function hexToBytes(hex) {
    let bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

function cigpassword_gpon(ont_serial, ont_user) {
    const hardcoded_key = '01030a1013051764c8061419b49d0500';
    const hardcoded_seed = '2345679abcdefghijkmnpqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ';

    let ont_vendor = ont_serial.substring(0, 4).toUpperCase();
    let ont_id = ont_serial.substring(4).toLowerCase();
    let formatted_serial = `${ont_vendor}${ont_id}`;

    let key_bytes = CryptoJS.enc.Hex.parse(hardcoded_key);
    let hmac = CryptoJS.HmacMD5(`${formatted_serial}-${ont_user}`, key_bytes);
    let pw_md5_hmac = hexToBytes(hmac.toString(CryptoJS.enc.Hex));

    let output = Array(pw_md5_hmac.length);

    for (let i = 0; i < pw_md5_hmac.length; i++) {
        output[i] = hardcoded_seed[pw_md5_hmac[i] % 0x36];
    }

    return output.join('');
}
