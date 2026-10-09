---
title: E.C.I. Networks EN-XGSPP-OMAC V2
has_children: false
parent: E.C.I. Networks
---

# Hardware Specifications

|                  |                                          |
| ---------------- | ---------------------------------------- |
| Vendor/Brand     | E.C.I. Networks                          |
| Model            | EN-XGSPP-OMAC-V2                        |
| Chipset          | MaxLinear PRX126                         |
| Flash            |                                          |
| RAM              |                                          |
| System           | Linux (PRX126 SDK)                       |
| SFP interfaces   | 10GBASE-R                                |
| Optics           | SC/APC                                   |
| IP address       |                                          |
| Web Gui          | ✅                                       |
| SSH              |                                          |
| Telnet           |                                          |
| Serial           |                                          |
| Serial baud      | 115200                                   |
| Serial encoding  | 8-N-1                                    |
| Form Factor      | miniONT SFP+                             |

::: warning Note
This is the V2 version of the E.C.I. Networks stick, based on the MaxLinear PRX126 chipset. It is **not** the same hardware as the [V1](/xgs/ont-ECIN-EN-XGSFPP-OMAC-v1), which is a Cortina CA8271A-based stick identical to the [FS.com XGS-ONU-25-20NI](/xgs/ont-fs-XGS-ONU-25-20NI). The firmware, commands, and configuration procedures are completely different between V1 and V2.
:::

The V2 has a web-based GUI for configuration, including PON status, LAN settings, and ONU authentication. It also supports a CLI interface.

## Web GUI

The web GUI provides pages for:
- Device information and PON state
- LAN settings
- ONU authentication (Serial Number, Registration ID/LOID)

The web interface enforces a Registration ID field, which corresponds to the LOID.

## VEIP support

This stick supports VEIP (HGU) mode, but requires the [8311 community firmware](https://github.com/djGrrr/8311-was-110-firmware-builder) to function universally.

## PLOAM debugging

PLOAM messages can be captured from the Linux shell using the `pond` command:

```sh
pond -v
```

# Miscellaneous Links

- [E.C.I. Networks product page](https://ecin.ca/custom-xgs-pon-sfp-stick-module-xgspon-ont-w-t-mac-function-mounted-on-sfp-package/)
- [MaxLinear 10G PON Chipset Solution](https://maxlinear-assets.azureedge.net/web/documents/10g%20pon%20chipset%20solution%20flyer_006flr01.pdf)
