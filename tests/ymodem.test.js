import test from 'node:test';
import assert from 'node:assert/strict';
import { sendYmodem } from '../.vitepress/theme/lib/ymodem.js';

const SOH = 0x01, STX = 0x02, EOT = 0x04, ACK = 0x06, NAK = 0x15, CAN = 0x18, C = 0x43;
const FAST = { startupTimeoutMs: 80, responseTimeoutMs: 35, writeTimeoutMs: 80, transferTimeoutMs: 2000 };
const decoder = new TextDecoder();
const encoder = new TextEncoder();

// Independent bytewise CRC-CCITT reference, including a known check vector.
function referenceCrc(bytes) {
    let crc = 0;
    for (const byte of bytes) {
        let value = ((crc >>> 8) ^ byte) & 0xff;
        value ^= value >>> 4;
        crc = ((crc << 8) ^ (value << 12) ^ (value << 5) ^ value) & 0xffff;
    }
    return crc;
}
assert.equal(referenceCrc(encoder.encode('123456789')), 0x31c3);

function timeout() {
    return Object.assign(new Error('Serial read deadline reached'), { code: 'TIMEOUT' });
}

// This receiver models the relevant U-Boot/standard YMODEM wire behaviour, not
// the sender's functions. Its byte queue deliberately retains coalesced output.
class Receiver {
    constructor({ headerC = false, firstEotNak = false, doubleAck = true, initial = [C],
        onPacket, dropDataAck = -1, split = false, trailer = '\r\n## Total Size = ready\r\nFALCON => ' } = {}) {
        Object.assign(this, { headerC, firstEotNak, doubleAck, onPacket, dropDataAck, split, trailer });
        this.chunks = [];
        this.writes = [];
        this.phase = 'header';
        this.expected = 1;
        this.accepted = [];
        this.attempts = new Map();
        this.eots = 0;
        this.cancels = 0;
        this.dropped = false;
        this.enqueue(Uint8Array.from(initial));
    }

    enqueue(bytes) {
        if (bytes.length) {
            if (this.split) for (const byte of bytes) this.chunks.push(Uint8Array.of(byte));
            else this.chunks.push(bytes.slice());
        }
        if (this.pending && this.chunks.length) this.pending.finish(null, this.take());
    }

    take() {
        const byte = this.chunks[0][0];
        this.chunks[0] = this.chunks[0].subarray(1);
        if (!this.chunks[0].length) this.chunks.shift();
        return byte;
    }

    remaining() {
        return Uint8Array.from(this.chunks.flatMap(chunk => [...chunk]));
    }

    async readByte(deadline, signal) {
        if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
        if (Date.now() >= deadline) throw timeout();
        if (this.chunks.length) return this.take();
        assert.equal(this.pending, undefined, 'there must only be one pending read');
        return new Promise((resolve, reject) => {
            const finish = (error, byte) => {
                clearTimeout(timer);
                signal?.removeEventListener('abort', abort);
                this.pending = undefined;
                if (error) reject(error);
                else resolve(byte);
            };
            const abort = () => finish(new DOMException('Cancelled', 'AbortError'));
            const timer = setTimeout(() => finish(timeout()), Math.max(0, deadline - Date.now()));
            this.pending = { finish };
            signal?.addEventListener('abort', abort, { once: true });
        });
    }

