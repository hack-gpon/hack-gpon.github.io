import test from 'node:test';
import assert from 'node:assert/strict';
import { crc32Hex, inspectNokiaImage, NOKIA_SLOT_SIZE } from '../.vitepress/theme/lib/nokiaImage.js';

// Python-generated LZMA test payload and uImage checksums, followed by a small
// synthetic SquashFS superblock. This is not bootable firmware and contains no
// bytes from the submitted proprietary images.
const FIXTURE = 'JwUZVhRAu5liWsD8AAAAOoAAIACAACAA2OymmgUFAgNNSVBTIE9wZW5XcnQgTGludXgtMy4xMC4xMDgAAAAAAF0AAIAA//////////8AKZ5Jx3eqw+J02qzRRqE0NwJK2/TTns5O2tJmEy/+93HUrdDxFhGeP/4pagBoc3FzAwAAALuofmoAAAQAAAAAAAQAEgDAAAEABAAAAAAAAAAAAAAAAAEAAAAAAAD4AAAAAAAAAP//////////ZAAAAAAAAACMAAAAAAAAAP//////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
const REVIEWED_SHA256 = '5c0d6853645d72748cf844f9e64fc57c38924cc7938ef14a40a827015bbc1248';
const ROOTFS_OFFSET = 122;

function fixture() {
    return Uint8Array.from(Buffer.from(FIXTURE, 'base64'));
}

function repairHeader(bytes) {
    bytes.fill(0, 4, 8);
    new DataView(bytes.buffer, bytes.byteOffset).setUint32(4, Number.parseInt(crc32Hex(bytes.subarray(0, 64)), 16), false);
}

test('CRC32 agrees with independent standard and fixture vectors, including byte views', () => {
    assert.equal(crc32Hex(new TextEncoder().encode('123456789')), 'cbf43926');
    assert.equal(crc32Hex(new Uint8Array()), '00000000');
    assert.equal(crc32Hex(fixture()), '45ec4781');
    assert.equal(crc32Hex(new TextEncoder().encode('x123456789y').subarray(1, 10)), 'cbf43926');
    assert.throws(() => crc32Hex(new ArrayBuffer(1)), TypeError);
});

test('rejects non-byte input, empty/truncated images, oversized images and full dumps', async () => {
    for (const input of [null, new ArrayBuffer(200), [], new Uint8Array(), new Uint8Array(63)]) {
        await assert.rejects(inspectNokiaImage(input), { code: 'INVALID_IMAGE' });
    }
    for (const length of [NOKIA_SLOT_SIZE + 1, 0x1000000]) {
        await assert.rejects(inspectNokiaImage(new Uint8Array(length)), { code: 'IMAGE_TOO_LARGE' });
    }
});

test('generic MIPS uImage/SquashFS structure cannot authorize a model', async () => {
    await assert.rejects(inspectNokiaImage(fixture()), { code: 'UNSUPPORTED_IMAGE' });
    const padded = new Uint8Array(NOKIA_SLOT_SIZE).fill(0xff);
    padded.set(fixture());
    await assert.rejects(inspectNokiaImage(padded), { code: 'UNSUPPORTED_IMAGE' });
});

test('rejects bad magic and independent header/payload corruption', async () => {
    const magic = fixture();
    magic[0] ^= 1;
    await assert.rejects(inspectNokiaImage(magic), { code: 'INVALID_UIMAGE' });
    const header = fixture();
    header[8] ^= 1;
    await assert.rejects(inspectNokiaImage(header), { code: 'BAD_HEADER_CRC' });
    const kernel = fixture();
    kernel[70] ^= 1;
    await assert.rejects(inspectNokiaImage(kernel), { code: 'BAD_KERNEL_CRC' });
});

test('rejects wrong kernel type/architecture/compression or load address with valid header CRC', async () => {
    for (const offset of [16, 20, 28, 29, 30, 31]) {
        const bytes = fixture();
        bytes[offset] ^= 1;
        repairHeader(bytes);
        await assert.rejects(inspectNokiaImage(bytes), { code: 'UNSUPPORTED_UIMAGE' });
    }
});

