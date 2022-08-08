---
title: ODI DFP-34X-2C2
has_children: false
parent: ONT
---

# Hardware Specifications

|             |                  |
| ----------- | ---------------- |
| Vendor      | ODI              |
| Model       | DFP-34X-2C2      |
| Chipset     | Realtek RTL9601D |
| Flash       | 8 MB             |
| RAM         | 64 MB            |
| System      | Linux (Luna SDK) |
| HSGMII      | Yes              |
| Optics      | SC/APC           |
| IP address  |                  |
| Web Gui     | ✅               |
| SSH         | ✅               |
| Form Factor | miniONT SFP      |

{% include image.html file="odi.jpg" alt="ODI DFP-34X-2C2" caption="ODI DFP-34X-2C2" %}


## Firmware is interchangeable with:

- [ODI DFP-34X-2C2](ont-ODI-DFP-34X-2C2)
- [VSOL V2801F](ont-vsol-V2801F)
- [TWCGPON657](ont-TWCGPON657)
- [UFiber UF-Instant](ont-UFiber-UF-Instant) 
- [DFP-34X-2C2](ont-DFP-34X-2C2)
- [CarlitoxxPro CPGOS03-0490 v2](ont-CarlitoxxPro-CPGOS03-0490-v2)

## List of software versions
## List of partitions
## List of firmwares and files

# Known Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

You should use the VID/VLAN shown by executing the command "omcicli mib get 84" via telnet to bring up PPPoE

# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)


