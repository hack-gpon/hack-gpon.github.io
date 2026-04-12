---
title: YOTC M2-2050-G40
has_children: false
layout: default
parent: YOTC
---

# Hardware Specifications

|                 |                                                                        |
| --------------- | ---------------------------------------------------------------------- |
| Vendor/Brand    | YOTC                                                                   |
| Model           | M2-2050-G40                                                            |
| Chipset         | Realtek RTL9607C / RTL9607Cv2                                          |
| Flash           | SPI NAND 128MB                                                         |
| RAM             | 256MB                                                                  |
| CPU             | Formosa MIPS interAptiv (multi) V2.0                                   |
| CPU Clock       | 900MHz / 1150MHz                                                       |
| BogoMIPS        | 597.60MHz / 766.77MHz                                                  |
| System          | Linux 4.4.140 (GCC Realtek MSDK-4.8.5p1 Build 3068)                    |
| Ethernet ports  | 2x1G                                                                   |
| Optics          | SC/APC                                                                 |
| IP address      | 192.168.1.1 or 192.168.8.1                                             |
| Web Gui         | ✅ user `super`, password `opticalink` OR user `User`, password `User` |
| Telnet          | ✅ user `super`, password `opticalink` OR user `User`, password `User` |
| SSH             | NO                                                                     |
| Serial baud     | 115200                                                                 |
| Serial encoding | 8-N-1                                                                  |
| Form Factor     | ONT                                                                    |


{% include image.html file="yotc-m2-2050-g40-top.jpg" alt="YOTC M2-2050-G40 Top" caption="YOTC M2-2050-G40 Top" %} 
{% include image.html file="yotc-m2-2050-g40-bottom.jpg" alt="YOTC M2-2050-G40 Bottom" caption="YOTC M2-2050-G40 Bottom" %}
{% include image.html file="yotc-m2-2050-g40-pcb-top.jpg" alt="YOTC M2-2050-G40 PCB Top" caption="YOTC M2-2050-G40 PCB Top" %}
{% include image.html file="yotc-m2-2050-g40-pcb.jpg" alt="YOTC M2-2050-G40 PCB Bottom" caption="YOTC M2-2050-G40 PCB Bottom" %}

# Serial

{% include image.html file="yotc-m2-2050-g40-ttl.jpg" alt="Serial Pinout (dont connect vcc)" caption="Serial Pinout (dont connect vcc)" %}

