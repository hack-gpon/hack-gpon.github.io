---
title: LEOX LXT-010S-H
has_children: false
layout: default
parent: LEOX
---

# Hardware Specifications

|                  |                                         |
| ---------------- | --------------------------------------- |
| Vendor/Brand     | LEOX                                    |
| Model            | LXT-010S-H                              |
| ODM              | HiSense                                 |
| ODM Product Code | [LTE3415-SH+](/ont-hisense-lte3415-sh+) |
| Chipset          | Realtek RTL9601CI                       |
| Flash            | 128MB                                   |
| RAM              | 32MB                                    |
| System           | Linux 3.18 (Luna SDK 3.3)               |
| HSGMII           | Yes                                     |
| Optics           | SC/UPC                                  |
| IP address       | 192.168.100.1/24                        |
| Web Gui          | ✅                                      |
| SSH              |                                         |
| Telnet           | ✅ user `leox`, password `leolabs_7`    |
| Serial           | ✅                                      |
| Serial baud      | 115200                                  |
| Serial encoding  | 8-N-1                                   |
| Form Factor      | miniONT SFP                             |


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

`k0` and `r0` respectively contain the kernel and firmware of the first image, while `k1` and `r1` respectively contain the kernel and the firmware of the second one.

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the stick's shield:

{% include image.html file="ont-leox-lxt-010s-h_ttl.jpg" alt="Leox LXT-010S-H TTL Pinout" caption="Leox LXT-010S-H TTL Pinout" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

## List firmware version

{% include alert.html content="There is a new firmware avaliable from LeoLabs that fixes the 2.5GbE" alert="Note" icon="svg-info" color="blue" %}

- V3.3.4L3
- V3.3.4L4rc1 (Fix 2.5GbE HiSGMII)

{% include_relative ont-luna-sdk-useful-commands.md ploam='ascii' speedLan='178' customSpeedLanAlert='You need firmware `V3.3.4L4rc1` or higher. Before editing the speed make sure your hardware supports it. If you try to use any mode not listed here, stick will default to mode 1.' flash='/etc/scripts/flash' %}

# Known Bugs

The stock firmware doesn't work @ 2.5GbE. There is a new firmware avaliable from LeoLabs that fixes this issue.