---
title: Nokia G-010G-T
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|             |          |
| ----------- | -------- |
| Vendor      | Nokia    |
| Model       | G-010G-T |
| Chipset     | RTL9601D |
| Flash       | 16MB     |
| RAM         | 32MB     |
| System      | CIG (Luna SDK 1.9.0) |
| HSGMII      | ✅       |
| Optics      | SC/APC   |
| IP address  | 192.168.100.1  (factory reseted unit use IP 10.89.42.157/16) |
| Web Gui     | ✅ user `admin`, password `1234`      |
| Telnet      | ✅ user `ONTUSER` password should be calculated, each ONT has a different one |
| SSH         | Can be enabled, locked down by iptables rule |
| Form Factor | ONT      |

# External/Internal Photo

{% include image.html file="q-010g-t_front.jpg"  alt="Nokia G-010G-T Front" caption="Nokia G-010G-T Front" %}
{% include image.html file="q-010g-t_back.jpg"  alt="Nokia G-010G-T Back" caption="Nokia G-010G-T Back" %}
{% include image.html file="q-010g-t_ports.jpg"  alt="Nokia G-010G-T Ports" caption="Nokia G-010G-T Ports" %}
{% include image.html file="q-010g-t_internal_up.jpg"  alt="Nokia G-010G-T Internal Up" caption="Nokia G-010G-T Internal Up" %}
{% include image.html file="q-010g-t_internal_down.jpg"  alt="Nokia G-010G-T Internal Down" caption="Nokia G-010G-T Internal Down" %}

## List of software versions
- 3FE49717AOCK12 

## List of partitions

| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00001000  | "Boot"          |
| mtd1  | 00002000 | 00001000  | "Config"        |
| mtd2  | 00002000 | 00001000  | "ImageA"        |
| mtd3  | 0003c000 | 00001000  | "ImageB"        |

## Serial Console

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, GND of TTL adapter should be attached to the ONT's shield (central GND PIN is not connected):

{% include image.html file="q-010g-t_ttl.jpg"  alt="Nokia G-010G-T TTL" caption="Nokia G-010G-T TTL" %}

At prompt to logon follow these commands:

```sh
ONT>enable
#ONT>login
User name:ONTUSER
Password: ****
```

# Access Full Shell

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
#ONT/system/misc>eqsn set "GNXS05546fb0"
---ATECMDRESULT--- OK
#ONT/system/misc>eqsn get
eqsn: GNXS05546fb0
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

## Getting/Setting the ONT's IP/Netmask
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>admin_ip get
admin_ip: 192.168.100.1
---ATECMDRESULT--- OK
#ONT/system/misc>admin_ip set 192.168.1.1
#ONT/system/misc>admin_mask get
admin_mask: 255.255.255.0
---ATECMDRESULT--- OK
#ONT/system/misc>admin_mask set 255.255.255.0
```

## Getting Operational Status 
```sh
#ONT>traffic
#ONT/system>pon
#ONT/system/pon>show link

 ----------------- LINK STATE -----------------
 Link State:              ACTIVE
 Operation State Machine: OPERATION (O5)
 ----------------- STATE  END -----------------
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
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser)  for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
- [ispreview.co.uk](https://www.ispreview.co.uk/index.php/2022/09/pictured-openreachs-future-2-5gbps-ont-for-fttp-broadband.html)
