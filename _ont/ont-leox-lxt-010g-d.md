---
title: Leox LXT-010G-D
has_children: false
layout: default
parent: Leox
---

# Hardware Specifications

|             |                                      |
| ----------- | ------------------------------------ |
| Vendor      | Leox                                 |
| Model       | LXT-010G-D                           |
| Chipset     |                                      |
| Flash       |                                      |
| RAM         |                                      |
| System      | Linux (Luna SDK )                    |
| HSGMII      | No                                   |
| Optics      |                                      |
| IP address  | 192.168.100.1/24                     |
| Web Gui     |                                      |
| Telnet      | ✅ user `leox`, password `leolabs_7` |
| Form Factor | ONT                                  |


## List of software versions
## List of partitions
## List of firmwares and files

# Useful Commands

## Getting/Setting the ONT's S/N
```sh
# /etc/scripts/flash get GPON_SN
GPON_SN=TMBB00000000
# /etc/scripts/flash set GPON_SN TMBB0A1B2C3D
```

## Getting/Setting the ONT's PLOAM password

{% include alert.html content="The PLOAM password is stored in ASCII format" alert="Info" icon="svg-info" color="blue" %}

```sh
# /etc/scripts/flash get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# /etc/scripts/flash set GPON_PLOAM_PASSWD AAAAAAAAAA
```

# Known Bugs
# Miscellaneous Links


