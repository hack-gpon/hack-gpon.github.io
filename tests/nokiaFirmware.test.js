import test from 'node:test';
import assert from 'node:assert/strict';
import { crc32Hex } from '../.vitepress/theme/lib/nokiaImage.js';
import {
    NOKIA_BOOT_PROFILE, NOKIA_UPGRADE_SETTINGS,
    planNokiaFlash, runNokiaFlashSession, flashNokiaFirmware
} from '../.vitepress/theme/lib/nokiaFirmware.js';
import { NokiaConsole } from '../.vitepress/theme/lib/nokiaConsole.js';
import { sendYmodem } from '../.vitepress/theme/lib/ymodem.js';

const RAM = 0x80800000;
const SLOT_OFFSETS = [0x0c0000, 0x6c0000];
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const ACK = 0x06;
const CRC_REQUEST = 0x43;

function fixtureImage() {
    // Synthetic bytes exercise transport and write boundaries. Public entry
    // point image identification is tested separately, without private dumps.
    const data = Uint8Array.from({ length: 2051 }, (_, n) => (n * 37 + 11) & 0xff);
    return { data, metadata: {
        size: data.length, kernelSize: 1024, slotSize: 0x600000,
        crc32: crc32Hex(data), sha256: 'a'.repeat(64), model: 'Nokia G-010S-A'
    } };
}

function settings(overrides = {}) {
    return {
        ...NOKIA_BOOT_PROFILE,
        update_system: 'run update_image0 && setenv commit 0 && setenv image0_is_valid 1 && saveenv',
        commit: '0', next_active: '0', c_img: '1',
        image0_is_valid: '1', image1_is_valid: '0', boot_fail: '2',
        asc0: '0', bootdelay: '5', preboot: null,
        ...overrides
    };
}

function crc16(bytes) {
    let crc = 0;
    for (const value of bytes) {
        crc ^= value << 8;
        for (let bit = 0; bit < 8; bit++) crc = (crc << 1 ^ (crc & 0x8000 ? 0x1021 : 0)) & 0xffff;
    }
    return crc;
}

// A deterministic U-Boot command/byte transcript, not a stub of sendYmodem.
// The real sender must perform its filename, data, EOT and final-header
// exchanges; only received bytes become the emulated RAM image.
class FakeFalcon {
    constructor(options = {}) {
        this.options = options;
        this.environment = settings(options.environment);
        this.persisted = { ...this.environment };
        this.originalProtectedSlot = Number(this.environment.select_image.includes('$committed_image')
            ? this.environment.committed_image : this.environment.commit);
        this.commands = [];
        this.events = [];
        this.bytes = [];
        this.blocks = [];
        this.receiverState = 'idle';
        this.nextSequence = 1;
        this.acquisitions = 0;
        this.saves = 0;
        this.crcCalls = 0;
        this.environmentReads = 0;
        this.signal = options.signal;
    }

