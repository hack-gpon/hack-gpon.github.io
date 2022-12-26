---
title: VSOL V2801F
has_children: false
layout: default
parent: VSOL
---

# Hardware Specifications

|             |                                       |
| ----------- | ------------------------------------- |
| Vendor      | VSOL                                  |
| Model       | V2801F                                |
| Chipset     | Realtek RTL9601CI                     |
| Flash       | 8 MB                                  |
| RAM         | 64 MB                                 |
| System      | Linux (Luna SDK)                      |
| HSGMII      | No                                    |
| Optics      | SC/APC                                |
| IP address  |                                       |
| Web Gui     | ✅ user `admin`, password `stdONU101` |
| SSH         | ✅ user `admin`, password `stdONU101` |
| Form Factor | miniONT SFP                           |

## Firmware is interchangeable with:

- [T&W TWC GPON657](/ont-t-w-twcgpon657)
- [UFiber UF-Instant](/ont-ufiber-uf-instant) 

## List of software versions
## List of partitions
## List of firmwares and files

- [Firmware repository by Anime4000](https://github.com/Anime4000/RTL960x/tree/main/Firmware/V2801F)

The reccomended version are `V2801F_V1.9.0-220425.tar` because it has Modern WebGUI, 2.5GbE, patched `runlansds.sh`, `tftpd`, ...


# Known Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

You should use the VID/VLAN shown by executing the command "omcicli mib get 84" via telnet to bring up PPPoE

# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [SFP GPON ONU](https://github.com/zry98/SFP-GPON-ONU)
- [forum lowyat](https://forum.lowyat.net/topic/4925452/+460)
