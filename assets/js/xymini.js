/* XYMini Sender - Minimal implementation of file transfer through serial
 * Copyright (C) Erny <info@erny.dev>
 * SPDX-License-Identifier: MPL-2.0-no-copyleft-exception
 *
 * Warning: This does not comply with XMODEM and YMODEM standards
*/

const STX = 0x02;
const ACK = 0x06;
const NAK = 0x15;
const EOF = 0x04;
const XYMINI_1K_MAGIC = 0x43;
const PAYLOAD_LEN = 1024;
const BLOCK_LEN = PAYLOAD_LEN + 5;
const CRC_POLY = 0x1021;

function uint16 (n) {
  return n & 0xFFFF;
}

function updateCrc(crcIn, incr) {
    const xor = uint16(crcIn >> 15);
    let result = uint16(crcIn << 1);

    if (incr) {
        result = uint16(result + 1);
    }

    if (xor) {
        result = uint16(result ^= CRC_POLY);
    }

    return result;
}

function crc16(data) {
    let crc;

    for (let i = 0; i < data.length; i++) {
        for (let j = 0x80; j; j >>= 1) {
            crc = updateCrc(crc, data[i] & j);
        }
    }

    for (let n = 0; n < 16; n++) {
        crc = updateCrc(crc, 0);
    }

    return crc;
}

async function detectXYMini(serial) {
    const textDecoder = new TextDecoder();

    while (true) {
        const value = await serial.readBytes();

        if (value[0] == XYMINI_1K_MAGIC) {
            console.log("XYMini: detected");
            break;
        }
    }
}

function generateXYMiniBlock(blockId, payload) {
    let buf = new Uint8Array(BLOCK_LEN);
    let i = 0;

    buf[i++] = STX;
    buf[i++] = blockId;
    buf[i++] = 0xFF - blockId;

    if (payload.length > PAYLOAD_LEN) {
        throw new Error("Payload too large to be transmitted in one block");
    }

    for (let j = 0; j < payload.length; j++) {
        buf[i++] = payload[j];
    }

    while (i < BLOCK_LEN - 2) {
        buf[i++] = 0xFF;
    }

    let crcBuf = buf.slice(3, PAYLOAD_LEN + 3)
    let crc = crc16(crcBuf);

    buf[i++] = (crc >> 8) & 0xFF;
    buf[i++] = crc & 0xFF;

    return buf;
}

async function sendXYMini(serial, data, progressCallback) {
    let blockId = 1;
    let size = data.length;
    let i = 0;
    let nakN = 0;
    let wrongCharN = 0;

    await detectXYMini(serial);

    while(true) {
        const payloadSize = Math.min(PAYLOAD_LEN, size);

        if (size) {
            const payload = data.slice(i, payloadSize + i);

            const block = generateXYMiniBlock(blockId, payload);
            await serial.writeBytes(block);
        } else {
            serial.writeBytes(new Uint8Array([EOF]));
        }

        const value = await serial.readBytes();

        if (value[0] == ACK) {
            if (!size) {
                console.log("XYMini: End of transmission");

                return;
            }

            blockId++;
            size -= payloadSize;
            i += payloadSize;
            nakN = 0;
            wrongCharN = 0;
            progressCallback(data.length - size);
        } else if (value[0] == NAK) {
            if (nakN >= 10) {
                throw new Error("Received 10 NAK, receiver is rejecting file transmission");
            }

            console.log("XYMini: NAK");
            nakN++;
        } else {
            if (wrongCharN >= 30) {
                throw new Error("Received 30 wrong characters, the receiver is rejecting the transmission or the connection is too noisy");
            }

            console.log("XYMini: wrong character");
            console.log(value);
            wrongCharN++;
        }
    }
}
