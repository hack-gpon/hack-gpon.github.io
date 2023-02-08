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
    do { a.push(s?.substring(0, i)) } while (s = s?.substring(i));
    return a;
}

class asciiHex {
    static asciiToHex(str, prefix = "0x", glue = " ") {
        var prefixi = glue !== "" ? prefix : "";
        var prefixs = glue === "" ? prefix : "";
        var hex = prefixs + ([...str].map((elem, n) => prefixi + Number(str.charCodeAt(n)).toString(16)).join(glue));
        return hex;
    }
    static hexToAscii(str, prefix = "0x", separator = " ") {
        if(prefix)
            str = stripHexPrefix(str, prefix);
        var ascii = separator === "" ? getChunks(str, 2).map(el => String.fromCharCode(parseInt(el, 16))).join('') : str.split(separator).map(el => String.fromCharCode(Number(el))).join('');
        return ascii;
    }
}


function isHexPrefixed(str, prefix = '0x') {
    if (typeof str !== 'string') {
      throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + (typeof str) + ", while checking isHexPrefixed.");
    }
  
    return str.slice(0, 2) === prefix;
}

function stripHexPrefix(str, prefix = '0x') {
    if (typeof str !== 'string') {
      return str;
    }
  
    return isHexPrefixed(str, prefix) ? str.slice(prefix.length) : str;
}

class mac {
    #mac;
    constructor(mac) {
        if(mac.length == 12) {
            this.#mac = mac;
        }
        if(mac.length == 14) {
            this.#mac = stripHexPrefix(mac);
        }
        if(mac.length == 17) {
            this.#mac = mac.split(mac[2]).join('');
        }
    }
    get hex() {
        return this.#mac;
    }

