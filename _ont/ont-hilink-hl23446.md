---
title: Hilink HL23446
has_children: false
alias: CarlitoxxPro CPGOS03-0490 v1
layout: default
parent: Hilink
---

# Hardware Specifications

|              |                      |
| ------------ | -------------------- |
| Vendor/Brand | Hilink               |
| Model        | HL23446              |
| Chipset      | Lantiq PEB98035      |
| Flash        | 16 MB                |
| RAM          | 64 MB                |
| CPU          | MIPS 34Kc interAptiv |
| CPU Clock    | 400MHz               |
| System       | OpenWRT              |
| HSGMII       | Yes                  |
| Optics       | SC/APC               |
| IP address   |                      |
| Web Gui      | ✅                   |
| SSH          |                      |
| Telnet       |                      |
| Serial       |                      |
| Form Factor  | miniONT SFP          |

{% include image.html file="hl23446.png" alt="Hilink HL23446" caption="Hilink HL23446" %}

## Possible Clones
- CarlitoxxPro CPGOS03-0490 **v1**

## Firmware is interchangeable with:

- [Huawei MA5671A](/ont-huawei-ma5671a)
- [Nokia G-010S-P](/ont-nokia-g-010s-p)
- [ONT FS.com GPON ONU Stick with MAC / SourcePhotonics SPS-34-24T-HP-TDFO](/ont-fs-com-gpon-onu-stick-with-mac)
- {:.text-red-200 } Dasan H650SFP 
- {:.text-red-200 } DpOptics D23446    
- {:.text-red-200 } Photonics SPS-34-24T-HP-TDFO

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

