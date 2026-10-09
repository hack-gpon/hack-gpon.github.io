---
title: Zyxel PMG1005-T20C
has_children: false
parent: Zyxel
---

# Hardware Specifications

|                 |                                                   |
| --------------- | ------------------------------------------------- |
| Vendor/Brand    | Zyxel                                             |
| Model           | PMG1005-T20C                                      |
| Chipset         |                                                   |
| Flash           |                                                   |
| RAM             |                                                   |
| System          |                                                   |
| 2.5GBaseT       | No (1x GbE LAN)                                   |
| Optics          |                                                   |
| IP address      | 192.168.1.1                                       |
| Web Gui         | ✅ user `admin`, password on the device label     |
| SSH             |                                                   |
| Telnet          |                                                   |
| Serial          |                                                   |
| Serial baud     |                                                   |
| Serial encoding |                                                   |
| Form Factor     | ONT                                               |

The PMG1005-T20C is a GPON SFU (Single Family Unit) with one GPON uplink and one GbE LAN port, working as a simple Layer-2 bridge. It is the successor of the [PMG1005-T20B](/ont-zyxel-pmg1005-t20b).

The web interface allows to change the admin password, see traffic statistics, upgrade the firmware and reset to factory defaults.

## LEDs

| LED   | Color | Status                                                                    |
| ----- | ----- | ------------------------------------------------------------------------- |
| POWER | Green | On: power on and system ready                                             |
| PON   | Green | On: GPON link up. Blinking: synchronizing with the OLT                    |
| LOS   | Red   | On: no optical signal. Blinking: weak optical signal                      |
| LAN   | Green | On: Ethernet link up. Blinking: transmitting/receiving data               |

# Miscellaneous Links

- [Zyxel PMG1005-T20B/T20C](https://www.zyxel.com/service-provider/global/en/products/fiber-oltsonts/gpon/sfus/pmg1005-series)
- [PMG1005-T20C Quick Start Guide](https://spdl.zyxel.com/PMG1005-T20C/quick_start_guide/PMG1005-T20C_Quick_start_guide_002.pdf)
