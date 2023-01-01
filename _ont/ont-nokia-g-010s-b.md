---
title: Nokia G-010S-B
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|             |                                          |
| ----------- | ---------------------------------------- |
| Vendor      | Nokia                                    |
| Model       | G-010S-B                                 |
| Chipset     | Lantiq PEB98035                          |
| CPU         | MIPS 34Kc interAptiv                     |
| CPU Clock   | 400MHz                                   |
| Manufacter  | SourcePhotonics                          |
| Flash       | 16 MB (Macronix MX25L25635FZ2R-10G)      |
| RAM         | 64 MB (Winbond W9751G6KB-25I)            |
| System      | OpenWRT                                  |
| HSGMII      | Yes                                      |
| Optics      | SC/UPC                                   |
| IP address  | 192.168.1.10                             |
| Web Gui     | ✅ user `adminadmin`, password `ALC#FGU` |
| SSH         | ✅ user `ONTUSER`, password `SUGAR2A041` |
| Form Factor | miniONT SFP                              |

{% include image.html file="g-010s-b_teardown_1.jpg"  alt="G-010S-B Teardown" caption="G-010S-B Teardown" %}
{% include image.html file="g-010s-b_teardown_2.jpg"  alt="G-010S-B Teardown" caption="G-010S-B Teardown" %}



## List of partitions

| dev   | size     | erasesize | name          |
| ----- | -------- | --------- | ------------- |
| mtd0  | 00040000 | 00010000  | "uboot"       |
| mtd1  | 00080000 | 00010000  | "uboot_env"   |
| mtd2  | 00c00000 | 00010000  | "linux"       |
| mtd3  | 0013cedb | 00010000  | "kernel"      |
| mtd4  | 00ac3125 | 00010000  | "rootfs"      |
| mtd5  | 00600000 | 00010000  | "rootfs_data" |
| mtd6  | 00c00000 | 00010000  | "image1"      |
| mtd7  | 00200000 | 00010000  | "configfs"    |
| mtd8  | 00300000 | 00010000  | "logfs"       |
| mtd9  | 00200000 | 00010000  | "extfs"       |
| mtd10 | 00010000 | 00010000  | "ri"          |
| mtd11 | 00010000 | 00010000  | "sfp"         |
| mtd12 | 00010000 | 00010000  | "ribackup"    |
| mtd13 | 00010000 | 00010000  | "reserve"     |

## List of firmwares and files

## Serial

| USB TTL(UART) Adapter | SFP 20pins Molex connector |
| --------------------- | -------------------------- |
| 3.3V                  | pin #15 and #16            |
| TX                    | pin #2                     |
| RX                    | pin #7                     |
| GND                   | pin #10                    |

Configuration: asc0=0 115200 8-N-1

# HW Modding

- [Nokia G-010S-A Pin 6 Iusse - Rsaxvc.net](https://rsaxvc.net/blog/2020/8/15/Nokia_G-010S-A_Pin_6_Issue.html)

# Useful Commands

##  Disabling Dying Gasp
```sh
uci set gpon.gtc.nDyingGaspEnable='0'; uci commit gpon
```

# Known Bugs

# Miscellaneous Links

- [G-010S-A](https://github.com/hwti/G-010S-A)
- [Usage GPON module SFP in Spain](https://forum.mikrotik.com/viewtopic.php?t=116364&start=300)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)
- [Tech Info Depot Wiki](http://en.techinfodepot.shoutwiki.com/wiki/Nokia_G-010S-B)

