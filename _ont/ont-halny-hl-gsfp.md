---
title: HALNy HL-GSFP
has_children: false
layout: default
parent: HALNy
---

# Hardware Specifications

|                  |                      |
| ---------------- | -------------------- |
| Vendor/Brand     | HALNy                |
| Model            | HL-GSFP              |
| ODM              | T&W                  |
| ODM Product Code | TW2362H-CDEL         |
| Chipset          | Lantiq PEB98035      |
| Flash            | 8 MB                 |
| RAM              | 64 MB                |
| CPU              | MIPS 34Kc interAptiv |
| CPU Clock        | 400MHz               |
| System           | OpenWRT              |
| HSGMII           | Yes                  |
| Optics           | SC/APC               |
| IP address       | 192.168.77.154/30    |
| Web Gui          | none                 |
| SSH              | port 22666           |
| Telnet           |                      |
| Serial           | ✅                   |
| Serial baud      | 115200               |
| Serial encoding  | 8-N-1                |
| Form Factor      | miniONT SFP          |

{% include image.html file="hl-gsfp-1.png"  alt="HALNy HL-GSFP top" caption="HALNy HL-GSFP top" %}
{% include image.html file="hl-gsfp-2.png"  alt="HALNy HL-GSFP bottom" caption="HALNy HL-GSFP bottom" %}

## Firmware is interchangeable with:

- [Zyxel PMG3000-D20B](/ont-zyxel-pmg3000-d20b)
- [D-LINK DPN-100-Rev-A2](/ont-d-link-dpn-100-rev-a2)
- [Zisa OP151s](/ont-zisa-op151s)
- [T&W TW2362H-CDEL](/ont-t-w-tw2362h-cdel)

## List of partitions

| dev  | size     | erasesize | name          |
| ---- | -------- | --------- | ------------- |
| mtd0 | 00040000 | 00010000  | "uboot"       |
| mtd1 | 00020000 | 00010000  | "uboot_env"   |
| mtd2 | 003d0000 | 00010000  | "image0"      |
| mtd3 | 003d0000 | 00010000  | "linux"       |
| mtd4 | 002a87aa | 00010000  | "rootfs"      |
| mtd5 | 000a0000 | 00010000  | "rootfs_data" |