test('rejects zero, truncated and overflowing kernel lengths before reading out of bounds', async () => {
    for (const size of [0, 12, 1000, 0xffffffff]) {
        const bytes = fixture();
        new DataView(bytes.buffer).setUint32(12, size, false);
        repairHeader(bytes);
        await assert.rejects(inspectNokiaImage(bytes), { code: 'INVALID_KERNEL_SIZE' });
    }
});

test('requires SquashFS 4.0/XZ exactly after the kernel', async () => {
    for (const offset of [0, 20, 28, 30]) {
        const bytes = fixture();
        bytes[ROOTFS_OFFSET + offset] ^= 1;
        await assert.rejects(inspectNokiaImage(bytes), { code: 'INVALID_SQUASHFS' });
    }
});

test('rejects rootfs lengths and metadata references outside the image', async () => {
    const cases = [
        view => view.setBigUint64(40, 0xffffffffffffffffn, true),
        view => view.setBigUint64(40, 257n, true),
        view => view.setBigUint64(40, 95n, true),
        view => view.setBigUint64(48, 256n, true),
        view => view.setBigUint64(48, 252n, true),
        view => view.setBigUint64(56, 256n, true),
        view => view.setBigUint64(64, 95n, true),
        view => view.setBigUint64(72, 99n, true),
        view => view.setBigUint64(80, 256n, true),
        view => view.setBigUint64(88, 256n, true),
        view => view.setBigUint64(32, 8192n, true),
        view => view.setBigUint64(32, 40n << 16n, true),
        view => view.setUint32(4, 0, true),
        view => view.setUint16(26, 0, true),
        view => view.setUint16(22, 30, true),
        view => view.setUint32(12, 131072, true),
        view => view.setUint32(16, 1, true)
    ];
    for (const change of cases) {
        const bytes = fixture();
        change(new DataView(bytes.buffer, ROOTFS_OFFSET));
        await assert.rejects(inspectNokiaImage(bytes), { code: 'INVALID_SQUASHFS' });
    }
});

test('a recognized digest still requires its reviewed size', async t => {
    // Only the crypto result is stubbed: there is no production option to
    // disable the allowlist or supply an alternative trusted hash.
    t.mock.method(globalThis.crypto.subtle, 'digest', async () => Buffer.from(REVIEWED_SHA256, 'hex'));
    await assert.rejects(inspectNokiaImage(fixture()), { code: 'UNSUPPORTED_IMAGE' });
});

test('metadata is frozen and inspection snapshots mutable buffers across SHA-256 await', async t => {
    const input = Buffer.alloc(0x4400eb, 0xff);
    input.set(fixture());
    const expectedCrc = crc32Hex(input);
    t.mock.method(globalThis.crypto.subtle, 'digest', async (algorithm, bytes) => {
        assert.equal(algorithm, 'SHA-256');
        assert.notEqual(bytes.buffer, input.buffer);
        input.fill(0);
        assert.equal(bytes[0], 0x27);
        return Buffer.from(REVIEWED_SHA256, 'hex');
    });
    const result = await inspectNokiaImage(input);
    assert.deepEqual(result, {
        profile: 'g010sa-19.07-20260814',
        name: 'Nokia G-010S-A OpenWrt 19.07 (2026-08-14)',
        size: 0x4400eb,
        sha256: REVIEWED_SHA256,
        crc32: expectedCrc,
        kernelSize: 58,
        rootfsOffset: ROOTFS_OFFSET,
        rootfsSize: 256,
        slotSize: 0x600000
    });
    assert.ok(Object.isFrozen(result));
    assert.throws(() => { result.crc32 = '00000000'; }, TypeError);
});

test('fails closed if SHA-256 verification is unavailable or fails', async t => {
    await t.test('unavailable', async t => {
        t.mock.getter(globalThis, 'crypto', () => undefined);
        await assert.rejects(inspectNokiaImage(fixture()), { code: 'CRYPTO_UNAVAILABLE' });
    });
    await t.test('digest failure', async t => {
        t.mock.method(globalThis.crypto.subtle, 'digest', async () => { throw new Error('crypto failed'); });
        await assert.rejects(inspectNokiaImage(fixture()), /crypto failed/);
    });
});
