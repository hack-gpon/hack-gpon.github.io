/* GPON OMCI VLAN Table parser
 * Copyright (C) Ernesto Castellotti <mail@ernestocastellotti.it>
 * SPDX-License-Identifier: MPL-2.0-no-copyleft-exception
*/

// Convert hex string to binary representation
function hex2bin(hex){
    hex = hex.replace(/0x/g, "").replace(/ /g, '').toLowerCase();
    var out = "";
    for(var c of hex) {
        switch(c) {
            case '0': out += "0000"; break;
            case '1': out += "0001"; break;
            case '2': out += "0010"; break;
            case '3': out += "0011"; break;
            case '4': out += "0100"; break;
            case '5': out += "0101"; break;
            case '6': out += "0110"; break;
            case '7': out += "0111"; break;
            case '8': out += "1000"; break;
            case '9': out += "1001"; break;
            case 'a': out += "1010"; break;
            case 'b': out += "1011"; break;
            case 'c': out += "1100"; break;
            case 'd': out += "1101"; break;
            case 'e': out += "1110"; break;
            case 'f': out += "1111"; break;
            default: return "";
        }
    }

    return out;
}

// Helper function to splice binary array and convert to decimal
function binSpliceToDec(binArray, len) {
    var result = binArray.splice(0, len);
    return parseInt(result.join(""), 2);
}

// GPON OMCI VLAN Table parser
class VlanTable {
    constructor(binaryArray) {
        this.filter_outer_priority = binSpliceToDec(binaryArray, 4);
        this.filter_outer_vid = binSpliceToDec(binaryArray, 13);
        this.filter_outer_tpid = binSpliceToDec(binaryArray, 3);
        binaryArray.splice(0, 12); // Padding
        this.filter_inner_priority = binSpliceToDec(binaryArray, 4);
        this.filter_inner_vid = binSpliceToDec(binaryArray, 13);
        this.filter_inner_tpid = binSpliceToDec(binaryArray, 3);
        binaryArray.splice(0, 8); // Padding
        this.filter_ether_type = binSpliceToDec(binaryArray, 4);
        this.treatment_tags_to_remove = binSpliceToDec(binaryArray, 2);
        binaryArray.splice(0, 10); // Padding
        this.treatment_outer_priority = binSpliceToDec(binaryArray, 4);
        this.treatment_outer_vid = binSpliceToDec(binaryArray, 13);
        this.treatment_outer_tpid = binSpliceToDec(binaryArray, 3);
        binaryArray.splice(0, 12); // Padding
        this.treatment_inner_priority = binSpliceToDec(binaryArray, 4);
        this.treatment_inner_vid = binSpliceToDec(binaryArray, 13);
        this.treatment_inner_tpid = binSpliceToDec(binaryArray, 3);
    }
    
    // Parse full vlan table to array of VlanTable class (one per vlan rule)
    static parse(hexString) {
        var binaryArray = hex2bin(hexString).split('');
        var result = new Array();
        
        while(binaryArray.length > 0) {
            var vlanRuleBinaryArray = binaryArray.splice(0, 16*8);
            result.push(new VlanTable(vlanRuleBinaryArray));
        }
        
        return result;
    }
}
