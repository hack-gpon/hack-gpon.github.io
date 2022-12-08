---
title: FiberTwist G2110C-2.5G
has_children: false
layout: default
parent: Genexis
---

# Hardware Specifications

|             |                                      |
| ----------- | ------------------------------------ |
| Vendor      | Genexis                              |
| Model       | FiberTwist G2110C-2.5G               |
| Chipset     | RTL9601D                             |
| Flash       | 128MB                                |
| RAM         | 32MB                                 |
| System      | Linux 3.18 (Luna SDK 3.3)            |
| HSGMII      | ✅                                   |
| Optics      | SC/APC                               |
| IP address  | 192.168.100.1/24 or 192.168.1.1/24   |
| Web Gui     | Can be enabled, locked down by iptables rule and missing CSS |
| Telnet      | ✅ user `company`, password `amyM77yY` |
| Form Factor | ONT                                  |

# External/Internal Photo

{% include image.html file="ft-g2110c-front.jpg"  alt="FiberTwist G2110C-2.5G Front" caption="FiberTwist G2110C-2.5G Front" %}
{% include image.html file="ft-g2110c-back.jpg"  alt="FiberTwist G2110C-2.5G Back" caption="FiberTwist G2110C-2.5G Back" %}

## Optical Header installation backplate
{% include image.html file="ft-g2110c-optical-header-1.jpg"  alt="FiberTwist G2110C-2.5G Optical Header installation backplate" caption="FiberTwist G2110C-2.5G Optical Header installation backplate" %}
{% include image.html file="ft-g2110c-optical-header-2.jpg"  alt="FiberTwist G2110C-2.5G Optical Header installation backplate" caption="FiberTwist G2110C-2.5G Optical Header installation backplate" %}
{% include image.html file="ft-g2110c-optical-header-3.jpg"  alt="FiberTwist G2110C-2.5G Optical Header installation backplate" caption="FiberTwist G2110C-2.5G Optical Header installation backplate" %}

## Internal (TTL is on CM3 header)
{% include image.html file="ft-g2110c-internal.jpg"  alt="FiberTwist G2110C-2.5G Internal" caption="FiberTwist G2110C-2.5G Internal" %}

## List of software versions
- C-5.6.1-R
- C-5.7.0-R

## List of partitions
| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00001000  | "boot"          |
| mtd1  | 00002000 | 00001000  | "env"           |
| mtd2  | 00002000 | 00001000  | "env2"          |
| mtd3  | 0003c000 | 00001000  | "config"        |
| mtd4  | 00300000 | 00001000  | "k0"            |
| mtd5  | 004c0000 | 00001000  | "r0"            |
| mtd6  | 00300000 | 00001000  | "k1"            |
| mtd7  | 004c0000 | 00001000  | "r1"            |
| mtd8  | 00001000 | 00001000  | "Partition_008" |
| mtd9  | 00001000 | 00001000  | "Partition_009" |
| mtd10 | 00001000 | 00001000  | "Partition_010" |
| mtd11 | 00001000 | 00001000  | "Partition_011" |
| mtd12 | 00300000 | 00001000  | "linux"         |
| mtd13 | 004c0000 | 00001000  | "rootfs"        |

This ONT supports dual boot. 

`k0` and `r0` respectively contain the kernel and firmware of the first image, `k1` and `r1` the kernel and the firmware of the second one

## List of firmwares and files

# Useful Commands


# Known Bugs
# Miscellaneous Links
- [FiberTwist G2110C-2.5G](https://genexis.eu/content/uploads/2020/07/FiberTwist-G2110C-2.5G-Installation-Guide-v1.0-EN.pdf)
