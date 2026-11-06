import test from 'node:test';
import assert from 'node:assert/strict';
import { enableNokiaSerial } from '../.vitepress/theme/lib/nokiaSerial.js';

const FAST = { startupTimeoutMs: 150, commandTimeoutMs: 150, ioTimeoutMs: 150 };
const decoder = new TextDecoder();
const encoder = new TextEncoder();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// The fixture implements the Web Serial surface with real Web Streams. It
// interprets a small console transcript; it never executes received commands.
class FakePort {
    constructor({ initial = [], promptOnCR = true, onWrite, environment, breakOnce = false, noise = false } = {}) {
        Object.assign(this, { initial, promptOnCR, onWrite, breakOnce, noise });
        this.environment = { asc0: '3', bootdelay: '5', preboot: 'gpio clear 100', ...environment };
        this.writes = [];
        this.openCount = 0;
        this.closeCount = 0;
        this.breakReleases = 0;
    }

    async open(options) {
        this.openCount++;
        this.options = options;
        this.readable = new ReadableStream({
            start: controller => { this.controller = controller; }
        });
        if (this.breakOnce) {
            const recovered = this.readable;
            this.readable = {
                getReader: () => ({
                    read: () => Promise.reject(new DOMException('FTDI module insertion BREAK', 'BreakError')),
                    releaseLock: () => { this.breakReleases++; this.readable = recovered; },
                    cancel: async () => {}
                })
            };
        }
        this.writable = new WritableStream({
            write: async bytes => {
                const text = decoder.decode(bytes);
                this.writes.push(text);
                if (await this.onWrite?.(text, this)) return;
                if (text === '\r') {
                    if (this.promptOnCR) this.emit('FALCON => ');
                    return;
                }
                if (text === '\x03') return;
                assert.ok(text.endsWith('\r'), 'console commands end with CR');
                const command = text.slice(0, -1);
                let response = '';
                if (command.startsWith('echo ')) {
                    response = command.slice(5) + '\r\n';
                } else if (command.startsWith('printenv ')) {
                    const variable = command.slice(9);
                    const value = this.environment[variable];
                    response = value === null || value === undefined
                        ? `## Error: "${variable}" not defined\r\n`
                        : `${variable}=${value}\r\n`;
                } else if (command.startsWith('setenv ')) {
                    const [, variable, ...value] = command.split(' ');
                    this.environment[variable] = value.length ? value.join(' ') : null;
                } else if (command === 'saveenv') {
                    response = 'Saving Environment to SPI Flash...\r\nErasing SPI flash...Writing to SPI flash...done\r\n';
                } else {
                    assert.fail(`Unexpected command: ${command}`);
                }
                this.emit(command + '\r\n' + response + 'FALCON => ');
            }
        });
        for (const chunk of this.initial) this.emit(chunk);
        if (this.noise) this.noiseTimer = setInterval(() => this.emit('unrelated output\r\n'), 5);
    }

    emit(text) {
        this.controller.enqueue(encoder.encode(text));
    }

    async close() {
        clearInterval(this.noiseTimer);
        assert.equal(this.readable.locked, false, 'read lock released before port.close');
        assert.equal(this.writable.locked, false, 'write lock released before port.close');
        this.closeCount++;
    }

    commands() {
        return this.writes.filter(value => value !== '\r' && value !== '\x03').map(value => value.trim());
    }

    mutations() {
        return this.commands().filter(command => /^(?:setenv|saveenv|reset)\b/.test(command));
    }
}

function run(port, options = {}) {
    return enableNokiaSerial(port, { ...FAST, confirmChanges: async () => true, ...options });
}

