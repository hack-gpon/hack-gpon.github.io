function hexToBytes(hex) {
    let bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

function cigpassword_gpon(ont_serial, ont_user, length = 0, xgspon = false) {
    const hardcoded_key = '01030a1013051764c8061419b49d0500';
    const hardcoded_seed = '2345679abcdefghijkmnpqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ';

    let ont_vendor = ont_serial.substring(0, 4).toUpperCase();
    let ont_id = ont_serial.substring(4).toLowerCase();

    if (xgspon) {
        ont_id = ont_id.toUpperCase();
    }

    let formatted_serial = `${ont_vendor}${ont_id}`;

    let key_bytes = new Uint8Array(hardcoded_key.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    if (length > 0) {
        key_bytes[15] = length;
    }

    let formatted_serial_user = formatted_serial;
    if (ont_user) {
        formatted_serial_user += `-${ont_user}`;
    }

    let hmac = CryptoJS.HmacMD5(formatted_serial_user, CryptoJS.lib.WordArray.create(key_bytes));
    let pw_md5_hmac = hexToBytes(hmac.toString(CryptoJS.enc.Hex));

    let output = Array(pw_md5_hmac.length);

    for (let i = 0; i < pw_md5_hmac.length; i++) {
        output[i] = hardcoded_seed[pw_md5_hmac[i] % 0x36];
    }

    if (length > 0) {
        return output.slice(0, length).join('');
    } else {
        return output.join('');
    }
}
