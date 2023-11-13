---
title: Nokia G-010G-R
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|                  |                                                                              |
| ---------------- | ---------------------------------------------------------------------------- |
| Vendor/Brand     | Nokia                                                                        |
| Model            | G-010G-R                                                                     |
| ODM              | CIG                                                                          |
| ODM Product Code | G-97C                                                                        |
| Chipset          | RTL9601B                                                                     |
| Flash            | 16MB                                                                         |
| RAM              | 32MB                                                                         |
| System           | Linux (Luna SDK 1.9.0)                                                       |
| 2.5GBaseT        | No                                                                           |
| Optics           | SC/APC                                                                       |
| IP address       | 192.168.100.1  (after a factory reset the ONT uses 10.89.42.157/16)          |
| Web Gui          | ✅ user `admin`, password `1234`                                             |
| SSH              |                                                                              |
| Telnet           | ✅ user `admin`, password `1234`, but has access to GponSLID and not GponCLI |
| Serial           | ✅                                                                           |
| Serial baud      | 115200                                                                       |
| Serial encoding  | 8-N-1                                                                        |
| Form Factor      | ONT                                                                          |

## List of software versions
- 3FE49717AOCK12 

## List of partitions

| dev  | size     | erasesize | name     |
| ---- | -------- | --------- | -------- |
| mtd0 | 00040000 | 00001000  | "Boot"   |
| mtd1 | 00002000 | 00001000  | "Config" |
| mtd2 | 00002000 | 00001000  | "ImageA" |
| mtd3 | 0003c000 | 00001000  | "ImageB" |


## Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the ONT’s shield like the below photo:
{% include image.html file="g-010g-r_serial_pinouts.jpg"  alt="Nokia G-010G-R Ports" caption="Nokia G-010G-R Ports" %}

{% include_relative ont-nokia-use.md username="ONTUSER" %}

{% include_relative ont-nokia-useful-command.md %}

# Miscellaneous Links
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser)  for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
- [ispreview.co.uk](https://www.ispreview.co.uk/index.php/2022/09/pictured-openreachs-future-2-5gbps-ont-for-fttp-broadband.html)
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser) for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
