---
title: T&W TWC GPON657
has_children: false
layout: default
parent: T&W
---

# Hardware Specifications

|             |                                    |
| ----------- | ---------------------------------- |
| Vendor      | T&W                                |
| Model       | TWC GPON657                        |
| Chipset     | Realtek RTL9601CI                  |
| Flash       | 16 MB                              |
| RAM         | 64 MB                              |
| System      | Linux (Luna SDK)                   |
| HSGMII      | Yes                                |
| Optics      | SC/APC                             |
| IP address  |                                    |
| Web Gui     | ✅ user `admin`, password `system` |
| SSH         | ✅ user `admin`, password `system` |
| Form Factor | miniONT SFP                        |

## Firmware is interchangeable with:

- [VSOL V2801F](/ont-vsol-v2801f)
- [UFiber UF-Instant](/ont-ufiber-uf-instant) 

## List of software versions
## List of partitions
## List of firmwares and files

- [Firmware repository by Anime4000](https://github.com/Anime4000/RTL960x/tree/main/Firmware/TWCGPON657)

The reccomended version are `C00R657V2801F_V1.9.0-220404.tar` because it is the V2801F for TWCGPON657


# Known Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

You should use the VID/VLAN shown by executing the command "omcicli mib get 84" via telnet to bring up PPPoE


# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [forum lowyat](https://forum.lowyat.net/topic/4925452/+460)