    checkAbort() {
        if (this.signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
    }

    async acquire() {
        this.checkAbort();
        this.acquisitions++;
        this.events.push('acquire');
    }

    storage() {
        this.flash ??= new Uint8Array(0x1000000).fill(0x5a);
        return this.flash;
    }

    async command(raw) {
        this.checkAbort();
        this.commands.push(raw);
        const match = /^(.*) && echo (__NOKIA_FLASH_[a-f0-9]+__)$/.exec(raw);
        const command = match ? match[1] : raw;
        const marker = match?.[2];
        this.events.push(command);
        const intercept = await this.options.onCommand?.(command, this, raw);
        if (intercept !== undefined) return intercept;
        let response;
        if (command === 'version') {
            response = this.options.version ?? 'U-Boot 2015.04-lantiq-gpon-1.3.6.1 (Feb 07 2018 - 17:12:06)';
        } else if (command.startsWith('printenv ')) {
            const key = command.slice(9);
            if (key === 'bootcmd') this.environmentReads++;
            const value = this.environment[key];
            response = value === null || value === undefined
                ? `## Error: "${key}" not defined`
                : `${key}=${value}`;
        } else if (command.startsWith('help ')) {
            const key = command.slice(5);
            response = this.options.missingCapability === key
                ? `Unknown command '${key}' - try 'help'`
                : `${key} - supported command`;
        } else if (command === 'bdinfo') {
            response = this.options.memory ?? 'memstart    = 0x80000000\nmemsize     = 0x04000000';
        } else if (command === 'sf probe 0') {
            response = `SF: Detected MX25L12805D with page size 256 Bytes, erase size 64 KiB, total ${this.options.flashMiB ?? 16} MiB`;
        } else if (command.startsWith('crc32 ')) {
            const [, address, length] = command.split(' ');
            assert.equal(Number(address), RAM, 'checksum must cover the intended RAM buffer');
            const size = Number(length);
            assert.ok(this.ram && this.ram.length >= size);
            this.crcCalls++;
            const checksum = this.options.badCrcAt === this.crcCalls ? '00000000' : crc32Hex(this.ram.subarray(0, size));
            response = `CRC32 for ${RAM.toString(16)} ... ${(RAM + size - 1).toString(16)} ==> ${checksum}`;
        } else if (command.startsWith('sf erase ')) {
            const [, , offset, length] = command.split(' ');
            const start = Number(offset), size = Number(length);
            assert.ok(SLOT_OFFSETS.includes(start), 'erase must start at an actual Nokia slot');
            assert.equal(size, 0x600000, 'erase includes the complete old JFFS2 overlay');
            assert.notEqual(start, SLOT_OFFSETS[this.originalProtectedSlot], 'never erase committed firmware');
            this.storage().fill(0xff, start, start + size);
            response = `SF: ${size} bytes @ ${offset} Erased: OK`;
        } else if (command.startsWith('sf write ')) {
            const [, , address, offset, length] = command.split(' ');
            assert.equal(Number(address), RAM);
            const start = Number(offset), size = Number(length);
            assert.equal(size, this.expectedSize, 'write file bytes, excluding YMODEM padding');
            this.storage().set(this.ram.subarray(0, size), start);
            response = `SF: ${size} bytes @ ${offset} Written: OK`;
        } else if (command.startsWith('sf read ')) {
            const [, , address, offset, length] = command.split(' ');
            assert.equal(Number(address), RAM);
            const start = Number(offset), size = Number(length);
            this.ram = this.storage().slice(start, start + size);
            if (this.options.dirtyTail) this.ram[this.ram.length - 1] = 0x00;
            response = `SF: ${size} bytes @ ${offset} Read: OK`;
        } else if (command.startsWith('setenv ')) {
            const [, key, remainder] = /^setenv ([A-Za-z0-9_]+)(?: (.*))?$/.exec(command) ?? [];
            assert.ok(key, 'well-formed environment assignment');
            let value = remainder ?? null;
            if (value?.startsWith("'")) {
                assert.ok(value.endsWith("'"));
                assert.ok(!value.slice(1, -1).includes("'"));
                value = value.slice(1, -1);
            } else if (value?.includes('$')) {
                // Hush would expand unquoted variables now instead of later.
                value = value.replace(/\$\{(\w+)\}|\$(\w+)/g, (_, a, b) => this.environment[a ?? b] ?? '');
            }
            if (this.options.ignoreSetenv !== key) this.environment[key] = value;
            response = '';
        } else if (command === 'saveenv') {
            this.saves++;
            this.persisted = { ...this.environment };
            response = 'Saving Environment to SPI Flash...\nErasing SPI flash...Writing to SPI flash...done';
        } else {
            assert.fail(`Unexpected device command: ${command}`);
        }
        if (marker && this.options.omitMarkerFor !== command) response += `\n${marker}\n`;
        return response;
    }

    async write(text) {
        this.checkAbort();
        assert.equal(text, 'loady 0x80800000\r');
        this.events.push('loady');
        this.receiverState = 'header';
        const address = this.options.readyAddress ?? '0x80800000';
        this.bytes.push(...encoder.encode(`## Ready for binary (ymodem) download to ${address} at 115200 bps...\r\n`), CRC_REQUEST);
    }

    async readByte(deadline, signal) {
        if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
        this.checkAbort();
        if (Date.now() >= deadline || !this.bytes.length) throw Object.assign(new Error('No receiver byte'), { code: 'TIMEOUT' });
        return this.bytes.shift();
    }

    async writeBytes(packet) {
        if (packet[0] === 0x18) {
            this.events.push('ymodem-cancel');
            return;
        }
        this.checkAbort();
        if (packet.length === 1 && packet[0] === 0x04) {
            assert.equal(this.receiverState, 'data');
            this.receiverState = 'final';
            // U-Boot's two-ACK EOT path followed by another CRC request.
            this.bytes.push(ACK, ACK, CRC_REQUEST);
            return;
        }
        const size = packet[0] === 0x01 ? 128 : packet[0] === 0x02 ? 1024 : 0;
        assert.ok(size, 'SOH or STX packet');
        assert.equal(packet.length, size + 5);
        assert.equal(packet[1] ^ packet[2], 0xff);
        const payload = packet.subarray(3, 3 + size);
        assert.equal(packet[3 + size] << 8 | packet[4 + size], crc16(payload), 'valid wire CRC16');
        if (this.receiverState === 'header') {
            assert.equal(packet[1], 0);
            const [filename, length] = decoder.decode(payload).split('\0');
            assert.equal(filename, 'nokia-firmware.image');
            this.expectedSize = Number(length);
            this.receiverState = 'data';
        } else if (this.receiverState === 'data') {
            assert.equal(packet[1], this.nextSequence & 0xff);
            this.nextSequence++;
            this.blocks.push(Uint8Array.from(payload));
        } else if (this.receiverState === 'final') {
            assert.equal(packet[1], 0);
            assert.ok(payload.every(value => value === 0), 'empty final batch header');
            this.ram = new Uint8Array(this.expectedSize);
            let offset = 0;
            for (const block of this.blocks) {
                this.ram.set(block.subarray(0, Math.min(block.length, this.expectedSize - offset)), offset);
                offset += Math.min(block.length, this.expectedSize - offset);
            }
            assert.equal(offset, this.expectedSize);
            this.receiverState = 'complete';
            this.events.push('ymodem-complete');
        } else {
            assert.fail(`Unexpected receiver state ${this.receiverState}`);
        }
        this.bytes.push(ACK);
    }

    async waitPrompt() {
        assert.equal(this.receiverState, 'complete');
        const size = this.expectedSize + (this.options.wrongTransferSize ? 1 : 0);
        return `xyzModem - CRC mode, 1(SOH)/3(STX)/0(CAN) packets, 0 retries\n## Total Size = 0x${size.toString(16)} = ${size} Bytes\n`;
    }

    destructiveCommands() {
        return this.events.filter(value => /^(?:sf (?:erase|write)|setenv |saveenv\b|reset\b|bootm\b|run boot_image)/.test(value));
    }
}

// Real Web Streams bridge for the shared text/binary console. In particular,
// the final YMODEM ACK and U-Boot's transfer report share one serial chunk.
class StreamFalconPort {
    constructor(falcon) {
        this.falcon = falcon;
        this.closed = false;
    }

