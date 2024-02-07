---
title: D-LINK DPN-100 Rev C1
has_children: false
layout: default
parent: D-LINK
---

# Hardware Specifications

|                  |                                                          |
| ---------------- | -------------------------------------------------------- |
| Vendor/Brand     | D-LINK                                                   |
| Model            | DPN-100 Rev C1                                           |
| ODM              | CIG                                                      |
| ODM Product Code | [G-97S](/ont-cig-g-97s)                                  |
| Chipset          | Realtek RTL9601CI                                        |
| Flash            | 16MB                                                     |
| RAM              | 32MB                                                     |
| System           | Linux (Luna SDK 1.9.0)                                   |
| HSGMII           | ✅                                                       |
| Optics           | SC/APC                                                   |
| IP address       | 192.168.100.1                                            |
| Web Gui          |                                                          |
| SSH              |                                                          |
| Telnet           | ✅ user `root`, password `admin` (only on R4.2.104.033e) |
| Serial           |                                                          |
| Form Factor      | miniONT SFP                                              |

{% include image.html file="dpn-100-rev-c1.png"  alt="DPN-100 Rev C1" caption="DPN-100 Rev C1" %}

## List of software versions
- R4.2.104.033e (Wind - has telnet enabled)
- R4.2.104.039 (Wind - no telnet access)

## List of partitions

| dev  | size     | erasesize | name     |
| ---- | -------- | --------- | -------- |
| mtd0 | 00080000 | 00010000  | "Boot"   |
| mtd1 | 00180000 | 00010000  | "Config" |
| mtd2 | 00700000 | 00010000  | "ImageA" |
| mtd3 | 00700000 | 00010000  | "ImageB" |


{% include_relative ont-nokia-useful-command.md %}

# Miscellaneous Links

- [DLINK DPN-100 Ver:C1 uses RTL9601CI](https://github.com/Anime4000/RTL960x/issues/2)
