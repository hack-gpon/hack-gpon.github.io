---
title: Nokia G-010S-Q
has_children: false
layout: default
parent: Nokia
alias: CIG G-97S
---

# Hardware Specifications

|                  |                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Vendor/Brand     | Nokia                                                                                                             |
| Model            | G-010S-Q                                                                                                          |
| ODM              | CIG                                                                                                               |
| ODM Product Code | G-97S                                                                                                             |
| Chipset          | RTL9601CI                                                                                                         |
| Flash            | 16 MB (Macronix MX25L12835F)                                                                                      |
| RAM              | 32 MB                                                                                                             |
| System           |                                                                                                                   |
| HSGMII           |                                                                                                                   |
| Optics           |                                                                                                                   |
| IP address       | 192.168.100.1                                                                                                     |
| Web Gui          | ✅ Port 80 (⚠️ *only available when the PON connection **IS NOT** estabilished*), user `admin`, password `1234` |
| Telnet           | ✅ user `admin`, password `1234`, but has access to GponSLID and not GponCLI                                      |
| SSH              |                                                                                                                   |
| Telnet           |                                                                                                                   |
| Serial           |                                                                                                                   |
| Form Factor      | miniONT SFP                                                                                                       |

{% include image.html file="g-010s-q-teardown-1.jpg" alt="Nokia G-010S-Q Teardown Up" caption="Nokia G-010S-Q Teardown Up" %}
{% include image.html file="g-010s-q-teardown-2.jpg" alt="Nokia G-010S-Q Teardown Down" caption="Nokia G-010S-Q Teardown Down" %}

{% include_relative ont-nokia-useful-command.md %}

## Enable full telnet shell
Full telnet and secondary factory IP can be enabled by sending [Nokia magic packet](https://github.com/YuukiJapanTech/CA8271x/blob/main/doc/rootShell.md#nokia-xs-010x-r). 

If factory mode is enabled sucessfully second IP `192.168.188.1/24` will be assinged to SFP LAN interface.

Newly available login credentials will be `ATE` / `CATS2388` and `ONTUSER` / `sha256 of SN formated as GPONa1b2c3d4` with GponCLI shell.

# Miscellaneous Links

- [Nokia G-010S-Q](https://github.com/Anime4000/RTL960x/issues/52)
- [CIG G-97S DataSheet](https://web.archive.org/web/20230803034001/https://www.cigtech.com/wp-content/uploads/2018/09/G-97S_DataSheet_V2.pdf)
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser) for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)


