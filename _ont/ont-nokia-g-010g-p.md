---
title: Nokia G-010G-P
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|             |                                     |
| ----------- | ----------------------------------- |
| Vendor      | Nokia                               |
| Model       | G-010G-P                            |
| Chipset     | Realtek RTL9601B                    |
| Manufacter  |                                     |
| Flash       |                                     |
| RAM         |                                     |
| System      | Linux (Luna SDK 1.9.0)              |
| HSGMII      | No                                  |
| Optics      | SC/APC                              |
| IP address  | 192.168.100.1                       |
| Web Gui     |                                     |
| Telnet      | ✅ user `root`, password `huigu309` |
| Form Factor | ONT                                 |

{% include image.html file="g-010g-p.jpg"  alt="G-010G-P" caption="Nokia G-010G-P" %}

To access a complete linux shell just type:
```sh
#ONT>system
#ONT/system>shell
```

# Useful Commands

## Committing changes to the OMCI MIB tables for GPON operation
```sh
#ONT>system
#ONT/system>mib
#ONT/system/mib>reset
```

## Getting/Setting the ONT's S/N
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>eqsn set "ALCL00000001"
---ATECMDRESULT--- OK
#ONT/system/misc>eqsn get
eqsn: ALCL00000001
---ATECMDRESULT--- OK
```

## Getting/Setting the ONT's Vendor
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>vendor get
vendor: ALCL
---ATECMDRESULT--- OK
#ONT/system/misc>eqsnvend get
vendor: ALCL
---ATECMDRESULT--- OK
#ONT/system/misc>vendor set "ALCL"
---ATECMDRESULT--- OK
#ONT/system/misc>eqsnvend set "ALCL"
---ATECMDRESULT--- OK

```

## Getting/Setting the ONT's Equipment ID
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>eqid set "FT-G2110C-2.5G"
---ATECMDRESULT--- OK
#ONT/system/misc>eqid get
eqid: FT-G2110C-2.5G
hex_eqid: 0x46542d4732313130432d322e3547000000000000
---ATECMDRESULT--- OK
```

## Getting/Setting the ONT's Hardware Version
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>eqvid get
eqvid: 3FE45458ABAA06
hex_eqvid: 0x3346453435343538414241413036
---ATECMDRESULT--- OK
#ONT/system/misc>eqvid set "G2110CE2V1D0"
```

## Querying a particular OMCI ME
```sh
#ONT>system
#ONT/system>mib
#ONT/system/mib>show 256
Table Ontg, Ont-g, total 1 instances

EntityID                  = 0x0000
VID                       = "GNXS"
Version                   = 47 32 31 31 30 43 45 32 56 31 44 30 00 00
SerialNum                 = 47 4e 58 53 05 54 6f b0
TraffMgtOpt               = 0
AtmCCOpt                  = 0
BatteryBack               = 1
AdminState                = 0
OpState                   = 0
OnuSurvivalTime           = 0
Loid                      = ""
Password                  = ""
AuthState                 = 0
OntState                  = 1
```

## Setting the ONT's Software Version
The following must be typed from the standard linux shell:
```sh
# echo SWVER=C-5.6.1-R > /mnt/rwdir/sys.cfg
```

# Miscellaneous Links
- <a href="https://github.com/nanomad/nokia-ont-mib-parser">MIB file parser</a> for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)


