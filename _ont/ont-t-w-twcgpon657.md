---
title: T&W TWC GPON657
has_children: false
layout: default
parent: T&W
---

# Hardware Specifications

|                  |                                    |
| ---------------- | ---------------------------------- |
| Vendor/Brand     | T&W                                |
| Model            | TWC GPON657                        |
| ODM              | ✅                                 |
| Chipset          | Realtek RTL9601CI                  |
| Flash            | 16 MB                              |
| RAM              | 64 MB                              |
| System           | Linux (Luna SDK)                   |
| HSGMII           | Yes                                |
| Optics           | SC/APC                             |
| IP address       |                                    |
| Web Gui          | ✅ user `admin`, password `system` |
| SSH              | ✅ user `admin`, password `system` |
| Telnet           |                                    |
| Serial           |                                    |
| Form Factor      | miniONT SFP                        |

## Firmware is interchangeable with:

- [VSOL V2801F](/ont-vsol-v2801f)
- [UFiber UF-Instant](/ont-ufiber-uf-instant) 

## List of firmwares and files

- [Firmware repository by Anime4000](https://github.com/Anime4000/RTL960x/tree/main/Firmware/TWCGPON657)

The reccomended version are `C00R657V2801F_V1.9.0-220404.tar` because it is the V2801F firmware for T&W TWC GPON657.

{% include_relative ont-luna-sdk-useful-commands.md 
    flash='flash'
    ploam='ascii'
    speedLan='123456'
    customSpeedLanAlert='Please use recommended version `C00R657V2801F_V1.9.0-220404.tar`. With other firmware it is not guaranteed that `LAN_SDS_MODE` other than `1` will work. Before editing the speed make sure your hardware supports it.'
%}

# Known Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

You should use the VID/VLAN shown by executing the command `omcicli mib get 84` via telnet to bring up PPPoE


# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [forum lowyat](https://forum.lowyat.net/topic/4925452/+460)

