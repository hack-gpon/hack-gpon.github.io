// A legacy MIPS uImage/SquashFS header does not identify a G-010S-A image:
// the inspected Huawei and Alcatel images have the same kernel and generic
// "SFP" fwtool metadata. Only reviewed, complete-file digests are accepted.
export const NOKIA_SLOT_SIZE = 0x600000;

const UIMAGE_HEADER_SIZE = 64;
const SQUASHFS_SUPERBLOCK_SIZE = 96;
const NO_TABLE = 0xffffffffffffffffn;
const IMAGES = Object.freeze({
    '5c0d6853645d72748cf844f9e64fc57c38924cc7938ef14a40a827015bbc1248': Object.freeze({
        profile: 'g010sa-19.07-20260814',
        name: 'Nokia G-010S-A OpenWrt 19.07 (2026-08-14)',
        size: 0x4400eb
    })
});

function failure(code, message) {
    return Object.assign(new Error(message), { name: 'NokiaImageError', code });
}

const CRC_TABLE = new Uint32Array(256);
for (let byte = 0; byte < CRC_TABLE.length; byte++) {
    let value = byte;
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
    CRC_TABLE[byte] = value >>> 0;
}

function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff];
    return (crc ^ 0xffffffff) >>> 0;
}

// U-Boot's crc32 command uses this CRC-32/ISO-HDLC representation. It checks
// transfer/readback integrity, while SHA-256 below identifies the image.
export function crc32Hex(bytes) {
    if (!(bytes instanceof Uint8Array)) throw new TypeError('Expected a Uint8Array.');
    return crc32(bytes).toString(16).padStart(8, '0');
}

function inspectStructure(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (view.getUint32(0, false) !== 0x27051956) {
        throw failure('INVALID_UIMAGE', 'Select a supported Nokia firmware image, not a flash dump or an archive.');
    }
    const header = bytes.slice(0, UIMAGE_HEADER_SIZE);
    header.fill(0, 4, 8);
    if (crc32(header) !== view.getUint32(4, false)) {
        throw failure('BAD_HEADER_CRC', 'The uImage header checksum is invalid. The firmware file may be damaged.');
    }
    // Linux, MIPS, kernel, LZMA; load/entry addresses of the reviewed profile.
    if (view.getUint8(28) !== 5 || view.getUint8(29) !== 5 ||
        view.getUint8(30) !== 2 || view.getUint8(31) !== 3 ||
        view.getUint32(16, false) !== 0x80002000 || view.getUint32(20, false) !== 0x80002000) {
        throw failure('UNSUPPORTED_UIMAGE', 'This is not the supported Nokia MIPS/LZMA kernel format.');
    }
    const kernelSize = view.getUint32(12, false);
    const rootfsOffset = UIMAGE_HEADER_SIZE + kernelSize;
    if (kernelSize < 13 || rootfsOffset > bytes.length - SQUASHFS_SUPERBLOCK_SIZE) {
        throw failure('INVALID_KERNEL_SIZE', 'The kernel length extends outside the firmware image.');
    }
    if (crc32(bytes.subarray(UIMAGE_HEADER_SIZE, rootfsOffset)) !== view.getUint32(24, false)) {
        throw failure('BAD_KERNEL_CRC', 'The kernel data checksum is invalid. The firmware file may be damaged.');
    }
    const squashfs = new DataView(bytes.buffer, bytes.byteOffset + rootfsOffset, bytes.length - rootfsOffset);
    if (squashfs.getUint32(0, true) !== 0x73717368 ||
        squashfs.getUint16(28, true) !== 4 || squashfs.getUint16(30, true) !== 0 ||
        squashfs.getUint16(20, true) !== 4) {
        throw failure('INVALID_SQUASHFS', 'Expected a SquashFS 4.0/XZ root filesystem immediately after the kernel.');
    }
    const blockSize = squashfs.getUint32(12, true);
    const blockLog = squashfs.getUint16(22, true);
    const rootfsSize64 = squashfs.getBigUint64(40, true);
    if (!squashfs.getUint32(4, true) || !squashfs.getUint16(26, true) ||
        blockLog < 12 || blockLog > 20 || blockSize !== 2 ** blockLog ||
        rootfsSize64 < BigInt(SQUASHFS_SUPERBLOCK_SIZE) ||
        rootfsSize64 > BigInt(bytes.length - rootfsOffset)) {
        throw failure('INVALID_SQUASHFS', 'The root filesystem has invalid sizes or extends outside the image.');
    }
    const table = (offset, optional = false) => {
        const value = squashfs.getBigUint64(offset, true);
        if (optional && value === NO_TABLE) return value;
        if (value < BigInt(SQUASHFS_SUPERBLOCK_SIZE) || value >= rootfsSize64) {
            throw failure('INVALID_SQUASHFS', 'A root filesystem table points outside the image.');
        }
        return value;
    };
    const idTable = table(48);
    table(56, true);
    const inodeTable = table(64);
    const directoryTable = table(72);
    table(80, squashfs.getUint32(16, true) === 0);
    table(88, true);
    const rootInode = squashfs.getBigUint64(32, true);
    if (inodeTable >= directoryTable || directoryTable >= idTable ||
        idTable + 8n > rootfsSize64 || (rootInode & 0xffffn) >= 8192n ||
        inodeTable + (rootInode >> 16n) >= directoryTable) {
        throw failure('INVALID_SQUASHFS', 'The root filesystem metadata bounds are invalid.');
    }
    return { kernelSize, rootfsOffset, rootfsSize: Number(rootfsSize64) };
}

/**
 * Validate the complete file before opening a serial port. No filename, model
 * checkbox, or generic uImage/fwtool header can override the digest allowlist.
 * Callers that later transmit bytes must keep their own private input snapshot.
 */
export async function inspectNokiaImage(input) {
    if (!(input instanceof Uint8Array)) {
        throw failure('INVALID_IMAGE', 'Firmware must be supplied as a Uint8Array.');
    }
    if (input.length > NOKIA_SLOT_SIZE) {
        throw failure('IMAGE_TOO_LARGE', 'The file exceeds a 6 MiB Nokia firmware slot. Full flash dumps are not supported.');
    }
    if (input.length < UIMAGE_HEADER_SIZE + SQUASHFS_SUPERBLOCK_SIZE) {
        throw failure('INVALID_IMAGE', 'The firmware file is empty or truncated.');
    }
    // Uint8Array.from also copies Node Buffers; Buffer.slice would alias input.
    const bytes = Uint8Array.from(input);
    const structure = inspectStructure(bytes);
    if (!globalThis.crypto?.subtle) {
        throw failure('CRYPTO_UNAVAILABLE', 'SHA-256 verification requires a browser with Web Crypto on HTTPS.');
    }
    const digest = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes));
    const sha256 = Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('');
    const profile = Object.hasOwn(IMAGES, sha256) ? IMAGES[sha256] : null;
    if (!profile || profile.size !== bytes.length) {
        throw failure('UNSUPPORTED_IMAGE', 'This file is not a reviewed Nokia G-010S-A firmware image. Huawei, Alcatel, raw partition backups and modified images are rejected.');
    }
    return Object.freeze({
        ...profile,
        size: bytes.length,
        sha256,
        crc32: crc32Hex(bytes),
        ...structure,
        slotSize: NOKIA_SLOT_SIZE
    });
}
