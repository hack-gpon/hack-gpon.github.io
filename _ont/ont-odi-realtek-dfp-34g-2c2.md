---
title: ODI Realtek DFP-34G-2C2 
description: New model 2022 - v05
has_children: false
layout: default
parent: ODI
---

# Hardware Specifications

|              |                                   |
| ------------ | --------------------------------- |
| Vendor/Brand | ODI                               |
| Model        | DFP-34G-2C2                       |
| Chipset      | Realtek RTL9601D                  |
| Flash        | 8 MB                              |
| RAM          | 64 MB                             |
| System       | Linux (Luna SDK 1.9)              |
| HSGMII       | Yes                               |
| Optics       | SC/UPC                            |
| IP address   | 192.168.1.1                       |
| Web Gui      | ✅ user `admin`, password `admin` |
| SSH          | ✅ user `admin`, password `admin` |
| Telnet       |                                   |
| Serial       |                                   |
| Form Factor  | miniONT SFP                       |

{% include alert.html content="SSH uses an outdated set of algorithms/ciphers, you can connect using the following command:" alert="Note"  icon="svg-info" color="blue" %}

```shell
ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 -oCiphers=+3des-cbc admin@192.168.1.1
```

{% include image.html file="realtek-dfp-34g-2c2.jpg" alt="ODI Realtek DFP-34X-C2C" caption="ODI Realtek DFP-34X-C2C" %}

## List of firmwares and files
- [Firmware repository by Anime4000](https://github.com/Anime4000/RTL960x/tree/main/Firmware/DFP-34X-2C2)

The reccomended version are `M114_sfp_ODI_Vlan_220414.tar`, `M114_sfp_ODI_hybrid_220527.tar` or `M114_sfp_ODI_hybrid_220916.tar` because it has working VLAN translation.  

## List of partitions
 
| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00001000  | "boot"          |
| mtd1  | 00002000 | 00001000  | "env"           |
| mtd2  | 00002000 | 00001000  | "env2"          |
| mtd3  | 0003c000 | 00001000  | "config"        |
| mtd4  | 0014c000 | 00001000  | "k0"            |
| mtd5  | 00274000 | 00001000  | "r0"            |
| mtd6  | 0014c000 | 00001000  | "k1"            |
| mtd7  | 00274000 | 00001000  | "r1"            |
| mtd8  | 00001000 | 00001000  | "Partition_008" |
| mtd9  | 00001000 | 00001000  | "Partition_009" |
| mtd10 | 00001000 | 00001000  | "Partition_010" |
| mtd11 | 00001000 | 00001000  | "Partition_011" |
| mtd12 | 0014c000 | 00001000  | "linux"         |
| mtd13 | 00274000 | 00001000  | "rootfs"        |

This stick supports dual boot. 

`k0` and `r0` respectively contain the kernel and firmware of the first image, while `k1` and `r1` respectively contain the kernel and the firmware of the second one

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. It's near the SFP header. TX, RX and ground pads need to be connected to a USB2TTL adapter supporting a logic level of 3.3V.

{% include image.html file="ont-odi-realtek-dfp-34x-2c2/ttl.jpg"  alt="DFP-34X-2C2 TTL Connection" caption="DFP-34X-2C2 TTL Connection" %}
{% include image.html file="ont-odi-realtek-dfp-34x-2c2/ttl-2.jpg"  alt="DFP-34X-2C2 TTL Pin" caption="DFP-34X-2C2 TTL Pin" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

{% include_relative ont-luna-sdk-useful-commands.md flash='flash' ploam='hex' customSwVersionAlert="This needs the `OMCI_OLT_MODE` value to be set to 3 and firmware 220530 or 220923 modded by @stich86 or if you don't want to replace firmware to change software version, set `OMCI_OLT_MODE` value to `21`. This will force to use your own settings from the XML file, but this is a hack and causes sigsegv of `/bin/checkomci`" speedLan='1234567' omciOLT21='true' %}

# Known Bugs

- Auto-sensing mode to switch between SGMII/HiSGMII

# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [Ditch ONU, use GPON SFP on Business Grade Router, Mikrotik/Ubiquiti/pfSense (Home Networking)](https://forum.lowyat.net/topic/4925452)
- [For the new model ODI ZTE DFP-34X-C2C](/ont-odi-zte-dfp-34x-2c2)


