---
title: Sercomm FG1000B.11
has_children: false
layout: default
parent: Sercomm
---

# Hardware Specifications

|                 |                        |
| --------------- | ---------------------- |
| Vendor/Brand    | Sercomm                |
| Model           | FG1000B.11             |
| ODM             | ✅                     |
| Chipset         | BCM68360_B1            |
| Flash           | NAND 128 MB            |
| RAM             | 256 MB                 |
| CPU             | Broadcom B53 Dual Core |
| CPU Clock       | 1500MHz                |
| Bootloader      | CFE                    |
| Load addr       | 0x80000                |
| 2.5GBaseT       | Yes                    |
| PHY Ethernet    | RTL8221B               |
| Optics          | SC/APC                 |
| IP address      | 192.168.100.1/24       |
| Web Gui         | ✅, no login needed    |
| SSH             | No                     |
| Telnet          | No                     |
| Serial          | ✅, only TX            |
| Serial baud     | 115200                 |
| Serial encoding | 8-N-1                  |
| Form Factor     | ONT                    |


{% include image.html file="fg1000b-11_rear.jpg" alt="Sercomm FG1000B.11" caption="Sercomm FG1000B.11 rear" %}
{% include image.html file="fg1000b-11_bottom.jpg" alt="Sercomm FG1000B.11 bottom" caption="Sercomm FG1000B.11 bottom" %}
{% include image.html file="fg1000b-11_side1.jpg" alt="Sercomm FG1000B.11 side 1" caption="Sercomm FG1000B.11 side 1" %}
{% include image.html file="fg1000b-11_side2.jpg" alt="Sercomm FG1000B.11 side 2" caption="Sercomm FG1000B.11 side 2" %}

## Serial

See picture side2 for the pin identification, use 112500 8-N-1
The ONT seems only to display output of the ROM CFE and flash CFE, but don't allow interupting the boot...

{% include serial_dump.html file="fg1000b-11_boot_cfe.txt" alt="Sercomm FG1000B.11 CFE boot dump" title="Sercomm FG1000B.11 CFE boot dump" %}

## List of software versions

Current only version seen is: 090144.1.0.001

# GPON/OMCI settings
## Getting/Setting ONU GPON PLOAM password

PLOAM can be set directly for Text or Hexa(without 0x) via Web interface if <10 digit otherwise POST call to URL allow > 10 digits for example 20 digit hex can be setup via:

```
curl -i -s -k -X $'POST' -H $'Content-Type: application/x-www-form-urlencoded' \
    -H $'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
    -d $'ploam_password=00000XXXXXXXXXXXXXXX' \
    $'http://192.168.100.1/ONT/client/data/Router.json'
```

# Miscellaneous Links

- [FG1000B.11 - lafibre.info](https://lafibre.info/remplacer-bbox/test-glasfaser-modem-2-telekom-pour-remplacement-ont-2-5gbe-synchro-ok-ipv4-ok/)

# Other brand names

 - 1&1 Glasfaser Modem
 - Telekom Glasfaser Modem 2


