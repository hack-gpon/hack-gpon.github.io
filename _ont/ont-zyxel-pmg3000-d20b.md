---
title: Zyxel PMG3000-D20B
has_children: false
alias: Ziza OP151S, T&W TW2362H-CDEL
layout: default
---

# Hardware Specifications

|             |                                                  |
| ----------- | -----------------------------------------------  |
| Vendor      | Zyxel                                            |
| Model       | PMG3000-D20B                                     |
| Chipset     | Lantiq PEB98035                                  |
| Flash       | 8 MB                                             |
| RAM         | 64 MB                                            |
| System      | OpenWRT                                          |
| HSGMII      | Yes                                              |
| Optics      | SC/APC                                           |
| IP address  | 10.10.1.1                                        |
| Web Gui     | ✅ username `admin` or `guest`, password `1234` or `guest` |
| SSH         | ✅ username `admin`, password `admin` |
| Form Factor | miniONT SFP                                      |

{% include image.html file="pmg3000-d20b.png" alt="PMG3000-D20B" caption="PMG3000-D20B" %}
{% include image.html file="op151s.png" alt="Ziza OP151S" caption="Ziza OP151S" %}

Once you access the stick via ssh you will be presented with a second tier login. The credentials to access the zyxel shell are: username: `twmanu` , password: `twmanu`.
From the zyxel shell you can move to a standard linux shell via the `linuxshell` command

## Firmware is interchangeable with:

- [Halny HL-GSFP](/ont-halny-hl-gsfp)
- [D-LINK DPN-100-Rev-A2](/ont-d-link-dpn-100-rev-a2)
- [Ziza OP151s](/ont-ziza-op151s)
- [T&W TW2362H-CDEL](/ont-t-w-tw2362h-cdel)

# List of software versions

# List of partitions
 
| dev  | size     | erasesize | name           |
| ---- | -------- | --------- | -------------- |
| mtd0 | 00060000 | 00010000  | "Boot"         |
| mtd1 | 00010000 | 00010000  | "Env"          |
| mtd2 | 00390000 | 00010000  | "ImageA"       |
| mtd3 | 00390000 | 00010000  | "ImageB"       |
| mtd4 | 00060000 | 00010000  | "Config"       |
| mtd5 | 00010000 | 00010000  | "SECTION_EGIS" |
| mtd6 | 00250000 | 00010000  | "rootfs"       |
| mtd7 | 00020000 | 00010000  | "rootfs_data"  |


This stick supports dual boot, as visible from the presence of `ImageA` and `ImageB`, which contain the rootfs.


# List of firmwares and files
## Useful files
- `/var/config/ont.sys` used to customize various settings on the stick. If you don't have it you can copy the stock one from /ont.sys

# Useful Commands
{% include alert.html content="all commands start from the twmanu shell." alert="Note"  icon="svg-info" color="blue" %}

## Changing the ONT's S/N
{% include alert.html content="the S/N is stored in the ASCII format." alert="Note"  icon="svg-info" color="blue" %}
```sh
manufactory
set sn ALCLf0f0f0f0
exit
hal
set sn ALCLf0f0f0f0
```

## Changing the ONT's PLOAM password
{% include alert.html content="the PLOAM is stored in the ASCII format." alert="Note"  icon="svg-info" color="blue" %}
This can be done easily via web ui. If you prefer to do it via the shell use:
```sh
hal
set password PLOAMPASS
```

## Changing the ONT's equipment ID
{% include alert.html content="model number must be 20 no more than chars total." alert="Note"  icon="svg-info" color="blue" %}
```sh
manufactory
set equipment id MYEQUIPMENTID
exit
omci
equipment id MYEQUIPMENTID
```

## Changing the ONT's hardware version
```sh
manufactory
set hardware version 3FE49165BFAA01
```

## Changing the software version
Edit the /var/config/ont.sys via vi directly on the stick itself. The file is CRLF terminated, one entry per line.
The entries for the software version are:
```
SW_VER0:0xabcdef
SW_VER1:0xabcedf
```
{% include alert.html content="it's better to enter the software version in hex format, all lowercase precedeed by 0x." alert="Note"  icon="svg-info" color="blue" %}

## See link speed
This SFP have HSGMII enabled by default, link_status=`5` HSGMII 2.5Gbit, link_status=`4` SGMII 1Gbit:
```
linuxshell
onu lanpsg 0
```

## Connection state
To see the connection state use this command, curr_state=`5` O5 state, curr_state=`1` all states other than O5:
```
linuxshell
onu ploamsg
```
## Querying a particular OMCI ME
Query via OMCI ME Class Name
```sh
omci
show me classname OmciClassName (e.g Ont2g)
```

Query via OMCI ME ID
```sh
omci
show me classid OmciClassId (e.g 7)
```


# Low Level Modding

## Creating a new rootfs
The stick has a tricky image packing method, fortunately it has been reverse engineered. A script to help you create a custom rootfs can be found here: [https://github.com/nanomad/zyxel-pmg-3000-mod-kit](https://github.com/nanomad/zyxel-pmg-3000-mod-kit)

## Flashing a new rootfs
{% include alert.html content="all commands start from the twmanu shell." alert="Note"  icon="svg-info" color="blue" %}

- Transfer the new mtd on the stick via tftp
```
linuxshell
tftp -gr mtd2.mod.bin TFTP_SERVER_IP
```
- Flash it on the standby partition. 
You can use `system` and then `show actimage` to get the current active image. Check `/proc/mtd` for the right mtds. Usually:
- if the currect active image is A the mtd in use is mtd2
- If the current active image is B the mtd in use is mtd3
```
linuxshell
mtd -e /dev/mtd2 write /tmp/mtd2.mod.bin /dev/mtd2
```
- Switch to the new image
```
system
set actimage a
```
- Reboot the ONT
```
system
reboot
```

# Reset Web Gui admin credentials

Sometimes, under certain circumstances, the Web Gui admin credentials might get changed from the default `admin`/`1234` combination.
To restore the default combination you can try following [this method](https://github.com/xvzf/zyxel-gpon-sfp/issues/6#issuecomment-1065864650).

# Known Bugs
- [Not working with Broadcom BCM57810S](https://github.com/xvzf/zyxel-gpon-sfp/issues/10)
- Issue on IPv6 discovery. But we are not sure if is a edge case of a particular ISP or not
- [Some stick have a custom password](https://github.com/xvzf/zyxel-gpon-sfp/issues/6)
- fw_setenv command doesn't work

# Miscellaneous Links

- [zyxel gpon- sfp](https://github.com/xvzf/zyxel-gpon-sfp)
- [zyxel pmg-3000 mod kit](https://github.com/nanomad/zyxel-pmg-3000-mod-kit)
