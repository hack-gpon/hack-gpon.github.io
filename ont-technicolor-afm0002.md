---
title: Technicolor AFM0002
has_children: false
parent: ONT
---

# Hardware Specifications

|             |                                                 |
| ----------- | ----------------------------------------------- |
| Vendor      | Technicolor                                     |
| Model       | AFM0002TIM/FWB/WND                              |
| Chipset     | Realtek RTL9601B                                |
| Flash       |                                                 |
| RAM         |                                                 |
| System      | Linux (Luna SDK)                                |
| HSGMII      | NO                                              |
| Optics      |                                                 |
| IP address  | 192.168.2.1 / 169.0.0.1                         |
| Web Gui     | Can be enabled, user `admin`, password `system` |
| SSH         | ✅ user `admin`, password `system`              |
| Form Factor | miniONT SFP                                     |

{% include image.html file="afm0002tim.jpg" alt="AFM0002TIM" caption="AFM0002TIM" %}

## Serial

Configuration: asc0=0 115200 8-N-1

# Hardware Revisions

- AFM0002TIM (IP address: 192.168.2.1)
- AFM0002FWB (IP address: 169.0.0.1)
- AFM0002WND

{% include alert.html content="The version used to obtain the info shown on this page is the AFM0002TIM" alert="Info"  icon="svg-info" color="blue" %}
{% include alert.html content="The AFM0002FWB can be transformed into AFM0002TIM. The AFM0002FWB has an older software version." alert="Warning"  icon="svg-warning" color="red" %}


# List of software versions
- V1_7_8_180122 
- V1_7_8_180725
- V1_7_8_181123
- V1_7_8_210412
- V1_7_8_210928

# List of partitions

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

`k0` and `r0` respectively contain the kernel and firmware of the first image, `k1` and `r1` the kernel and the firmware of the second one

# List of firmwares and files
## Useful files
- `/var/config/lastgood.xml` - Contains the user portion of the configuration
- `/var/config/lastgood-hs.xml` - Contains the "hardware" configuration (i.e. that _should_ not be changed)
- `/tmp/omcilog` - OMCI messages logs (must be enabeled, see below)

## Useful binaries
- `/etc/scripts/flash`  - Used to manipulate the config files in a samewhat safe manner
- `xmlconfig` - Used to low-level manipulate the XML config files. Called by `flash`
- `nv` - Used to manipulate the nvram storage, including persistent config entries via `nv setenv`/`nv getenv`
- `omcicli` - Used to interact with the running OMCI daemon
- `omci_app` - The OMCI daemon
- `diag` - Used to run low-level diagnostics commands on the stick

# Useful Commands

## Getting/Setting the ONT's S/N
```sh
# /etc/scripts/bin flash get GPON_SN
GPON_SN=TMBB00000000
# /etc/scripts/bin flash set GPON_SN TMBB0A1B2C3D
```

## Getting/Setting the ONT's PLOAM password

{% include alert.html content="The PLOAM password is stored in ASCII format" %}

```sh
# /etc/scripts/bin flash get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# /etc/scripts/bin flash set GPON_PLOAM_PASSWD AAAAAAAAAA
```

## Enabling the Web UI
```sh
# /bin/iptables -D INPUT -p tcp --dport 80 -j DROP
```

## Checking the currently active image
```sh
# nv getenv sw_active
sw_active=1
# nv getenv sw_version0
sw_version0=V1_7_8_210412
# nv getenv sw_version1
sw_version1=V1_7_8_210412
```

## Booting to a different image
```sh
# nv setenv sw_commit 0|1
# reboot
```

## Querying a particular OMCI ME
```sh
# omcicli mib get MIB_IDX
```

# Low Level Modding

{% include alert.html content="This section is based on `V1_7_8_210412` firmware version of the stick" %}


