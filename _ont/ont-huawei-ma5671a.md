---
title: Huawei MA5671A
has_children: true
layout: default
parent: Huawei
---

# Hardware Specifications

|             |                                     |
| ----------- | ----------------------------------- |
| Vendor      | Huawei                              |
| Model       | MA5671A                             |
| Chipset     | Lantiq PEB98035                     |
| Flash       | 16 MB                               |
| RAM         | 64 MB                               |
| System      | OpenWRT                             |
| HSGMII      | Yes                                 |
| Optics      | SC/APC                              |
| IP address  | 192.168.1.10                        |
| Web Gui     | After root                          |
| SSH         | ✅ user `root`, password `admin123` |
| Form Factor | miniONT SFP                         |

{% include image.html file="g-010s-p-and-ma5671a.jpg"  alt="G-010S-P and MA5671A Teardown" caption="G-010S-P and MA5671A Teardown" %}


##  Firmware is interchangeable with:

- [Nokia G-010S-P](/ont-nokia-g-010s-p)
- [ONT FS.com GPON ONU Stick with MAC / SourcePhotonics SPS-34-24T-HP-TDFO](/ont-fs-com-gpon-onu-stick-with-mac)
- [Hilink HL23446](/ont-hilink-hl23446)
- {:.text-red-200 } Dasan H650SFP 
- {:.text-red-200 } DpOptics D23446  
- {:.text-red-200 } Photonics SPS-34-24T-HP-TDFO

## Serial

| USB TTL(UART) Adapter | SFP 20pins Molex connector |
| --------------------- | -------------------------- |
| 3.3V                  | pin #15 and #16            |
| TX                    | pin #2                     |
| RX                    | pin #7                     |
| GND                   | pin #14 and #10            |

Configuration: asc0=0 115200 8-N-1

{% include alert.html content="Try PIN 10 or other GND PINs if the connection doesn't work by using PIN 14." alert="Note"  icon="svg-warning" color="yellow" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}


## Root procedure

- [Root](/ont-huawei-ma5671a-root)

## List of software versions

- V8R017C00S202B

## List of partitions

Partition layouts change depending on which image is booted, in particular:

When booting image0:
```
mtd2 ---> image0 (linux)
mtd5 --> image1
mtd3 --> rootfs
mtd4 --> rootfs_data
```
When booting image0:
```
mtd2 ---> image0
mtd3 --> image1 (linux)
mtd4 --> rootfs
mtd5 --> rootfs_data
```

