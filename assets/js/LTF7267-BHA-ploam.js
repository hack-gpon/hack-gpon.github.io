function hexEncode(str){
    var hex, i;

    var result = "";
    for (i=0; i<str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += hex.padStart(2, "0");
    }

    return result;
}

function hisensePloam(ascii_ploam) {
    var hex_ploam = hexEncode(ascii_ploam);
    var hex_padded_ploam = hex_ploam.padEnd(72, "0");
    var array =[];
    for (i = 0; i<9; i++) {
        ploam_segment = hex_padded_ploam.slice(i*8, (i+1)*8);
        new_ploam_segment = "";
        for(j = 4; j>0; j--) {
            new_ploam_segment = new_ploam_segment + ploam_segment.slice((j-1)*2, j*2);
        }
        if(new_ploam_segment !== "00000000")
            array.push("INT             CFG_ID_PON_REGISTRATION_ID"+i+"                                        = 0x"+new_ploam_segment+";");
    }
    return array.join("\n");
}