    async writeBytes(bytes, deadline, signal) {
        if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
        if (Date.now() >= deadline) throw timeout();
        this.writes.push(bytes.slice());
        if (bytes[0] === CAN) {
            this.cancels++;
            return;
        }
        if (bytes[0] === EOT) {
            assert.equal(bytes.length, 1);
            this.eots++;
            if (this.firstEotNak && this.eots === 1) {
                this.enqueue(Uint8Array.of(NAK));
            } else {
                this.phase = 'final';
                this.enqueue(Uint8Array.from(this.doubleAck ? [ACK, ACK, C] : [ACK, C]));
            }
            return;
        }
        const payloadSize = bytes[0] === SOH ? 128 : 1024;
        assert.ok(bytes[0] === SOH || bytes[0] === STX, 'valid YMODEM packet type');
        assert.equal(bytes.length, payloadSize + 5);
        assert.equal(bytes[1] ^ bytes[2], 0xff);
        const payload = bytes.subarray(3, bytes.length - 2);
        assert.equal((bytes.at(-2) << 8) | bytes.at(-1), referenceCrc(payload), 'valid wire CRC');
        const key = `${this.phase}/${this.accepted.length}/${bytes[1]}`;
        const attempt = (this.attempts.get(key) ?? 0) + 1;
        this.attempts.set(key, attempt);
        if (await this.onPacket?.({ phase: this.phase, sequence: bytes[1], bytes, payload, attempt }, this)) return;

        if (this.phase === 'header') {
            assert.equal(bytes[0], SOH);
            assert.equal(bytes[1], 0);
            const fields = decoder.decode(payload).split('\0');
            this.filename = fields[0];
            this.length = Number(fields[1]);
            this.phase = 'data';
            this.enqueue(Uint8Array.from(this.headerC ? [ACK, C] : [ACK]));
        } else if (this.phase === 'data') {
            if (this.lastPacket && bytes[1] === this.lastPacket[1]) {
                assert.deepEqual(bytes, this.lastPacket, 'a retry sends the identical packet');
                this.enqueue(Uint8Array.of(ACK));
                return;
            }
            assert.equal(bytes[1], this.expected, 'sequential modulo-256 data packets');
            this.expected = (this.expected + 1) & 0xff;
            this.lastPacket = bytes.slice();
            this.accepted.push(payload.slice());
            if (!this.dropped && this.accepted.length === this.dropDataAck) this.dropped = true;
            else this.enqueue(Uint8Array.of(ACK));
        } else {
            assert.equal(bytes[0], SOH);
            assert.equal(bytes[1], 0);
            assert.ok(payload.every(byte => byte === 0), 'end-of-batch header is empty');
            this.enqueue(Uint8Array.from([ACK, ...encoder.encode(this.trailer)]));
            this.phase = 'complete';
        }
    }

    file() {
        const bytes = new Uint8Array(this.accepted.length * 1024);
        this.accepted.forEach((block, index) => bytes.set(block, index * 1024));
        return bytes.subarray(0, this.length);
    }
}

const sample = length => Uint8Array.from({ length }, (_, index) => (index * 37 + 19) & 0xff);
const run = (io, bytes, options = {}) => sendYmodem(io, bytes, { ...FAST, ...options });

test('U-Boot ACK-only header and double-ACK EOT preserve the exact file and console tail', async () => {
    const bytes = sample(2049);
    bytes[2048] = 0x1a; // A real file-ending Ctrl-Z must survive YMODEM padding.
    const receiver = new Receiver();
    const progress = [];
    const result = await run(receiver, bytes, { onProgress: value => progress.push(value) });
    assert.deepEqual(result, { bytesSent: 2049, retries: 0 });
    assert.equal(receiver.filename, 'firmware.image');
    assert.equal(receiver.length, bytes.length);
    assert.deepEqual(receiver.file(), bytes);
    assert.deepEqual(progress, [1024, 2048, 2049]);
    assert.equal(receiver.phase, 'complete');
    assert.equal(receiver.eots, 1);
    assert.equal(receiver.cancels, 0);
    assert.equal(decoder.decode(receiver.remaining()), receiver.trailer);
});

test('standard header ACK+C and first-EOT NAK work with byte-split replies', async () => {
    const bytes = sample(1100);
    const receiver = new Receiver({ headerC: true, firstEotNak: true, doubleAck: false, split: true });
    const result = await run(receiver, bytes, { filename: 'nokia.image' });
    assert.deepEqual(receiver.file(), bytes);
    assert.equal(receiver.filename, 'nokia.image');
    assert.equal(receiver.eots, 2);
    assert.equal(result.retries, 1);
    assert.equal(decoder.decode(receiver.remaining()), receiver.trailer);
});

