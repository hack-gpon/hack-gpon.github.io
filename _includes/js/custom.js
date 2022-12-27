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

function getChunks(s, i) {
    var a = [];
    do{ a.push(s.substring(0, i)) }  while( (s = s.substring(i)) != "" );
    return a;
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
        if(progressive !== undefined) {
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
        } else {
            if(vendor.length == 12) {
                this.#vendor = vendor.substring(0, 4).toUpperCase();
                this.#progressive = vendor.substring(4).toLowerCase();
            } else if(vendor.length == 16) {
                this.#vendor = asciiHex.hexToAscii(serial.substring(0, 8)).toUpperCase();
                this.#progressive = vendor.substring(8).toLowerCase();
            }  else {
                throw "serial length unvalid";
            }
        }
    }
    get vendorHex() {
        return ([...this.#vendor].map((_, n) => Number(this.#vendor.charCodeAt(n)).toString(16)).join(''));
    }
    get vendor() {
        return this.#vendor;
    }
    get progressive() {
        return this.#progressive;
    }
    get serial() {
        return `${this.#vendor}${this.#progressive}`;
    }   
}

class gponPloam {
    #ploam;
    constructor(ploam) {
        if(ploam.length <= 10) {  
            this.#ploam = ([...gpon_password].map((_, n) => Number(gpon_password.charCodeAt(n)).toString(16)).join(''));
            this.#ploam += '0'.repeat(20-gpon_password.length);
        }
        else if(ploam.length === 20) {
            this.#ploam = ploam;
        }
        else {
            throw "ploam length unvalid";
        }
    }
    get ploam() {
        return asciiHex.hexToAscii(this.#ploam, '','');
    }
    get ploamEncoding() {
        return JSON.stringify(ploam);
    }
    get ploamHex() {
        return this.#ploam;
    }
}

class eeprom1 {
    #hex;
    constructor(hex) {
        this.#hex = [...hex];
    }

    getPart = function(startIndex, endIndex) {
        return this.#hex.slice(startIndex*2, (endIndex+1)*2).join('');
    }

    setPart = function(startIndex, endIndex, value) {
        let calcLength = (endIndex+1-startIndex)*2;
        if(value.length != calcLength) {
            value += '0'.repeat(calcLength-value.length);
        }    
        this.#hex.splice(startIndex*2, calcLength, ...[...value]);
    }

    get hex() {
      return this.#hex.join('');
    }

    get serial() {
        return this.getPart(233, 240);
    }

    set serial(value) {
        this.setPart(233, 240, value);
    }

    get ploam() {
        return this.getPart(191, 214);
    }

    set ploam(value) {
        this.setPart(191, 214, value);
    }

    get loid() {
        return this.getPart(191, 214);
    }

    set loid(value) {
        this.setPart(191, 214, value);
    }

    get lpwd() {
        return this.getPart(215, 231);
    }

    set lpwd(value) {
        this.setPart(215, 231, value);
    }

    get loidPloamSwitch() {
        return this.getPart(232, 232);
    }

    set loidPloamSwitch(value) {
        this.setPart(232, 232, value);
    }

    get equipmentID() {
        return this.getPart(512, 531);
    }

    set equipmentID(value) {
        this.setPart(512, 531, value);
    }

    get vendorID() {
        return this.getPart(532, 535);
    }

    set vendorID(value) {
        this.setPart(532, 535, value);
    }

    get macAddress() {
        return this.getPart(384, 389);
    }

    set macAddress(value) {
        this.setPart(384, 389, value);
    }
}

function populateForm(form, data, basename) {
    for (const key in data) {
        if (!data.hasOwnProperty(key)) {
            continue;
        }

        let name = key;
        let value = data[key];

        if ('undefined' === typeof value)
            value = '';

        if (null === value)
            value = '';

        // add basename
        if (typeof(basename) !== "undefined")
            name = basename + "-" + key;

        if (value.constructor === Array) {
            if(typeof(basename) !== "undefined")
                name += '[]';
        } else if(typeof value == "object") {
            if(Object.keys(value).length === 1) {
                if (typeof(basename) !== "undefined")
                    name += "-" + Object.keys(value)[0];
                value = value[Object.keys(value)[0]];
            } else {
                if (typeof(basename) !== "undefined")
                    populateForm(form, value, name);
                else
                    populateForm(form, value);
                continue;
            }
        }

        // only proceed if element is set
        let element = form.elements.namedItem(name);
        if (! element) {
            continue;
        }

        let type = element.type || element[0].type;

        switch(type ) {
            default:
                element.value = value;
                break;

            case 'radio':
            case 'checkbox': {
                let values = value.constructor === Array ? value : [value];
                for (let j = 0; j < element.length; j++) {
                    element[j].checked = (values.findIndex(it => it.toString() === element[j].value) > -1);
                }
                break;
            }
            case 'select-multiple': {
                let values = value.constructor === Array ? value : [value];
                for (let j = 0; j < element.options.length; j++) {
                    element.options[j].selected = (values.findIndex(it => it.toString() === element.options[j].value) > -1);
                }
                break;
            }
            case 'select':
            case 'select-one':
                element.value = value.toString() || value;
                break;

            case 'date':
                let date = new Date(value);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                element.value = date.toISOString().substring(0, 10);
                break;

            case 'datetime-local':
                let datetime = new Date(value);
                datetime.setMinutes(datetime.getMinutes() - datetime.getTimezoneOffset());
                element.value = datetime.toISOString().substring(0, 16);
                break;
        }

    }
}
