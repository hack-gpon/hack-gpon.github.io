---
title: Nokia G-010S-A
has_children: false
layout: default
---

# Hardware Specifications

|             |                                          |
| ----------- | ---------------------------------------- |
| Vendor      | Nokia                                    |
| Model       | G-010S-A                                 |
| Chipset     | Lantiq PEB98035                          |
| Flash       | 16 MB                                    |
| RAM         | 64 MB                                    |
| System      | OpenWRT                                  |
| HSGMII      | Yes                                      |
| Optics      | SC/UPC                                   |
| IP address  | 192.168.1.10                             |
| Web Gui     | ✅ user `adminadmin`, password `ALC#FGU` |
| SSH         | ✅ user `ONTUSER`, password `SUGAR2A041` |
| Form Factor | miniONT SFP                              |

{% include image.html file="g-010s-a.png"  alt="G-010S-A" caption="G-010S-A" %}
{% include image.html file="g-010s-a-teardown.jpg"  alt="G-010S-A Teardown" caption="G-010S-A Teardown" %}


## Modifying firmware

Turning a [Nokia G-010S-P](ont-nokia-g-010s-p) into a [Nokia G-010S-A](ont-nokia-g-010s-a) is possible by changing layout from mtd

## List of software versions

- [https://github.com/hwti/G-010S-A/tree/main/firmwares](https://github.com/hwti/G-010S-A/tree/main/firmwares)

## List of partitions
## List of firmwares and files

## Serial

```
USB TTL(UART) Adapter ------- SFP 20pins Molex connector
3.3V ---red ------------------pin #15 and #16
TX -----orange ---------------pin #3
RX -----yellow ---------------pin #6
GND ----green --------------- pin #10
```
Configuration: asc0=0 115200 8-N-1

##  Disabling Dying Gasp
```sh
uci set gpon.gtc.nDyingGaspEnable='0'; uci commit gpon
```

# HW Modding

- [Nokia G-010S-A Pin 6 Iusse - Rsaxvc.net](https://rsaxvc.net/blog/2020/8/15/Nokia_G-010S-A_Pin_6_Issue.html)

# Known Bugs

# Miscellaneous Links

- [G-010S-A](https://github.com/hwti/G-010S-A)

