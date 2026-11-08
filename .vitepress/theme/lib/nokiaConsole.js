// Shared verified FALCON console transport for Nokia UART tools.
const PROMPT = /(?:^|\n)[ \t]*FALCON[ \t]*=>[ \t]*$/;
const ROM = /(?:^|\n)[ \t]*ROM:/;
const STARTUP = /(?:^|\n)[ \t]*(?:U-Boot\b|Chip:|Bootmode:|Reset cause:|CPU Clock:|Press SPACE|Hit any key|Autoboot)/;
const STARTUP_EVENTS = /(?:^|\n)[ \t]*(?:ROM:[ \t]*V|U-Boot\b|Chip:|Bootmode:|Reset cause:|CPU Clock:|Press SPACE|Hit any key|Autoboot)/g;
const LINUX = /(?:^|\n)[ \t]*(?:Starting kernel|Linux version |BusyBox |[^\n]*[Ll]ogin:[ \t]*$|root@[^\n]*[#$][ \t]*$)/m;
const RECOVERABLE = new Set(['BreakError', 'FramingError', 'ParityError']);
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

function checkConsole(text, command = false, versionReply = false) {
    if (/bad\s+crc[^\n]*using\s+default\s+environment/i.test(text)) {
        throw failure('BAD_ENVIRONMENT', 'U-Boot reported an invalid saved environment and is using defaults. Review or restore the environment before configuring or flashing the module.');
    }
    if (/ROM:\s*Boot\?|Boot\?\s*\(0-9A-F/i.test(text)) {
        throw failure('BOOTROM_MENU', 'The module is at the BootROM recovery menu, not the FALCON U-Boot console. Use the documented Nokia recovery procedure.');
    }
    if (LINUX.test(text)) {
        throw failure('LINUX_CONSOLE', 'The module has booted into Linux. Use SSH to enable UART, or power-cycle the module and retry to stop U-Boot.');
    }
    // `version` legitimately prints the U-Boot banner. Permit only that line
    // for that exact command; ROM/Chip/Bootmode/etc. still signal a restart.
    const startupText = versionReply ? text.replace(/^U-Boot[^\n]*(?:\n|$)/gm, '') : text;
    if (command && (ROM.test(text) || STARTUP.test(startupText))) {
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
        this.bytes = new Uint8Array();
        this.byteOffset = 0;
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
        return this.writeBytes(this.encoder.encode(text), deadline);
    }

    async writeBytes(bytes, deadline, signal = this.signal) {
        checkAbort(signal);
        if (!this.writer) throw failure('DISCONNECTED', 'The serial connection is closed.');
        const remaining = Math.min(this.ioTimeoutMs, deadline - Date.now());
        if (remaining <= 0) throw failure('TIMEOUT', 'The serial operation timed out.');
        try {
            await bounded(this.writer.write(bytes), remaining, signal,
                failure('TIMEOUT', 'Writing to the serial port timed out.'));
        } catch (error) {
            if (error.name === 'AbortError' || error.code) throw error;
            throw failure('DISCONNECTED', `Could not write to the serial port: ${error.message}`);
        }
    }

    async readRaw(deadline, pollMs = Infinity, recover = false) {
        checkAbort(this.signal);
        if (this.byteOffset < this.bytes.length) {
            const bytes = this.bytes.subarray(this.byteOffset);
            this.bytes = new Uint8Array();
            this.byteOffset = 0;
            return bytes;
        }
        if (!this.pendingRead) this.pendingRead = this.reader.read();
        let result;
        try {
            result = await bounded(this.pendingRead, Math.min(pollMs, deadline - Date.now()), this.signal,
                failure('POLL', 'Waiting for serial data.'));
        } catch (error) {
            if (error.code === 'POLL') return null;
            this.pendingRead = undefined;
            // Web Serial replaces its readable stream after these nonfatal
            // errors (FTDI adapters can report BREAK during module insertion).
            if (recover && RECOVERABLE.has(error.name) && ++this.readErrors <= 5) {
                this.reader.releaseLock();
                this.reader = this.port.readable?.getReader();
                this.decoder = new TextDecoder();
                if (this.reader) return new Uint8Array();
            }
            if (error.name === 'AbortError') throw error;
            throw failure('DISCONNECTED', `Serial reading failed (${error.name}): ${error.message}. Check the adapter, wiring and 115200 8-N-1 settings.`);
        }
        this.pendingRead = undefined;
        if (result.done) throw failure('DISCONNECTED', 'The serial connection closed before the procedure completed.');
        return result.value;
    }

    async read(deadline, pollMs = Infinity) {
        const bytes = await this.readRaw(deadline, pollMs, true);
        if (bytes === null) return false;
        this.buffer += this.decoder.decode(bytes, { stream: true });
        if (this.buffer.length > MAX_OUTPUT) throw failure('TIMEOUT', 'Too much serial output was received without a FALCON prompt.');
        return true;
    }

    // YMODEM consumes individual bytes, preserving coalesced ACK/C/prompt data.
    // Stream/framing errors during binary transfer are fatal; only the text
    // console may recover its readable stream after an FTDI BREAK.
    async readByte(deadline, signal = this.signal) {
        checkAbort(signal);
        while (this.byteOffset >= this.bytes.length) {
            if (Date.now() >= deadline) throw failure('TIMEOUT', 'Waiting for serial data timed out.');
            const bytes = await this.readRaw(deadline);
            this.bytes = bytes ?? new Uint8Array();
            this.byteOffset = 0;
            checkAbort(signal);
        }
        return this.bytes[this.byteOffset++];
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
        return this.waitPrompt(deadline, command.split(' ')[0]);
    }

    async waitPrompt(deadline, operation = 'transfer') {
        while (Date.now() < deadline) {
            await this.read(deadline);
            const text = normalize(this.buffer);
            checkConsole(text, true, operation === 'version');
            const prompt = PROMPT.exec(text);
            if (prompt) {
                this.buffer = '';
                return text.slice(0, prompt.index);
            }
        }
        throw failure('TIMEOUT', `U-Boot did not finish the ${operation} command in time. No further commands will be sent.`);
    }

    async command(command, timeoutMs = this.commandTimeoutMs) {
        if (!this.verified) throw failure('UNVERIFIED', 'A verified FALCON console is required before sending commands.');
        try {
            return await this.exchange(command, Date.now() + timeoutMs);
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


export { NokiaConsole, failure, cancelled, checkAbort, bounded, normalize, commandFailed };
