---
title: LEOX LXT-010G-D
has_children: false
layout: default
parent: LEOX
---

# Hardware Specifications

|                 |                                      |
| --------------- | ------------------------------------ |
| Vendor/Brand    | LEOX                                 |
| Model           | LXT-010G-D                           |
| Chipset         | Realtek RTL9601D                     |
| Flash           | SPI NOR 16MB                         |
| RAM             | 32MB                                 |
| System          | Linux 3.18 (Luna SDK 3.3)            |
| 2.5GBaseT       | No                                   |
| Optics          | Bosa on Board (BoB)                  |
| IP address      | 192.168.100.1/24                     |
| Web Gui         | yes                                  |
| SSH             |                                      |
| Telnet          | ✅ user `leox`, password `leolabs_7` |
| Serial          | ✅                                   |
| Serial baud     | 115200                               |
| Serial encoding | 8-N-1                                |
| Form Factor     | ONT                                  |

# Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface.

{% include_relative ont-luna-sdk-userful-commands.md ploam='ascii' flash='/etc/scripts/flash' %}