test('data block numbering wraps through zero without changing the payload', async () => {
    const bytes = sample(260 * 1024 + 17);
    const receiver = new Receiver();
    await run(receiver, bytes);
    assert.deepEqual(receiver.file(), bytes);
    const packets = receiver.writes.filter(bytes => bytes[0] === STX);
    assert.deepEqual(packets.slice(253, 258).map(bytes => bytes[1]), [254, 255, 0, 1, 2]);
    assert.equal(packets.length, 261);
});

test('a lost data ACK retries the identical block without duplicate progress or data', async () => {
    const bytes = sample(3000);
    const receiver = new Receiver({ dropDataAck: 2 });
    const progress = [];
    const result = await run(receiver, bytes, { onProgress: value => progress.push(value) });
    assert.equal(result.retries, 1);
    assert.equal(receiver.writes.filter(bytes => bytes[0] === STX && bytes[1] === 2).length, 2);
    assert.deepEqual(receiver.file(), bytes);
    assert.deepEqual(progress, [1024, 2048, 3000]);
});

test('NAK retries the header, a data block and the final empty header', async () => {
    const rejected = new Set();
    const receiver = new Receiver({ onPacket(info, io) {
        const key = `${info.phase}/${info.sequence}`;
        if (!rejected.has(key)) {
            rejected.add(key);
            io.enqueue(Uint8Array.of(NAK));
            return true;
        }
    } });
    const bytes = sample(1300);
    const result = await run(receiver, bytes);
    assert.equal(result.retries, 4);
    assert.deepEqual(receiver.file(), bytes);
});

test('a U-Boot C retry request is handled without mistaking it for a data ACK', async () => {
    let rejected = false;
    const receiver = new Receiver({ onPacket(info, io) {
        if (info.phase === 'data' && !rejected) {
            rejected = true;
            io.enqueue(Uint8Array.of(C));
            return true;
        }
    } });
    const result = await run(receiver, sample(500));
    assert.equal(result.retries, 1);
    assert.deepEqual(receiver.file(), sample(500));
});

test('repeated NAK reaches the retry limit and does not advance to the next block', async () => {
    const receiver = new Receiver({ onPacket(info, io) {
        if (info.phase === 'data') {
            io.enqueue(Uint8Array.of(NAK));
            return true;
        }
    } });
    await assert.rejects(run(receiver, sample(2000), { maxRetries: 2 }), { code: 'YMODEM_RETRIES' });
    const dataPackets = receiver.writes.filter(bytes => bytes[0] === STX);
    assert.equal(dataPackets.length, 3);
    assert.ok(dataPackets.every(bytes => bytes[1] === 1));
    assert.equal(receiver.eots, 0);
    assert.equal(receiver.cancels, 1);
});

test('remote cancellation during data aborts immediately without EOT', async () => {
    const receiver = new Receiver({ onPacket(info, io) {
        if (info.phase === 'data') {
            io.enqueue(Uint8Array.of(CAN, CAN));
            return true;
        }
    } });
    await assert.rejects(run(receiver, sample(2000)), { code: 'YMODEM_CANCELLED' });
    assert.equal(receiver.writes.filter(bytes => bytes[0] === STX).length, 1);
    assert.equal(receiver.eots, 0);
});

test('an isolated CAN in noise is not a remote cancellation', async () => {
    const receiver = new Receiver({ initial: [CAN, 0x0d, C] });
    await run(receiver, sample(50));
    assert.equal(receiver.phase, 'complete');
});

test('abort during an outstanding read sends CAN with no aborted signal and leaves no read', async () => {
    const controller = new AbortController();
    const receiver = new Receiver({ onPacket(info) {
        if (info.phase === 'data') {
            setTimeout(() => controller.abort(), 5);
            return true;
        }
    } });
    await assert.rejects(run(receiver, sample(2000), { signal: controller.signal }), { name: 'AbortError' });
    assert.equal(receiver.pending, undefined);
    assert.equal(receiver.cancels, 1);
    assert.equal(receiver.eots, 0);
    assert.ok(receiver.writes.at(-1).subarray(0, 4).every(byte => byte === CAN));
});

