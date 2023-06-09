function hexEncode(str: String): String {

    var result = "";
    for (let i = 0; i < str.length; i++) {
        const hex = str.charCodeAt(i).toString(16);
        result += hex.padStart(2, "0");
    }

    return result;
}

function hisensePloam(ascii_ploam: String): String {
    const hex_ploam = hexEncode(ascii_ploam);
    const hex_padded_ploam = hex_ploam.padEnd(72, "0");
    let array: String[] = [];
    for (let i = 0; i < 9; i++) {
        const ploam_segment = hex_padded_ploam.slice(i * 8, (i + 1) * 8);
        let new_ploam_segment = "";
        for (let j = 4; j > 0; j--) {
            new_ploam_segment = new_ploam_segment + ploam_segment.slice((j - 1) * 2, j * 2);
        }
        if (new_ploam_segment !== "00000000") {
            array.push("INT             CFG_ID_PON_REGISTRATION_ID" + i + "                                        = 0x" + new_ploam_segment + ";");
        }
    }
    return array.join("\n");
}

(window as any).hisensePloam = hisensePloam;