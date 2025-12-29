---
title: Nokia G-010G-D
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|                  |                                                                              |
| ---------------- | ---------------------------------------------------------------------------- |
| Vendor/Brand     | Nokia                                                                        |
| Model            | G-010G-D                                                                     |
| Chipset          | RTL9607FS                                                                    |
| Flash            | 256MB (SPI-NAND, Winbond 25N02KVZEIE)                                        |
| RAM              | 512MB                                                                        |
| System           | Linux (Realtek Unified SDK 2.2.0)                                            |
| 2.5GBaseT        | Yes                                                                          |
| Optics           | SC/APC                                                                       |
| IP address       | 192.168.1.254                                                                |
| Web Gui          | ✅ user `adminadmin`, password `ALC#FGU`                                     |
| SSH              | ✅ user `adminadmin`, password `ALC#FGU`, but has access to limited shell    |
| Telnet           |                                                                              |
| Serial           | ⚠️ (U-boot is password protected, Linux kernel disabled it after boot)       |
| Serial baud      | 115200                                                                       |
| Serial encoding  | 8-N-1                                                                        |
| Form Factor      | ONT                                                                          |

## List of software versions
- 3TN00816JJLJ25 

## List of partitions

| dev  | name     |
| ---- | -------- |
| mtd0 | "boot"   |
| mtd1 | "env"    |
| mtd2 | "env2"   |
| mtd3 | "RI"     |
| mtd4 | "binfo"  |
| mtd5 | "image0" |
| mtd6 | "image1" |
| mtd7 | "cfg"    |
| mtd8 | "cfg_bak" |
| mtd9 | "log"    |
| mtd10 | "extfs" |
| mtd11 | "mft_data" |

## Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the ONT’s shield.

## Photos

Front:

{% include image.html file="g-010g-d_front.jpg"  alt="Nokia G-010G-D Front" caption="Nokia G-010G-D Front" %}


Back:

{% include image.html file="g-010g-d_back.jpg"  alt="Nokia G-010G-D Back" caption="Nokia G-010G-D Back" %}


Front Internal:

{% include image.html file="g-010g-d_internal_1.jpg"  alt="Nokia G-010G-D Internal front-face with TTL Pinout" caption="Nokia G-010G-D Internal front-face with TTL Pinout" %}

Back Internal:

{% include image.html file="g-010g-d_internal_2.jpg"  alt="Nokia G-010G-D Internal Back" caption="Nokia G-010G-D Internal Back" %}


# Miscellaneous Links
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser)  for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
- [ispreview.co.uk](https://www.ispreview.co.uk/index.php/2022/09/pictured-openreachs-future-2-5gbps-ont-for-fttp-broadband.html)
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser) for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
