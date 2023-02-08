---
title: Lantiq Print EEPROM
has_children: false
layout: default
---

<form id="eeprom0">
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="sfp_a0_low_128 input" name="sfp-a0-low-128" id="sfp-a0-low-128"    >
        <label for="sfp-a0-low-128">sfp_a0_low_128 input</label>
    </div>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Show!" name="submit">
    </div>
</form>



<form id="eeprom1">
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="sfp_a2_info input" name="sfp-a2-info" id="sfp-a2-info"    >
        <label for="sfp-a2-info">sfp_a2_info input</label>
    </div>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Show!" name="submit">
    </div>
</form>
<script>
    var eepromA0 = document.getElementById('eeprom0');
    eepromA0.addEventListener('submit',(event) => {
        event.preventDefault();
        var fomrdata = new FormData(eepromA0);
        var sfp_a2_info = fomrdata.get('sfp-a0-low-128');
        var sfp_a2_info_arr = sfp_a2_info.split('@');
        var sfp_a2_info_0 = sfp_a2_info_arr.shift();
        var sfp_a2_decode = sfp_a2_info_arr.map(it => base64ToHex(it)).join('');
        var eeprom = new eeprom1(sfp_a2_decode);
        var table = eepromTable(eeprom,0);
        var htmlTable = buildHtmlTable(table);
        eepromA0.parentNode.insertBefore(htmlTable, eepromA0.nextSibling);
    });
    var eepromA2 = document.getElementById('eeprom1');
    eepromA2.addEventListener('submit',(event) => {
        event.preventDefault();
        var fomrdata = new FormData(eepromA2);
        var sfp_a2_info = fomrdata.get('sfp-a2-info');
        var sfp_a2_info_arr = sfp_a2_info.split('@');
        var sfp_a2_info_0 = sfp_a2_info_arr.shift();
        var sfp_a2_decode = sfp_a2_info_arr.map(it => base64ToHex(it)).join('');
        var eeprom = new eeprom1(sfp_a2_decode);
        var table = eepromTable(eeprom,1);
        var htmlTable = buildHtmlTable(table);
        eepromA2.parentNode.insertBefore(htmlTable, eepromA2.nextSibling);
    });
    function eepromTable(eeprom, number) {
        jsonArray = [[
            {
                "address": "",
                "size": "",
                "name": "**BASE ID FIELDS (SFF-8472)**",
                "description": ""
            },
            {
                "address": "0",
                "size": "1",
                "name": "Identifier",
                "description": "Type of transceiver"
            },
            {
                "address": "1",
                "size": "1",
                "name": "Ext identifier",
                "description": "Additional information about the transceiver"
            },
            {
                "address": "2",
                "size": "1",
                "name": "Connector",
                "description": "Type of media connector"
            },
            {
                "address": "3-10",
                "size": "8",
                "name": "Transceiver",
                "description": "Code for optical compatibility"
            },
            {
                "address": "11",
                "size": "1",
                "name": "Encoding",
                "description": "High speed serial encoding algorithm"
            },
            {
                "address": "12",
                "size": "1",
                "name": "Signaling Rate, Nominal",
                "description": "Nominal signaling rate"
            },
            {
                "address": "13",
                "size": "1",
                "name": "Rate Identifier",
                "description": "Type of rate select functionality"
            },
            {
                "address": "14",
                "size": "1",
                "name": "Length (SMF,km)",
                "description": "Link length supported for single-mode fiber, units of km"
            },
            {
                "address": "15",
                "size": "1",
                "name": "Length (SMF)",
                "description": "Link length supported for single-mode fiber, units of 100 m"
            },
            {
                "address": "16",
                "size": "1",
                "name": "Length (50 um, OM2)",
                "description": "Link length supported for 50 um OM2 fiber, units of 10 m"
            },
            {
                "address": "17",
                "size": "1",
                "name": "Length (62.5 um, OM1)",
                "description": "Link length supported for 62.5 um OM1 fiber, units of 10 m"
            },
            {
                "address": "18",
                "size": "1",
                "name": "Length copper cable",
                "description": "Link length supported for copper or direct attach cable, units of m"
            },
            {
                "address": "19",
                "size": "1",
                "name": "Length (50 um, OM3)",
                "description": "Link length supported for 50 um OM3 fiber, units of 10 m"
            },
            {
                "address": "20-35",
                "size": "16",
                "name": "Vendor name",
                "description": "SFP vendor name (ASCII)"
            },
            {
                "address": "36",
                "size": "1",
                "name": "Transceiver",
                "description": "Code for optical compatibility"
            },
            {
                "address": "37-39",
                "size": "3",
                "name": "Vendor OUI",
                "description": "SFP vendor IEEE company ID"
            },
            {
                "address": "40-55",
                "size": "16",
                "name": "Vendor PN",
                "description": "Part number provided by SFP vendor (ASCII)"
            },
            {
                "address": "56-59",
                "size": "4",
                "name": "Vendor rev",
                "description": "Revision level for part number provided by vendor (ASCII)"
            },
            {
                "address": "60-61",
                "size": "2",
                "name": "Wavelength",
                "description": "Laser wavelength"
            },
            {
                "address": "62",
                "size": "1",
                "name": "Fibre Channel Speed 2",
                "description": "Transceiver's Fibre Channel speed capabilities"
            },
            {
                "address": "63",
                "size": "1",
                "name": "CC_BASE",
                "description": "Check code for Base ID Fields (addresses 0 to 62)"
            },
            {
                "address": "",
                "size": "",
                "name": "**EXTENDED ID FIELDS (SFF-8472)**",
                "description": ""
            },
            {
                "address": "64-65",
                "size": "2",
                "name": "Options",
                "description": "Indicates which optional transceiver signals are implemented"
            },
            {
                "address": "66",
                "size": "1",
                "name": "Signaling Rate, max",
                "description": "Upper signaling rate margin, units of %"
            },
            {
                "address": "67",
                "size": "1",
                "name": "Signaling Rate, min",
                "description": "Lower signaling rate margin, units of %"
            },
            {
                "address": "68-83",
                "size": "16",
                "name": "Vendor SN",
                "description": "Serial number provided by vendor (ASCII)"
            },
            {
                "address": "84-91",
                "size": "8",
                "name": "Date code",
                "description": "Vendor's manufacturing date code"
            },
            {
                "address": "92",
                "size": "1",
                "name": "Diagnostic Monitoring Type",
                "description": "Indicates which type of diagnostic monitoring is implemented"
            },
            {
                "address": "93",
                "size": "1",
                "name": "Enhanced Options",
                "description": "Indicates which optional enhanced features are implemented"
            },
            {
                "address": "94",
                "size": "1",
                "name": "SFF-8472 Compliance",
                "description": "Indicates which revision of SFF-8472 the transceiver complies with"
            },
            {
                "address": "95",
                "size": "1",
                "name": "CC_EXT",
                "description": "Check code for the Extended ID Fields (addresses 64 to 94)"
            },
            {
                "address": "",
                "size": "",
                "name": "**VENDOR SPECIFIC FIELDS**",
                "description": ""
            },
            {
                "address": "96-127",
                "size": "32",
                "name": "Vendor data",
                "description": "Vendor specifc data (ASCII)"
            },
            {
                "address": "128-255",
                "size": "128",
                "name": "Reserved",
                "description": "Reserved"
            },
            {
                "address": "",
                "size": "",
                "name": "**EXTRA EEPROM FIELDS**",
                "description": "**Not exposed to I2C interface**"
            },
            {
                "address": "256-639",
                "size": "384",
                "name": "Reserved",
                "description": "Reserved"
            }
        ], [
            {
                "address": "",
                "size": "",
                "name": "**DIAGNOSTIC AND CONTROL FIELDS**",
                "description": ""
            },
            {
                "address": "0-1",
                "size": "2",
                "name": "Temp High Alarm",
                "description": ""
            },
            {
                "address": "2-3",
                "size": "2",
                "name": "Temp Low Alarm",
                "description": ""
            },
            {
                "address": "4-5",
                "size": "2",
                "name": "Temp High Warning",
                "description": ""
            },
            {
                "address": "6-7",
                "size": "2",
                "name": "Temp Low Warning",
                "description": ""
            },
            {
                "address": "8-9",
                "size": "2",
                "name": "Voltage High Alarm",
                "description": ""
            },
            {
                "address": "10-11",
                "size": "2",
                "name": "Voltage Low Alarm",
                "description": ""
            },
            {
                "address": "12-13",
                "size": "2",
                "name": "Voltage High Warning",
                "description": ""
            },
            {
                "address": "14-15",
                "size": "2",
                "name": "Voltage Low Warning",
                "description": ""
            },
            {
                "address": "16-17",
                "size": "2",
                "name": "Bias High Alarm",
                "description": ""
            },
            {
                "address": "18-19",
                "size": "2",
                "name": "Bias Low Alarm",
                "description": ""
            },
            {
                "address": "20-21",
                "size": "2",
                "name": "Bias High Warning",
                "description": ""
            },
            {
                "address": "22-23",
                "size": "2",
                "name": "Bias Low Warning",
                "description": ""
            },
            {
                "address": "24-25",
                "size": "2",
                "name": "TX Power High Alarm",
                "description": "Value expressed in watts subunits"
            },
            {
                "address": "26-27",
                "size": "2",
                "name": "TX Power Low Alarm",
                "description": "Value expressed in watts subunits"
            },
            {
                "address": "28-29",
                "size": "2",
                "name": "TX Power High Warning",
                "description": "Value expressed in watts subunits"
            },
            {
                "address": "30-31",
                "size": "2",
                "name": "TX Power Low Warning",
                "description": "Value expressed in watts subunits"
            },
            {
                "address": "32-33",
                "size": "2",
                "name": "RX Power High Alarm",
                "description": "Value expressed in watts subunits"
            },
            {
                "address": "34-35",
                "size": "2",
                "name": "RX Power Low Alarm",
                "description": "Value expressed in watts subunits"
            },
            {
                "address": "36-37",
                "size": "2",
                "name": "RX Power High Warning",
                "description": "Value expressed in watts subunits"
            },
            {
                "address": "38-39",
                "size": "2",
                "name": "RX Power Low Warning",
                "description": "Value expressed in watts subunits"
            },
            {
                "address": "40-45",
                "size": "6",
                "name": "MAC address",
                "description": "Contains the mac address of the SFP, it could also be empty"
            },
            {
                "address": "46-55",
                "size": "10",
                "name": "Reserved",
                "description": "Reserved"
            },
            {
                "address": "56-59",
                "size": "4",
                "name": "RX_PWR(4) Calibration",
                "description": "4th order RSSI calibration coefficient"
            },
            {
                "address": "60-63",
                "size": "4",
                "name": "RX_PWR(3) Calibration",
                "description": "3rd order RSSI calibration coefficient"
            },
            {
                "address": "64-67",
                "size": "4",
                "name": "RX_PWR(2) Calibration",
                "description": "2nd order RSSI calibration coefficient"
            },
            {
                "address": "68-71",
                "size": "4",
                "name": "RX_PWR(1) Calibration",
                "description": "1st order RSSI calibration coefficient"
            },
            {
                "address": "72-75",
                "size": "4",
                "name": "RX_PWR(0) Calibration",
                "description": "0th order RSSI calibration coefficient"
            },
            {
                "address": "76-77",
                "size": "2",
                "name": "TX_I(Slope) Calibration",
                "description": "Slope for Bias calibration"
            },
            {
                "address": "78-79",
                "size": "2",
                "name": "TX_I(Offset) Calibration",
                "description": "Offset for Bias calibration"
            },
            {
                "address": "80-81",
                "size": "2",
                "name": "TX_PWR(Slope) Calibration",
                "description": "Slope for TX Power calibration"
            },
            {
                "address": "82-83",
                "size": "2",
                "name": "TX_PWR(Offset) Calibration",
                "description": "Offset for TX Power calibration"
            },
            {
                "address": "84-85",
                "size": "2",
                "name": "T(Slope) Calibration",
                "description": "Slope for Temperature calibration"
            },
            {
                "address": "86-87",
                "size": "2",
                "name": "T(Offset) Calibration",
                "description": "Offset for Temperature calibration, in units of 256ths °C"
            },
            {
                "address": "88-89",
                "size": "2",
                "name": "V(Slope) Calibration",
                "description": "Slope for VCC calibration"
            },
            {
                "address": "90-91",
                "size": "2",
                "name": "V(Offset) Calibration",
                "description": "Offset for VCC calibration"
            },
            {
                "address": "92-94",
                "size": "3",
                "name": "Reserved",
                "description": "Reserved"
            },
            {
                "address": "95",
                "size": "1",
                "name": "CC_DMI",
                "description": "Check code for Base Diagnostic Fields (addresses 0 to 94)"
            },
            {
                "address": "96",
                "size": "1",
                "name": "Temperature MSB",
                "description": "Internally measured module temperature"
            },
            {
                "address": "97",
                "size": "1",
                "name": "Temperature LSB",
                "description": ""
            },
            {
                "address": "98",
                "size": "1",
                "name": "Vcc MSB",
                "description": "Internally measured supply voltage in transceiver"
            },
            {
                "address": "99",
                "size": "1",
                "name": "Vcc LSB",
                "description": ""
            },
            {
                "address": "100",
                "size": "1",
                "name": "TX Bias MSB",
                "description": "Internally measured TX Bias Current"
            },
            {
                "address": "101",
                "size": "1",
                "name": "TX Bias LSB",
                "description": ""
            },
            {
                "address": "102",
                "size": "1",
                "name": "TX Power MSB",
                "description": "Measured TX output power"
            },
            {
                "address": "103",
                "size": "1",
                "name": "TX Power LSB",
                "description": ""
            },
            {
                "address": "104",
                "size": "1",
                "name": "RX Power MSB",
                "description": "Measured RX input power"
            },
            {
                "address": "105",
                "size": "1",
                "name": "RX Power LSB",
                "description": ""
            },
            {
                "address": "106-109",
                "size": "4",
                "name": "Optional Diagnostics",
                "description": "Monitor Data for Optional Laser temperature and TEC current"
            },
            {
                "address": "110",
                "size": "1",
                "name": "Status/Control",
                "description": "Optional Status and Control Bits"
            },
            {
                "address": "111",
                "size": "1",
                "name": "Reserved",
                "description": "Reserved"
            },
            {
                "address": "112-113",
                "size": "2",
                "name": "Alarm Flags",
                "description": "Diagnostic Alarm Flag Status Bits"
            },
            {
                "address": "114",
                "size": "1",
                "name": "Tx Input EQ control",
                "description": "Tx Input equalization level control"
            },
            {
                "address": "115",
                "size": "1",
                "name": "Rx Out Emphasis control",
                "description": "Rx Output emphasis level control"
            },
            {
                "address": "116-117",
                "size": "2",
                "name": "Warning Flags",
                "description": "Diagnostic Warning Flag Status Bits"
            },
            {
                "address": "118-119",
                "size": "2",
                "name": "Ext Status/Control",
                "description": "Extended module control and status bytes"
            },
            {
                "address": "",
                "size": "",
                "name": "**GENERAL USE FIELDS**",
                "description": ""
            },
            {
                "address": "120-126",
                "size": "7",
                "name": "Vendor Specific",
                "description": "Vendor specific memory addresses"
            },
            {
                "address": "127",
                "size": "1",
                "name": "Table Select",
                "description": "Optional Page Select"
            },
            {
                "address": "",
                "size": "",
                "name": "**USER WRITABLE EEPROM**",
                "description": ""
            },
            {
                "address": "128-190",
                "size": "63",
                "name": "Reserved",
                "description": "Reserved"
            },
            {
                "address": "191-214",
                "size": "24",
                "name": "GPON LOID or PLOAM",
                "description": "GPON Logical ONU ID or PLOAM, depends on `GPON LOID/PLOAM switch`"
            },
            {
                "address": "215-231",
                "size": "17",
                "name": "GPON LPWD",
                "description": "GPON Logical Password"
            },
            {
                "address": "232",
                "size": "1",
                "name": "GPON LOID/PLOAM switch",
                "description": "`0x01` to enable LOID, `0x02` to enable PLOAM"
            },
            {
                "address": "233-240",
                "size": "8",
                "name": "GPON SN",
                "description": "GPON Serial Number (ME 256)"
            },
            {
                "address": "241-247",
                "size": "7",
                "name": "Reserved",
                "description": "Reserved"
            },
            {
                "address": "248-255",
                "size": "8",
                "name": "Vendor Control",
                "description": "Vendor specific control functions"
            },
            {
                "address": "",
                "size": "",
                "name": "**EXTRA EEPROM FIELDS**",
                "description": "**Not exposed to I2C interface**"
            },
            {
                "address": "256-511",
                "size": "256",
                "name": "Unknown vendor specific",
                "description": "Probably not used in current SFPs"
            },
            {
                "address": "512-531",
                "size": "20",
                "name": "GPON Equipment ID",
                "description": "GPON Equipment ID (ME 257), may not work in some firmwares"
            },
            {
                "address": "532-535",
                "size": "4",
                "name": "GPON Vendor ID",
                "description": "GPON Vendor ID (ME 256 and more), may not work in some firmware"
            },
            {
                "address": "536-639",
                "size": "104",
                "name": "Reserved",
                "description": "Reserved"
            }
        ]];
        finalArray = [...jsonArray[number]];
        finalArray.map(it => {
            if(it.address) {
                var addr = it.address.split('-').map(x => parseInt(x));
                it.value = eeprom.getPart(addr[0], addr[addr.length -1])
            }
            return it;
        });
        return finalArray;
    }
</script>

<style>
table td {
    max-width: 50px;
}
</style>

{% include alert.html content="For more information, see the SFF-8472 Rev 10.2 specification." alert="Info" icon="svg-info" color="blue" %}