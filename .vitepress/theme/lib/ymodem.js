// YMODEM/CRC sender for a receiver already started with U-Boot's `loady`.
// Keep this separate from the historical Huawei XYMini implementation.
// Receiver reference: https://github.com/u-boot/u-boot/blob/v2015.04/common/xyzModem.c
const SOH = 0x01;
const STX = 0x02;
const EOT = 0x04;
const ACK = 0x06;
const NAK = 0x15;
const CAN = 0x18;
const CRC = 0x43;
const DATA_SIZE = 1024;

function failure(code, message) {
    return Object.assign(new Error(message), { name: 'YmodemError', code });
}

function checkAbort(signal) {
    if (signal?.aborted) throw new DOMException('Firmware transfer cancelled.', 'AbortError');
}

function isTimeout(error) {
    return ['TIMEOUT', 'POLL', 'YMODEM_TIMEOUT'].includes(error?.code) || error?.name === 'TimeoutError';
}

function crc16(bytes) {
    let crc = 0;
    for (const byte of bytes) {
        crc ^= byte << 8;
        for (let bit = 0; bit < 8; bit++) {
            crc = ((crc << 1) ^ ((crc & 0x8000) ? 0x1021 : 0)) & 0xffff;
        }
    }
    return crc;
}

function packet(sequence, bytes, size, padding = 0) {
    const result = new Uint8Array(size + 5);
    result[0] = size === 128 ? SOH : STX;
    result[1] = sequence & 0xff;
    result[2] = result[1] ^ 0xff;
    result.fill(padding, 3, 3 + size);
    result.set(bytes, 3);
    const checksum = crc16(result.subarray(3, 3 + size));
    result[3 + size] = checksum >>> 8;
    result[4 + size] = checksum & 0xff;
    return result;
}

/**
 * Transfer one file, including the size header and final empty batch header.
 *
 * The caller must first verify U-Boot's loady readiness banner. Its transport
 * supplies readByte(deadline, signal) and writeBytes(bytes, deadline, signal).
 * Deadlines are absolute Date.now() values. Both methods must honour deadlines
 * and aborts; a read timeout must not consume a later byte. The transport owns
 * the byte queue, so bytes after the final ACK remain available to the caller's
 * console parser, even when ACK and the U-Boot prompt arrive in one USB chunk.
 *
 * A completed transfer is not permission to flash: the caller must separately
 * verify the reported length and a checksum of the entire RAM buffer.
 */
