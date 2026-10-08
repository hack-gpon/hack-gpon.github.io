---
title: Prolink PGN6401V
has_children: false
parent: Prolink
---

# Hardware Specifications

|                 |                                                                        |
| --------------- | ---------------------------------------------------------------------- |
| Vendor/Brand    | Prolink                                                                   |
| Model           | PGN6401V                                                            |
| Chipset         | Realtek RTL9607Cv2                                          |
| Flash           | SPI NAND 128MB                                                         |
| RAM             | 256MB                                                                  |
| CPU             | Formosa MIPS interAptiv (multi) V2.0                                   |
| CPU Clock       | 1150MHz                                                       |
| BogoMIPS        | 766.77MHz                                                  |
| System          | Linux 4.4.140 (GCC Realtek MSDK-4.8.5p1 Build 3068)                    |
| Ethernet ports  | 4x1G                                                                   |
| Optics          | SC/UPC                                                                 |
| IP address      | 192.168.1.1                                              |
| Web Gui         | ✅ user `admin`, password `1234` |
| Telnet          | ✅ user `admin`, password `1234` |
| SSH             |  ✅ user `admin`, password `1234`                                    |
| Serial baud     | 115200                                                                 |
| Serial encoding | 8-N-1                                                                  |
| Form Factor     | ONT                                                                    |


<ImageFigure file="Prolink-PGN6401V-pcbtop.jpg" alt="Prolink PGN6401V PCB top" caption="Prolink PGN6401V PCB top" />

<ImageFigure file="Prolink-PGN6401V-pcbbottom.jpg" alt="Prolink PGN6401V PCB bottom" caption="Prolink PGN6401V PCB bottom" />


# Serial

<ImageFigure file="Prolink-PGN6401V-ttl.jpg" alt="Serial Pinout (dont connect vcc)" caption="Serial Pinout (dont connect vcc)" />

::: details PGN6401V boot dump
<<< ./serial_dump/Prolink-PGN6401V.txt
:::


## List of partitions (MTD)

| dev   | size     | erasesize | name          |
| ----- | -------- | --------- | ------------- |
| mtd0  | 000c0000 | 00020000  | "boot"        |
| mtd1  | 00020000 | 00020000  | "env"         |
| mtd2  | 00020000 | 00020000  | "env2"        |
| mtd3  | 00020000 | 00020000  | "static_conf" |
| mtd4  | 07c60000 | 00020000  | "ubi_device"  |
| mtd5  | 00a89000 | 0001f000  | "ubi_Config"  |
| mtd6  | 00a0d000 | 0001f000  | "ubi_k0"      |
| mtd7  | 01911000 | 0001f000  | "ubi_r0"      |
| mtd8  | 00a0d000 | 0001f000  | "ubi_k1"      |
| mtd9  | 01911000 | 0001f000  | "ubi_r1"      |

To back up a volume, `cat` the appropriate `/dev/ubi0_X` device to a file or pipe, to restore a volume, use the `ubiupdatevol` utility.

This ONT supports dual boot.

Volumes `ubi_k0` and `ubi_r0` respectively contain kernel and rootfs of the first image, while `ubi_k1` and `ubi_r1` contain kernel and rootfs of the second one.

# Useful files and binaries

## Useful files

User Configuration:
```
/var/config/config.xml
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
## Switch PON Mode
```
# RJ45 Ethernet Mode
mib set PON_MODE 0
mib set WAN_PHY_PORT 0
```

```
# GPON mode
mib set WAN_PHY_PORT 5
mib set PON_MODE 1
```

```
# EPON mode
mib set WAN_PHY_PORT 5
mib set PON_MODE 2
```

```
# Fiber Ethernet mode
mib set WAN_PHY_PORT 5
mib set PON_MODE 3
```


## RJ45 Ethernet PON_MODE mapping:
```
# for the first rj45 port (ge1)
mib set WAN_PHY_PORT 0

# for the 2nd rj45 port (ge2)
mib set WAN_PHY_PORT 1

# for the third rj45 port (ge3)
mib set WAN_PHY_PORT 2

# for the last rj45 port (ge4)
mib set WAN_PHY_PORT 3
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
# enable lan 1
mib set SW_PORT_TBL.0.Enable 1
# disable lan 1 power down state
diag port set phy-force-power-down port 0 state disable 

#enable lan 2
mib set SW_PORT_TBL.1.Enable 1
# disable lan 2 power down state
diag port set phy-force-power-down port 1 state disable

# enable lan 3
mib set SW_PORT_TBL.2.Enable 1
# disable lan 3 power down state
diag port set phy-force-power-down port 2 state disable 

#enable lan 4
mib set SW_PORT_TBL.3.Enable 1
# disable lan 4 power down state
diag port set phy-force-power-down port 3 state disable

mib commit
```

## Enable WiFi
```
# 5GHz
mib set WLAN_MBSSIB_TBL.0.wlanDisabled 0
# 2.4GHz
mib set WLAN1_MBSSIB_TBL.0.wlanDisabled 0
sysconf multi_ap_wlan_reinit
```

# Teardown and other photos
<ImageFigure file="Prolink-PGN6401V-twopcb.jpg" alt="Two Prolink PGN6401V PCBs" caption="2 Prolink PGN6401V PCBs" />
