---
title: Vantiva AFM0002 (formerly Technicolor AFM0002) 
has_children: false
layout: default
parent: Vantiva (formerly Technicolor)
alias: HiSense LTE3415-SCA+
---

# Hardware Specifications

|                  |                                                 |
| ---------------- | ----------------------------------------------- |
| Vendor/Brand     | Vantiva (formerly Technicolor)                  |
| Model            | AFM0002TIM/FWB/WND                              |
| ODM              | HiSense                                         |
| ODM Product Code | LTE3415-SCA+                                    |
| Chipset          | Realtek RTL9601B                                |
| Flash            | 32MB                                            |
| RAM              | 16MB                                            |
| System           | Linux (Luna SDK 1.9)                            |
| HSGMII           | No                                              |
| Optics           | SC/APC                                          |
| IP address       | 192.168.2.1 / 169.0.0.1                         |
| Web Gui          | Can be enabled, user `admin`, password `system` |
| SSH              | ✅ user `admin`, password `system`              |
| Telnet           |                                                 |
| Serial           | ✅                                              |
| Serial baud      | 115200                                          |
| Serial encoding  | 8-N-1                                           |
| Form Factor      | miniONT SFP                                     |
| Multicast        | ✅                                              |

{% include image.html file="afm0002tim.jpg" alt="AFM0002TIM" caption="AFM0002TIM" %}
{% include image.html file="afm0002fwb.jpg" alt="AFM0002FWB" caption="AFM0002FWB" %}

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the stick's shield:

