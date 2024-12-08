/* Copyright (C) Erny <info@erny.dev>
 * SPDX-License-Identifier: MPL-2.0-no-copyleft-exception
*/

// Convert hex string to binary representation
function hex2bin(hexString){
    var result = "";
    hexString = hexString.replace(/0x/g, "").replace(/ /g, '').toLowerCase();
    
    for(const hexChr of hexString) {
        const bin = parseInt(hexChr, 16).toString(2).padStart(4, '0');
        
        if (!bin.isNaN) {
            result += bin;
        } else {
            throw new Error("The hex string is not valid!");
        }
    }

    return result;
}

// Helper function to splice binary array and convert to decimal
function binSpliceToDec(binArray, len) {
    const result = binArray.splice(0, len);
    return parseInt(result.join(""), 2);
}

// GPON OMCI VLAN Table parser
function vlanTableParse(hexString) {
    const binaryArray = hex2bin(hexString).split('');
    var result = new Array();
        
    while(binaryArray.length > 0) {
        var vlanRule = new Array();
            
        vlanRule.push(binSpliceToDec(binaryArray, 4));
        vlanRule.push(binSpliceToDec(binaryArray, 13));
        vlanRule.push(binSpliceToDec(binaryArray, 3));
        binaryArray.splice(0, 12); // Padding
        vlanRule.push( binSpliceToDec(binaryArray, 4));
        vlanRule.push(binSpliceToDec(binaryArray, 13));
        vlanRule.push(binSpliceToDec(binaryArray, 3));
        binaryArray.splice(0, 8); // Padding
        vlanRule.push(binSpliceToDec(binaryArray, 4));
        vlanRule.push(binSpliceToDec(binaryArray, 2));
        binaryArray.splice(0, 10); // Padding
        vlanRule.push(binSpliceToDec(binaryArray, 4));
        vlanRule.push(binSpliceToDec(binaryArray, 13));
        vlanRule.push(binSpliceToDec(binaryArray, 3));
        binaryArray.splice(0, 12); // Padding
        vlanRule.push(binSpliceToDec(binaryArray, 4));
        vlanRule.push(binSpliceToDec(binaryArray, 13));
        vlanRule.push(binSpliceToDec(binaryArray, 3));
        
        result.push(vlanRule);
    }
        
    return result;
}
