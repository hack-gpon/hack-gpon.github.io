---
title: Hilink HL23446
has_children: false
alias: CarlitoxxPro CPGOS03-0490 v1
parent: Hilink
---

# Hardware Specifications

|              |                      |
| ------------ | -------------------- |
| Vendor/Brand | Hilink               |
| Model        | HL23446              |
| Chipset      | [Lantiq FALC ON-S PEB 38035 ET (PEB98035)](/chipset-lantiq-falc-on) |
| Flash        | 16 MB                |
| RAM          | 64 MB                |
| CPU          | MIPS 34Kc interAptiv |
| CPU Clock    | 400MHz               |
| System       | OpenWRT              |
| SFP interfaces | HSGMII               |
| Optics       | SC/APC               |
| IP address   |                      |
| Web Gui      | ✅                   |
| SSH          |                      |
| Telnet       |                      |
| Serial       |                      |
| Form Factor  | miniONT SFP          |

<ImageFigure file="hl23446.png" alt="Hilink HL23446" caption="Hilink HL23446" />

<!--@partial: ./_partials/ont-lantiq-falcon-architecture.md-->

## Possible Clones
- CarlitoxxPro CPGOS03-0490 **v1**

## Firmware

<FirmwareList />

## List of partitions

| dev  | size     | erasesize | name          |
| ---- | -------- | --------- | ------------- |
| mtd0 | 00040000 | 00010000  | "uboot"       |
| mtd1 | 00080000 | 00010000  | "uboot_env"   |
| mtd2 | 00740000 | 00010000  | "linux"       |
| mtd3 | 0061eedc | 00010000  | "rootfs"      |
| mtd4 | 00370000 | 00010000  | "rootfs_data" |
| mtd5 | 00800000 | 00010000  | "image1"      |


# Miscellaneous Links

- [Usage GPON module SFP in Spain](https://forum.mikrotik.com/viewtopic.php?t=116364&start=300)


[^ponwiki-sps]: Chipset information sourced from [pon.wiki](https://pon.wiki/), licensed [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
