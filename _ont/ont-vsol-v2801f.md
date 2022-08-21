---
title: VSOL V2801F
has_children: false
layout: default
---

# Hardware Specifications

|             |                   |
| ----------- | ----------------- |
| Vendor      | VSOL              |
| Model       | V2801F            |
| Chipset     | Realtek RTL9601CI |
| Flash       | 8 MB              |
| RAM         | 64 MB             |
| System      | Linux (Luna SDK)  |
| HSGMII      | No                |
| Optics      | SC/APC            |
| IP address  |                   |
| Web Gui     | ✅                |
| SSH         | ✅                |
| Form Factor | miniONT SFP       |

## Firmware is interchangeable with:

- [VSOL V2801F](/ont-vsol-v2801f)
- [TWCGPON657](/ont-twcgpon657)
- [UFiber UF-Instant](/ont-ufiber-uf-instant) 

## List of software versions
## List of partitions
## List of firmwares and files

# Known Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

You should use the VID/VLAN shown by executing the command "omcicli mib get 84" via telnet to bring up PPPoE

# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [SFP GPON ONU](https://github.com/zry98/SFP-GPON-ONU)
