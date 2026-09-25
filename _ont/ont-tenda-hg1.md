---
title: Tenda HG1
has_children: false
layout: default
parent: Tenda
---

|                 |                                                                            |
| --------------- | -------------------------------------------------------------------------- |
| Vendor/Brand    | Tenda                                                                      |
| Model           | HG1                                                                        |
| CPU             | Realtek RTL9601D                                                           |
| DRAM            | 32 MB                                                                      |
| Flash Size      | 8 MB                                                                       |
| CPU Arch        | MIPSBE Realtek Lexra                                                       |
| CPU Clock       | 300MHz                                                                     |
| Bootloader      | U-Boot RSDK 2011                                                           |
| System          | Linux 2.6                                                                  |
| Optics          | SC/APC                                                                     |
| IP address      | 192.168.1.1/24                                                             |
| Web Gui         | ✅ user `admin`, password `admin`                                          |
| SSH             | ❌                                                                         |
| Telnet          | ✅                                                                         |
| FTP             | ❌                                                                         |
| Serial          | ✅                                                                         |
| Serial baud     | 115200                                                                     |
| Serial encoding | 8-N-1                                                                      | 
| Form Factor     | ONT                                                                        |

## Hardware Revisions

- V2.0 (Black Case)
- V3.0 (White Case)
 
# External/Internal Photo

{% include image.html file="tenda_hg1_v3_case.jpg" alt="Tenda HG1 v3.1" caption="Tenda HG1 v3.1" %}
{% include image.html file="tenda_hg1_v3_pcb.jpg" alt="Tenda HG1 v3.1 PCB" caption="Tenda HG1 v3.1 PCB" %}

## List of software versions

- V1.7.1
 
# List of partitions 

| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00001000  | "boot"          |
| mtd1  | 00002000 | 00001000  | "env"           |
| mtd2  | 00002000 | 00001000  | "env2"          |
| mtd3  | 0002c000 | 00001000  | "config"        |
| mtd4  | 00140000 | 00001000  | "k0"            |
| mtd5  | 00288000 | 00001000  | "r0"            |
| mtd6  | 00140000 | 00001000  | "k1"            |
| mtd7  | 00288000 | 00001000  | "r1"            |
| mtd8  | 00001000 | 00001000  | "Partition_008" |
| mtd9  | 00001000 | 00001000  | "Partition_009" |
| mtd10 | 00001000 | 00001000  | "Partition_010" |
| mtd11 | 00001000 | 00001000  | "Partition_011" |
| mtd12 | 00140000 | 00001000  | "linux"         |
| mtd13 | 00288000 | 00001000  | "rootfs"        |

This ONT supports dual boot. 

`k0` and `r0` respectively contain kernel and firmware of the first image, while `k1` and `r1` contain kernel and firmware of the second one.


{% include_relative ont-luna-sdk-useful-commands.md 
    flash='flash' 
    ploam='asciiAndHex' 
%}

# Advanced Configuration

## Enabling telnet
Default configuration restricts telnet to WAN interface only. To re-enable it new entry has to be added into `Admin -> ACL Configuration` or edited inside exported XML configuration by hand.

## Hidden Web Gui config page
Device has a hidden page `http://192.168.1.1/tddeviceinfo.asp` for configuring OMCI parameters, MAC and XPON switch.

OMCI equipment ID (ME 257) and OMCI hardware version (ME 256) are hardcoded into `/etc/version.sh` and `/bin/startup` requiring a firmware patch to change.

# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
