---
title: LEOX LXT-240G-C1
has_children: false
layout: default
parent: LEOX
---

# Hardware Specifications

|                 |                                                                        |
| --------------- | ---------------------------------------------------------------------- |
| Vendor/Brand    | LEOX                                                                   |
| Model           | LXT-240G-C1                                                            |
| Chipset         | Realtek RTL9607C                                                       |
| Flash           | SPI NAND 256MB                                                         |
| RAM             | 196MB visible in top (256MB total?)                                    |
| System          | Linux 4.4.140 (GCC Realtek MSDK-4.8.5p1 Build 3068)                    |
| Ethernet ports  | 4x1G                                                                   |
| POTS ports      | 2xRJ11                                                                 |
| Optics          | SC/APC                                                                 |
| IP address      | 192.168.1.1/24                                                         |
| Web Gui         | ✅ user `admin`, password `letmein` OR user `user`, password `user`   |
| Telnet          | ✅ user `leox`, password `leolabs_7`                                  |
| Form Factor     | ONT                                                                    |

# External Photos

{% include image.html file="ont-leox-lxt-240g-c1_top.jpg" alt="Leox LXT-240G-C1 Top" caption="Leox LXT-240G-C1 Top" %} 
{% include image.html file="ont-leox-lxt-240g-c1_bottom.jpg" alt="Leox LXT-240G-C1 Bottom" caption="Leox LXT-240G-C1 Bottom" %}
{% include image.html file="ont-leox-lxt-240g-c1_pcb.jpg" alt="Leox LXT-240G-C1 PCB" caption="Leox LXT-240G-C1 PCB" %}

## List of partitions (MTD)

| dev   | size     | erasesize | name             |
| ----- | -------- | --------- | ---------------- |
| mtd0  | 000c0000 | 00020000  | "boot"           |
| mtd1  | 00020000 | 00020000  | "env"            |
| mtd2  | 00020000 | 00020000  | "env2"           |
| mtd3  | 00040000 | 00020000  | "static_conf"    |
| mtd4  | 0f9c0000 | 00020000  | "ubi_device"     |
| mtd5  | 00a89000 | 0001f000  | "ubi_Config"     |
| mtd6  | 00a0d000 | 0001f000  | "ubi_k0"         |
| mtd7  | 01911000 | 0001f000  | "ubi_r0"         |
| mtd8  | 00a0d000 | 0001f000  | "ubi_k1"         |
| mtd9  | 01911000 | 0001f000  | "ubi_r1"         |
| mtd10 | 0081d000 | 0001f000  | "ubi_framework1" |
| mtd11 | 0081d000 | 0001f000  | "ubi_framework2" |
| mtd12 | 02416000 | 0001f000  | "ubi_apps"       |

Only the first 4 partitions with erasesize 0x20000 should be manipulated using mtd devices, the fifth partition "ubi_device" contains the rest of the NAND and is to be manipulated using ubi volumes

## List of volumes (UBI)

| dev    | size      | type    | name             |
| ------ | --------- | ------- | ---------------- |
| ubi0_0 | 11046912B | dynamic | "ubi_Config"     |
| ubi0_1 | 10539008B | dynamic | "ubi_k0"         |
| ubi0_2 | 26284032B | dynamic | "ubi_r0"         |
| ubi0_3 | 10539008B | dynamic | "ubi_k1"         |
| ubi0_4 | 26284032B | dynamic | "ubi_r1"         |
| ubi0_5 |  8507392B | dynamic | "ubi_framework1" |
| ubi0_6 |  8507392B | dynamic | "ubi_framework2" |
| ubi0_7 | 37838848B | dynamic | "ubi_apps"       |

To back up a volume, cat or dd the appropriate /dev/ubi0_X device to a file or pipe, to restore a volume, use the ubiupdatevol utility (or just do it safely via the WebGUI)

This ONT supports dual boot.

Volumes `ubi_k0` and `ubi_r0` respectively contain kernel and rootfs of the first image, while `ubi_k1` and `ubi_r1` contain kernel and rootfs of the second one.

## List of firmware versions

- V4.1.1L5rc2
- V4.1.1L5 (same as rc2 just marked final)


