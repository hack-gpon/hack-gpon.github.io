---
title: LEOX LXT-010H-D
has_children: false
layout: default
parent: LEOX
---

# Hardware Specifications

|                 |                                                                        |
| --------------- | ---------------------------------------------------------------------- |
| Vendor/Brand    | LEOX                                                                   |
| Model           | LXT-010H-D                                                             |
| Chipset         | Realtek RTL9601D                                                       |
| Flash           | SPI NOR 16MB                                                           |
| RAM             | 32MB                                                                   |
| System          | Linux 3.18 (Luna SDK 3.3)                                              |
| 2.5GBaseT       | Yes                                                                    |
| PHY Ethernet    | RTL8221B                                                               |
| Optics          | SC/APC                                                                 |
| IP address      | 192.168.100.1/24                                                       |
| Web Gui         | yes, same logins as Telnet                                             |
| SSH             |                                                                        |
| Telnet          | ✅ user `leox`, password `leolabs_7` OR user `adsl`, password `realtek` |
| Serial          | ✅                                                                      |
| Serial baud     | 115200                                                                 |
| Serial encoding | 8-N-1                                                                  |
| Form Factor     | ONT                                                                    |

# External Photos

{% include image.html file="ont-leox-lxt-010-h-d_top.jpg" alt="Leox LXT-010H-D Top" caption="Leox LXT-010H-D Top" %} 
{% include image.html file="ont-leox-lxt-010-h-d_bottom.jpg" alt="Leox LXT-010H-D Bottom" caption="Leox LXT-010H-D Bottom" %}

# Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface (see red square).

{% include image.html file="ont-leox-lxt-010-h-d_ttl.jpg" alt="Leox LXT-010H-D TTL Pinout" caption="Leox LXT-010H-D TTL Pinout" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

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

This ONT supports dual boot. 

`k0` and `r0` respectively contain kernel and firmware of the first image, while `k1` and `r1` contain kernel and firmware of the second one.

## List firmware version

- V3.3.2L6
- V3.3.2L7
- V3.3.2L8
- V3.3.2L8V ([Veip](/pptp_veip/) firmware)
- V3.3.2L9

{% include alert.html content="Before proceeding with any modification, make a backup of files rtl8290b.data and europa.data from /var/config folder. These files include optical calibration of your ONT's laser, if you accidentally delete or ruin them, your ONT will be unusable" alert="Note" icon="svg-warning" color="yellow" %}

{% include_relative ont-luna-sdk-useful-commands.md 
    ploam='ascii'
    flash='/etc/scripts/flash'
    customSwVersionAlert='This needs the `OMCI_OLT_MODE` value to be set to `21`. This will force the stick to use your own settings from the XML file, but this is a hack and causes sigsegv of `/bin/checkomci`.'
    omciOLT21='true'
%}


