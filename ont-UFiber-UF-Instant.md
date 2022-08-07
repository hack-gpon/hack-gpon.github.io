---
title: UFiber UF-Instant
has_children: false
parent: ONT
---

# Hardware Specifications

|             |                   |
| ----------- | ----------------- |
| Vendor      | UFiber            |
| Model       | UFiber UF-Instant |
| Alias       |                   |
| Chipset     | Realtek RTL9601CI |
| Flash       | 16 MB             |
| RAM         | 64 MB             |
| System      | Linux (Luna SDK)  |
| HSGMII      | No                |
| Optics      | SC/APC            |
| IP address  |                   |
| Web Gui     | ✅                |
| SSH         | ✅                |
| Form Factor | miniONT SFP       |

## Interchangeable firmware with

{% include warning.html content="UFiber UF-Instant can be used as universal GPON stick with V2801F rootfs, but only with stock UF kernel (4.3.1/4.4.2): needed for Laser controller." %}


- [VSOL V2801F](ont-vsol-V2801F)
- [TWCGPON657](ont-TWCGPON657)
- [UFiber UF-Instant](ont-UFiber-UF-Instant) 


## List of software version
## List of partition
## List of firmware and files
# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [UF INstant Mod](https://github.com/stich86/UF-Instant-Mod)

# Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

use VID/VLAN from command "omcicli mib get 84" via telnet to bring up PPPoE

