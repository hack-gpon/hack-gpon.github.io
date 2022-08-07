---
title: Nokia G-010S-P
has_children: false
parent: ONT
---

# Hardware Specifications

|             |                                                                  |
| ----------- | ---------------------------------------------------------------- |
| Vendor      | Nokia                                                            |
| Model       | G-010S-P                                                         |
| Alias       | Alcatel G-010S-P                                                 |
| Chipset     | Lantiq PEB98035                                                  |
| Flash       | 16 MB                                                            |
| RAM         | 64 MB                                                            |
| System      | OpenWRT                                                          |
| HSGMII      | Yes                                                              |
| Optics      | SC/APC                                                           |
| IP address  |                                                                  |
| Web Gui     | ✅ [after enabling](https://www.dslreports.com/forum/r32458588-) |
| SSH         | ✅ user `ONTUSER`, password `SUGAR2A041`                         |
| Form Factor | miniONT SFP                                                      |

{% include image.html file="g-s010s-p.jpg"  alt="G-010S-P" caption="G-010S-P" %}

## Firmware is interchangeable with:
- [Huawei MA5671A](ont-huawei-ma5671a)
- [Nokia G-010S-P](ont-nokia-g-s010s-p)
- [SourcePhotonics SPS-34-24T-HP-TDFO](ont-SourcePhotonics-SPS-34-24T-HP-TDFO)
- [Hilink HL23446](ont-Hilink-HL23446)

Turning a [Nokia G-010S-P](ont-nokia-g-s010s-p) into a [Nokia G-010S-A](ont-nokia-g-s010s-A) is possible by changing layout from mtd

## Serial

On SFP: Serial TTL: TX Pin 2 RX Pin 7 asc0=0 115,200 N 8 1

## List of software versions
## List of partitions
## List of firmwares and files

##  Disabling Dying Gasp
```sh
fw_setenv nDyingGaspEnable 0
```

# Known Bugs
# Miscellaneous Links

- [alcatel_lucent-lantiq_falcon](https://github.com/minhng99/alcatel_lucent-lantiq_falcon)
- [uboot lantiq falcon](https://github.com/minhng99/u-boot_lantiq_falcon)


