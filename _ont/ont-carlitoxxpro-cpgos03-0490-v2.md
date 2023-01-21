---
title: CarlitoxxPro CPGOS03-0490 v2
has_children: false
layout: default
parent: CarlitoxxPro
---

# Hardware Specifications

|              |                                       |
| ------------ | ------------------------------------- |
| Vendor/Brand | CarlitoxxPro                          |
| Model        | CPGOS03-0490 v2                       |
| Chipset      | Realtek RTL9601CI                     |
| Flash        | 8 MB                                  |
| RAM          | 64 MB                                 |
| System       | Linux (Luna SDK)                      |
| HSGMII       | No                                    |
| Optics       | SC/APC                                |
| IP address   |                                       |
| Web Gui      | ✅ user `cpAdmin`, password `cpAdmin` |
| SSH          |                                       |
| Telnet       | ✅                                    |
| Serial       |                                       |
| Form Factor  | miniONT SFP                           |

# Known Bugs

- VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

- You should use the VID/VLAN shown by executing the command `omcicli mib get 84` via telnet to bring up PPPoE

{% include_relative ont-luna-sdk-userful-commands.md flash='flash' ploam='asciiAndHex' %}


# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [GPON ONU SFP - CPGOS03-0490 v2.0: Configuration Manual 1.0](https://wiki.rockstable.it/FTTH?action=AttachFile&do=get&target=CPGOS03-0490v2_Configuration-Manual.pdf)