    prettier(glue=':') {
        return getChunks(this.#mac,2).join(glue);
    }
}

class gponSerial {
    #vendor;
    #progressive;
    constructor(first, second) {
        first = first.replace(/\0/g, '');
        second = second?.replace(/\0/g, '');
        if (second !== undefined) {
            if (first.length == 4) {
                this.#vendor = first.toUpperCase();
            } else if (first.length == 8) {
                this.#vendor = asciiHex.hexToAscii(first, '', '').toUpperCase();
            } else {
                throw "vendor length unvalid";
            }
            if (second.length == 8) {
                this.#progressive = second.toLowerCase();
            } else {
                throw "progressive length unvalid";
            }
        } else {
            if (first.length == 12) {
                this.#vendor = first.substring(0, 4).toUpperCase();
                this.#progressive = first.substring(4).toLowerCase();
            } else if (first.length == 16) {
                this.#vendor = asciiHex.hexToAscii(first.substring(0, 8), '', '').toUpperCase();
                this.#progressive = first.substring(8).toLowerCase();
            } else if (first.length == 18) {
                first = stripHexPrefix(first);
                this.#vendor = asciiHex.hexToAscii(first.substring(0, 8), '', '').toUpperCase();
                this.#progressive = first.substring(8).toLowerCase();
            } else {
                throw "serial length unvalid";
            }
        }
    }
    get vendorHex() {
        return asciiHex.asciiToHex(this.#vendor,'','');
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
    get serialHex() {
        return `${this.vendorHex}${this.#progressive}`;
    }
}

class gponHexItem {
    #value;
    constructor(value) {
        value = stripHexPrefix(value);
    }
    get hex() {
        return this.#value;
    }
    get ascii() {
        return asciiHex.hexToAscii(this.#value, '', '');
    }
}

class gponPloam {
    #ploam;
    constructor(ploam) {
        ploam = ploam.replace(/\0/g, '');
        if (ploam.length <= 10) {
            this.#ploam = asciiHex.asciiToHex(ploam,'','');
            this.#ploam += '0'.repeat(20 - this.#ploam.length);
        }
        else if (ploam.length >= 20) {
            this.#ploam = stripHexPrefix(ploam);
        }
        else {
            throw "ploam length unvalid";
        }
    }
    get ploam() {
        return asciiHex.hexToAscii(this.#ploam, '', '');
    }
    get ploamEncoding() {
        return JSON.stringify(ploam);
    }
    get ploamHex() {
        return this.#ploam;
    }
}

class eeprom {
    #hex;
    constructor(hex, size=256) {
        this.#hex = [...hex];
        if (this.#hex.length < size*2) throw new Error('EEPROM size error!');
    }

    getPart = function (startIndex, endIndex) {
        return this.#hex.slice(startIndex * 2, (endIndex + 1) * 2).join('');
    }

    setPart = function (startIndex, endIndex, value) {
        let calcLength = (endIndex + 1 - startIndex) * 2;
        if(!value) {
            return;
        }
        if (value.length != calcLength) {
            value += '0'.repeat(calcLength - value.length);
        }
        this.#hex.splice(startIndex * 2, calcLength, ...[...value]);
    }

    get hex() {
        return this.#hex.join('');
    }
}

class eeprom1 extends eeprom {
    get serial() {
        return new gponSerial(this.getPart(233, 240));
    }

    set serial(value) {
        if(value instanceof gponSerial) {
            this.setPart(233, 240, value.serialHex);
        } else {
            this.setPart(233, 240, value);
        }
    }

    get ploam() {
        return this.loidPloamSwitch === "02" ? new gponPloam(this.getPart(191, 214)) : undefined;
    }

    set ploam(value) {
        if(this.loidPloamSwitch === "02") {
            if(value instanceof gponPloam) {
                console.log(this.getPart(191, 214));
                console.log(value.ploam);
                console.log(value.ploamHex);
                this.setPart(191, 214, value.ploamHex);
            } else {
                this.setPart(191, 214, value);
            }
        }
    }

    get loid() {
        return this.loidPloamSwitch === "01" ? new gponHexItem(this.getPart(191, 214)) : undefined;
    }

    set loid(value) {
        if(this.loidPloamSwitch === "01") {
            if(value instanceof gponHexItem) {
                this.setPart(191, 214, value.hex);
            } else {
                this.setPart(191, 214, value);
            }
        }
    }

    get lopw() {
        return new gponHexItem(this.getPart(215, 231));
    }

    set lopw(value) {
        if(value instanceof gponHexItem) {
            this.setPart(215, 231, value.hex);
        } else {
            this.setPart(215, 231, value);
        }
    }

    get loidPloamSwitch() {
        return this.getPart(232, 232);
    }

    set loidPloamSwitch(value) {
        this.setPart(232, 232, value);
    }

    get equipmentID() {
        return new gponHexItem(this.getPart(512, 531));
    }

    set equipmentID(value) {
        if(value instanceof gponHexItem) {
            this.setPart(512, 531, value.hex);
        } else {
            this.setPart(512, 531, value);
        }
    }

    get vendorID() {
        return new gponHexItem(this.getPart(532, 535));
    }

    set vendorID(value) {
        if(value instanceof gponHexItem) {
            this.setPart(532, 535, value.hex);
        } else {
            this.setPart(532, 535, value);
        }
    }

    get macAddress() {
        return new mac(this.getPart(384, 389));
    }

    set macAddress(value) {
        if(value instanceof mac) {
            this.setPart(384, 389, value.hex);
        } else {
            this.setPart(384, 389, value);
        }
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
        if (typeof (basename) !== "undefined")
            name = basename + "-" + key;

        if (value.constructor === Array) {
            if (typeof (basename) !== "undefined")
                name += '[]';
        } else if (typeof value == "object") {
            if (Object.keys(value).length === 1) {
                if (typeof (basename) !== "undefined")
                    name += "-" + Object.keys(value)[0];
                value = value[Object.keys(value)[0]];
            } else {
                if (typeof (basename) !== "undefined")
                    populateForm(form, value, name);
                else
                    populateForm(form, value);
                continue;
            }
        }

        // only proceed if element is set
        let element = form.elements.namedItem(name);
        if (!element) {
            continue;
        }

        let type = element.type || element[0].type;

        switch (type) {
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


var _table_ = document.createElement('table'),
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');

// Builds the HTML Table out of myList json data from Ivy restful service.
function buildHtmlTable(arr) {
    var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
    for (var i = 0, maxi = arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        for (var j = 0, maxj = columns.length; j < maxj; ++j) {
            var td = _td_.cloneNode(false);
            var cellValue = arr[i][columns[j]];
            td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records
function addAllColumnHeaders(arr, table) {
    var columnSet = [],
        tr = _tr_.cloneNode(false);
    for (var i = 0, l = arr.length; i < l; i++) {
        for (var key in arr[i]) {
            if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
                columnSet.push(key);
                var th = _th_.cloneNode(false);
                th.appendChild(document.createTextNode(key));
                tr.appendChild(th);
            }
        }
    }
    table.appendChild(tr);
    return columnSet;
}

function hexToBase64(hexStr) {
    return btoa([...hexStr].reduce((acc, _, i) => acc += !(i - 1 & 1) ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16)) : '', ''));
}
function base64ToHex(base64Value) {
    try {
    return [...atob(base64Value)].map(c=> c.charCodeAt(0).toString(16).padStart(2,0)).join('');
    } catch { return ''; }
}