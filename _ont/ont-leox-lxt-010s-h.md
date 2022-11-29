---
title: Leox LXT-010S-H
has_children: false
layout: default
parent: Leox
---

# Hardware Specifications

|             |                                      |
| ----------- | ------------------------------------ |
| Vendor      | Leox                                 |
| Model       | LXT-010S-H                           |
| Chipset     | RTL9601CI                            |
| Flash       | 128MB                                |
| RAM         | 32MB                                 |
| System      | Linux 3.18 (Luna SDK 3.3)             |
| HSGMII      | ✅                                   |
| Optics      | SC/UPC                               |
| IP address  | 192.168.100.1/24                     |
| Web Gui     | ✅                                   |
| Telnet      | ✅ user `leox`, password `leolabs_7` |
| Form Factor | miniONT SFP                          |


## List of software versions
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

## Serial Console

The stick has a TTL 3.3v UART console (115200bps - 8Bit) that can be accessed from the top surface. To accept TX line commands, GND of TTL adapter should be attached to the stick's shield:

{% include image.html file="ont-leox-lxt-010s-h_ttl.jpg" alt="Leox LXT-010S-H TTL Pinout" caption="Leox LXT-010S-H TTL Pinout" %}

## List firmware version

- V3.3.4L3
- V3.3.4L4rc1 (contains fix for 2.5GbE mode)

# Useful Commands

## Change IP address
```sh
# /etc/scripts/flash get LAN_IP_ADDR
LAN_IP_ADDR=192.168.2.1
# /etc/scripts/flash set LAN_IP_ADDR 192.168.1.1
 ```

## Getting/Setting the ONT's S/N
```sh
# /etc/scripts/flash get GPON_SN
GPON_SN=LEOX00000000
# /etc/scripts/flash set GPON_SN TMBB0A1B2C3D
```

## Getting/Setting the ONT's PLOAM password

{% include alert.html content="The PLOAM password is stored in ASCII format" alert="Info" icon="svg-info" color="blue" %}

```sh
# /etc/scripts/flash get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# /etc/scripts/flash set GPON_PLOAM_PASSWD AAAAAAAAAA
```

## LAN SDS Mode (with firmware V3.3.4L4rc1):

|       mode           |             description              |
| -------------------- | ------------------------------------ |
| LAN_SDS_MODE = 1     | 1GbE with auto-neg on                |
| LAN_SDS_MODE = 7     | 1GbE with auto-neg off               |
| LAN_SDS_MODE = 8     | 2.5GbE with auto-neg off             |

to change the link mode use this command:

```sh
# /etc/scripts/flash get LAN_SDS_MODE
LAN_SDS_MODE=1
# /etc/scripts/flash set LAN_SDS_MODE 1
```

## Known Bugs

Stock firmware doesn't work @ 2.5GbE. There is a new firmware avaliable from LeoLabs that fix this issue


# Miscellaneous Links