    async open() {
        this.readable = new ReadableStream({ start: controller => { this.controller = controller; } });
        this.writable = new WritableStream({ write: async bytes => {
            const fake = this.falcon;
            if ([0x01, 0x02, 0x04, 0x18].includes(bytes[0])) {
                await fake.writeBytes(bytes);
                const reply = fake.bytes.splice(0);
                if (fake.receiverState === 'complete') reply.push(...encoder.encode((await fake.waitPrompt()) + 'FALCON => '));
                this.controller.enqueue(Uint8Array.from(reply));
                return;
            }
            const text = decoder.decode(bytes);
            if (text === '\r') {
                this.controller.enqueue(encoder.encode('FALCON => '));
            } else if (text.startsWith('echo __NOKIA_UART_')) {
                this.controller.enqueue(encoder.encode(text.trim() + '\r\n' + text.slice(5).trim() + '\r\nFALCON => '));
            } else if (text.startsWith('loady ')) {
                await fake.write(text);
                this.controller.enqueue(Uint8Array.from([...encoder.encode(text + '\n'), ...fake.bytes.splice(0)]));
            } else {
                const command = text.replace(/\r$/, '');
                const response = await fake.command(command);
                this.controller.enqueue(encoder.encode(command + '\r\n' + response + '\r\nFALCON => '));
            }
        } });
    }

