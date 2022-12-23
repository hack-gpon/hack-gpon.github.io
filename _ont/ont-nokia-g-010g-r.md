---
title: Nokia G-010G-R
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|             |                                                                     |
| ----------- | ------------------------------------------------------------------- |
| Vendor      | Nokia                                                               |
| Model       | G-010G-R                                                            |
| Manufacter  | CIG G-97C                                                           |
| Chipset     | RTL9601D                                                            |
| Flash       | 16MB                                                                |
| RAM         | 32MB                                                                |
| System      | Linux (Luna SDK 1.9.0)                                              |
| HSGMII      | ✅                                                                  |
| Optics      | SC/APC                                                              |
| IP address  | 192.168.100.1  (factory reseted unit use IP 10.89.42.157/16)        |
| Web Gui     | ✅ user `admin`, password `1234`                                    |
| Telnet      | ✅ user `admin`, password `1234`, but open GponCLI and not GponSLID |
| SSH         |                                                                     |
| Form Factor | ONT                                                                 |

## List of software versions
- 3FE49717AOCK12 

## List of partitions

| dev  | size     | erasesize | name     |
| ---- | -------- | --------- | -------- |
| mtd0 | 00040000 | 00001000  | "Boot"   |
| mtd1 | 00002000 | 00001000  | "Config" |
| mtd2 | 00002000 | 00001000  | "ImageA" |
| mtd3 | 0003c000 | 00001000  | "ImageB" |

# Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface.

{% include_relative ont-nokia-use.md %}

{% include_relative ont-nokia-userful-command.md %}

# Miscellaneous Links
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser)  for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
- [ispreview.co.uk](https://www.ispreview.co.uk/index.php/2022/09/pictured-openreachs-future-2-5gbps-ont-for-fttp-broadband.html)
