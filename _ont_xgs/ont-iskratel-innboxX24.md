---
title: Innbox X24
has_children: false
layout: default
parent: Iskratel
---

|                 |                                                                            |
| --------------- | -------------------------------------------------------------------------- |
| Vendor          | Iskratel                                                                   |
| Model           | Innbox X24                                                                 |
| CPU             | EcoNet EN7580                                                              |
| DRAM            | 256 MB                                                                     |
| Flash Size      | 128 MB (WINBOND W25N01G)                                                   |
| CPU Arch        | MIPS interAptiv (multi) V2.12 - (2 Core, 4 Threads)                        |
| CPU Clock       | 1.3 GHz                                                                    |
| Bootloader      | Econet free bootbase                                                       |
| System          | Linux version 4.4.115                                                      |
| 10GBaseT        | Yes                                                                        |
| Optics          | SC/APC                                                                     |
| IP address      | 192.168.1.1/24                                                             |
| Web Gui         | ✅                                                                         |
| SSH             | ✅ user: `admin`, password: `c79@NkZ5LJgZ33+Lp6@%`                         |
| Telnet          | ✅                                                                         |
| TFTP            | ✅                                                                         |
| Serial          | ✅                                                                         |
| Serial baud     | 115200                                                                     |
| Serial encoding | 8-N-1                                                                      | 
| Form Factor     | ONT                                                                        |

{% include image.html file="innbox_X24_teardown_1.jpg" alt="Innbox X24 PCB" caption="Innbox X24 PCB" %}

## List of software versions
- 1.13.1507 (Cetin)
- 1.1.1680 (Iskratel)

# GPON ONU status

```sh
csmconf -g /InternetGatewayDevice/X_INNBOX_GPON/ONU/SerialNumber
csmconf -g /InternetGatewayDevice/X_INNBOX_GPON/ONU/VendorId
csmconf -g /InternetGatewayDevice/X_INNBOX_GPON/ONU/Password
csmconf -g /InternetGatewayDevice/X_INNBOX_GPON/ONU/VendorProCode
csmconf -g /InternetGatewayDevice/X_INNBOX_GPON/ONU/OMCCVersion
csmconf -g /InternetGatewayDevice/X_INNBOX_GPON/ONU/Version
/userfs/bin/tcapi show GPON_ONU
/userfs/bin/tcapi show SysInfo_Entry
```

# GPON/OMCI settings

{% include alert.html content="Modify environment and XML variables with caution, if you enter an invalid value that causes the config daemon to crash, the device cannot be recovered without desoldering the SPI chip!" alert="Note"  icon="svg-warning" color="yellow" %}

## Getting/Setting ONU GPON Serial Number
Also sets OMCI vendor ID (ME 256)

```sh
# fad config getenv serial_gpon
serial_gpon=ISKTA1B2C3D4
# fad config setenv serial_gpon ISKTA1B2C3D4
```

## Flash layout
```
dev:    size   erasesize  name
mtd0: 00040000 00020000 "bootloader"		- Econet Bootbase
mtd1: 00040000 00020000 "romfile"
mtd2: 0027c77b 00020000 "kernel"
mtd3: 01320000 00020000 "rootfs"
mtd4: 03000000 00020000 "tclinux"		- TRX Image A
mtd5: 03f80000 00020000 "kernel_slave"
mtd6: 00000000 00000000 "rootfs_slave"
mtd7: 03000000 00020000 "tclinux_slave"		- TRX Image B
mtd8: 00100000 00020000 "config"		- INNDACFG1 - encrypted XML
mtd9: 00100000 00020000 "Equip"			- INNDAENV
mtd10: 00100000 00020000 "WlanE2pData"		- Blank
mtd11: 00100000 00020000 "bootEnv"		- INNDABOOT
mtd12: 00100000 00020000 "VoiceLog"		- Blank
mtd13: 00100000 00020000 "SystemLog"		- Custom syslog storage
mtd14: 00200000 00020000 "SaaS"			- /var/SaaS/ - jffs2
mtd15: 00240000 00020000 "reservearea"		- Blank
```

# Environment partition contents
- INNDAENV
```
passwd_gpon=0000000000 - PLOAM password
serial=3525123456789 - Iskratel serial number
hw_id=InnboxX24_SW2 - Device model
fwupgrade=0 - ?
mp_mode=OFF - ?
lanmac=48:55:41:AA:BB:CC  - MAC address of first LAN port
customer_id=Cetin  - ISP branding, reset to "Iskratel" for unbranded config.
wanmac=64:6E:EA:01:00:01 - MAC address of WAN port
usb_freset=off - ?
hwrev=V1.0 - HW revision
serial_gpon=ISKT23AABBCC - GPON SN 
```

- INNDABOOT
```
fw_slave_full_crc=340607dea7cc3a2f115164b5e9e3b571
boot_full_crc=e72b2000da5e0bafdf983fc8e7daf0bf
fw_main_crc=db3ad7cdc9b1c2c116c5ee36cb3379f6
Image1Commit=0
Image1Active=0
Image0Valid=1
boot_flag=0
Image0Active=1
Image0Commit=1
boot_crc=49d9eec2334e7a24d4c5b6254848b9c7
fw_slave_crc=db3ad7cdc9b1c2c116c5ee36cb3379f6
fw_main_full_crc=340607dea7cc3a2f115164b5e9e3b571
BackUpFwVer=1.13.1507
```


## Usefull links
- [Econet Linux](https://econet-linux.pkt.wiki/en/bootloader)
- [Econet GPL code](https://github.com/cjdelisle/EN751221-Linux26/)
- [Innbox Decryption tools](https://github.com/Troll338cz/CTN_GPON/tree/main/Innbox_X24/utils)
