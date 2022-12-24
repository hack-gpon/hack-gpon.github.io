---
title: Nokia G-010G-T
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|             |                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Vendor      | Nokia                                                                                                                                      |
| Model       | G-010G-T                                                                                                                                   |
| Chipset     | RTL9601D                                                                                                                                   |
| Manufacter  | [CIG G-97CP](/ont-cig-g-97cp)                                                                                                              |
| Flash       | 16MB                                                                                                                                       |
| RAM         | 32MB                                                                                                                                       |
| System      | Linux (Luna SDK 1.9.0)                                                                                                                     |
| HSGMII      | ✅                                                                                                                                         |
| Optics      | SC/APC                                                                                                                                     |
| IP address  | 192.168.100.1  (factory reseted unit use IP 10.89.42.157/16)                                                                               |
| Web Gui     | ✅ user `admin`, password `1234`                                                                                                           |
| Telnet      | ✅ user `ONTUSER`, password should be computed based on a hash of the username and the serial number (see the paragraph [Telnet](#telnet)) |
| SSH         | Can be enabled, locked down by iptables rule                                                                                               |
| Form Factor | ONT                                                                                                                                        |

{% include image.html file="q-010g-t_front.jpg"  alt="Nokia G-010G-T Front" caption="Nokia G-010G-T Front" %}
{% include image.html file="q-010g-t_back.jpg"  alt="Nokia G-010G-T Back" caption="Nokia G-010G-T Back" %}
{% include image.html file="q-010g-t_ports.jpg"  alt="Nokia G-010G-T Ports" caption="Nokia G-010G-T Ports" %}
{% include image.html file="q-010g-t_internal_up.jpg"  alt="Nokia G-010G-T Internal Up" caption="Nokia G-010G-T Internal Up" %}
{% include image.html file="q-010g-t_internal_down.jpg"  alt="Nokia G-010G-T Internal Down" caption="Nokia G-010G-T Internal Down" %}

## List of software versions
- 3FE49717AOCK12 

## List of partitions

| dev  | size     | erasesize | name     |
| ---- | -------- | --------- | -------- |
| mtd0 | 00040000 | 00001000  | "Boot"   |
| mtd1 | 00002000 | 00001000  | "Config" |
| mtd2 | 00002000 | 00001000  | "ImageA" |
| mtd3 | 0003c000 | 00001000  | "ImageB" |

## Serial Console

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the ONT's shield:

{% include image.html file="q-010g-t_ttl.jpg"  alt="Nokia G-010G-T TTL" caption="Nokia G-010G-T TTL" %}

{% include_relative ont-nokia-use.md %}

{% include_relative ont-nokia-userful-command.md %}

# Miscellaneous Links
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser)  for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
- [ispreview.co.uk](https://www.ispreview.co.uk/index.php/2022/09/pictured-openreachs-future-2-5gbps-ont-for-fttp-broadband.html)
