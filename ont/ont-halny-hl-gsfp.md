---
title: HALNy HL-GSFP
has_children: false
parent: HALNy
---

# Hardware Specifications

|                  |                      |
| ---------------- | -------------------- |
| Vendor/Brand     | HALNy                |
| Model            | HL-GSFP              |
| ODM              | T&W                  |
| ODM Product Code | TW2362H-CDEL         |
| Chipset          | [Lantiq FALC ON-S PEB 38035 ET (PEB98035)](/chipset-lantiq-falc-on) |
| Flash            | 8 MB                 |
| RAM              | 64 MB                |
| CPU              | MIPS 34Kc interAptiv |
| CPU Clock        | 400MHz               |
| System           | OpenWRT              |
| SFP interfaces   | HSGMII               |
| Optics           | SC/APC               |
| IP address       | 192.168.77.154/30    |
| Web Gui          | none                 |
| SSH              | port 22666           |
| Telnet           |                      |
| Serial           | ✅                   |
| Serial baud      | 115200               |
| Serial encoding  | 8-N-1                |
| Form Factor      | miniONT SFP          |

<ImageFigure file="hl-gsfp-1.png" alt="HALNy HL-GSFP top" caption="HALNy HL-GSFP top" />
<ImageFigure file="hl-gsfp-2.png" alt="HALNy HL-GSFP bottom" caption="HALNy HL-GSFP bottom" />

<!--@partial: ./_partials/ont-lantiq-falcon-architecture.md-->

## Firmware

<FirmwareList />

## List of partitions

| dev  | size     | erasesize | name          |
| ---- | -------- | --------- | ------------- |
| mtd0 | 00040000 | 00010000  | "uboot"       |
| mtd1 | 00020000 | 00010000  | "uboot_env"   |
| mtd2 | 003d0000 | 00010000  | "image0"      |
| mtd3 | 003d0000 | 00010000  | "linux"       |
| mtd4 | 002a87aa | 00010000  | "rootfs"      |
| mtd5 | 000a0000 | 00010000  | "rootfs_data" |



[^ponwiki-sps]: Chipset information sourced from [pon.wiki](https://pon.wiki/), licensed [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