## Transfering files from/to the stick
Works with binary files too, just run md5sum on source and destination to make sure you are not corrupting anything...
From the stick to the PC:
```sh
# ssh admin@192.168.2.1 "cat /tmp/omcilog" > omcilog.log
```
From the PC to the stick
```sh
# cat lastgood.xml | ssh admin@192.168.2.1  "cat > /var/config/lastgood.xml"
```

{% include alert.html content="If a Windows system is used replace type with cat and run the commands from cmd (not Powershell)" %}

## Extracting and repacking the rootfs
{% include alert.html content="Make sure you run both commands as root, otherwise you might get a damaged rootfs image" alert="Warning" icon="svg-warning" color="red" %}

```sh
# unsquashfs mtd5.bin
# mksquashfs squashfs-root rootfs -b 131072 -comp lzma -no-recovery
```
## Flashing a new rootfs

{% include alert.html content="Only the inactive image can be flashed" %}

So mtd4/5 if you are on image1, mtd6/7 if you are on image0.

The follwing examples flashes a new rootfs to image1 and boots to it
```sh
# flash_eraseall /dev/mtd7
# cat /tmp/rootfs.new > /dev/mtd7
# nv setenv sw_commit=1
# reboot
```
## Adding support to configurable SW and HW versions, VENDOR ID and much more
`/etc/scripts/flash` can be flashed in order to add support for some variables implemented in `omci_app` but removed from `xmlconfig`. The patch is below (change the values to suit your needs)
```patch
--- squashfs-root/etc/scripts/flash     2021-09-28 10:38:52.000000000 +0200
+++ squashfs-root.new/etc/scripts/flash 2022-08-04 00:00:29.769605000 +0200
@@ -62,7 +62,26 @@
                if [ `echo $para | egrep $specific_mib_patten` ]; then
                        /bin/xmlconfig -g $para | sed -r "s/$rename_mib_name+/$2/g" | sed -r "s/,+//g"
                else
-                       /bin/xmlconfig -g $para | sed -r "s/$rename_mib_name+/$2/g"
+                       case "$para" in
+                               "OMCI_EQID")
+                                       echo "$para=MY_EQID"
+                                       ;;
+                               "OMCI_VENDOR_ID")
+                                       echo "$para=MY_VENDOR"
+                                       ;;
+                               "OMCI_SW_VER1")
+                                       echo "$para=MY_SW_VER1"
+                                       ;;
+                               "OMCI_SW_VER2")
+                                       echo "$para=MY_SW_VER2"
+                                       ;;
+                               "OMCI_ONT_VER")
+                                       echo "$para=MY_HW_VER"
+                                       ;;
+                               *)
+                                       /bin/xmlconfig -g $para | sed -r "s/$rename_mib_name+/$2/g"
+                                       ;;
+                       esac
                fi
                if [ "$?" = "0" ]; then
                        exit 0
```                        
## Increasing the length of the software version from 13 to 14 characters
`omci_app` has an hard-coded limit of 13 characters for the software version, which is too low. We can binary patch it to increase it to 14 (or more, if you dare/need)
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
(It's inside the function referecing the string `OMCI_SW_VER1`)

The original file md5sum is: `4aea2f72bacc11256b7e2c1583d2ad4f`
The patched file md5sum is: `da20327c4c002e4c27f82f6ee63dbc1a`
## Enabling PLOAM logging
```sh
/etc/scripts/bin flash set OMCI_DBGLVL 1
/etc/scripts/bin flash set OMCI_DBGLOGFILE 1
reboot
/bin/omcicli set logfile 1 ffffffff
```
1. The binary log will be placed inside: `/tmp/omcilog`
2. You can convert it into .pcap using https://github.com/ADeltaX/omcilog2pcap
3. You can then open it with Wireshark by installing the OMCI plugin from https://wiki.wireshark.org/Contrib.md
   
If you want to log everything since the stick boots, you can create a custom rootfs. Place the last command inside `etc/runomci.sh` as the last line of the file

# Known Bugs

# Miscellaneous Links

- [omcilog2pcap](https://github.com/ADeltaX/omcilog2pcap)
