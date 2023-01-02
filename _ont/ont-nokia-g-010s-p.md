---
title: Nokia G-010S-P
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|             |                                          |
| ----------- | ---------------------------------------- |
| Vendor      | Nokia                                    |
| Model       | G-010S-P                                 |
| Chipset     | Lantiq PEB98035                          |
| Manufacter  | SourcePhotonics                          |
| Flash       | 16 MB                                    |
| RAM         | 64 MB                                    |
| CPU         | MIPS 34Kc interAptiv                     |
| CPU Clock   | 400MHz                                   |
| System      | OpenWRT                                  |
| HSGMII      | Yes                                      |
| Optics      | SC/APC                                   |
| IP address  |                                          |
| Web Gui     | Can be enabled                           |
| SSH         | ✅ user `ONTUSER`, password `SUGAR2A041` |
| Form Factor | miniONT SFP                              |

{% include image.html file="g-010s-p.jpg"  alt="G-010S-P" caption="G-010S-P" %}
<br/>
{% include image.html file="g-010s-p-and-ma5671a.jpg"  alt="G-010S-P and MA5671A Teardown" caption="G-010S-P and MA5671A Teardown" %}
<br/>
{% include alert.html content="G-010S-P and other models will not expose an ethernet interface unless fiber cable is connected ([source](https://forum.mikrotik.com/viewtopic.php?t=116364&start=300))" alert="Warning" icon="svg-warning" color="yellow" %}

## Firmware is interchangeable with:

- [Huawei MA5671A](/ont-huawei-ma5671a)
- [ONT FS.com GPON ONU Stick with MAC / SourcePhotonics SPS-34-24T-HP-TDFO](/ont-fs-com-gpon-onu-stick-with-mac)
- [Hilink HL23446](/ont-hilink-hl23446)
- {:.text-red-200 } Dasan H650SFP 
- {:.text-red-200 } DpOptics D23446    
- {:.text-red-200 } Photonics SPS-34-24T-HP-TDFO

The [Nokia G-010S-A](/ont-nokia-g-010s-a) can be flashed with the Nokia G-010S-P firmware, provided the MTD layout has been changed beforehand to match the new one. For the full procedure, see the post on [lafibre.info](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/msg870551/#msg870551)

## Serial

```
USB TTL(UART) Adapter ------- SFP 20pins Molex connector
3.3V ---red ------------------pin #15 and #16
TX -----orange ---------------pin #2
RX -----yellow ---------------pin #7
GND ----green --------------- pin #10
```
Configuration: asc0=0 115200 8-N-1

## List of software versions
## List of partitions

| dev  | size     | erasesize | name          |
| ---- | -------- | --------- | ------------- |
| mtd0 | 00040000 | 00010000  | "uboot"       |
| mtd1 | 00080000 | 00010000  | "uboot_env"   |
| mtd2 | 00740000 | 00010000  | "linux"       |
| mtd3 | 0061eedc | 00010000  | "rootfs"      |
| mtd4 | 00370000 | 00010000  | "rootfs_data" |
| mtd5 | 00800000 | 00010000  | "image1"      |

## List of firmwares and files

# Useful Commands

##  Disabling Dying Gasp
```sh
fw_setenv nDyingGaspEnable 0
```

## Enabling the Web UI

To activate the web-ui you can use the following guide on [dslreport](https://www.dslreports.com/forum/r32458588-).

# Known Bugs
# Miscellaneous Links

- [alcatel_lucent-lantiq_falcon](https://github.com/minhng99/alcatel_lucent-lantiq_falcon)
- [uboot lantiq falcon](https://github.com/minhng99/u-boot_lantiq_falcon)
- [Usage GPON module SFP in Spain](https://forum.mikrotik.com/viewtopic.php?t=116364&start=300)


