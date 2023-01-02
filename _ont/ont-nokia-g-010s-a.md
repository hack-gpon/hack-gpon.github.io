---
title: Nokia G-010S-A
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|             |                                          |
| ----------- | ---------------------------------------- |
| Vendor      | Nokia                                    |
| Model       | G-010S-A                                 |
| Chipset     | Lantiq PEB98035                          |
| Manufacter  | SourcePhotonics                          |
| Flash       | 16 MB                                    |
| RAM         | 64 MB                                    |
| CPU         | MIPS 34Kc interAptiv                     |
| CPU Clock   | 400MHz                                   |
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

The Nokia G-010S-A can be flashed with the [Nokia G-010S-P](/ont-nokia-g-010s-p) firmware, provided the MTD layout has been changed beforehand to match the new one. For the full procedure, see the post on [lafibre.info](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/msg870551/#msg870551)

## List of software versions

- [https://github.com/hwti/G-010S-A/tree/main/firmwares](https://github.com/hwti/G-010S-A/tree/main/firmwares)

## List of partitions
## List of firmwares and files

## Serial

| USB TTL(UART) Adapter | SFP 20pins Molex connector |
| --------------------- | -------------------------- |
| 3.3V                  | pin #15 and #16            |
| TX                    | pin #3                     |
| RX                    | pin #6                     |
| GND                   | pin #10                    |

Configuration: asc0=0 115200 8-N-1

# Useful Commands

##  Disabling Dying Gasp
```sh
uci set gpon.gtc.nDyingGaspEnable='0'; uci commit gpon
```

# HW Modding

- [Nokia G-010S-A Pin 6 Iusse - Rsaxvc.net](https://rsaxvc.net/blog/2020/8/15/Nokia_G-010S-A_Pin_6_Issue.html)

# Known Bugs

# Miscellaneous Links

- [G-010S-A](https://github.com/hwti/G-010S-A)
- [Usage GPON module SFP in Spain](https://forum.mikrotik.com/viewtopic.php?t=116364&start=300)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)