test('bannerless Nokia boot, split prompt, backup, confirmation and verified save', { timeout: 2000 }, async () => {
    let sentPrompt = false;
    const port = new FakePort({
        initial: ['ROM: V1.1.4\r\nChip: FALCON-S (A22)\r\nBootmode: 0x06\r\n'],
        promptOnCR: false,
        environment: { bootdelay: '-1' },
        onWrite(text, device) {
            if (text === '\x03' && !sentPrompt) {
                sentPrompt = true;
                device.emit('FAL');
                device.emit('CON =');
                device.emit('> ');
                device.promptOnCR = true;
            }
        }
    });
    const events = [];
    const result = await run(port, {
        onStatus(message) {
            if (message.includes('Power-cycle')) assert.equal(port.openCount, 1, 'listen before asking for a reboot');
        },
        onBackup(before) {
            assert.deepEqual(before, { asc0: '3', bootdelay: '-1', preboot: 'gpio clear 100' });
            assert.deepEqual(port.mutations(), []);
            events.push('backup');
        },
        confirmChanges(proposal) {
            assert.deepEqual(proposal.after, { asc0: '0', bootdelay: '5', preboot: null });
            assert.deepEqual(port.mutations(), []);
            events.push('confirm');
            return true;
        }
    });
    assert.deepEqual(events, ['backup', 'confirm']);
    assert.equal(result.saved, true);
    assert.deepEqual(port.mutations(), ['setenv asc0 0', 'setenv bootdelay 5', 'setenv preboot', 'saveenv']);
    assert.deepEqual(port.environment, result.after);
    assert.equal(port.commands().filter(command => command.startsWith('echo ')).length, 2, 'reverify after human confirmation');
    assert.equal(port.commands().filter(command => command.startsWith('printenv ')).length, 9, 'read before, after confirmation, and before save');
    assert.deepEqual(port.options, { baudRate: 115200, dataBits: 8, stopBits: 1, parity: 'none', flowControl: 'none' });
    assert.equal(port.openCount, 1);
    assert.equal(port.closeCount, 1);
    assert.ok(!port.commands().some(command => command === 'reset' || command.includes('gpio set')));
});

test('preserves an existing positive boot delay and removes only the known preboot', async () => {
    const port = new FakePort({ environment: { bootdelay: '3', preboot: 'run start_netconsole' } });
    await run(port);
    assert.deepEqual(port.mutations(), ['setenv asc0 0', 'setenv preboot', 'saveenv']);
    assert.equal(port.environment.bootdelay, '3');
});

test('an overflowing bootdelay is not mistaken for a valid positive delay', async () => {
    const port = new FakePort({ environment: { bootdelay: '999999999999999999999' } });
    const result = await run(port);
    assert.equal(result.after.bootdelay, '5');
    assert.ok(port.mutations().includes('setenv bootdelay 5'));
});

test('already enabled settings are read-only and require no confirmation', async () => {
    const port = new FakePort({ environment: { asc0: '0', preboot: null } });
    const result = await run(port, { confirmChanges: () => assert.fail('nothing to confirm') });
    assert.equal(result.changed, false);
    assert.equal(result.saved, false);
    assert.deepEqual(port.mutations(), []);
    assert.equal(port.closeCount, 1);
});

test('ROM-only output times out without environment commands or lingering writes', { timeout: 1500 }, async () => {
    const port = new FakePort({
        initial: ['ROM: V1.1.4\r\nROM: CFG 0x00000006\r\nROM: SFLASH-4\r\n'], promptOnCR: false
    });
    await assert.rejects(run(port, { startupTimeoutMs: 80 }), { code: 'ROM_ONLY' });
    assert.deepEqual(port.commands(), []);
    const writes = port.writes.length;
    await sleep(80);
    assert.equal(port.writes.length, writes);
    assert.equal(port.closeCount, 1);
});

test('a U-Boot banner alone does not authorize commands', { timeout: 1000 }, async () => {
    const port = new FakePort({ initial: ['U-Boot 2011.12\r\n'], promptOnCR: false });
    await assert.rejects(run(port, { startupTimeoutMs: 60 }), { code: 'TIMEOUT' });
    assert.deepEqual(port.commands(), []);
});