{% include image.html file="ont-leox-lxt-010s-h_ttl.jpg" alt="Vantiva (formerly Technicolor) AFM0002 TTL Pinout" caption="Vantiva (formerly Technicolor) AFM0002 TTL Pinout" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

## Hardware Revisions

- AFM0002TIM (IP address: 192.168.2.1)
- AFM0002FWB (IP address: 169.0.0.1)
- AFM0002WND (IP address: 169.0.0.1)

{% include alert.html content="The version used to obtain the info shown on this page is the AFM0002TIM" alert="Info"  icon="svg-info" color="blue" %}
{% include alert.html content="The AFM0002FWB can be transformed into AFM0002TIM. Usually AFM0002FWBs have older software." alert="Warning"  icon="svg-warning" color="red" %}


## List of software versions
- V1.7.6-170626 (FWB & WND)
- V1_7_8_180122 
- V1_7_8_180725
- V1_7_8_181123
- V1_7_8_210412
- V1_7_8_210928

## List of partitions

| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00001000  | "boot"          |
| mtd1  | 00002000 | 00001000  | "env"           |
| mtd2  | 00002000 | 00001000  | "env2"          |
| mtd3  | 0003c000 | 00001000  | "config"        |
| mtd4  | 00300000 | 00001000  | "k0"            |
| mtd5  | 004c0000 | 00001000  | "r0"            |
| mtd6  | 00300000 | 00001000  | "k1"            |
| mtd7  | 004c0000 | 00001000  | "r1"            |
| mtd8  | 00001000 | 00001000  | "Partition_008" |
| mtd9  | 00001000 | 00001000  | "Partition_009" |
| mtd10 | 00001000 | 00001000  | "Partition_010" |
| mtd11 | 00001000 | 00001000  | "Partition_011" |
| mtd12 | 00300000 | 00001000  | "linux"         |
| mtd13 | 004c0000 | 00001000  | "rootfs"        |

This stick supports dual boot. 

`k0` and `r0` respectively contain kernel and firmware of the first image, while `k1` and `r1` contain kernel and firmware of the second one.

{% include_relative ont-luna-sdk-useful-commands.md 
	flash='/etc/scripts/flash'
	ploam='ascii'
	lastgoodHs=true
	flashSwVersion=true 
	customSwVersionAlert="This needs the `/etc/scripts/flash` modded"
	customHwVersionAlert="This needs the `/etc/scripts/flash` modded"
	customVendorAlert="This needs the `/etc/scripts/flash` modded"
	customEquipAlert="This needs the `/etc/scripts/flash` modded"
%}

## Enabling the Web UI
```sh
# /bin/iptables -D INPUT -p tcp --dport 80 -j DROP
```

## Transfering files from/to the stick
Works with binary files too, just run md5sum on source and destination to make sure you are not corrupting anything...
From the stick to the PC:
```sh
# ssh admin@192.168.2.1 "cat /tmp/omcilog" > omcilog.log
```
From the PC to the stick:
```sh
# cat lastgood.xml | ssh admin@192.168.2.1  "cat > /var/config/lastgood.xml"
```

{% include alert.html content="If a Windows system is used replace type with cat and run the commands from cmd (not Powershell)" alert="Info" icon="svg-info" color="blue" %}

## Extracting and repacking the rootfs
{% include alert.html content="Make sure you run both commands as root, otherwise you might get a damaged rootfs image" alert="Warning" icon="svg-warning" color="red" %}

```sh
# unsquashfs mtd5.bin
# mksquashfs squashfs-root rootfs -b 131072 -comp lzma -no-recovery
```
## Flashing a new rootfs

{% include alert.html content="Only the inactive image can be flashed, change sw_versionX and sw_commit X based on the bank you have flashed" alert="Info" icon="svg-info" color="blue" %}

Flash mtd4/5 if you are on image1, mtd6/7 if you are on image0.

The following commands are used to flash a new rootfs to image1 and then boot to it
```sh
# flash_eraseall /dev/mtd7
# cat /tmp/rootfs.new > /dev/mtd7
# nv setenv sw_version1 NEW_SOFTWARE_VERSION
# nv setenv sw_commit 1
# reboot
```

{% include alert.html content="This section is based on the `V1_7_8_210412` version of the stick's firmware " alert="Info" icon="svg-info" color="blue" %}

## Adding support to configurable SW and HW versions, Vendor ID and equipment ID
`/etc/scripts/flash` can be modified in order to add support for some variables implemented in `omci_app` but removed from `xmlconfig`. The modified file is below.

`flash set` will still print an error but the change wil be persisted. You can check that by running the relative `flash get` command

```sh
#!/bin/ash
#
# usage: flash.sh [cmd] ...
#

DEFAULT_FILE="/etc/config_default.xml"
DEFAULT_HS_FILE="/etc/config_default_hs.xml"
LASTGOOD_FILE="/var/config/lastgood.xml"
LASTGOOD_HS_FILE="/var/config/lastgood_hs.xml"

# for array type in hw_setting
specific_mib_patten="(^HW(_|_WLAN0_|_WLAN1_)TX_POWER*)|(^HW_FON_KEYWORD$)"

rename_mib_patten="^HW_(NIC[0-1]|WLAN[0-1]_WLAN)_ADDR"
rename_mib_name="ELAN_MAC_ADDR"

hw_mib="^HW_|^SUPER_NAME$|^SUPER_PASSWORD$|^BOOT_MODE$|^ELAN_MAC_ADDR#|^WLAN_MAC_ADD$|^WAN_PHY_PORT$|^WIFI_SUPPORT$|^BYTE$|^WORD$|^DWORD$|^INT1$|^INT2$"
var=""


case "$1" in
  "all")
#  	echo "------ [$1] Display all settings ------"
  	if [ $# -eq 1 ] || [ "$2" = "hs" ]; then
  		/bin/xmlconfig -os -hs
	fi
	if [ $# -eq 1 ] || [ "$2" = "cs" ]; then
	        /bin/xmlconfig -os
	fi
	exit 0
  	;;
  "default")
#  	echo "------ [$1] Restore to default configurationg ------"
  	if [ "$2" = "cs" ]; then
		/bin/xmlconfig -def_mib
		/bin/xmlconfig -if $DEFAULT_FILE -nodef && /bin/xmlconfig -of $LASTGOOD_FILE
		echo "Reset CS to default configuration success."
	elif [ "$2" = "hs" ]; then
		/bin/xmlconfig -def_mib -hs
		/bin/xmlconfig -if $DEFAULT_HS_FILE -nodef && /bin/xmlconfig -of $LASTGOOD_HS_FILE
		echo "Reset HS to default configuration success."
	elif [ "$2" = "voip" ]; then
		/bin/xmlconfig -def_voip_mib
		/bin/xmlconfig -of $LASTGOOD_FILE
		echo "Reset VoIP to default configuration success."
	else
		echo "Restore to default configurationg fail."	
		/bin/sh $0 -h
		exit 1
	fi
	echo "Please reboot system."
	exit 0
	;;
  "get" | "gethw")
# 	echo "------ [$1] Get a specific mib parameter from flash memory. ------"
	if [ "$2" != "" ]; then
		para=$2
		if [ `echo $para | egrep $rename_mib_patten` ]; then
			para=$rename_mib_name
		fi
		#echo "/bin/xmlconfig -g $para"
		if [ `echo $para | egrep $specific_mib_patten` ]; then
			/bin/xmlconfig -g $para | sed -r "s/$rename_mib_name+/$2/g" | sed -r "s/,+//g"
		else
			local_nv_getenv=`nv getenv $para`
			if [ -z "${local_nv_getenv}" ]; then
				/bin/xmlconfig -g $para | sed -r "s/$rename_mib_name+/$2/g"
			else
				echo "${local_nv_getenv}" | sed -r "s/$rename_mib_name+/$2/g"
			fi
		fi
		if [ "$?" = "0" ]; then
			exit 0
		fi
	else
		/bin/sh $0 -h
		exit 1
	fi
	;;
  "set" | "sethw")
 # 	echo "------ [$1] Set a specific mib parameter into flash memory. ------"
  	if [ "$2" != "" ] && [ "$3" != "" ]; then
		para=$2
		if [ `echo $para | egrep $rename_mib_patten` ]; then
			$para=$rename_mib_name
		fi

		if [ $# -eq 3 ]; then
			var=$3
		else
			while [ $# -ge 3 ]
			do
				# for multiple decimal values: dec2hex and concatenate all setting value
				if [ "$3" = "08" ] || [ "$3" = "09" ]; then
					# 08 & 09 are not invalid octal number
					var=$var$3
				else
					var=$var`printf "%02x" $3`
				fi

				shift
				if [ $# -ge 3 ]; then var=$var","; fi
			done
		fi
		#echo "/bin/xmlconfig -s $para $var"

		/bin/xmlconfig -s $para $var | egrep "[ERR]"
		if [ $? == 0 ]; then
			nv setenv $para $var
		else
			# Clear the ovveride from nv if it is there since we wrote it to xmlconfig
			nv setenv $para
		fi
		if [ "`echo $2 | egrep $hw_mib`" = "" ]; then
			/bin/xmlconfig -of $LASTGOOD_FILE
		fi
  		/bin/xmlconfig -of -hs $LASTGOOD_HS_FILE && exit 0
	else
		/bin/sh $0 -h
		exit 1
	fi
	;;
  "-h")
		echo 'Usage: flash.sh [cmd]'
		echo 'cmd:'
		echo '  all <cs/hs>               : Show all settings.'
		echo '  default <cs/hs>           : Restore to default configuration.'
		echo '  get MIB-NAME              : get a specific mib parameter from flash memory.'
		echo '  set MIB-NAME MIB-VALUE    : set a specific mib parameter into flash memory.'
		echo 
		echo '  Note: When set the MIB_ARRAY or MIB_VALUE overflowed,'
		echo '        xmlconfig will truncate the redundant part.'
		echo '        Take signed integer for example:'
		echo '        1. Set value=-6442450944(0xfffffffe80000000),'
		echo '           and get value=-2147483648(0x80000000)'
		echo '        2. Set value=-2147483649(0xffffffff7fffffff),'
		echo '           and get value=2147483647(0x7fffffff)'
		echo '        3. Set value=2147483648(0x80000000),'
		echo '           and get value=-2147483648(0x80000000)'
		echo '        4. Set value=4294967296(0x100000000), and get value=0(0x0)'
		echo 
	;;
  *)
  	/bin/sh $0 -h
		exit 1
	;;
esac

```                        
## Increasing the length of the software version from 13 to 14 characters
`omci_app` has a hard-coded limit of 13 characters for the software version, which is too low. We can binary patch it to increase it to 14 (or more, if you dare/need)
```
JVhEWjAwNCUAAAAIAAgACAAAAAAAAAAAAAAAAAAAAABvbWNpX2FwcG9tY2lfYXBwH4sIAAAAAAAA
AwMAAAAAAAAAAAAfiwgAAAAAAAADY2BoYGZgYFjh9Uq/aNcZQdXsOh3R5ktr/fd0sTEwcuTnJmfG
JxYUYJVlZGAA0gCHsMK2QQAAAAAAAEQlWERaMDA0JQ==
```
Save it as `omci_app.xdelta.base64`, then run:	
```sh
# base64 -d omci_app.xdelta.base64 > omci_app.xdelta
# xdelta patch omci_app.xdelta bin/omci_app bin/omci_app.new
# mv bin/omci_app.new bin/omci_app
```
For reference, the patch changes the follwing section of the omci_app:
```diff
-00408c24 24 05 00 0e     li         a1,0xe
+00408c24 24 05 00 0f     li         a1,0xf
-00408cf0 24 05 00 0f     li         a1,0xe
+00408cf0 24 05 00 0f     li         a1,0xf
```
(It's inside the function referencing the string `OMCI_SW_VER1`)

The original file md5sum is: `4aea2f72bacc11256b7e2c1583d2ad4f`
The patched file md5sum is: `da20327c4c002e4c27f82f6ee63dbc1a`

## Enabling PLOAM logging

```sh
/etc/scripts/flash set OMCI_DBGLVL 1
/etc/scripts/flash set OMCI_DBGLOGFILE 1
reboot
/bin/omcicli set logfile 1 ffffffff
```
1. The binary log will be placed inside: `/tmp/omcilog`
2. You can convert it into a .pcap file using [omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap)
3. You can then open it with Wireshark by installing this OMCI plugin from [GitHub](https://github.com/hack-gpon/omci-wireshark-dissector)
   
If you want to log everything since the stick boots, you can create a custom rootfs. Place the last command inside `etc/runomci.sh` as the last line of the file

# Known Bugs

# Miscellaneous Links

- [omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap)