test('an already aborted operation never touches the transport', async () => {
    const controller = new AbortController();
    controller.abort();
    const receiver = new Receiver();
    await assert.rejects(run(receiver, sample(1), { signal: controller.signal }), { name: 'AbortError' });
    assert.equal(receiver.writes.length, 0);
    assert.deepEqual(receiver.remaining(), Uint8Array.of(C));
});

test('startup and final-header waits have deadlines', async t => {
    await t.test('no initial C', async () => {
        const receiver = new Receiver({ initial: [] });
        await assert.rejects(run(receiver, sample(50), { startupTimeoutMs: 20 }), { code: 'TIMEOUT' });
        assert.equal(receiver.pending, undefined);
        assert.equal(receiver.writes.filter(bytes => bytes[0] === SOH).length, 0);
    });
    await t.test('no final ACK', async () => {
        const receiver = new Receiver({ onPacket: info => info.phase === 'final' });
        await assert.rejects(run(receiver, sample(50), { maxRetries: 1, responseTimeoutMs: 20 }), { code: 'YMODEM_RETRIES' });
        assert.equal(receiver.pending, undefined);
        assert.equal(receiver.phase, 'final');
    });
});

test('the overall deadline bounds retries even when each local deadline is longer', async () => {
    const receiver = new Receiver({ onPacket: info => info.phase === 'data' });
    const deadlines = [];
    const readByte = receiver.readByte.bind(receiver);
    receiver.readByte = (deadline, signal) => {
        deadlines.push(deadline);
        return readByte(deadline, signal);
    };
    const start = Date.now();
    await assert.rejects(run(receiver, sample(2000), {
        transferTimeoutMs: 25, responseTimeoutMs: 1000, maxRetries: 100
    }), { code: 'YMODEM_TIMEOUT' });
    assert.ok(Date.now() - start < 500);
    assert.ok(deadlines.every(deadline => deadline <= deadlines[0]), 'retries cannot extend the initial overall deadline');
    const packets = receiver.writes.filter(bytes => bytes[0] === STX);
    assert.ok(packets.length >= 1);
    // A timer may fire just before its millisecond deadline on Node 22. A
    // bounded retry is allowed, but it must not advance to an unacknowledged
    // packet or reset the overall deadline.
    assert.ok(packets.every(bytes => bytes[1] === 1));
});

test('constant unexpected input is bounded instead of extending the wait', async () => {
    const receiver = new Receiver({ initial: Array(4200).fill(0x41) });
    await assert.rejects(run(receiver, sample(50)), { code: 'YMODEM_PROTOCOL' });
    assert.equal(receiver.writes.filter(bytes => bytes[0] === SOH).length, 0);
});

test('legacy checksum mode is rejected before any file data', async () => {
    const receiver = new Receiver({ initial: [NAK] });
    await assert.rejects(run(receiver, sample(50)), { code: 'YMODEM_CHECKSUM' });
    assert.equal(receiver.writes.filter(bytes => bytes[0] === SOH).length, 0);
});

test('a cleanup failure preserves the original connection failure', async () => {
    const original = Object.assign(new Error('USB disconnected'), { code: 'DISCONNECTED' });
    const io = {
        readByte: async () => { throw original; },
        writeBytes: async () => { throw new Error('Cleanup failed'); }
    };
    await assert.rejects(run(io, sample(50)), error => error === original);
});

test('invalid data, filenames and timeouts are rejected before transfer', async () => {
    const receiver = new Receiver();
    for (const [bytes, options] of [
        [new Uint8Array(0), {}],
        [sample(1), { filename: 'bad\nreset' }],
        [sample(1), { filename: '../firmware.image' }],
        [sample(1), { filename: 'x'.repeat(97) }],
        [sample(1), { responseTimeoutMs: Infinity }],
        [sample(1), { maxRetries: -1 }]
    ]) await assert.rejects(run(receiver, bytes, options), { code: 'YMODEM_INPUT' });
    assert.equal(receiver.writes.length, 0);
});

test('invalid transport bytes cannot be mistaken for a valid response', async () => {
    const io = { readByte: async () => undefined, writeBytes: async () => {} };
    await assert.rejects(run(io, sample(1)), { code: 'YMODEM_IO' });
});