export async function sendYmodem(io, data, {
    signal,
    filename = 'firmware.image',
    onProgress = () => {},
    startupTimeoutMs = 30000,
    responseTimeoutMs = 5000,
    writeTimeoutMs = 5000,
    transferTimeoutMs = 30 * 60 * 1000,
    maxRetries = 10
} = {}) {
    if (!(data instanceof Uint8Array) || data.length === 0) {
        throw failure('YMODEM_INPUT', 'Select a nonempty binary firmware image.');
    }
    if (typeof io?.readByte !== 'function' || typeof io?.writeBytes !== 'function') {
        throw failure('YMODEM_INPUT', 'The transfer requires a bounded byte transport.');
    }
    // The filename is metadata, never a terminal command or a local path.
    if (typeof filename !== 'string' || !/^[A-Za-z0-9._-]{1,96}$/.test(filename)) {
        throw failure('YMODEM_INPUT', 'Use a short ASCII filename without paths or control characters.');
    }
    const timing = [startupTimeoutMs, responseTimeoutMs, writeTimeoutMs, transferTimeoutMs];
    if (!timing.every(value => Number.isFinite(value) && value > 0) ||
        !Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 100) {
        throw failure('YMODEM_INPUT', 'Invalid transfer timeout or retry limit.');
    }
    checkAbort(signal);

    const expires = Date.now() + transferTimeoutMs;
    let retries = 0;
    let started = false;
    const deadline = ms => Math.min(expires, Date.now() + ms);

    function checkTime(end) {
        checkAbort(signal);
        if (Date.now() >= end) throw failure('YMODEM_TIMEOUT', 'The firmware transfer timed out.');
    }

    async function write(bytes) {
        const end = deadline(writeTimeoutMs);
        checkTime(end);
        await io.writeBytes(bytes, end, signal);
        checkTime(expires);
    }

    async function control(accepted, end) {
        let cancellations = 0;
        let ignored = 0;
        while (true) {
            checkTime(end);
            const byte = await io.readByte(end, signal);
            checkTime(expires);
            if (!Number.isInteger(byte) || byte < 0 || byte > 255) {
                throw failure('YMODEM_IO', 'The serial connection did not return a valid byte.');
            }
            if (byte === CAN) {
                if (++cancellations >= 2) {
                    throw failure('YMODEM_CANCELLED', 'The receiver cancelled the firmware transfer.');
                }
            } else {
                cancellations = 0;
                if (accepted.includes(byte)) return byte;
            }
            // Repeated C characters and harmless status text must not extend
            // a deadline or keep an immediate/noisy reader spinning forever.
            if (++ignored > 4096) {
                throw failure('YMODEM_PROTOCOL', 'Too much unexpected serial data during the transfer.');
            }
        }
    }

    async function sendPacket(bytes, label) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            checkTime(expires);
            await write(bytes);
            try {
                const answer = await control([ACK, NAK], deadline(responseTimeoutMs));
                if (answer === ACK) return;
            } catch (error) {
                if (!isTimeout(error)) throw error;
                checkTime(expires);
            }
            if (attempt < maxRetries) retries++;
        }
        throw failure('YMODEM_RETRIES', `The receiver did not acknowledge ${label}; the retry limit was reached.`);
    }

    async function endFile() {
        // Standard receivers can NAK the first EOT; U-Boot can ACK it twice.
        // C alone also establishes that the receiver is waiting for the final
        // batch header when an EOT acknowledgement was lost.
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            await write(Uint8Array.of(EOT));
            let answer;
            try {
                answer = await control([ACK, NAK, CRC], deadline(responseTimeoutMs));
            } catch (error) {
                if (!isTimeout(error)) throw error;
                checkTime(expires);
            }
            if (answer === CRC) return;
            if (answer === ACK) {
                await control([CRC], deadline(responseTimeoutMs));
                return;
            }
            if (attempt < maxRetries) retries++;
        }
        throw failure('YMODEM_RETRIES', 'The receiver did not finish the file transfer.');
    }

    try {
        started = true;
        const ready = await control([CRC, NAK], deadline(startupTimeoutMs));
        if (ready !== CRC) {
            throw failure('YMODEM_CHECKSUM', 'The receiver requested legacy checksum mode; CRC YMODEM is required.');
        }
        const metadata = new TextEncoder().encode(`${filename}\0${data.length}\0`);
        await sendPacket(packet(0, metadata, 128), 'the file header');

        // U-Boot 2011.12 and 2015.04 do not necessarily send another C after
        // acknowledging block 0. Start data after ACK; an optional C is ignored
        // while waiting for that data block's ACK. Retry only after NAK/timeout,
        // avoiding duplicate packets when C and ACK arrive in separate chunks.
        let sequence = 1;
        for (let offset = 0; offset < data.length; offset += DATA_SIZE) {
            const end = Math.min(offset + DATA_SIZE, data.length);
            await sendPacket(packet(sequence, data.subarray(offset, end), DATA_SIZE, 0x1a), `data block ${sequence}`);
            sequence = (sequence + 1) & 0xff;
            onProgress(end, data.length);
        }

        await endFile();
        await sendPacket(packet(0, new Uint8Array(0), 128), 'the final batch header');
        return { bytesSent: data.length, retries };
    } catch (error) {
        if (started) {
            // Cancellation has to reach loady even when the operation's signal
            // is already aborted. Do not let cleanup replace the original error.
            try {
                await io.writeBytes(Uint8Array.of(CAN, CAN, CAN, CAN, 0x08, 0x08, 0x08, 0x08),
                    Date.now() + Math.min(writeTimeoutMs, 1000), new AbortController().signal);
            } catch {}
        }
        throw error;
    }
}
