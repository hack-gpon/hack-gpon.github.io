<template>
    <div>
        <div class="form-floating mb-3">
            <textarea v-if="type === 'eeprom-ethtool'" type="text" class="form-control" placeholder="EEPROM input" id="eeprom" v-model="eeprom"></textarea>
            <input v-else type="text" class="form-control" placeholder="EEPROM input" id="eeprom" v-model="eeprom">
            <label for="eeprom">EEPROM input</label>
        </div>
        <template v-if="type === 'eeprom-lantiq'">
            <div class="form-floating mb-3">
                <select class="form-control" placeholder="Select EEPROM" id="eeprom-type" v-model="eeprom_switch">
                    <option value="A0">EEPROM A0</option>
                    <option value="A2">EEPROM A2</option>
                </select>
                <label for="eeprom-type">Select EEPROM A0 or A2</label>
            </div>
            <div class="table-wrapper">
                <table>
                    <tr>
                        <th>address</th>
                        <th>size</th>
                        <th>name</th>
                        <th>hex value</th>
                        <th>decoded value</th>
                        <th>description</th>
                    </tr>
                    <tr v-for="(value, key, index) in eeprom_json" :key="index">
                        <td>{{ value.address }}</td>
                        <td>{{ value.size }}</td>
                        <td v-if="value.name.startsWith('**')"><b>{{ value.name.replaceAll('**', '') }}</b></td>
                        <td v-else>{{ value.name }}</td>
                        <td><code v-if="value.value">{{ chunk(value.value)?.map(it => `0x${it}`)?.join(' ') }}</code></td>
                        <td><span v-if="value.human">{{ value.human }}</span></td>
                        <td v-if="value.description.startsWith('**')"><b>{{ value.description.replaceAll('**', '') }}</b></td>
                        <td v-else>{{ value.description }}</td>
                    </tr>
                </table>
            </div>
            <div markdown="span" class="alert alert-blue" role="alert" v-if="revision">
                <svg viewBox="0 0 24 24" class="info-icon"><use xlink:href="#svg-info"></use></svg>
                <span> <b>Info</b> For more information, see the {{ revision }} specification.</span>
            </div>
        </template>
        <template v-if="type === 'eeprom-ethtool'">
            <div class="form-floating mb-3">
                <select class="form-control" placeholder="Select EEPROM" id="eeprom-type" v-model="eeprom_switch">
                    <option value="A0">EEPROM A0</option>
                    <option value="A2">EEPROM A2</option>
                </select>
                <label for="eeprom-type">Select EEPROM A0 or A2</label>
            </div>
            <div class="table-wrapper">
                <table>
                    <tr>
                        <th>address</th>
                        <th>size</th>
                        <th>name</th>
                        <th>hex value</th>
                        <th>decoded value</th>
                        <th>description</th>
                    </tr>
                    <tr v-for="(value, key, index) in eeprom_json" :key="index">
                        <td>{{ value.address }}</td>
                        <td>{{ value.size }}</td>
                        <td v-if="value.name.startsWith('**')"><b>{{ value.name.replaceAll('**', '') }}</b></td>
                        <td v-else>{{ value.name }}</td>
                        <td><code v-if="value.value">{{ chunk(value.value)?.map(it => `0x${it}`)?.join(' ') }}</code></td>
                        <td><span v-if="value.human">{{ value.human }}</span></td>
                        <td v-if="value.description.startsWith('**')"><b>{{ value.description.replaceAll('**', '') }}</b></td>
                        <td v-else>{{ value.description }}</td>
                    </tr>
                </table>
            </div>
            <div markdown="span" class="alert alert-blue" role="alert" v-if="revision">
                <svg viewBox="0 0 24 24" class="info-icon"><use xlink:href="#svg-info"></use></svg>
                <span> <b>Info</b> For more information, see the {{ revision }} specification.</span>
            </div>
        </template>
        <template v-if="type === 'eeprom-rooted-edit'">
            <div class="form-floating mb-3">
                <input type="text" class="form-control" placeholder="GPON S/N HEX" id="gpon-serial" v-model="serial_hex" style="width: 50%">
                <input type="text" class="form-control" placeholder="GPON S/N ASCII" id="gpon-serial-ascii" v-model="serial_ascii" style="width: 50%">
                <label for="gpon-serial">GPON S/N in format 0x47504F4E12345678 or GPON12345678</label>
            </div>
            <div class="form-floating mb-3">
                <select class="form-control" placeholder="GPON Ploam/LoID Switch" id="gpon-loid-ploam-switch" v-model="loidPloamSwitch">
                    <option value="02">GPON PLOAM</option>
                    <option value="01">GPON LoID</option>
                </select>
                <label for="gpon-loid-ploam-switch">GPON Ploam/LoID Switch</label>
            </div>
            <div class="form-floating mb-3" v-if="loidPloamSwitch === '02'">
                <input type="text" class="form-control" placeholder="GPON Ploam Password HEX" id="gpon-ploam" v-model="ploam_hex" style="width: 50%">
                <input type="text" class="form-control" placeholder="GPON Ploam Password ASCII" id="gpon-ploam-ascii" v-model="ploam_ascii" style="width: 50%">
                <label for="gpon-ploam">GPON Ploam in format 0x31323334353637383930 or 1234567890</label>
            </div>
            <div class="form-floating mb-3" v-if="loidPloamSwitch === '01'">
                <input type="text" class="form-control" placeholder="GPON LoID User" id="gpon-loid" v-model="loid_hex" style="width: 50%">
                <input type="text" class="form-control" placeholder="GPON LoID User" id="gpon-loid-ascii" v-model="loid_ascii" style="width: 50%">
            <label for="gpon-loid">GPON LoID User in hex format 0x31323334353637383930 or 1234567890</label>
            </div>
            <div class="form-floating mb-3" v-if="loidPloamSwitch === '01'">
                <input type="text" class="form-control" placeholder="GPON LoPW Password" id="gpon-lopw" v-model="lopw_hex" style="width: 50%">
                <input type="text" class="form-control" placeholder="GPON LoPW Password" id="gpon-lopw-ascii" v-model="lopw_ascii" style="width: 50%">
                <label for="gpon-lopw">GPON LoPW Password in hex format 0x31323334353637383930 or 1234567890</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" placeholder="MAC address" id="bridge-mac"  v-model="mac_prettier" pattern="[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}">
                <label for="bridge-mac">Bridge MAC Address in format 48:57:02:da:be:ef, 48-57-02-da-be-ef or 485702dabeef</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" placeholder="sfp_a2_info output" id="sfp-a2-info" v-model="eeprom" readonly>
                <label for="sfp-a2-info">sfp_a2_info output</label>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    data() {
        return {
            raw: null,
            eeprom_decode: null,
            lantiq_0: null,
            lantiq_last: null,
            eeprom_table: {
                "A0":[
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
                        "description": "Type of transceiver",
                        "parse": "table_identifier_values"
                    },
                    {
                        "address": "1",
                        "size": "1",
                        "name": "Ext identifier",
                        "description": "Additional information about the transceiver",
                        "parse": "table_phy_device_identifier_value"
                    },
                    {
                        "address": "2",
                        "size": "1",
                        "name": "Connector",
                        "description": "Type of media connector",
                        "parse": "table_connector_value"
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
                        "description": "High speed serial encoding algorithm",
                        "parse": "table_encoding_value"
                    },
                    {
                        "address": "12",
                        "size": "1",
                        "name": "Signaling Rate, Nominal",
                        "description": "Nominal signaling rate",
                        "parse": "hexToRate"
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
                        "description": "Link length supported for single-mode fiber, units of km",
                        "parse": "hexTo_km"
                    },
                    {
                        "address": "15",
                        "size": "1",
                        "name": "Length (SMF)",
                        "description": "Link length supported for single-mode fiber, units of 100 m",
                        "parse": "hexTo100m"
                    },
                    {
                        "address": "16",
                        "size": "1",
                        "name": "Length (50 um, OM2)",
                        "description": "Link length supported for 50 um OM2 fiber, units of 10 m",
                        "parse": "hexTo10m"
                    },
                    {
                        "address": "17",
                        "size": "1",
                        "name": "Length (62.5 um, OM1)",
                        "description": "Link length supported for 62.5 um OM1 fiber, units of 10 m",
                        "parse": "hexTo10m"
                    },
                    {
                        "address": "18",
                        "size": "1",
                        "name": "Length copper cable",
                        "description": "Link length supported for copper or direct attach cable, units of m",
                        "parse": "hexTo_m"
                    },
                    {
                        "address": "19",
                        "size": "1",
                        "name": "Length (50 um, OM3)",
                        "description": "Link length supported for 50 um OM3 fiber, units of 10 m",
                        "parse": "hexTo10m"
                    },
                    {
                        "address": "20-35",
                        "size": "16",
                        "name": "Vendor name",
                        "description": "SFP vendor name (ASCII)",
                        "parse": "hexToAscii"
                    },
                    {
                        "address": "36",
                        "size": "1",
                        "name": "Transceiver",
                        "description": "Code for optical compatibility",
                        "parse":"table_extended_specification_compliance_codeds"
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
                        "description": "Part number provided by SFP vendor (ASCII)",
                        "parse": "hexToAscii"
                    },
                    {
                        "address": "56-59",
                        "size": "4",
                        "name": "Vendor rev",
                        "description": "Revision level for part number provided by vendor (ASCII)",
                        "parse": "hexToAscii"
                    },
                    {
                        "address": "60-61",
                        "size": "2",
                        "name": "Wavelength",
                        "description": "Laser wavelength",
                        "parse": "hexTo_nm"
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
                        "description": "Serial number provided by vendor (ASCII)",
                        "parse": "hexToAscii"
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
                        "description": "Indicates which type of diagnostic monitoring is implemented",
                        "parse":"table_diagnostic_monitoring_type"
                    },
                    {
                        "address": "93",
                        "size": "1",
                        "name": "Enhanced Options",
                        "description": "Indicates which optional enhanced features are implemented",
                        "parse":"table_enhanced_options"
                    },
                    {
                        "address": "94",
                        "size": "1",
                        "name": "SFF-8472 Compliance",
                        "description": "Indicates which revision of SFF-8472 the transceiver complies with",
                        "parse":"table_compliance"
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
                        "description": "Vendor specifc data (ASCII)",
                        "parse": "hexToAscii"
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
                ], 
                "A2":[
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
                        "description": "",
                        "parse": "hexToTemp"
                    },
                    {
                        "address": "2-3",
                        "size": "2",
                        "name": "Temp Low Alarm",
                        "description": "",
                        "parse": "hexToTemp"
                    },
                    {
                        "address": "4-5",
                        "size": "2",
                        "name": "Temp High Warning",
                        "description": "",
                        "parse": "hexToTemp"
                    },
                    {
                        "address": "6-7",
                        "size": "2",
                        "name": "Temp Low Warning",
                        "description": "",
                        "parse": "hexToTemp"
                    },
                    {
                        "address": "8-9",
                        "size": "2",
                        "name": "Voltage High Alarm",
                        "description": "",
                        "parse": "hexToVolt"
                    },
                    {
                        "address": "10-11",
                        "size": "2",
                        "name": "Voltage Low Alarm",
                        "description": "",
                        "parse": "hexToVolt"
                    },
                    {
                        "address": "12-13",
                        "size": "2",
                        "name": "Voltage High Warning",
                        "description": "",
                        "parse": "hexToVolt"
                    },
                    {
                        "address": "14-15",
                        "size": "2",
                        "name": "Voltage Low Warning",
                        "description": "",
                        "parse": "hexToVolt"
                    },
                    {
                        "address": "16-17",
                        "size": "2",
                        "name": "Bias High Alarm",
                        "description": "",
                        "parse": "hexToMilliAmpere"
                    },
                    {
                        "address": "18-19",
                        "size": "2",
                        "name": "Bias Low Alarm",
                        "description": "",
                        "parse": "hexToMilliAmpere"
                    },
                    {
                        "address": "20-21",
                        "size": "2",
                        "name": "Bias High Warning",
                        "description": "",
                        "parse": "hexToMilliAmpere"
                    },
                    {
                        "address": "22-23",
                        "size": "2",
                        "name": "Bias Low Warning",
                        "description": "",
                        "parse": "hexToMilliAmpere"
                    },
                    {
                        "address": "24-25",
                        "size": "2",
                        "name": "TX Power High Alarm",
                        "description": "Value expressed in watts subunits",
                        "parse": "hex_suWTo_dBm"
                    },
                    {
                        "address": "26-27",
                        "size": "2",
                        "name": "TX Power Low Alarm",
                        "description": "Value expressed in watts subunits",
                        "parse": "hex_suWTo_dBm"
                    },
                    {
                        "address": "28-29",
                        "size": "2",
                        "name": "TX Power High Warning",
                        "description": "Value expressed in watts subunits",
                        "parse": "hex_suWTo_dBm"
                    },
                    {
                        "address": "30-31",
                        "size": "2",
                        "name": "TX Power Low Warning",
                        "description": "Value expressed in watts subunits",
                        "parse": "hex_suWTo_dBm"
                    },
                    {
                        "address": "32-33",
                        "size": "2",
                        "name": "RX Power High Alarm",
                        "description": "Value expressed in watts subunits",
                        "parse": "hex_suWTo_dBm"
                    },
                    {
                        "address": "34-35",
                        "size": "2",
                        "name": "RX Power Low Alarm",
                        "description": "Value expressed in watts subunits",
                        "parse": "hex_suWTo_dBm"
                    },
                    {
                        "address": "36-37",
                        "size": "2",
                        "name": "RX Power High Warning",
                        "description": "Value expressed in watts subunits",
                        "parse": "hex_suWTo_dBm"
                    },
                    {
                        "address": "38-39",
                        "size": "2",
                        "name": "RX Power Low Warning",
                        "description": "Value expressed in watts subunits",
                        "parse": "hex_suWTo_dBm"
                    },
                    {
                        "address": "40-45",
                        "size": "6",
                        "name": "MAC address",
                        "description": "Contains the mac address of the SFP, it could also be empty",
                        "parse": "hexToMac"
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
                        "description": "Optional Status and Control Bits",
                        "parse": "table_real_time_diagnostic_and_control"
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
                        "description": "Diagnostic Alarm Flag Status Bits",
                        "parse": "table_alarm_and_warning"
                    },
                    {
                        "address": "114",
                        "size": "1",
                        "name": "Tx Input EQ control",
                        "description": "Tx Input equalization level control",
                        "parse": "hex_to_dBm"

                    },
                    {
                        "address": "115",
                        "size": "1",
                        "name": "Rx Out Emphasis control",
                        "description": "Rx Output emphasis level control",
                        "parse": "hex_to_dBm"
                    },
                    {
                        "address": "116-117",
                        "size": "2",
                        "name": "Warning Flags",
                        "description": "Diagnostic Warning Flag Status Bits",
                        "parse": "table_alarm_and_warning"
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
                        "description": "GPON Logical ONU ID or PLOAM, depends on `GPON LOID/PLOAM switch`",
                        "parse": "hexToAscii"
                    },
                    {
                        "address": "215-231",
                        "size": "17",
                        "name": "GPON LPWD",
                        "description": "GPON Logical Password",
                        "parse": "hexToAscii"
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
                        "description": "GPON Serial Number (ME 256)",
                        "parse": "hexToSerial"
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
                        "address": "256-383",
                        "size": "128",
                        "name": "Unknown vendor specific",
                        "description": "Probably not used in current SFPs"
                    },
                    {
                        "address": "384-389",
                        "size": "6",
                        "name": "MAC address (Huawei Rooted Firmware)",
                        "description": "Contains the mac address of the SFP, probably it used only in Huawei Rooted Firmware",
                        "parse":"hexToMac"
                    },
                    {
                        "address": "390-511",
                        "size": "122",
                        "name": "Unknown vendor specific",
                        "description": "Probably not used in current SFPs"
                    },
                    {
                        "address": "512-531",
                        "size": "20",
                        "name": "GPON Equipment ID",
                        "description": "GPON Equipment ID (ME 257), may not work in some firmwares",
                        "parse": "hexToAscii"
                    },
                    {
                        "address": "532-535",
                        "size": "4",
                        "name": "GPON Vendor ID",
                        "description": "GPON Vendor ID (ME 256 and more), may not work in some firmware",
                        "parse": "hexToAscii"
                    },
                    {
                        "address": "536-639",
                        "size": "104",
                        "name": "Reserved",
                        "description": "Reserved"
                    }
                ]
                },
            eeprom_switch: "A0"
        }
    },
    props: ['type'],
    computed: {
        revision: {
            get() {
                if (this.eeprom_switch === "A0") {
                    var rev = this.getPart(94, 94);
                    return rev !== "00" ? this.table_compliance(rev).slice(0, -1) ?? "SFF-8472" : "SFF-8472";
                }
                return "SFF-8472";
            }
        },
        eeprom: {
            get() {
                if(this.type === 'eeprom-lantiq' || this.type === 'eeprom-rooted-edit') {
                    if(this.eeprom_decode){
                        var lantiq_new = (this.eeprom_decode.join('').match(/.{1,90}/g) ?? []).map(it => this.hexToBase64(it));
                        lantiq_new.unshift(this.lantiq_0);
                        lantiq_new.push(...this.lantiq_last);
                        return lantiq_new.join('@'); 
                    }
                    return '';
                } else {
                    return this.raw;
                }
            },
            set(val) {
                this.raw = val;
                if(this.type === 'eeprom-lantiq' || this.type === 'eeprom-rooted-edit') {
                    var lantiq_array = val.split('@');
                    this.lantiq_0 = lantiq_array.shift();
                    if(this.lantiq_0.includes("sfp_a2_info")) {
                        this.eeprom_switch = "A2";
                    }
                    else if(this.lantiq_0.includes("sfp_a0_low_128")) {
                        this.eeprom_switch = "A0";
                    }
                    this.lantiq_last = lantiq_array.slice(-2);
                    var lantiq_decode = lantiq_array.map(it => this.base64ToHex(it)).join('');
                    this.eeprom_decode = [...lantiq_decode];
                }
                else if(this.type === 'eeprom-ethtool') {
                    var ethtool_map = Object.fromEntries(val.split('\n').filter(it => it.startsWith("0x")).map(it => {  var [key, value] = it.split(/[: ]+(.*)/s);
                                                                                                                        key = parseInt(key, 16);
                                                                                                                        value = value.replace(/\s+/g, '');
                                                                                                                        value = [...value];
                                                                                                                        return [key,value] }));
                    var eeprom_decode = [];
                    var max = Math.max(...Object.keys(ethtool_map).map(it => parseInt(it)));
                    for(var i = 0; i < max; i+=16) {
                        eeprom_decode.push(...(ethtool_map[i] ?? Array.from({length: 32}, () => 0)));
                    };
                    this.eeprom_decode = [...eeprom_decode];
                    var ethtool_0 = val.split('\n')[0];
                    const conditions = {
                        "A0": ['-m', '--dump-module-eeprom', '--module-info'],
                        "A2": ['-e', '--eeprom-dump']
                    };
                    for (const [key, value] of Object.entries(conditions)) {
                        if (value.some(el => ethtool_0.includes(el))) {
                            this.eeprom_switch = key;
                            break;
                        }
                    }
                }
            },
        },
        eeprom_json: {
            get() {
                var finalArray = [...this.eeprom_table[this.eeprom_switch]];
                finalArray.map(it => {
                    if(it.address) {
                        var addr = it.address.split('-').map(x => parseInt(x));
                        it.value = this.getPart(addr[0], addr[addr.length -1])
                        if(it.parse) it.human = this[it.parse ?? ((it) => { console.log(`no function find for ${it.parse}`)})](it.value)
                    }
                    return it;
                });
                return finalArray;
            }
        },
        serial: {
            get() {
                return this.getPart(233, 240);
            },
            set(value) {
                if(value.length == 16)
                    this.setPart(233, 240, value);
            }
        },
        serial_hex: {
            get() {
                if(this.serial) return this.addHexPrefix(this.serial);
            },
            set(value) {
                value = this.stripHexPrefix(value);
                if(value.length == 16)
                    this.serial = value;
            }
        },
        serial_ascii: {
            get() {
                if(this.serial) return this.hexToSerial(this.serial);
            },
            set(value) {
                if(value.length == 12)
                    this.serial = this.asciiToHex(value.substring(0,4))+value.substring(4);
            }
        },
        ploam: {
            get() {
                if(this.loidPloamSwitch === "02")
                    return this.getPart(191, 214);
            },
            set(value) {
                if(this.loidPloamSwitch === "02")
                    this.setPart(191, 214, value);
            }
        },
        ploam_hex: {
            get() {
                if(this.ploam) return this.addHexPrefix(this.ploam.substring(0,20));
            },
            set(value) {
                this.ploam = this.stripHexPrefix(value);
            }
        },
        ploam_ascii: {
            get() {
                if(this.ploam) return this.hexToAscii(this.ploam.substring(0,20));
            },
            set(value) {
                if(value.length <= 10)
                    this.ploam = this.asciiToHex(value);
            }
        },
        loid: {
            get() {
                if(this.loidPloamSwitch === "01")
                    return this.getPart(191, 214);
            },
            set(value) {
                if(this.loidPloamSwitch === "01")
                    this.setPart(191, 214, value);
            }
        },
        loid_hex: {
            get() {
                if(this.loid) return this.addHexPrefix(this.loid.substring(0,20));
            },
            set(value) {
                this.loid = this.stripHexPrefix(value);
            }
        },
        loid_ascii: {
            get() {
                if(this.loid) return this.hexToAscii(this.loid.substring(0,20));
            },
            set(value) {
                if(value.length <= 10)
                    this.loid = this.asciiToHex(value);
            }
        },
        lopw: {
            get() {
                if(this.loidPloamSwitch === "01")
                    return this.getPart(215, 231);
            },
            set(value) {
                if(this.loidPloamSwitch === "01")
                    this.setPart(215, 231, value);
            }
        },
        lopw_hex: {
            get() {
                if(this.lopw) return this.hexToAscii(this.lopw.substring(0,20));
            },
            set(value) {
                this.lopw = this.stripHexPrefix(value);
            }
        },
        lopw_ascii: {
            get() {
                if(this.lopw) return this.hexToAscii(this.lopw.substring(0,20));
            },
            set(value) {
                if(value.length <= 10)
                    this.lopw = this.asciiToHex(value);
            }
        },
        loidPloamSwitch: {
            get() {
                return this.getPart(232, 232);
            },
            set(value) {
                this.setPart(232, 232, value);
            }
        },
        equipmentID: {
            get() {
                return this.getPart(512, 531);
            },
            set(value) {
                this.setPart(512, 531, value);
            }
        },
        vendorID: {
            get() {
                return this.getPart(532, 535);
            },
            set(value) {
                this.setPart(532, 535, value);
            }
        },
        mac_rooted: {
            get() {
                return this.getPart(384, 389);
            },
            set(value) {
                this.setPart(384, 389, value);
            }
        },
        mac_prettier: {
            get() {
                return this.hexToMac(this.mac_rooted);
            },
            set(value) {
                if(value.length == 12) {
                    this.mac = value;
                }
                else if(value.length == 14) {
                    this.mac = stripHexPrefix(value);
                }
                else if(value.length == 17) {
                    this.mac = value.split(value[2]).join('');
                }
            }
        }
    },
    methods: {
        getPart: function (startIndex, endIndex) {
            return this.eeprom_decode?.slice(startIndex * 2, (endIndex + 1) * 2)?.join('');
        },
        setPart: function (startIndex, endIndex, value) {
            let calcLength = (endIndex + 1 - startIndex) * 2;
            if(!value) {
                return;
            }
            if (value.length < calcLength) {
                value += '0'.repeat(calcLength - value.length);
            } else if(value.length > calcLength) {
                value = value.substring(0, calcLength);
            }
            this.eeprom_decode.splice(startIndex * 2, calcLength, ...[...value]);
        },
        isHexPrefixed: function(str, prefix = '0x') {
            if (typeof str !== 'string') {
            throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + (typeof str) + ", while checking isHexPrefixed.");
            }
            return str.slice(0, 2) === prefix;
        },
        stripHexPrefix: function(str, prefix = '0x') {
            if (typeof str !== 'string') {
                return str;
            }
            return this.isHexPrefixed(str) ? str.slice(prefix.length) : str;
        },
        chunk: function(str) {
            return str?.match(/../g);
        },
        hexToBase64: function (hexStr) {
            return btoa([...hexStr].reduce((acc, _, i) => acc += !(i - 1 & 1) ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16)) : '', ''));
        },
        base64ToHex: function(base64Value) {
            try {
                return [...atob(base64Value)].map(c=> c.charCodeAt(0).toString(16).padStart(2,0)).join('');
            } catch { return ''; }
        },
        parseInt2complement: function(bitstring, bitcount)
        {
            var value = parseInt(bitstring, 2);

            if ((value & (1<<(bitcount-1))) > 0) {
                value = value - (1<<(bitcount));
            }
            return value;
        },
        reverseEndian: function(hex) {
            return hex ? this.chunk(hex).reverse().join('') : "";
        },
        hexToTemp: function(hex) {
            return hex ? `${this.parseInt2complement((parseInt(this.reverseEndian(hex), 16)).toString(2), 8)}℃` : "";
        },
        hexToVolt: function(hex) {
            return hex ? `${parseInt(hex, 16) / 10000}V` : "";
        },
        hexToMilliAmpere: function(hex) {
            return hex ? `${parseInt(hex, 16) / 10000}mA` : "";
        },
        hexToMac: function(hex) {
            return hex ? this.chunk(hex).join(':') : "";
        },
        hex_to_dBm: function(hex) {
            return hex ? `${parseInt(hex, 16)}dBm` : "";
        },
        hex_suWTo_dBm: function(hex) {
            return hex ? `${(10 * Math.log10(parseInt(hex, 16) / 10000)).toFixed(2)}dBm` : "";
        },
        hex_dBmTo_mw: function(hex) {
            return hex ? Math.pow(10, parseInt(hex, 16) / 10) : "";
        },
        hexToAscii: function (hex) {
            return hex ? this.chunk(hex)?.map(el => String.fromCharCode(parseInt(el, 16)))?.join('')?.replace(/\0/g, '') : "";
        },
        hexToSerial: function (hex) {
            return hex ? this.hexToAscii(hex.substring(0,8))+hex.substring(8) : "";
        },
        hexTo_km: function(hex) {
            return hex ? `${parseInt(hex, 16)}km` : "";
        },
        hexTo100m: function(hex) {
            return hex ? `${parseInt(hex, 16) / 10}km` : "";
        },
        hexTo10m: function(hex) {
            return hex ? `${parseInt(hex, 16) * 10}m` : "";
        },
        hexTo_m: function(hex) {
            return hex ? `${parseInt(hex, 16)}m` : "";
        },
        hexTo_nm: function(hex) {
            return hex ? `${parseInt(hex, 16)}nm` : "";
        },
        hexToRate: function(hex) {
            return hex ? `${parseInt(hex, 16) / 10}Gbps` : "";
        },
        flagDecoder: function(element, table, not_table) {
            var list = []
            var flags = parseInt(element, 16)
            for(const [key, value] of Object.entries(table)) {
                if(flags & key) {
                    list.push(value)
                } else if(not_table && not_table[key]) {
                    list.push(not_table[key])
                }
            }
            return list;
        },
        table_identifier_values: function (hex) {
            var table = {
                "01":"GBIC",
                "02":"Module soldered to motherboard (ex: SFF)",
                "03":"SFP/SFP+/SFP28"
            }
            return hex ?  table[hex] ?? `See ${this.revision} Table 3.2` : "";
        },
        table_phy_device_identifier_value: function (hex) {
            var table = {
                "00":"GBIC definition is not specified or the GBIC definition is not compliant with a defined MOD_DEF. See product specification for details",
                "01":"GBIC is compliant with MOD_DEF 1",
                "02":"GBIC is compliant with MOD_DEF 2",
                "03":"GBIC is compliant with MOD_DEF 3",
                "04":"GBIC/SFP function is defined by serial ID only",
                "05":"GBIC is compliant with MOD_DEF 5",
                "06":"GBIC is compliant with MOD_DEF 6",
                "07":"GBIC is compliant with MOD_DEF 7",
            }
            return hex ?  table[hex] ?? `See ${this.revision} Table 3.3` : "";
        },
        table_connector_value: function (hex) {
            var table = {
                "00":"Unknown or unspecified",
                "01":"SC (Subscriber Connector)",
                "02":"Fibre Channel Style 1 copper connector",
                "03":"Fibre Channel Style 2 copper connector",
                "04":"BNC/TNC (Bayonet/Threaded Neill-Concelman)",
                "05":"Fibre Channel coax headers",
                "06":"Fiber Jack",
                "07":"LC (Lucent Connector)",
                "08":"MT-RJ (Mechanical Transfer - Registered Jack)",
                "09":"MU (Multiple Optical)",
                "21":"Copper pigtail",
                "22":"RJ45 (Registered Jack)"
            }
            return hex ?  table[hex] ?? `See ${this.revision} Table 3.4` : "";
        },
        table_encoding_value: function (hex) {
            var table = {
                "00":"Unspecified",
                "01":"8B/10B",
                "02":"4B/5B",
                "03":"NRZ",
                "04":"Manchester",
                "05":"SONET Scrambled",
                "06":"64B/66B",
            }
            return hex ?  table[hex] ?? `See ${this.revision} Table 3.6` : "";
        },
        table_real_time_diagnostic_and_control: function(hex) {
            var table = {
                128:"TX Disable State",
                64:"Soft TX Disable",
                32:"RS(1) State",
                16:"Rate Select State",
                8:"Soft Rate Select",
                4:"TX Fault",
                2:"LOS",
                1:"Data_Ready_Bar"
            }
            return hex ?  this.flagDecoder(hex, table)?.join(', ') : "";
        },
        table_alarm_and_warning: function(hex) {
            var table = [{
                128:"Temp High",
                64:"Temp Low",
                32:"Vcc High",
                16:"Vcc Low",
                8:"TX Bias High",
                4:"TX Bias Low",
                2:"TX Power High",
                1:"TX Power Low"
            },{
                128:"RX Power High",
                64:"RX Power Low",
            }]
            return hex ?  this.chunk(hex)?.flatMap((element, index) => this.flagDecoder(element, table[index]))?.join(', ') : "";          
        },
        table_diagnostic_monitoring_type: function(hex) {
            var table = {
                64:"Digital diagnostic monitoring implemented",
                32:"Internally calibrated",
                16:"Externally calibrated",
                8:"Received power measurement type: average power",
                4:"Address change required"
            }
            var not_table = {
                128:"Reserved for legacy diagnostic implementations",
                8:"Received power measurement type: OMA",
                4:"Address change required"
            }
            return hex ?  this.flagDecoder(hex, table, not_table)?.join(', ') : "";
        },
        table_enhanced_options: function(hex) {
            var table = {
                128:"Alarm/warning flags implemented for all monitored quantities",
                64:"Soft TX_DISABLE control and monitoring implemented",
                32:"Soft TX_FAULT monitoring implemented",
                16:"Soft RX_LOS monitoring implemented",
                8:"Soft RATE_SELECT control and monitoring implemented",
                4:"Application Select control implemented per SFF-8079",
                2:"Rate Select control implemented per SFF-8431"
            }
            return hex ?  this.flagDecoder(hex, table)?.join(', ') : "";
        },
        table_compliance: function(hex) {
            var table = {
                "00":"Digital diagnostic functionality not included or undefined.",
                "01":"Rev 9.3 of SFF-8472.",
                "02":"Rev 9.5 of SFF-8472.",
                "03":"Rev 10.2 of SFF-8472.",
                "04":"Rev 10.4 of SFF-8472.",
                "05":"Rev 11.0 of SFF-8472.",
                "06":"Rev 11.3 of SFF-8472.",
                "07":"Rev 11.4 of SFF-8472.",
                "08":"Rev 12.3 of SFF-8472.",
                "09":"Rev 12.4 of SFF-8472.",
            }
            return hex ?  table[hex] ?? "" : "";
        },
        table_extended_specification_compliance_codeds: function(hex) {
            var table = {
                "00":"Unspecified.",
                "01":"100G AOC (Active Optical Cable), retimed or 25GAUI C2M AOC. Providing a worst BER of 5 × 10-5.",
                "02":"100GBASE-SR4 or 25GBASE-SR.",
                "03":"100GBASE-LR4 or 25GBASE-LR.",
                "04":"100GBASE-ER4 or 25GBASE-ER.",
                "05":"100GBASE-SR10.",
                "06":"100G CWDM4.",
                "07":"100G PSM4 Parallel SMF.",
                "08":"100G ACC (Active Copper Cable), retimed or 25GAUI C2M ACC. Providing a worst BER of 5 × 10-5.",
                "09":"Obsolete (assigned before 100G CWDM4 MSA required FEC).",
                "0A":"Reserved.",
                "0B":"100GBASE-CR4, 25GBASE-CR CA-25G-L or 50GBASE-CR2 with RS (Clause91) FEC.",
                "0C":"25GBASE-CR CA-25G-S or 50GBASE-CR2 with BASE-R (Clause 74 Fire code) FEC.",
                "0D":"25GBASE-CR CA-25G-N or 50GBASE-CR2 with no FEC.",
                "0E":"10 Mb/s Single Pair Ethernet (802.3cg, Clause 146/147, 1000 m copper).",
                "10":"40GBASE-ER4.",
                "11":"4 x 10GBASE-SR.",
                "12":"40G PSM4 Parallel SMF.",
                "13":"G959.1 profile P1I1-2D1 (10709 MBd, 2km, 1310 nm SM).",
                "14":"G959.1 profile P1S1-2D2 (10709 MBd, 40km, 1550 nm SM).",
                "15":"G959.1 profile P1L1-2D2 (10709 MBd, 80km, 1550 nm SM).",
                "16":"10GBASE-T with SFI electrical interface.",
                "17":"100G CLR4.",
                "18":"100G AOC, retimed or 25GAUI C2M AOC. Providing a worst BER of 10-12 or below.",
                "19":"100G ACC, retimed or 25GAUI C2M ACC. Providing a worst BER of 10-12 or below.",
                "1A":"100GE-DWDM2 (DWDM transceiver using 2 wavelengths on a 1550 nm DWDM grid with a reach up to 80 km).",
                "1B":"100G 1550nm WDM (4 wavelengths).",
                "1C":"10GBASE-T Short Reach (30 meters).",
                "1D":"5GBASE-T.",
                "1E":"2.5GBASE-T.",
                "1F":"40G SWDM4.",
                "20":"100G SWDM4.",
                "21":"100G PAM4 BiDi.",
                "37":"10GBASE-BR (Clause 158).",
                "38":"25GBASE-BR (Clause 159).",
                "39":"50GBASE-BR (Clause 160).",
                "22":"4WDM-10 MSA (10km version of 100G CWDM4 with same RS(528,514) FEC in host system).",
                "23":"4WDM-20 MSA (20km version of 100GBASE-LR4 with RS(528,514) FEC in host system).",
                "24":"4WDM-40 MSA (40km reach with APD receiver and RS(528,514) FEC in host system).",
                "25":"100GBASE-DR (Clause 140), CAUI-4 (no FEC).",
                "26":"100G-FR or 100GBASE-FR1 (Clause 140), CAUI-4 (no FEC on host interface).",
                "27":"100G-LR or 100GBASE-LR1 (Clause 140), CAUI-4 (no FEC on host interface).",
                "28":"100GBASE-SR1 (802.3, Clause 167), CAUI-4 (no FEC on host interface).",
                "3A":"100GBASE-VR1 (802.3, Clause 167), CAUI-4 (no FEC on host interface).",
                "29":"100GBASE-SR1, 200GBASE-SR2 or 400GBASE-SR4 (802.3, Clause 167).",
                "36":"100GBASE-VR1, 200GBASE-VR2 or 400GBASE-VR4 (802.3, Clause 167).",
                "2A":"100GBASE-FR1 (802.3, Clause 140) or 400GBASE-DR4-2 (P802.3df, Clause 124).",
                "2B":"100GBASE-LR1 (802.3, Clause 140).",
                "2C":"100G-LR1-20 MSA, CAUI-4 (no FEC on host interface).",
                "2D":"100G-ER1-30 MSA, CAUI-4 (no FEC on host interface).",
                "2E":"100G-ER1-40 MSA, CAUI-4 (no FEC on host interface).",
                "2F":"100G-LR1-20 MSA.",
                "34":"100G-ER1-30 MSA.",
                "35":"100G-ER1-40 MSA.",
                "30":"Active Copper Cable with 50GAUI, 100GAUI-2 or 200GAUI-4 C2M. Providing a worst BER of 10-6 or below.",
                "31":"Active Optical Cable with 50GAUI, 100GAUI-2 or 200GAUI-4 C2M. Providing a worst BER of 10-6 or below.",
                "32":"Active Copper Cable with 50GAUI, 100GAUI-2 or 200GAUI-4 C2M. Providing a worst BER of 2.6x10-4 for ACC, 10-5 for AUI, or below.",
                "33":"Active Optical Cable with 50GAUI, 100GAUI-2 or 200GAUI-4 C2M. Providing a worst BER of 2.6x10-4 for AOC, 10-5 for AUI, or below.",
                "3F":"100GBASE-CR1, 200GBASE-CR2 or 400GBASE-CR4 (P802.3ck, Clause 162).",
                "40":"50GBASE-CR, 100GBASE-CR2, or 200GBASE-CR4.",
                "41":"50GBASE-SR, 100GBASE-SR2, or 200GBASE-SR4.",
                "42":"50GBASE-FR or 200GBASE-DR4.",
                "4A":"50GBASE-ER (IEEE 802.3, Clause 139).",
                "43":"200GBASE-FR4.",
                "44":"200G 1550 nm PSM4.",
                "45":"50GBASE-LR.",
                "46":"200GBASE-LR4.",
                "47":"400GBASE-DR4 (802.3, Clause 124), 400GAUI-4 C2M (Annex 120G).",
                "48":"400GBASE-FR4 (802.3, Clause 151).",
                "49":"400GBASE-LR4-6 (802.3, Clause 151).",
                "4B":"400G-LR4-10.",
                "4C":"400GBASE-ZR (P802.3cw, Clause 156).",
                "7F":"256GFC-SW4 (FC-PI-7P).",
                "80":"64GFC (FC-PI-7).",
                "81":"128GFC (FC-PI-8)."
            }
            return hex ?  table[hex] ?? "" : "";
        },
        asciiToHex: function(str) {
            return ([...str].map((_, n) => Number(str.charCodeAt(n)).toString(16)).join(''));
        },
        addHexPrefix: function(str, prefix = '0x') {
            if(this.isHexPrefixed(str, prefix)) return str;
            return `${prefix}${str}`;
        }
    }
};
</script>
<style scoped>
table td {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
}
</style>