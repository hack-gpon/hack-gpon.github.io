---
title: TP-Link XZ000-G7
has_children: false
parent: TP-Link
---

# Hardware Specifications

|              |                                       |
| ------------ | ------------------------------------- |
| Vendor/Brand | TP-Link                               |
| Model        | XZ000-G7                              |
| Chipset      | Faraday/Galachip GC1601               |
| CPU          | ARMv5l 32-bit                         |
| Flash        | 4MB (cFeon QH32B-104HIP)              |
| RAM          | 32MB                                  |
| System       | Linux (Kernel 3.16.0, uClibc)         |
| HSGMII       | No                                    |
| Optics       | UX3320S SC/APC                        |
| IP address   | 192.168.1.1/24                        |
| Web Gui      | ✅ username `admin`, password `admin` |
| SSH          | ❌                                    |
| Telnet       | ✅ Locked down CLI                    |
| Serial       | ✅ 115200 8-N-1                       |
| Form Factor  | ONT                                   |

::: info Note
This ONT uses the Faraday/Galachip GC1601 chipset, which is relatively uncommon. The device uses a custom Galachip-specific SDK. Very little public documentation exists about this chipset.
:::

# Internal Photo

<ImageFigure file="tp-link/tp-link-XZ000-G7-V1.0.jpg" alt="XZ000-G7 V1.0" caption="XZ000-G7 V1.0" />

# Flash Layout

| dev  | size   | erasesize | name       | Notes           |
| ---- | -------| --------- | ---------- | --------------- |
| mtd0 | 400000 | 1000      | "whole"    | Full flash      |
| mtd1 | 20000  | 1000      | "uboot"    | loader + U-Boot |
| mtd2 | 170000 | 1000      | "kernel"   | zImage + DTB    |
| mtd3 | 240000 | 1000      | "rootfs"   | Squashfs        |
| mtd4 | 20000  | 1000      | "misc"     | XML Config      |
| mtd5 | 10000  | 1000      | "hwconfig" | MAC+BOSA config |

# Miscellaneous Links

- [TP-Link XZ000-G7 product page](https://www.tp-link.com/nordic/service-provider/gpon/xz000-g7/)
- [XZ000-G7 additional info (Portuguese)](https://www.tripleoxygen.net/wiki/ont/tplink/xz000-g7-br-v1)