test('continuous irrelevant output does not extend the overall timeout', { timeout: 1000 }, async () => {
    const port = new FakePort({ promptOnCR: false, noise: true });
    await assert.rejects(run(port, { startupTimeoutMs: 70 }), { code: 'TIMEOUT' });
    assert.deepEqual(port.writes, ['\r'], 'no blind Ctrl+C on an unknown console');
    assert.equal(port.closeCount, 1);
});

test('BootROM recovery menu and Linux console have distinct errors', async t => {
    for (const [text, code] of [
        ['ROM: Boot? (0-9A-F)\r\n', 'BOOTROM_MENU'],
        ['Linux version 3.10.108\r\nroot@NOKIA:~# ', 'LINUX_CONSOLE']
    ]) {
        await t.test(code, async () => {
            const port = new FakePort({ initial: [text], promptOnCR: false });
            await assert.rejects(run(port), { code });
            assert.deepEqual(port.commands(), []);
            assert.equal(port.closeCount, 1);
        });
    }
});

test('echoed command and stale prompt cannot satisfy the nonce challenge', async t => {
    for (const response of ['echo-only', 'prompt-only']) {
        await t.test(response, async () => {
            const port = new FakePort({
                onWrite(text, device) {
                    if (!text.startsWith('echo ')) return false;
                    device.emit((response === 'echo-only' ? text + '\n' : '') + 'FALCON => ');
                    return true;
                }
            });
            await assert.rejects(run(port), { code: 'UNVERIFIED' });
            assert.equal(port.commands().length, 1);
            assert.deepEqual(port.mutations(), []);
        });
    }
});

test('unexpected preboot is backed up and rejected before confirmation or mutation', async () => {
    const port = new FakePort({ environment: { preboot: 'run custom_startup' } });
    let backedUp = false;
    await assert.rejects(run(port, {
        onBackup: before => { backedUp = before.preboot === 'run custom_startup'; },
        confirmChanges: () => assert.fail('unsafe settings must not be proposed')
    }), { code: 'UNSAFE_PREBOOT' });
    assert.equal(backedUp, true);
    assert.deepEqual(port.mutations(), []);
});

test('unexpected asc0 values stop before proposing or writing changes', async () => {
    const port = new FakePort({ environment: { asc0: '7' } });
    await assert.rejects(run(port, {
        confirmChanges: () => assert.fail('unexpected bootloader value must be reviewed manually')
    }), { code: 'UNEXPECTED_ASC0' });
    assert.deepEqual(port.mutations(), []);
});

test('declining confirmation never changes the environment', async () => {
    const port = new FakePort();
    await assert.rejects(run(port, { confirmChanges: () => false }), { name: 'AbortError' });
    assert.deepEqual(port.mutations(), []);
    assert.equal(port.closeCount, 1);
});

test('aborting an unanswered confirmation closes the port and cannot resume later', { timeout: 1000 }, async () => {
    const controller = new AbortController();
    let resolveConfirmation;
    let notifyReview;
    const reviewing = new Promise(resolve => { notifyReview = resolve; });
    const port = new FakePort();
    const operation = run(port, {
        signal: controller.signal,
        confirmChanges: () => {
            notifyReview();
            return new Promise(resolve => { resolveConfirmation = resolve; });
        }
    });
    await reviewing;
    controller.abort();
    await assert.rejects(operation, { name: 'AbortError' });
    const count = port.writes.length;
    resolveConfirmation(true);
    await sleep(10);
    assert.equal(port.writes.length, count);
    assert.deepEqual(port.mutations(), []);
    assert.equal(port.closeCount, 1);
});

test('aborting a pending read releases the reader and closes the port', { timeout: 1000 }, async () => {
    const controller = new AbortController();
    const port = new FakePort({ promptOnCR: false });
    const operation = run(port, { signal: controller.signal });
    setTimeout(() => controller.abort(), 15);
    await assert.rejects(operation, { name: 'AbortError' });
    assert.deepEqual(port.commands(), []);
    assert.equal(port.closeCount, 1);
});

test('settings changed during confirmation are detected by a fresh read', async () => {
    const port = new FakePort();
    await assert.rejects(run(port, {
        confirmChanges: () => { port.environment.asc0 = '2'; return true; }
    }), { code: 'SETTINGS_CHANGED' });
    assert.deepEqual(port.mutations(), []);
});

