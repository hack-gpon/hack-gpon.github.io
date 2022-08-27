---
title: CarlitoxxPro CPGOS03-0490 v2
has_children: false
layout: default
---

# Hardware Specifications

|             |                   |
| ----------- | ----------------- |
| Vendor      | CarlitoxxPro      |
| Model       | CPGOS03-0490 v2   |
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


# Known Bugs

- VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

- You should use the VID/VLAN shown by executing the command "omcicli mib get 84" via telnet to bring up PPPoE

# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)


