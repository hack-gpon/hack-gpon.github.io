---
title: TWCGPON657
has_children: true
parent: ONT
---

# TWCGPON657

## Hardware Specifications

|          |               |
|----------|---------------|
| Vendor   |          |
| Model    |  TWCGPON657      |
| Alias | |
| Chipset  | Realtek RTL9601CI |
| Flash | 16 MB |
| RAM | 64 MB |
| System | Linux (Luna SDK) |
| HSGMII | Yes |
| Optics | SC/APC |
| IP address |   |
| Web Gui | ✅ |
| SSH | ✅ |
| Form Factor | miniONT SFP |

### Interchangeable firmware with

- [ODI DFP-34X-C2C]({{ site.baseurl }}{% link ont-ODI-DFP-34X-C2C.md %})
- [VSOL V2801F]({{ site.baseurl }}{% link ont-vsol-V2801F.md %})
- [TWCGPON657]({{ site.baseurl }}{% link ont-TWCGPON657.md %})
- [UFiber UF-Instant]({{ site.baseurl }}{% link ont-UFiber-UF-Instant.md %}) can be used as universal GPON stick with V2801F rootfs, but only with stock UF kernel (4.3.1) - needed for Laser controller
- [DFP-34X-2C2]({{ site.baseurl }}{% link ont-DFP-34X-2C2.md %})
- [CarlitoxxPro CPGOS03-0490 v2]({{ site.baseurl }}{% link ont-CarlitoxxPro-CPGOS03-0490-v2.md %})
### List of software version
### List of partition
### List of firmware and files
## Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)

## Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

use VID/VLAN from command "omcicli mib get 84" via telnet to bring up PPPoE

