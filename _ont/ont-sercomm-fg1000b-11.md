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
| Chipset         | BCM68360_B1            |
| Flash           | NAND 128 MB            |
| RAM             | 128 MB                 |
| CPU             | Broadcom B53 Dual Core |
| CPU Clock       | 1500MHz                |
| Bootloader      | CFE                    |
| Load addr       | 0x0000000000080000     |
| 2.5GBaseT       | Yes                    |
| PHY Ethernet    | RTL8221B               |
| Optics          | SC/APC                 |
| IP address      | 192.168.100.1/24       |
| Web Gui         | ✅, no login needed    |
| SSH             | No                     |
| Telnet          | No                     |
| Serial          | No                     |
| Serial baud     | 115200                 |
| Serial encoding | 8-N-1                  |
| Form Factor     | ONT                    |


{% include image.html file="fg1000b-11_rear.jpg" alt="Sercomm FG1000B.11" caption="Sercomm FG1000B.11 rear" %}
{% include image.html file="fg1000b-11_bottom.jpg" alt="Sercomm FG1000B.11 bottom" caption="Sercomm FG1000B.11 bottom" %}
{% include image.html file="fg1000b-11_side1.jpg" alt="Sercomm FG1000B.11 side 1" caption="Sercomm FG1000B.11 side 1" %}
{% include image.html file="fg1000b-11_side2.jpg" alt="Sercomm FG1000B.11 side 2" caption="Sercomm FG1000B.11 side 2" %}

# Serial

See picture side2 for the pin identification, use 112500 8-N-1
The ONT seems only to display output of the ROM CFE and flash CFE, but don't allow interupting the boot...

dump:

{% include serial_dump.html file="fg1000b-11_boot_cfe.txt" alt="Sercomm FG1000B.11 CFE boot dump" %}

## Getting/Setting ONU GPON PLOAM password

PLOAM can be set directly for Text or Hexa(without 0x) via Web interface if <10 digit otherwise POST call to URL allow > 10 digits for example 20 digit hex can be setup via:

```
curl -i -s -k -X $'POST' \
    -H $'Host: 192.168.100.1' -H $'Accept: application/json, text/javascript, */*' -H $'X-Requested-With: XMLHttpRequest' -H $'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5563.65 Safari/537.36' -H $'Content-Type: application/x-www-form-urlencoded' -H $'Origin: http://192.168.100.1' -H $'Referer: http://192.168.100.1/ONT/client/html/content/config/setup.html?lang=en' -H $'Accept-Encoding: gzip, deflate' -H $'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' -H $'Connection: close' \
    -b $'lang=en' \
    -d $'ploam_password=00000XXXXXXXXXXXXXXX' \
    $'http://192.168.100.1/ONT/client/data/Router.json'
```

## List of software versions

Current only version seen is: 090144.1.0.001

## Miscellaneous Links

- [FG1000B.11 - lafibre.info](https://lafibre.info/remplacer-bbox/test-glasfaser-modem-2-telekom-pour-remplacement-ont-2-5gbe-synchro-ok-ipv4-ok/)

## Other brand names

 - 1&1 Glasfaser Modem
 - Telekom Glasfaser Modem 2


