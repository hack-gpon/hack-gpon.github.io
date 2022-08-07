---
title: VSOL V2801F
has_children: false
parent: ONT
---

# Hardware Specifications

|             |                   |
| ----------- | ----------------- |
| Vendor      | VSOL              |
| Model       | V2801F            |
| Alias       |                   |
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

## Interchangeable firmware with

- [VSOL V2801F](ont-vsol-V2801F)
- [TWCGPON657](ont-TWCGPON657)
- [UFiber UF-Instant](ont-UFiber-UF-Instant) 

## List of software version
## List of partition
## List of firmware and files
# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)

# Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

use VID/VLAN from command "omcicli mib get 84" via telnet to bring up PPPoE