    async close() {
        assert.equal(this.readable.locked, false);
        assert.equal(this.writable.locked, false);
        this.closed = true;
    }
}

function realConsole(port, signal) {
    return new NokiaConsole(port, {
        signal, baudRate: 115200, startupTimeoutMs: 1000,
        commandTimeoutMs: 1000, ioTimeoutMs: 1000
    });
}

function run(serial, image = fixtureImage(), options = {}) {
    return runNokiaFlashSession(serial, image, {
        bootMode: 'stage', confirmFlash: async () => true,
        commandTimeoutMs: 200, flashTimeoutMs: 300, transferTimeoutMs: 1000,
        ...options
    });
}

function assertProtected(serial, protectedSlot, image) {
    const target = 1 - protectedSlot;
    const offset = SLOT_OFFSETS[target];
    const memory = Buffer.from(serial.storage());
    assert.deepEqual(memory.subarray(0, offset), Buffer.alloc(offset, 0x5a));
    assert.deepEqual(memory.subarray(offset + 0x600000), Buffer.alloc(0x1000000 - offset - 0x600000, 0x5a));
    assert.deepEqual(memory.subarray(offset, offset + image.data.length), Buffer.from(image.data));
    assert.deepEqual(memory.subarray(offset + image.data.length, offset + 0x600000), Buffer.alloc(0x600000 - image.data.length, 0xff));
}

test('staging uses Nokia slot boundaries, verifies the whole erased tail, and preserves all other flash bytes', async t => {
    for (const protectedSlot of [0, 1]) {
        await t.test(`committed slot ${protectedSlot}`, async () => {
            const image = fixtureImage();
            const serial = new FakeFalcon({ environment: {
                commit: String(protectedSlot), next_active: String(protectedSlot),
                c_img: String(1 - protectedSlot), image0_is_valid: '1', image1_is_valid: '1'
            } });
            const before = { ...serial.environment };
            const result = await run(serial, image);
            assert.equal(result.verified, true);
            assert.equal(result.protectedSlot, protectedSlot);
            assert.equal(result.targetSlot, 1 - protectedSlot);
            assert.equal(result.offset, SLOT_OFFSETS[1 - protectedSlot]);
            assertProtected(serial, protectedSlot, image);
            assert.equal(serial.crcCalls, 2, 'RAM and full-slot readback checks');
            assert.equal(serial.saves, 0);
            assert.deepEqual(serial.environment, before);
            assert.ok(!serial.events.some(command => /^(setenv|saveenv|reset|bootm|run )/.test(command)));
            const erase = serial.events.findIndex(command => command.startsWith('sf erase '));
            assert.ok(serial.events.indexOf('ymodem-complete') < erase);
            assert.ok(serial.events.findIndex(command => command.startsWith('crc32 ')) < erase);
            assert.equal(serial.receiverState, 'complete');
        });
    }
});

test('saved c_img never selects the protected slot; next_active=-1 uses the committed slot', () => {
    const plan = planNokiaFlash(settings({ commit: '1', next_active: '-1', c_img: '0', image1_is_valid: '1' }), fixtureImage().metadata, 'stage');
    assert.equal(plan.protectedSlot, 1);
    assert.equal(plan.targetSlot, 0);
    assert.equal(plan.offset, 0x0c0000);
});

test('unknown boot geometry, scripts, and pending selectors cannot authorize erasing flash', async t => {
    const invalid = [
        { kernel1_offs: '0x800000' },
        { kernel0_offs: '0x0' },
        { addmtdparts1: NOKIA_BOOT_PROFILE.addmtdparts1.replace('6144k', '7424k') },
        { bootcmd: 'run boot_image0' },
        { addip: 'sf erase 0 1000000' },
        { select_image: 'setenv c_img 0' },
        { update_system: 'run update_image1' },
        { boot_image1: 'sf erase 0 1000000' },
        { commit: '2' },
        { next_active: '1' },
        { image0_is_valid: '0' },
        { image1_is_valid: '2' },
        { boot_fail: 'unknown' },
        { boot_fail: null },
        { boot_fail: '8' },
        { asc0: '3' },
        { bootdelay: '0' },
        { bootdelay: '99999999999999999999' },
        { preboot: 'run custom_boot' }
    ];
    for (const environment of invalid) {
        await t.test(Object.keys(environment)[0] + '=' + Object.values(environment)[0], async () => {
            const serial = new FakeFalcon({ environment });
            await assert.rejects(run(serial));
            assert.deepEqual(serial.destructiveCommands(), []);
            assert.ok(!serial.events.includes('loady'));
        });
    }
});

test('version, RAM, required command, and flash-capacity checks fail before transfer', async t => {
    for (const options of [
        { version: 'U-Boot 2011.12-lantiq-gpon-1.2.24' },
        { version: 'U-Boot 2015.04-lantiq-gpon-1.3.6.1 (Mar 28 2017 - 11:55:00)' },
        { memory: 'memstart = 0x80000000\nmemsize = 0x02000000' },
        { memory: 'memstart = 0xa0000000\nmemsize = 0x04000000' },
        { missingCapability: 'loady' },
        { missingCapability: 'crc32' },
        { missingCapability: 'sf' },
        { flashMiB: 8 }
    ]) {
        await t.test(JSON.stringify(options), async () => {
            const serial = new FakeFalcon(options);
            await assert.rejects(run(serial));
            assert.deepEqual(serial.destructiveCommands(), []);
            assert.ok(!serial.events.includes('loady'));
        });
    }
});

test('an untrusted filesize or kernel larger than the read window is rejected', () => {
    const image = fixtureImage().metadata;
    for (const bad of [
        { ...image, size: 0x600001 },
        { ...image, size: 0 },
        { ...image, slotSize: 0x740000 },
        { ...image, kernelSize: 0x180000 }
    ]) assert.throws(() => planNokiaFlash(settings(), bad, 'stage'), { code: 'IMAGE_SIZE' });
});

test('backup and explicit confirmation precede any transfer or flash mutation', async () => {
    const serial = new FakeFalcon();
    let backup;
    await assert.rejects(run(serial, fixtureImage(), {
        onBackup(value) {
            backup = value;
            assert.deepEqual(serial.destructiveCommands(), []);
            assert.ok(!serial.events.includes('loady'));
        },
        confirmFlash(plan) {
            assert.equal(backup.settings.commit, '0');
            assert.equal(backup.plan.targetSlot, plan.targetSlot);
            assert.equal(plan.targetSlot, 1);
            return false;
        }
    }), { name: 'AbortError' });
    assert.deepEqual(serial.destructiveCommands(), []);
    assert.ok(!serial.events.includes('loady'));
});

test('a device-setting change while the user reviews the plan stops before transfer', async () => {
    const serial = new FakeFalcon();
    await assert.rejects(run(serial, fixtureImage(), {
        confirmFlash() {
            serial.environment.next_active = '1';
            return true;
        }
    }), { code: 'SETTINGS_CHANGED' });
    assert.deepEqual(serial.destructiveCommands(), []);
    assert.ok(!serial.events.includes('loady'));
});

test('a boot-state change during YMODEM stops after RAM verification and before erase', async () => {
    const image = fixtureImage();
    const serial = new FakeFalcon();
    await assert.rejects(run(serial, image, {
        onProgress(sent) {
            if (sent === image.data.length) serial.environment.next_active = '1';
        }
    }), { code: 'SETTINGS_CHANGED' });
    assert.equal(serial.receiverState, 'complete');
    assert.equal(serial.crcCalls, 1);
    assert.deepEqual(serial.destructiveCommands(), []);
});

test('wrong receiver address, received length, or RAM checksum never reaches erase', async t => {
    for (const options of [
        { readyAddress: '0x80002000' },
        { wrongTransferSize: true },
        { badCrcAt: 1 }
    ]) {
        await t.test(JSON.stringify(options), async () => {
            const serial = new FakeFalcon(options);
            await assert.rejects(run(serial));
            assert.deepEqual(serial.destructiveCommands(), []);
        });
    }
});

test('flash readback covers the old overlay tail and forbids activation on any mismatch', async t => {
    for (const options of [{ badCrcAt: 2 }, { dirtyTail: true }]) {
        await t.test(JSON.stringify(options), async () => {
            const serial = new FakeFalcon(options);
            await assert.rejects(run(serial, fixtureImage(), { bootMode: 'trial' }), { code: 'FLASH_UNCERTAIN' });
            assert.equal(serial.crcCalls, 2);
            assert.equal(serial.saves, 0);
            assert.ok(!serial.events.some(command => command.startsWith('setenv ')));
            assert.equal(serial.persisted.commit, '0');
            assert.equal(serial.persisted.next_active, '0');
        });
    }
});

test('a prompt without the fresh success marker cannot establish a completed flash command', async () => {
    const serial = new FakeFalcon({ omitMarkerFor: 'sf erase 0x6c0000 0x600000' });
    await assert.rejects(run(serial), { code: 'FLASH_UNCERTAIN' });
    assert.ok(serial.events.some(command => command.startsWith('sf erase ')));
    assert.ok(!serial.events.some(command => command.startsWith('sf write ')));
    assert.equal(serial.saves, 0);
});

test('write errors cannot be hidden by a shell success marker', async () => {
    const serial = new FakeFalcon({
        onCommand(command, self, raw) {
            if (command.startsWith('sf write ')) {
                const marker = raw.match(/echo (\S+)$/)[1];
                return `SF: write ERROR\nError: program operation failed\n${marker}\n`;
            }
        }
    });
    await assert.rejects(run(serial), { code: 'FLASH_UNCERTAIN' });
    assert.ok(!serial.events.some(command => command.startsWith('sf read ')));
    assert.equal(serial.saves, 0);
});

test('cancelling a pending review cannot later resume the operation', { timeout: 1000 }, async () => {
    const controller = new AbortController();
    const serial = new FakeFalcon({ signal: controller.signal });
    let resolveReview;
    let reviewing;
    const ready = new Promise(resolve => { reviewing = resolve; });
    const operation = run(serial, fixtureImage(), {
        signal: controller.signal,
        confirmFlash() {
            reviewing();
            return new Promise(resolve => { resolveReview = resolve; });
        }
    });
    await ready;
    controller.abort();
    await assert.rejects(operation, { name: 'AbortError' });
    const count = serial.commands.length;
    resolveReview(true);
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(serial.commands.length, count);
    assert.deepEqual(serial.destructiveCommands(), []);
});

test('cancellation immediately before erase keeps the flash untouched', async () => {
    const controller = new AbortController();
    const serial = new FakeFalcon({ signal: controller.signal });
    await assert.rejects(run(serial, fixtureImage(), {
        signal: controller.signal,
        onPhase(phase) { if (phase === 'erase') controller.abort(); }
    }), { name: 'AbortError' });
    assert.deepEqual(serial.destructiveCommands(), []);
});

test('cancellation after erase reports partial flash and never activates it', async () => {
    const controller = new AbortController();
    const serial = new FakeFalcon({ signal: controller.signal });
    await assert.rejects(run(serial, fixtureImage(), {
        signal: controller.signal, bootMode: 'trial',
        onPhase(phase) { if (phase === 'write') controller.abort(); }
    }), { code: 'FLASH_UNCERTAIN' });
    assert.ok(serial.events.some(command => command.startsWith('sf erase ')));
    assert.ok(!serial.events.some(command => command.startsWith('sf write ')));
    assert.equal(serial.saves, 0);
    assert.equal(serial.persisted.next_active, '0');
});

test('changed inspected bytes are rejected before device commands', async () => {
    const image = fixtureImage();
    image.data[0] ^= 1;
    const serial = new FakeFalcon();
    await assert.rejects(run(serial, image), { code: 'IMAGE_CHANGED' });
    assert.deepEqual(serial.commands, []);
});

test('the public entry point rejects an unrecognized image before opening a port', async () => {
    let opens = 0;
    const port = { open() { opens++; assert.fail('invalid input must not open UART'); } };
    await assert.rejects(flashNokiaFirmware(port, Uint8Array.of(1, 2, 3), { confirmFlash: () => true }));
    assert.equal(opens, 0);
});

test('trial migration is saved only after readback and preserves the committed image', async () => {
    const image = fixtureImage();
    const serial = new FakeFalcon();
    const oldSelector = serial.environment.select_image;
    let backup;
    const result = await run(serial, image, { bootMode: 'trial', onBackup: value => { backup = value; } });
    assert.equal(result.bootMode, 'trial');
    assert.equal(serial.persisted.commit, '0', 'legacy selector remains available for rollback');
    assert.equal(serial.persisted.committed_image, '0', 'old firmware remains the default');
    assert.equal(serial.persisted.next_active, '1', 'new firmware is requested once');
    assert.equal(serial.persisted.image0_is_valid, '1');
    assert.equal(serial.persisted.image1_is_valid, '1');
    assert.equal(serial.persisted.boot_fail, '0');
    for (const [key, value] of Object.entries(NOKIA_UPGRADE_SETTINGS)) assert.equal(serial.persisted[key], value);
    assert.match(serial.persisted.select_image, /setenv boot_fail 0;exit 0$/);
    assert.ok(serial.persisted.select_image.includes('${magic_addr}'), 'boot-time variable expansions remain literal');
    assert.equal(backup.settings.select_image, oldSelector);
    assert.equal(backup.settings.committed_image, null);
    assert.equal(backup.plan.migrateBootScripts, true);
    assert.equal(serial.saves, 1);
    const firstMutation = serial.events.findIndex(command => command.startsWith('setenv '));
    const checksums = serial.events.flatMap((command, index) => command.startsWith('crc32 ') ? [index] : []);
    assert.ok(firstMutation > checksums[1], 'no environment mutation before full flash proof');
    const assignedSelector = serial.commands.find(command => command.startsWith('setenv select_image '));
    assert.ok(assignedSelector.startsWith("setenv select_image '"));
    assert.match(assignedSelector, /' && echo __NOKIA_FLASH_[a-f0-9]+__$/);
    assert.ok(encoder.encode(assignedSelector + '\r').length < 1023, 'complete long script and nonce fit inspected console');
    assert.ok(!serial.events.some(command => /^(?:bootm|reset|run )/.test(command)), 'no automatic kernel start or reset');
    assertProtected(serial, 0, image);
});

test('explicit default-image activation migrates the policy without erasing the old image', async () => {
    const image = fixtureImage();
    const serial = new FakeFalcon();
    const result = await run(serial, image, { bootMode: 'commit' });
    assert.equal(result.bootMode, 'commit');
    assert.equal(serial.persisted.commit, '0', 'old legacy value is not repurposed');
    assert.equal(serial.persisted.committed_image, '1');
    assert.equal(serial.persisted.next_active, '1');
    assert.equal(serial.persisted.image0_is_valid, '1');
    assert.equal(serial.persisted.boot_fail, '0');
    assert.equal(serial.persisted.select_image, NOKIA_UPGRADE_SETTINGS.select_image);
    assert.equal(serial.saves, 1);
    assertProtected(serial, 0, image);
});

test('a migrated profile protects committed_image rather than an obsolete legacy commit', async () => {
    const serial = new FakeFalcon({ environment: {
        ...NOKIA_UPGRADE_SETTINGS,
        commit: '0', committed_image: '1', next_active: '1', c_img: '0',
        image0_is_valid: '0', image1_is_valid: '1'
    } });
    let reviewed;
    const result = await run(serial, fixtureImage(), {
        bootMode: 'trial', confirmFlash(plan) { reviewed = plan; return true; }
    });
    assert.equal(reviewed.bootProfile, '19.07');
    assert.equal(reviewed.migrateBootScripts, false);
    assert.equal(result.protectedSlot, 1);
    assert.equal(result.targetSlot, 0);
    assert.equal(result.offset, 0x0c0000);
    assert.equal(serial.persisted.commit, '0');
    assert.equal(serial.persisted.committed_image, '1');
    assert.equal(serial.persisted.next_active, '0');
    assert.ok(!serial.events.some(command => /^setenv (?:select_image|update_system|boot_image) /.test(command)), 'already migrated scripts are not rewritten');
});

test('partial migration or a pending migrated trial is not guessed', async t => {
    for (const environment of [
        { select_image: NOKIA_UPGRADE_SETTINGS.select_image, committed_image: '0' },
        { ...NOKIA_UPGRADE_SETTINGS, committed_image: null },
        { ...NOKIA_UPGRADE_SETTINGS, committed_image: '0', next_active: '1' }
    ]) {
        await t.test(JSON.stringify(environment).slice(0, 90), async () => {
            const serial = new FakeFalcon({ environment });
            await assert.rejects(run(serial));
            assert.deepEqual(serial.destructiveCommands(), []);
        });
    }
});

test('a migration readback mismatch prevents saveenv and retains the original persistent settings', async () => {
    const serial = new FakeFalcon({ ignoreSetenv: 'select_image' });
    const persisted = { ...serial.persisted };
    await assert.rejects(run(serial, fixtureImage(), { bootMode: 'commit' }), { code: 'SAVE_UNCERTAIN' });
    assert.equal(serial.crcCalls, 2);
    assert.ok(serial.events.some(command => command.startsWith('setenv select_image ')));
    assert.equal(serial.saves, 0);
    assert.deepEqual(serial.persisted, persisted);
    assert.ok(!serial.events.some(command => /^(?:bootm|reset|run )/.test(command)));
});

test('a missing saveenv acknowledgement is an uncertain activation, never success', async () => {
    const serial = new FakeFalcon({ omitMarkerFor: 'saveenv' });
    await assert.rejects(run(serial, fixtureImage(), { bootMode: 'trial' }), error => {
        assert.equal(error.code, 'SAVE_UNCERTAIN');
        assert.match(error.message, /may not be saved/);
        return true;
    });
    assert.equal(serial.saves, 1, 'no blind retry of a possibly completed flash save');
    assert.equal(serial.crcCalls, 2);
    assert.ok(!serial.events.some(command => /^(?:bootm|reset|run )/.test(command)));
});

test('disconnecting during saveenv cannot be reported as an ordinary cancelled operation', async () => {
    const serial = new FakeFalcon({
        onCommand(command, self) {
            if (command === 'saveenv') {
                self.saves++;
                throw Object.assign(new Error('USB disconnected'), { code: 'DISCONNECTED' });
            }
        }
    });
    await assert.rejects(run(serial, fixtureImage(), { bootMode: 'commit' }), { code: 'SAVE_UNCERTAIN' });
    assert.equal(serial.saves, 1);
    assert.equal(serial.persisted.next_active, '0');
});

test('cancelling during an environment migration reports partial in-RAM edits without saving them', async () => {
    const controller = new AbortController();
    const serial = new FakeFalcon({
        signal: controller.signal,
        onCommand(command) {
            if (command.startsWith('setenv select_image ')) controller.abort();
        }
    });
    await assert.rejects(run(serial, fixtureImage(), { signal: controller.signal, bootMode: 'commit' }), { code: 'SAVE_UNCERTAIN' });
    assert.equal(serial.saves, 0);
    assert.equal(serial.persisted.select_image, NOKIA_BOOT_PROFILE.select_image);
    assert.ok(serial.events.some(command => command.startsWith('setenv select_image ')));
    assert.ok(!serial.events.some(command => /^(?:bootm|reset|run )/.test(command)));
});

test('a settings change after flash verification stops activation', async () => {
    const serial = new FakeFalcon();
    await assert.rejects(run(serial, fixtureImage(), {
        bootMode: 'trial',
        onPhase(phase) { if (phase === 'activate') serial.environment.bootdelay = '3'; }
    }), { code: 'FLASH_UNCERTAIN' });
    assert.equal(serial.crcCalls, 2);
    assert.ok(!serial.events.some(command => command.startsWith('setenv ')));
    assert.equal(serial.saves, 0);
});

test('CRC warnings and multiple environment values are not accepted as a verified profile', async t => {
    for (const response of [
        'Warning: bad CRC, using default environment\ncommit=0',
        'commit=0\ncommit=1',
        '## Error: "commit" not defined\ncommit=0'
    ]) {
        await t.test(response, async () => {
            const serial = new FakeFalcon({ onCommand: command => command === 'printenv commit' ? response : undefined });
            await assert.rejects(run(serial), { code: 'ENVIRONMENT' });
            assert.deepEqual(serial.destructiveCommands(), []);
        });
    }
});

test('a stale or duplicated CRC line is not accepted as RAM verification', async () => {
    const serial = new FakeFalcon({
        onCommand(command, self, raw) {
            if (command.startsWith('crc32 ')) {
                const marker = raw.match(/echo (\S+)$/)[1];
                const line = `CRC32 for ${RAM.toString(16)} ... ${(RAM + self.expectedSize - 1).toString(16)} ==> ${crc32Hex(self.ram)}`;
                return `${line}\n${line}\n${marker}\n`;
            }
        }
    });
    await assert.rejects(run(serial), { code: 'CRC_MISMATCH' });
    assert.deepEqual(serial.destructiveCommands(), []);
});

test('real console accepts an explicit version reply and preserves coalesced YMODEM ACK/prompt bytes', async () => {
    const image = fixtureImage();
    const device = new FakeFalcon();
    const port = new StreamFalconPort(device);
    const serial = realConsole(port);
    try {
        await serial.open();
        await serial.acquire();
        const result = await run(serial, image, { bootMode: 'commit', commandTimeoutMs: 1000, flashTimeoutMs: 1000 });
        assert.equal(result.verified, true);
        assert.equal(device.receiverState, 'complete');
        assert.equal(device.saves, 1);
        assert.equal(device.persisted.committed_image, '1');
        assert.equal(device.persisted.select_image, NOKIA_UPGRADE_SETTINGS.select_image);
        assertProtected(device, 0, image);
    } finally {
        await serial.close();
    }
    assert.equal(port.closed, true);
});

test('the version-command exemption still rejects a real reboot', async () => {
    const device = new FakeFalcon({
        onCommand: command => command === 'version'
            ? 'ROM: V1.1.4\nChip: FALCON-S (A22)\nU-Boot 2015.04-lantiq-gpon-1.3.6.1 (Feb 07 2018 - 17:12:06)'
            : undefined
    });
    const port = new StreamFalconPort(device);
    const serial = realConsole(port);
    try {
        await serial.open();
        await serial.acquire();
        await assert.rejects(run(serial), { code: 'DISCONNECTED' });
        assert.deepEqual(device.destructiveCommands(), []);
    } finally {
        await serial.close();
    }
});

test('a boot banner during an unrelated command still invalidates the verified console', async () => {
    const device = new FakeFalcon({
        onCommand: command => command === 'printenv commit'
            ? 'U-Boot 2015.04-lantiq-gpon-1.3.6.1 (Feb 07 2018 - 17:12:06)'
            : undefined
    });
    const port = new StreamFalconPort(device);
    const serial = realConsole(port);
    try {
        await serial.open();
        await serial.acquire();
        await assert.rejects(run(serial), { code: 'DISCONNECTED' });
        assert.deepEqual(device.destructiveCommands(), []);
    } finally {
        await serial.close();
    }
});

test('real byte transport sends CAN cleanup even after the operation signal is aborted', async () => {
    const controller = new AbortController();
    const packets = [];
    let input;
    const port = {
        async open() {
            this.readable = new ReadableStream({ start: stream => { input = stream; input.enqueue(Uint8Array.of(CRC_REQUEST)); } });
            this.writable = new WritableStream({ write: async bytes => {
                packets.push(Uint8Array.from(bytes));
                if (bytes[0] !== 0x18) input.enqueue(Uint8Array.of(ACK));
            } });
        },
        async close() {}
    };
    const serial = realConsole(port, controller.signal);
    try {
        await serial.open();
        await assert.rejects(sendYmodem(serial, Uint8Array.of(1, 2, 3), {
            signal: controller.signal,
            onProgress: () => controller.abort(),
            startupTimeoutMs: 200, responseTimeoutMs: 200, transferTimeoutMs: 1000
        }), { name: 'AbortError' });
        assert.deepEqual([...packets.at(-1)], [0x18, 0x18, 0x18, 0x18, 0x08, 0x08, 0x08, 0x08]);
        assert.equal(packets.filter(packet => packet[0] === 0x18).length, 1);
    } finally {
        await serial.close();
    }
});
