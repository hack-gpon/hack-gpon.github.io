---
title: CONBIC PMG3000-D20B-C
has_children: false
parent: CONBIC
---

# Hardware Specifications

|                  |                                                            |
| ---------------- | ---------------------------------------------------------- |
| Vendor/Brand     | CONBIC                                                     |
| Model            | PMG3000-D20B-C                                             |
| Chipset          | Faraday/Galachip C1601                                     |
| Flash            |                                                            |
| RAM              |                                                            |
| CPU              |                                                            |
| CPU Clock        |                                                            |
| Bootloader       |                                                            |
| System           |                                                            |
| Linux shell      |                                                            |
| SDK              |                                                            |
| SFP interfaces   |                                                            |
| Optics           | SC/APC                                                     |
| IP address       | 192.168.1.1                                                |
| Web Gui          | ✅ username `admin`, password `admin`                      |
| SSH              | ✅ username `root`, password `root`                        |
| Telnet           | ❌                                                         |
| Serial           |                                                            |
| Serial baud      |                                                            |
| Serial encoding  |                                                            |
| Form Factor      |                                                            |

<ImageFigure file="pmg3000-d20b-c.png" alt="PMG3000-D20B-C" caption="PMG3000-D20B-C" />

# GPON settings

## Setting ONU MAC Address
```sh
gccli sys mac 00:1A:2B:3C:4D:5E
gccli sys save
```

## Setting ONU GPON Serial Number
::: info Note
The S/N is stored in the ASCII format.
:::
```sh
gccli sys gponsn ALCLf0f0f0f0
gccli sys save
```
The GPON serial number may be set within the Web Gui, too.