---
title: UFiber UF-Instant
has_children: false
layout: default
---

# Hardware Specifications

|             |                   |
| ----------- | ----------------- |
| Vendor      | UFiber            |
| Model       | UFiber UF-Instant |
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

## Firmware is interchangeable with:

{% include alert.html content="The UFiber UF-Instant can be used as universal GPON stick with V2801F rootfs, but only with stock UF kernel (4.3.1/4.4.2): needed for Laser controller." alert="Info"  icon="svg-info" color="blue" %}


- [VSOL V2801F](/ont-vsol-v2801f)
- [TWCGPON657](/ont-twcgpon657)


## List of software versions
## List of partitions

| dev  | size     | erasesize | name     |
| ---- | -------- | --------- | -------- |
| mtd0 | 00040000 | 00001000  | "boot"   |
| mtd1 | 00002000 | 00001000  | "env"    |
| mtd2 | 00002000 | 00001000  | "env2"   |
| mtd3 | 0003c000 | 00001000  | "config" |
| mtd4 | 00300000 | 00001000  | "k0"     |
| mtd5 | 004b0000 | 00001000  | "r0"     |
| mtd6 | 00300000 | 00001000  | "k1"     |
| mtd7 | 004b0000 | 00001000  | "r1"     |
| mtd8 | 00010000 | 00001000  | "hw"     |
| mtd9 | 00010000 | 00001000  | "sec"    |

## List of firmwares and files

# Know Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

You should use the VID/VLAN shown by executing the command "omcicli mib get 84" via telnet to bring up PPPoE


# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [UF INstant Mod](https://github.com/stich86/UF-Instant-Mod)
- [SFP GPON ONU](https://github.com/zry98/SFP-GPON-ONU)
- [UFiber.Configurator](https://github.com/Unifi-Tools/UFiber.Configurator)
