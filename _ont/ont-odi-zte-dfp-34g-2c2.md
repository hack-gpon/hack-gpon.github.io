---
title: ODI ZTE DFP-34G-2C2
description: Old model 2020 - v04
has_children: false
layout: default
parent: ODI
alias: Usourcetech UGP-N1S
---

# Hardware Specifications

|              |                                                 |
| ------------ | ----------------------------------------------- |
| Vendor/Brand | ODI                                             |
| Model        | DFP-34G-2C2                                     |
| CPU          | ZTE ZX279125                                    |
| CPU Clock    | 600Mhz                                          |
| Flash        | 16 MB                                           |
| RAM          | 32 MB                                           |
| System       | System ZTE Linux (based on Linux Kernel 2.6.32) |
| HSGMII       | No                                              |
| Optics       | SC/UPC                                          |
| IP address   | 192.168.1.1                                     |
| Web Gui      | ✅ user `admin`, password `admin`               |
| SSH          |                                                 |
| Telnet       | ✅ user `root`, password `Pon521`               |
| Serial       |                                                 |
| Form Factor  | miniONT SFP                                     |


{% include image.html file="zte-dfp-34x-2c2.jpg" alt="ODI ZTE DFP-34X-C2C" caption="ODI ZTE DFP-34X-C2C" %}
{% include image.html file="zte-dfp-34x-2c2_teardown_1.jpg" alt="ODI ZTE DFP-34X-C2C Teardown" caption="ODI DFP-34X-C2C Teardown" %}
{% include image.html file="zte-dfp-34x-2c2_teardown_2.jpg" alt="ODI ZTE DFP-34X-C2C Teardown" caption="ODI DFP-34X-C2C Teardown" %}

## List of software versions
- LX.X.V1.0.0

## List of partitions
 
| dev   | size     | erasesize | name             |
| ----- | -------- | --------- | ---------------- |
| mtd0  | 00800000 | 00001000  | "whole flash"    |
| mtd1  | 00040000 | 00001000  | "uboot"          |
| mtd2  | 00130000 | 00001000  | "kernel0"        |
| mtd3  | 00130000 | 00001000  | "kernel1"        |
| mtd4  | 00010000 | 00001000  | "others"         |
| mtd5  | 00010000 | 00001000  | "parameter tags" |
| mtd6  | 00060000 | 00001000  | "usercfg"        |
| mtd7  | 00270000 | 00001000  | "rootfs0"        |
| mtd8  | 00270000 | 00001000  | "rootfs1"        |


This stick supports dual boot. 

`kernel0` and `rootfs0` respectively contain the kernel and firmware of the first image, while `kernel1` and `rootfs1` respectively contain the kernel and the firmware of the second one

# Miscellaneous Links

- [GPON module Dfp-34g-2c2 sfp](https://forum.openwrt.org/t/gpon-module-dfp-34g-2c2-sfp/51641)
- [Ditch ONU, use GPON SFP on Business Grade Router, Mikrotik/Ubiquiti/pfSense (Home Networking)](https://forum.lowyat.net/topic/4925452)
- [Usage GPON module SFP in Spain](https://forum.mikrotik.com/viewtopic.php?t=116364&start=300)
- [For the new model ODI Realtek DFP-34X-C2C](/ont-odi-realtek-dfp-34x-2c2)
- [Usource GPON ONU STICK](https://www.usourcetech.com/web/userfiles/download/GPONSTICKSFPCLASSB-2B_Rev01.pdf)
