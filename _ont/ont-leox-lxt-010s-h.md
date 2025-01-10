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
| Optics           | SC/UPC or SC/APC                        |
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

`k0` and `r0` respectively contain kernel and firmware of the first image, while `k1` and `r1` contain kernel and firmware of the second one.

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the stick's shield:

{% include image.html file="ont-leox-lxt-010s-h_ttl.jpg" alt="Leox LXT-010S-H TTL Pinout" caption="Leox LXT-010S-H TTL Pinout" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

## List firmware version

{% include alert.html content="There is a new firmware provided by LeoLabs that fixes issues with the stick operating at 2.5GbE speeds" alert="Note" icon="svg-info" color="blue" %}

- V3.3.4L3
- V3.3.4L4rc1 (Fix 2.5GbE HiSGMII)
- V3.3.4L4rc5
- V3.3.4L4 (Added failover from 2.5GbE to 1GbE, other fixes)
- V3.3.4L4V (Same as V3.3.4L4 but should be used for VEIP profiles)
- V3.3.4L5rc1 - This version adds "auto-negotiation" capability to the stick. It always prefers 1G (to keep the stick consistently accessible). When you force the link to 2.5G (disabling auto-negotiation), it takes at least 40 seconds to establish the connection.
- V3.3.4L6 (Build date: 2024-06-27 16:43:48)

{% include_relative ont-luna-sdk-useful-commands.md 
    ploam='ascii'
    speedLan='18'
    customSpeedLanAlert='Firmware version `V3.3.4L4rc1` or higher is required. Before editing the speed make sure your hardware supports it. If you try to use any mode not listed here, the stick will default to mode 1.'
    flash='/etc/scripts/flash'
    customSwVersionAlert='This needs the `OMCI_OLT_MODE` value to be set to `21`. This will force the stick to use your own settings from the XML file, but this is a hack and causes sigsegv of `/bin/checkomci`.'
    omciOLT21='true' %}

# Known Bugs

The stock firmware doesn't work at 2.5GbE. There is a new firmware provided by LeoLabs that fixes this issue.
