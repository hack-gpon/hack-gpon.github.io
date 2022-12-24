class uuencoding {
    /**
     * uuencode a value
     *
     * @param {(String|Buffer)} The value to be encoded.
     * @returns {String} The encoded value.
     */
    static encode(inString) {
        var stop = false;
        var inIndex = 0;
        var outIndex = 0;
        var bytesRead = 0;

        var inBytes = new Buffer(inString);
        var buffLen = inBytes.length;
        var outBytes = new Buffer(buffLen + buffLen / 3 + 1 + buffLen / 45 * 2 + 2 + 4);

        do {
            var n;
            var bytesLeft = buffLen - bytesRead;

            if (bytesLeft === 0) {
                break;
            }

            if (bytesLeft <= 45) {
                n = bytesLeft;
            } else {
                n = 45;
            }

            outBytes[outIndex++] = (n & 0x3F) + 32;

            for (var i = 0; i < n; i += 3) {
                if (buffLen - inIndex < 3) {
                    var padding = new Array(3);
                    var z = 0;

                    while (inIndex + z < buffLen) {
                        padding[z] = inBytes[inIndex + z];
                        ++z;
                    }

                    this.#encodeBytes(padding, 0, outBytes, outIndex);
                } else {
                    this.#encodeBytes(inBytes, inIndex, outBytes, outIndex);
                }

                inIndex += 3;
                outIndex += 4;
            }

            outBytes[outIndex++] = 10;
            bytesRead += n;

            if (n >= 45) {
                continue;
            }

            stop = true;
        } while (!stop);

        return outBytes.toString().substring(0, outIndex);
    }

    /**
     * uudecode a value
     *
     * @param {(String|Buffer)} The value to be decoded.
     * @returns {Buffer} The decoded value.
     */
    static decode(inString) {
        var stop = false;
        var inIndex = 0;
        var outIndex = 0;
        var totalLen = 0;

        var inBytes = new Buffer(inString);
        var buffLen = inBytes.length;
        var outBytes = new Buffer(buffLen);

        do {
            if (inIndex < buffLen) {
                var n = inBytes[inIndex] - 32 & 0x3F;

                ++inIndex;

                if (n > 45) {
                    throw 'Invalid Data';
                }

                if (n < 45) {
                    stop = true;
                }

                totalLen += n;

                while (n > 0) {
                    this.#decodeChars(inBytes, inIndex, outBytes, outIndex);
                    outIndex += 3;
                    inIndex += 4;
                    n -= 3;
                }

                ++inIndex;
            } else {
                stop = true;
            }
        } while (!stop);

        return outBytes.slice(0, totalLen);
    }

    // private helper functions
    static #encodeBytes(inBytes, inIndex, outBytes, outIndex) {
        var c1 = inBytes[inIndex] >>> 2;
        var c2 = inBytes[inIndex] << 4 & 0x30 | inBytes[inIndex + 1] >>> 4 & 0xF;
        var c3 = inBytes[inIndex + 1] << 2 & 0x3C | inBytes[inIndex + 2] >>> 6 & 0x3;
        var c4 = inBytes[inIndex + 2] & 0x3F;

        outBytes[outIndex] = (c1 & 0x3F) + 32;
        outBytes[outIndex + 1] = (c2 & 0x3F) + 32;
        outBytes[outIndex + 2] = (c3 & 0x3F) + 32;
        outBytes[outIndex + 3] = (c4 & 0x3F) + 32;
    }

    static #decodeChars(inBytes, inIndex, outBytes, outIndex) {
        var c1 = inBytes[inIndex];
        var c2 = inBytes[inIndex + 1];
        var c3 = inBytes[inIndex + 2];
        var c4 = inBytes[inIndex + 3];

        var b1 = (c1 - 32 & 0x3F) << 2 | (c2 - 32 & 0x3F) >> 4;
        var b2 = (c2 - 32 & 0x3F) << 4 | (c3 - 32 & 0x3F) >> 2;
        var b3 = (c3 - 32 & 0x3F) << 6 | c4 - 32 & 0x3F;

        outBytes[outIndex] = b1 & 0xFF;
        outBytes[outIndex + 1] = b2 & 0xFF;
        outBytes[outIndex + 2] = b3 & 0xFF;
    }
}

class asciiHex {
    static asciiToHex(str, prefix = "0x", glue = " ") {
        var prefixi = glue !== "" ? prefix : "";
        var prefixs = glue === "" ? prefix : "";
        var hex = prefixs + ([...str].map((elem, n) => prefixi+Number(str.charCodeAt(n)).toString(16)).join(glue));
        return hex;
    }
    static hexToAscii(str, prefix = "0x", separator = " ") {
        if(prefix != "" && str.startsWith(prefix)) 
            str = str.substring(prefix.length);
        var ascii = separator === "" ? getChunks(str.substring(2),2).map(el => String.fromCharCode(parseInt(el, 16))).join('') : str.split(separator).map(el => String.fromCharCode(Number(el))).join('');
        return ascii;
    }
}

class gponSerial {
    #vendor;
    #progressive;
    constructor(vendor, progressive) {
        if(vendor.length == 4) {
            this.#vendor = vendor.toUpperCase();
        } else if(vendor.length == 8) {
            this.#vendor = asciiHex.hexToAscii(vendor,'','').toUpperCase();
        } else {
            throw "vendor length unvalid";
        }
        if(progressive.length == 8) {
            this.#progressive = progressive.toLowerCase();
        } else {
            throw "progressive length unvalid";
        }
    }
    constructor(serial) {
        if(serial.length == 12) {
            this.#vendor = serial.substring(0, 4).toUpperCase();
            this.#progressive = serial.substring(4).toLowerCase();
        } else if(serial.length == 16) {
            this.#vendor = asciiHex.hexToAscii(serial.substring(0, 8)).toUpperCase();
            this.#progressive = serial.substring(8).toLowerCase();
        }  else {
            throw "serial length unvalid";
        }
    }
    get [vendorHex]() {
        return ([...this.#vendor].map((elem, n) => Number(this.#vendor.charCodeAt(n)).toString(16)).join(''));
    }
    get [vendor]() {
        return this.#vendor;
    }
    get [progressive]() {
        return this.#progressive;
    }
    get [serial]() {
        return `${this.#vendor}${this.#progressive}`;
    }   
}

class gponPloam {
    #ploam;
    constructor(ploam) {
        if(ploam.length <= 10) {  
            this.#ploam = ([...gpon_password].map((elem, n) => Number(gpon_password.charCodeAt(n)).toString(16)).join(''));
            this.#ploam += '0'.repeat(20-gpon_password.length);
        }
        else if(ploam.length === 20) {
            this.#ploam = ploam;
        }
        else if(ploam.length === 22 && ploam.startsWith("0x")) {
            this.#ploam = ploam.substring(2);
        }
    }
    get [ploam]() {
        return asciiHex.hexToAscii(this.#ploam, '','');
    }
    get [ploamEncoding]() {
        return JSON.stringify(ploam);
    }
    get [ploamHex] () {
        return this.#ploam;
    }
}