test('CRC/environment errors are not treated as undefined variables', async () => {
    const port = new FakePort({
        onWrite(text, device) {
            if (text !== 'printenv asc0\r') return false;
            device.emit('Warning: bad CRC, using default environment\r\nasc0=3\r\nFALCON => ');
            return true;
        }
    });
    await assert.rejects(run(port), { code: 'COMMAND_FAILED' });
    assert.deepEqual(port.mutations(), []);
});

test('failed setenv readback prevents saveenv', async () => {
    const port = new FakePort({
        onWrite(text, device) {
            if (text !== 'setenv asc0 0\r') return false;
            device.emit('setenv asc0 0\r\nFALCON => '); // Prompt, but unchanged value.
            return true;
        }
    });
    await assert.rejects(run(port), { code: 'COMMAND_FAILED' });
    assert.ok(!port.commands().includes('saveenv'));
});

test('saveenv failure is not hidden by an earlier OK string', async () => {
    const port = new FakePort({
        onWrite(text, device) {
            if (text !== 'saveenv\r') return false;
            device.emit('Erasing... OK\r\nError: writing environment failed\r\nFALCON => ');
            return true;
        }
    });
    await assert.rejects(run(port), { code: 'SAVE_FAILED' });
    assert.equal(port.closeCount, 1);
});

test('saveenv requires a final acknowledgement, not an earlier erase OK', async () => {
    const port = new FakePort({
        onWrite(text, device) {
            if (text !== 'saveenv\r') return false;
            device.emit('Erasing... OK\r\nWriting environment... timeout\r\nFALCON => ');
            return true;
        }
    });
    await assert.rejects(run(port), { code: 'SAVE_FAILED' });
});

test('cancellation during saveenv reports uncertain persistence', { timeout: 1000 }, async () => {
    const controller = new AbortController();
    const port = new FakePort({
        onWrite(text) {
            if (text !== 'saveenv\r') return false;
            controller.abort();
            return true;
        }
    });
    await assert.rejects(run(port, { signal: controller.signal }), error => {
        assert.equal(error.code, 'SAVE_FAILED');
        assert.match(error.message, /saved state is uncertain/);
        return true;
    });
    assert.equal(port.closeCount, 1);
});

test('a bannerless Nokia restart invalidates an in-flight command', async () => {
    const port = new FakePort({
        onWrite(text, device) {
            if (text !== 'setenv asc0 0\r') return false;
            device.emit('Chip: FALCON-S (A22)\r\nBootmode: 0x06\r\nFALCON => ');
            return true;
        }
    });
    await assert.rejects(run(port), { code: 'DISCONNECTED' });
    assert.deepEqual(port.mutations(), ['setenv asc0 0'], 'no further environment or save commands after restart');
});

test('a disconnect during verification cannot be accepted as a usable prompt', async () => {
    const port = new FakePort({
        onWrite(text, device) {
            if (!text.startsWith('echo ')) return false;
            device.controller.close();
            return true;
        }
    });
    await assert.rejects(run(port), { code: 'DISCONNECTED' });
    assert.deepEqual(port.mutations(), []);
});

test('recoverable FTDI BREAK reacquires the stream without reopening the port', async () => {
    const port = new FakePort({ breakOnce: true });
    const result = await run(port);
    assert.equal(result.saved, true);
    assert.equal(port.breakReleases, 1);
    assert.equal(port.openCount, 1);
    assert.equal(port.closeCount, 1);
});

test('a stalled serial write has a bounded deadline and releases the writer', { timeout: 1500 }, async () => {
    const port = new FakePort({
        onWrite(text) {
            if (text.startsWith('echo ')) return new Promise(() => {});
        }
    });
    await assert.rejects(run(port, { ioTimeoutMs: 60 }), { code: 'TIMEOUT' });
    assert.deepEqual(port.mutations(), []);
    assert.equal(port.closeCount, 1);
});