For more info [XPONos partition layout](https://github.com/XPONos/linux_lantiq-falcon/commit/456f68f69a84c846a542a9f0ea47c37476535dcb).


## When booting from image0

| dev  | size     | erasesize | name          |
| ---- | -------- | --------- | ------------- |
| mtd0 | 00040000 | 00010000  | "uboot"       |
| mtd1 | 00080000 | 00010000  | "uboot_env"   |
| mtd2 | 00740000 | 00010000  | "linux"       |
| mtd3 | 0061eedc | 00010000  | "rootfs"      |
| mtd4 | 00370000 | 00010000  | "rootfs_data" |
| mtd5 | 00800000 | 00010000  | "image1"      |

## When booting from image1

| dev  | size     | erasesize | name          |
| ---- | -------- | --------- | ------------- |
| mtd0 | 00040000 | 00010000  | "uboot"       |
| mtd1 | 00080000 | 00010000  | "uboot_env"   |
| mtd2 | 00740000 | 00010000  | "image0"      |
| mtd3 | 00800000 | 00010000  | "linux"       |
| mtd4 | 006d8077 | 00010000  | "rootfs"      |
| mtd5 | 00410000 | 00010000  | "rootfs_data" |

## List of firmwares and files

{% include alert.html content="If the root procedure without tweezers is used, the firmware already on the Huawei Stick corresponds to rooted firmware in this list." alert="Info" icon="svg-info" color="blue" %}

- [Carlito MTD2](https://ma5671a.s3.nl-ams.scw.cloud/mtd2.bin){: .btn }  md5hash: d3cb6f7efec201b37931139feb4bb23b
- [Huawei Rooted MTD2](https://ma5671a.s3.nl-ams.scw.cloud/mA5671a_root_mtd2.img){: .btn } md5hash: 3138d2dd06a32bb92bc63610fec6fcd6
- [Carlito MTD5](https://ma5671a.s3.nl-ams.scw.cloud/mtd5.bin){: .btn }  md5hash: 59d2dc15227d6f693a38131eca89b29e 
- [Huawei Rooted MTD5](https://ma5671a.s3.nl-ams.scw.cloud/mA5671a_root_mtd5.img){: .btn }  md5hash: 0e4cfdc1b96be6581869b26b48789556
- [1224abort.bin](https://ma5671a.s3.nl-ams.scw.cloud/1224ABORT.bin){: .btn }  md5hash: 10e94a4b4acdc82dec20c7904b69e5c0
- [right.com.cn (China) 19 July 2022](https://mega.nz/file/9fpSkYTb#wNyjAj1kOLWC9HozX-gTQ-TS3VFqRYg--x1rm7RSuDg){: .btn } md5hash: 6b5e7e3c659fe3f0204340fa746ac4fc
- [right.com.cn (China) 29 Aug 2022](https://mega.nz/file/VHFFSBrT#2WhDPcdON5EHR01l6Ut35GC3sl55e4l09Z0NUo_7SWA){: .btn} md5hash: 3d357e2dc7b59c66fe61b4ddf1fb8dc0
- [ONT FS.com GPON ONU Stick with MAC firmware / SourcePhotonics SPS-34-24T-HP-TDFO firmware](/ont-fs-com-gpon-onu-stick-with-mac)

# General setting

- [Huawei Rooted Firmware General Setting](/ont-huawei-ma5671a-rooted)
- [Carlito Firmware General Setting](/ont-huawei-ma5671a-carlito)
- [SourcePhotonics Firmware General Setting](/ont-huawei-ma5671a-sf)
- [right.com.cn (China) Firmware General Setting](/ont--huawei-ma5671a-china)

# Useful commands

## Transferring files to the stick

{% include alert.html content="If you use a modern OpenSSH version (e.g. >= 8.8) you will have to use the legacy protocol and enable some deprecated algorithms: scp -O -oKexAlgorithms=+diffie-hellman-group1-sha1 -oHostKeyAlgorithms=+ssh-dss [...]" alert="Info" icon="svg-info" color="blue" %}

```sh
# scp rootfs.bin root@192.168.1.10:/tmp/
```

## Backup of all partition

Make a backup of all partitions, an easy way is:
- On the stick run:
```shell
cat /proc/mtd
```
- For each mtdX run, on computer shell:
```shell
nc -l -p 1234 > mtdX.bin
```
And in the lantiq shell:
```shell
cat /dev/mtdX | nc 192.168.1.11 1234
```

## Flashing a new rootfs

{% include alert.html content="Only the inactive image can be flashed" alert="Info" icon="svg-info" color="blue" %}

The following commands are used to flash a new rootfs to image1 and then boot to it
```sh
# mtd -e image1 write /tmp/rootfs.bin image1
# fw_setenv committed_image 1
# fw_setenv image1_is_valid 1
# reboot
```

{% include alert.html content="Some OLTs don't like when ONTs don't boot from image 0, therefore the previous procedure must be preceded by the following procedure with inverted images, as to clone image 1 into image 0" alert="Warning" icon="svg-warning" color="yellow" %}

## Cloning of mtd1 (image 0) into mtd5 (image 1)

{% include alert.html content="Image 0 can be flashed to image 1 while image 1 cannot be flashed to image 0 because it has larger rootfs_data" alert="Warning" icon="svg-warning" color="yellow" %}

The following commands are used to clone image0 to image1 and then boot to it
```sh
# cat /dev/mtd2 > /tmp/mtd2.bin
# mtd -e image1 write /tmp/mtd2.bin image1
# fw_setenv committed_image 1
# fw_setenv image1_is_valid 1
# reboot
```

# Miscellaneous Links

- [Support MA5671A SFP GPON - OpenWRT forum](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042)
- [u boot lantiq falcon - GitHub](https://github.com/minhng99/u-boot_lantiq_falcon)
- [Custom Firmware - right.com.cn](https://www.right.com.cn/forum/thread-8220173-1-1.html)
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate - fibra.click Forum](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
- [GPON SFP Tools](https://github.com/MokkaSchnalle/GPON-SFP-Tools)
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
- [La fibre Orange à 2Gbps, sur un routeur MikroTik 10Gbps CCR2004, via un ONT SFP+](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/msg832904/#msg832904)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)
- [General setting of lantiq](https://forum.fibra.click/d/23881-ma5671a-e-vodafone-25-gbps/64)
- [Manual and firmware for reflashing of HUAWEI MA5671A SFP module](https://github.com/nikbyte/huawei_ma5671a)
- [Usage GPON module SFP in Spain](https://forum.mikrotik.com/viewtopic.php?t=116364&start=300)
