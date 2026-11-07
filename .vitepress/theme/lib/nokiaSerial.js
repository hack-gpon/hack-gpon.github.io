// Nokia G-010S-A console settings only. This procedure never flashes firmware,
// applies Huawei GPIO settings, or treats BootROM output as a command prompt.
const PROMPT = /(?:^|\n)[ \t]*FALCON[ \t]*=>[ \t]*$/;
const ROM = /(?:^|\n)[ \t]*ROM:/;
const STARTUP = /(?:^|\n)[ \t]*(?:U-Boot\b|Chip:|Bootmode:|Reset cause:|CPU Clock:|Press SPACE|Hit any key|Autoboot)/;
const STARTUP_EVENTS = /(?:^|\n)[ \t]*(?:ROM:[ \t]*V|U-Boot\b|Chip:|Bootmode:|Reset cause:|CPU Clock:|Press SPACE|Hit any key|Autoboot)/g;
const LINUX = /(?:^|\n)[ \t]*(?:Starting kernel|Linux version |BusyBox |[^\n]*[Ll]ogin:[ \t]*$|root@[^\n]*[#$][ \t]*$)/m;
const RECOVERABLE = new Set(['BreakError', 'FramingError', 'ParityError']);
const VARIABLES = ['asc0', 'bootdelay', 'preboot'];
const MAX_OUTPUT = 256 * 1024;

function failure(code, message) {
    return Object.assign(new Error(message), { name: 'NokiaSerialError', code });
}

function cancelled() {
    return new DOMException('The Nokia UART procedure was cancelled.', 'AbortError');
}

function checkAbort(signal) {
    if (signal?.aborted) throw cancelled();
}

// A timed-out read remains owned by the session until it is consumed or closed.
// This avoids concurrent readers and losing bytes between polling intervals.
async function bounded(promise, ms, signal, error) {
    if (signal?.aborted) {
        // The caller may already have started an I/O request when abort fires.
        // Observe a late rejection even though this operation cannot continue.
        Promise.resolve(promise).catch(() => {});
        throw cancelled();
    }
    let timer;
    let abort;
    const interrupted = new Promise((_, reject) => {
        if (ms !== undefined) timer = setTimeout(() => reject(error), Math.max(0, ms));
        abort = () => reject(cancelled());
        signal?.addEventListener('abort', abort, { once: true });
    });
    try {
        return await Promise.race([promise, interrupted]);
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', abort);
    }
}

function normalize(text) {
    return text.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '').replace(/\r\n?/g, '\n');
}

function checkConsole(text, command = false) {
    if (/ROM:\s*Boot\?|Boot\?\s*\(0-9A-F/i.test(text)) {
        throw failure('BOOTROM_MENU', 'The module is at the BootROM recovery menu, not the FALCON U-Boot console. Use the documented Nokia recovery procedure.');
    }
    if (LINUX.test(text)) {
        throw failure('LINUX_CONSOLE', 'The module has booted into Linux. Use SSH to enable UART, or power-cycle the module and retry to stop U-Boot.');
    }
    if (command && (ROM.test(text) || STARTUP.test(text))) {
        throw failure('DISCONNECTED', 'The module restarted during the command. No further commands will be sent.');
    }
}

class NokiaConsole {
    constructor(port, { signal, baudRate, startupTimeoutMs, commandTimeoutMs, ioTimeoutMs }) {
        Object.assign(this, { port, signal, baudRate, startupTimeoutMs, commandTimeoutMs, ioTimeoutMs });
        this.buffer = '';
        this.decoder = new TextDecoder();
        this.encoder = new TextEncoder();
        this.verified = false;
        this.readErrors = 0;
    }

    async open() {
        checkAbort(this.signal);
        this.opening = this.port.open({ baudRate: this.baudRate, dataBits: 8, stopBits: 1, parity: 'none', flowControl: 'none' });
        await bounded(this.opening, this.ioTimeoutMs, this.signal, failure('TIMEOUT', 'Opening the serial port timed out.'));
        this.opened = true;
        this.reader = this.port.readable?.getReader();
        this.writer = this.port.writable?.getWriter();
        if (!this.reader || !this.writer) throw failure('DISCONNECTED', 'The serial port has no readable/writable connection.');
    }

    async write(text, deadline) {
        checkAbort(this.signal);
        if (!this.writer) throw failure('DISCONNECTED', 'The serial connection is closed.');
        const remaining = Math.min(this.ioTimeoutMs, deadline - Date.now());
        if (remaining <= 0) throw failure('TIMEOUT', 'The serial operation timed out.');
        try {
            await bounded(this.writer.write(this.encoder.encode(text)), remaining, this.signal,
                failure('TIMEOUT', 'Writing to the serial port timed out.'));
        } catch (error) {
            if (error.name === 'AbortError' || error.code) throw error;
            throw failure('DISCONNECTED', `Could not write to the serial port: ${error.message}`);
        }
    }

    async read(deadline, pollMs = Infinity) {
        checkAbort(this.signal);
        if (!this.pendingRead) this.pendingRead = this.reader.read();
        let result;
        try {
            result = await bounded(this.pendingRead, Math.min(pollMs, deadline - Date.now()), this.signal,
                failure('POLL', 'Waiting for serial data.'));
        } catch (error) {
            if (error.code === 'POLL') return false;
            this.pendingRead = undefined;
            // Web Serial replaces its readable stream after these nonfatal
            // errors (FTDI adapters can report BREAK during module insertion).
            if (RECOVERABLE.has(error.name) && ++this.readErrors <= 5) {
                this.reader.releaseLock();
                this.reader = this.port.readable?.getReader();
                this.decoder = new TextDecoder();
                if (this.reader) return true;
            }
            if (error.name === 'AbortError') throw error;
            throw failure('DISCONNECTED', `Serial reading failed (${error.name}): ${error.message}. Check the adapter, wiring and 115200 8-N-1 settings.`);
        }
        this.pendingRead = undefined;
        if (result.done) throw failure('DISCONNECTED', 'The serial connection closed before the procedure completed.');
        this.buffer += this.decoder.decode(result.value, { stream: true });
        if (this.buffer.length > MAX_OUTPUT) throw failure('TIMEOUT', 'Too much serial output was received without a FALCON prompt.');
        return true;
    }

    async acquire() {
        this.verified = false;
        const deadline = Date.now() + this.startupTimeoutMs;
        await this.write('\r', deadline); // Also elicit a prompt from an idle U-Boot.
        let lastEvent = -1;
        let interruptUntil = 0;
        let nextInterrupt = 0;
        while (Date.now() < deadline) {
            checkAbort(this.signal);
            const text = normalize(this.buffer);
            checkConsole(text);
            if (PROMPT.test(text)) {
                this.buffer = '';
                const bytes = crypto.getRandomValues(new Uint8Array(12));
                const nonce = '__NOKIA_UART_' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('') + '__';
                const response = await this.exchange(`echo ${nonce}`, Math.min(deadline, Date.now() + this.commandTimeoutMs));
                if (!normalize(response).split('\n').some(line => line.trim() === nonce)) {
                    throw failure('UNVERIFIED', 'The FALCON prompt did not return the console verification response. No settings were changed.');
                }
                this.verified = true;
                return;
            }
            const events = Array.from(text.matchAll(STARTUP_EVENTS));
            const latest = events.at(-1)?.index ?? -1;
            if (latest > lastEvent) {
                lastEvent = latest;
                interruptUntil = Math.min(deadline, Date.now() + 5000);
                nextInterrupt = Date.now();
            }
            if (Date.now() < interruptUntil && Date.now() >= nextInterrupt) {
                await this.write('\x03', deadline);
                nextInterrupt = Date.now() + 50;
            }
            await this.read(deadline, Date.now() < interruptUntil ? Math.max(1, nextInterrupt - Date.now()) : Infinity);
        }
        const text = normalize(this.buffer);
        if (ROM.test(text) && !STARTUP.test(text)) {
            throw failure('ROM_ONLY', 'Only BootROM output was received; an interactive U-Boot prompt was not obtained. The UART console may be disabled by asc0=3. Enable it through SSH or the supported web interface, or use the documented Nokia recovery procedure if network access is unavailable. No settings were changed.');
        }
        throw failure('TIMEOUT', 'Timed out waiting for a verified FALCON prompt. Check the Nokia pinout and power-cycle the module after starting this procedure. No settings were changed.');
    }

    async exchange(command, deadline) {
        await this.write(command + '\r', deadline);
        while (Date.now() < deadline) {
            await this.read(deadline);
            const text = normalize(this.buffer);
            checkConsole(text, true);
            const prompt = PROMPT.exec(text);
            if (prompt) {
                this.buffer = '';
                return text.slice(0, prompt.index);
            }
        }
        throw failure('TIMEOUT', `U-Boot did not finish the ${command.split(' ')[0]} command in time. No further commands will be sent.`);
    }

    async command(command) {
        if (!this.verified) throw failure('UNVERIFIED', 'A verified FALCON console is required before sending commands.');
        try {
            return await this.exchange(command, Date.now() + this.commandTimeoutMs);
        } catch (error) {
            this.verified = false;
            throw error;
        }
    }

    async close() {
        this.verified = false;
        if (!this.opened) {
            // An open request may finish after its timeout or user cancellation.
            this.opening?.then(() => this.port.close()).catch(() => {});
            return;
        }
        const limit = Math.min(1000, this.ioTimeoutMs);
        const cleanup = promise => bounded(Promise.resolve(promise).catch(() => {}), limit, undefined,
            failure('TIMEOUT', 'Serial cleanup timed out.')).catch(() => {});
        await Promise.all([cleanup(this.reader?.cancel()), cleanup(this.writer?.abort())]);
        try { this.reader?.releaseLock(); } catch { /* A disconnected stream can already be released. */ }
        try { this.writer?.releaseLock(); } catch { /* A disconnected stream can already be released. */ }
        await cleanup(this.port.close());
    }
}

function commandFailed(response) {
    return /\b(?:error|failed|failure|bad crc|unknown command|timeout|timed out)\b|^\s*Usage:/im.test(response);
}

async function readSettings(serial) {
    const settings = {};
    for (const variable of VARIABLES) {
        const command = `printenv ${variable}`;
        const response = await serial.command(command);
        const lines = normalize(response).split('\n').map(line => line.trim()).filter(line =>
            line && line !== command && line !== `FALCON => ${command}`);
        const missing = new RegExp(`^## Error: ["']?${variable}["']? not defined$`, 'i');
        if (lines.length === 1 && missing.test(lines[0])) {
            settings[variable] = null;
        } else if (lines.length === 1 && lines[0].startsWith(variable + '=') && !commandFailed(response)) {
            settings[variable] = lines[0].slice(variable.length + 1);
        } else {
            throw failure('COMMAND_FAILED', `Could not reliably read ${variable}. No further changes will be made; check the serial console and U-Boot environment.`);
        }
    }
    return settings;
}

function sameSettings(a, b) {
    return VARIABLES.every(variable => a[variable] === b[variable]);
}

/**
 * Enable the Nokia G-010S-A UART from an already accessible U-Boot console.
 * Missing environment variables are represented by null. onBackup receives the
 * three original settings; confirmChanges must explicitly return true before
 * any mutation. Success leaves U-Boot paused, ready for a manual power cycle.
 * Timeout overrides are useful for slower adapters and deterministic tests.
 */
export async function enableNokiaSerial(port, {
    signal, onStatus = () => {}, onBackup = () => {}, confirmChanges,
    baudRate = 115200, startupTimeoutMs = 45000, commandTimeoutMs = 5000, ioTimeoutMs = 5000
} = {}) {
    for (const timeout of [startupTimeoutMs, commandTimeoutMs, ioTimeoutMs]) {
        if (!Number.isFinite(timeout) || timeout <= 0) throw new TypeError('Serial timeouts must be positive finite numbers.');
    }
    const serial = new NokiaConsole(port, { signal, baudRate, startupTimeoutMs, commandTimeoutMs, ioTimeoutMs });
    try {
        onStatus('Opening the serial port.');
        await serial.open();
        onStatus('Serial port open. Power-cycle the Nokia G-010S-A now if it is already running.');
        await serial.acquire();
        onStatus('FALCON console verified. Reading the current UART settings.');
        const before = await readSettings(serial);
        await bounded(Promise.resolve(onBackup({ ...before })), undefined, signal);
        if (before.asc0 !== null && !/^[0-3]$/.test(before.asc0)) {
            throw failure('UNEXPECTED_ASC0', 'The module has an unexpected asc0 value. Its original settings were captured, but no settings were changed. Review the bootloader configuration manually.');
        }
        const preboot = (before.preboot ?? '').trim().replace(/\s+/g, ' ');
        if (!['', 'gpio clear 100', 'run start_netconsole'].includes(preboot)) {
            throw failure('UNSAFE_PREBOOT', 'The module has a custom preboot command. Its original settings were captured, but no settings were changed. Review preboot manually before enabling UART.');
        }
        const delay = Number(before.bootdelay);
        const positiveDelay = /^\d+$/.test(before.bootdelay ?? '') && Number.isSafeInteger(delay) && delay > 0 && delay <= 0x7fffffff;
        const after = { asc0: '0', bootdelay: positiveDelay ? before.bootdelay : '5', preboot: null };
        if (sameSettings(before, after)) {
            onStatus('UART is already enabled with a positive boot delay. No settings were changed. U-Boot remains paused.');
            return { before, after, changed: false, saved: false };
        }
        onStatus('Review the original settings and proposed changes before saving.');
        checkAbort(signal);
        if (typeof confirmChanges !== 'function' ||
            await bounded(Promise.resolve(confirmChanges({ before: { ...before }, after: { ...after } })), undefined, signal) !== true) {
            throw cancelled();
        }
        // The module could have rebooted, disconnected, or been changed while
        // the user reviewed the proposal. Obtain a fresh prompt and readback.
        await serial.acquire();
        if (!sameSettings(await readSettings(serial), before)) {
            throw failure('SETTINGS_CHANGED', 'The U-Boot settings changed while confirmation was pending. Nothing was written; start again to review the current values.');
        }
        onStatus('Applying the confirmed Nokia UART settings.');
        for (const variable of VARIABLES) {
            if (before[variable] === after[variable]) continue;
            const command = `setenv ${variable}` + (after[variable] === null ? '' : ` ${after[variable]}`);
            if (commandFailed(await serial.command(command))) {
                throw failure('COMMAND_FAILED', `U-Boot rejected ${variable}. Changes have not been saved to flash; power-cycle to discard the temporary settings.`);
            }
        }
        if (!sameSettings(await readSettings(serial), after)) {
            throw failure('COMMAND_FAILED', 'UART settings did not match the requested values. Changes have not been saved to flash; power-cycle to discard the temporary settings.');
        }
        onStatus('Settings verified. Saving the U-Boot environment.');
        checkAbort(signal);
        let saved;
        try {
            saved = await serial.command('saveenv');
        } catch (error) {
            throw failure('SAVE_FAILED', `The saveenv operation was interrupted (${error.message}). The saved state is uncertain; keep power connected and inspect the console before rebooting.`);
        }
        if (commandFailed(saved) || !/\b(?:done|ok)[.!]?\s*$/i.test(saved)) {
            throw failure('SAVE_FAILED', 'U-Boot did not confirm a successful saveenv. The saved state is uncertain; keep power connected and inspect the console before rebooting.');
        }
        onStatus('UART settings saved. U-Boot remains paused; power-cycle the module to boot normally.');
        return { before, after, changed: true, saved: true };
    } finally {
        await serial.close();
    }
}