## List of Software versions
- 518_V300R02B15 (doesn't have upg_app, wget, wget_manage)
- 518_V300R02B21
- 518_V300R02B22
- 518_V300R02B25
- 518_V300R02B31

## List of partitions (MTD)

| dev   | size     | erasesize | name          |
| ----- | -------- | --------- | ------------- |
| mtd0  | 000c0000 | 00020000  | "boot"        |
| mtd1  | 00020000 | 00020000  | "env"         |
| mtd2  | 00020000 | 00020000  | "env2"        |
| mtd3  | 00020000 | 00020000  | "static_conf" |
| mtd4  | 07c60000 | 00020000  | "ubi_device"  |
| mtd5  | 0081d000 | 0001f000  | "ubi_Config"  |
| mtd6  | 00516000 | 0001f000  | "ubi_k0"      |
| mtd7  | 0141a000 | 0001f000  | "ubi_r0"      |
| mtd8  | 00516000 | 0001f000  | "ubi_k1"      |
| mtd9  | 0141a000 | 0001f000  | "ubi_r1"      |

## List of volumes (UBI)

| dev    | size       | type    | name         |
| ------ | ---------- | ------- | ------------ |
| ubi0_0 | 8507392B   | dynamic | "ubi_Config" |
| ubi0_1 | 5332992B   | dynamic | "ubi_k0"     |
| ubi0_2 | 21078016B  | dynamic | "ubi_r0"     |
| ubi0_3 | 5332992B   | dynamic | "ubi_k1"     |
| ubi0_4 | 21078016B  | dynamic | "ubi_r1"     |


To back up a volume, `cat` the appropriate `/dev/ubi0_X` device to a file or pipe, to restore a volume, use the `ubiupdatevol` utility.

This ONT supports dual boot.

Volumes `ubi_k0` and `ubi_r0` respectively contain kernel and rootfs of the first image, while `ubi_k1` and `ubi_r1` contain kernel and rootfs of the second one.

# Useful files and binaries

## Useful files

User Configuration:
```
/var/config/config.xml
```

Custom Default Configuration:
```
/var/config/config_custom_default.xml
```

Custom Configuration (on reset):
```
/var/config/custom_config.sh
```

Hardware Configuration:
```
/var/config/config_hs.xml
```

# GPON/OMCI settings

## Set OMCI mode to customized so versions don't reset
```
mib set OMCI_OLT_MODE 3
```

## Setting OMCI software version (ME 7)
```
mib set OMCI_SW_VER1 YOURSWVER
mib set OMCI_SW_VER2 YOURSWVER
```

## Setting OMCI vendor ID (ME 256)
```
mib set PON_VENDOR_ID VEND
```

## Setting ONU GPON Serial Number
```
mib set GPON_SN VEND1234ABCD
```

## Setting OMCI hardware version (ME 256)
```
mib set HW_HWVER YOURHWVER
```

## Setting OMCC version (ME 257), only accepts decimal values.
```
mib set OMCC_VER 128
```

## Setting Product Code (ME 257), only accepts decimal values.
```
mib set OMCI_VENDOR_PRODUCT_CODE 0
```

## Setting OMCI equipment ID (ME 257)
```
mib set GPON_ONU_MODEL YOUREQUIPMENTID
```

## Setting VEIP slot ID (example for 255), only accepts decimal values.
```
mib set OMCI_VEIP_SLOT_ID 255
```

## Commit Changes.
```
mib commit
```


# Verification commands for settings changed above (all settings take a reboot to apply)

## Verify SwVer (ME 7)
```
omcicli mib get 7
```

## Verify Vendor ID, HwVer, and G984 Serial (ME 256)
```
omcicli mib get 256
```

## Verify OMCC version, Equipment ID and Product Code (ME 257)
```
omcicli mib get 257
```

## Verify VEIP customized slot ID (ME 329)
```
omcicli mib get 329
```


# Advanced Settings

## Setting management MAC
```
mib set ELAN_MAC_ADDR 1A2B3C4D5E6F
```

## Setting management IP
```
mib set LAN_IP_ADDR 192.168.8.1
```

## Checking the currently active image
```
nv getenv sw_active
```

## Booting to a different image
```
# Switch to image 0
nv setenv sw_commit 0
nv setenv sw_tryactive 0
```

```
# Switch to image 1
nv setenv sw_commit 1
nv setenv sw_tryactive 1
```

## Cloning of image 0 into image 1
```
cp /dev/ubi0_1 /tmp/
cp /dev/ubi0_2 /tmp/
ubiupdatevol /dev/ubi0_3 /tmp/ubi0_1
ubiupdatevol /dev/ubi0_4 /tmp/ubi0_2
```

## Rebooting the ONU
```
reboot
```

## Enable Ethernet Ports
```
mib set SW_PORT_TBL.0.Enable 1
mib set SW_PORT_TBL.1.Enable 1
mib set SW_PORT_TBL.2.Enable 1
mib set SW_PORT_TBL.3.Enable 1
```

## Enable 5GHz WiFi
```
mib set WLAN_MBSSIB_TBL.0.wlanDisabled 0
```

# Teardown and other photos
{% include image.html file="yotc-m2-2050-g40-pcb-top-b21.jpg" alt="YOTC M2-2050-G40 PCB Top (newer revision with RTL9607Cv2)" caption="YOTC M2-2050-G40 PCB Top (newer revision with RTL9607Cv2)" %}
{% include image.html file="yotc-m2-2050-g40-pcb-b21.jpg" alt="YOTC M2-2050-G40 PCB Bottom (newer revision with RTL9607Cv2)" caption="YOTC M2-2050-G40 PCB Bottom (newer revision with RTL9607Cv2)" %}
