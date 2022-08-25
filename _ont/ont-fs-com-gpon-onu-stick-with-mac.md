---
title: ONT FS.com GPON ONU Stick with MAC (GPON-ONU-34-20BI)
has_children: false
alias: SourcePhotonics SPS-34-24T-HP-TDFO
layout: default
---

# Hardware Specifications

|             |                                            |
| ----------- | ------------------------------------------ |
| Vendor      | SourcePhotonics                            |
| Model       | SPS-34-24T-HP-TDFO                         |
| Chipset     | Lantiq PEB98035                            |
| Flash       | 16 MB                                      |
| RAM         | 64 MB                                      |
| Bootloader  | U-Boot 2011.12-lantiq-gpon-1.2.24          |
| System      | OpenWRT 14.07_ltq (Kernel 3.10.49)         |
| HSGMII      | Yes                                        |
| Optics      | SC/APC                                     |
| IP address  | 192.168.1.10                               |
| Web Gui     |                                            |
| SSH         | ✅ user `ONTUSER`, password `7sp!lwUBz1`   |
| Form Factor | miniONT SFP                                |

{% include image.html file="ont-fs.jpg" alt="ONT FS.com GPON ONU" caption="ONT FS.com GPON ONU" %}
{% include image.html file="ont-fs-box.jpg" alt="ONT FS.com GPON ONU in the box" caption="ONT FS.com GPON ONU in the box" %}

## Possible clones

- SourcePhotonics SPS-34-24T-HP-TDFO

## Firmware is interchangeable with:

- [Huawei MA5671A](/ont-huawei-ma5671a)
- [Nokia G-010S-P](/ont-nokia-g-010s-p)
- [Hilink HL23446](/ont-hilink-hl23446)
- {:.text-red-200 } Dasan H650SFP 
- {:.text-red-200 } DpOptics D23446    
- {:.text-red-200 } Photonics SPS-34-24T-HP-TDFO

# General setting


## Setting S/N
```sh
set_serial_number ABCD12345678
```
Or:
```sh
sfp_i2c -i8 -s "ABCD12345678"
```

## Obtain S/N setted
```sh
fw_printenv | grep nSerial
```
Or:
```sh
sfp_i2c -g
```

## Setting PLOAM Password
Software 6BA1896SPLQA41 and before:
```sh
fw_setenv nPassword "0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39"
```

Software 6BA1896SPLQA42 and after:
```sh
sfp_i2c -i11 -s "0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39"
```

## Setting LOID and Checkcode Password
Software 6BA1896SPLQA41 and before:
```sh
fw_setenv omci_loid 1234567890
fw_setenv omci_lpwd password01
```

Software 6BA1896SPLQA42 and after:
```sh
sfp_i2c -i9 -s "1234567890"
sfp_i2c -i10 -s "password01"
```

## Setting eqipment id
```sh
sfp_i2c -i6 -s "22133912P"
```

## Setting vendor id
```sh
sfp_i2c -i7 -s "SPGA"
```

## Setting Lantiq MAC address
```sh
uci set network.lct.macaddr=00:06:B5:07:D6:04
uci set network.host.macaddr=00:06:B5:07:D8:04
uci commit network.lct.macaddr=00:06:B5:07:D6:04
uci commit network.host.macaddr=00:06:B5:07:D8:04
```

## Setting Lantiq IP address
```sh
fw_setenv ipaddr 192.168.20.60
fw_setenv gatewayip 192.168.20.1
```

## Read all EEPROM
```sh
sfp_i2c -r
```

## Get Firmware version
```sh
strings /opt/lantiq/bin/omcid | grep ^software_Version | awk -F[=,] '{print $2}'
```

## Get Firmware build time
```sh
strings /opt/lantiq/bin/omcid | grep compiled
```

## Setting Onu reboot
```sh
reboot
```

## Reinitialize the EEPROM without rebooting 
{% include alert.html content="This will cause you to disconnect from the current ssh session."  alert="Warning"  icon="svg-warning" color="yellow" %}
```sh
reload_i2c.sh
```

## Reset EEPROM to default values and reinitialize 
{% include alert.html content="This command is not reversible, all the EEPROM data will be restored to the factory values!"  alert="Warning"  icon="svg-warning" color="red" %}
{% include alert.html content="This will cause you to disconnect from the current ssh session."  alert="Warning"  icon="svg-warning" color="yellow" %}
```sh
sfp_i2c -d yes
reload_i2c.sh
```

## List of software versions
- 6BA1896SPLQA13 (Dec 16 2016)
- 6BA1896SPLQA41
- 6BA1896SPLQA42 (Sep 18 2021)

## List of partitions
When image0 is committed: 

| dev  | size     | erasesize | name          |
| ---- | -------- | --------- | ------------- |
| mtd0 | 00040000 | 00010000  | "uboot"       |
| mtd1 | 00080000 | 00010000  | "uboot_env"   |
| mtd2 | 00740000 | 00010000  | "linux"       |
| mtd3 | 0061eedc | 00010000  | "rootfs"      |
| mtd4 | 00370000 | 00010000  | "rootfs_data" |
| mtd5 | 00800000 | 00010000  | "image1"      |

When image1 is committed: 

| dev  | size     | erasesize | name          |
| ---- | -------- | --------- | ------------- |
| mtd0 | 00040000 | 00010000  | "uboot"       |
| mtd1 | 00080000 | 00010000  | "uboot_env"   |
| mtd2 | 00740000 | 00010000  | "image0"      |
| mtd3 | 00800000 | 00010000  | "linux"       |
| mtd4 | 006d8077 | 00010000  | "rootfs"      |
| mtd5 | 00410000 | 00010000  | "rootfs_data" |

## List of firmwares and files
- [6BA1896SPLQA13 MTD0/U-Boot](https://mega.nz/file/wptjyYiS#Xj3cijX2bN0FexsZr1Wn7iRG0Wy4Z8vX0NyNBd1kBWo){: .btn } md5hash: 992b31a67c644aa68cf7f9caf956b1f9
- [6BA1896SPLQA13 MTD2/Image0](https://mega.nz/file/1kUlUbgQ#ANS9qH6wCggYshsQ3STD6gxmR_3TL-5MXfdCl5s50Nk){: .btn } md5hash: 5d46a9acc3c5ba8710887aa32b82aeb4
- [6BA1896SPLQA42 MTD0/U-Boot](https://mega.nz/file/FkswHbgL#s7-vaH65EPQ2O5vKeD3bU1_RPwzaKPOJdrCWvPQqDvc){: .btn } md5hash: 992b31a67c644aa68cf7f9caf956b1f9
- [6BA1896SPLQA42 MTD2/Image0](https://mega.nz/file/NoUnHJaC#u7P4sousHoMjZn7ruK6BSaIcV5T0yBj8xTGa0rDmm_E){: .btn } md5hash: 914b789fbf7bd4e157c7737d9be4cb5f

# Known Bugs
# Miscellaneous Links

- [FS.com](https://www.fs.com/it/products/133619.html)
- [General setting of lantiq](https://forum.fibra.click/d/23881-ma5671a-e-vodafone-25-gbps/64)
- [Usage GPON module SFP in Spain](https://forum.mikrotik.com/viewtopic.php?t=116364&start=300)
