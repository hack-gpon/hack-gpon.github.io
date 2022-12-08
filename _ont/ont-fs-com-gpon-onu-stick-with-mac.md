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
| CPU         | MIPS 34Kc interAptiv                       |
| CPU Clock   | 400MHz                                     |
| Flash       | 16 MB                                      |
| RAM         | 64 MB                                      |
| Bootloader  | U-Boot 2011.12-lantiq-gpon-1.2.24          |
| System      | OpenWRT 14.07_ltq (Kernel 3.10.49)         |
| Serial baud | 115200                                     |
| Load addr   | 0x80800000                                 |
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

## Bootloader unlock from shell
{% include alert.html content="It is strongly recommended that you unlock the bootloader before making any major changes to the firmware." alert="Warning"  icon="svg-warning" color="yellow" %}
```sh
fw_setenv bootdelay 5
fw_setenv asc0 0
fw_setenv preboot "gpio input 105;gpio input 106;gpio input 107;gpio input 108;gpio set 3;gpio set 109;gpio set 110;gpio clear 423;gpio clear 422;gpio clear 325;gpio clear 402;gpio clear 424"
```
If you haven't done this and the stick doesn't work due to your changes you can follow the [Huawei MA5671A unlock guide](/ont-huawei-ma5671a-root)

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
Software 6BA1896SPLQA41 and before (See [Carlito Firmware](/ont-huawei-ma5671a-carlito))
```sh
fw_setenv nPassword "0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39"
```

Software 6BA1896SPLQA42 and after:
```sh
sfp_i2c -i11 -s "0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39"
```

## Setting LOID and Checkcode Password
Software 6BA1896SPLQA41 and before (See [Carlito Firmware](/ont-huawei-ma5671a-carlito))
```sh
fw_setenv omci_loid 1234567890
fw_setenv omci_lpwd password01
```

Software 6BA1896SPLQA42 and after:
```sh
sfp_i2c -i9 -s "1234567890"
sfp_i2c -i10 -s "password01"
```

## Setting eqipment id (ME 257)
```sh
sfp_i2c -i6 -s "YOUR_EQUIPMENT_ID"
```

## Setting vendor id (ME 256)
```sh
sfp_i2c -i7 -s "YOUR_VENDOR_ID"
```

## Change ONU hardware version (ME 256)
```sh
cp /etc/mibs/data_1g_8q.ini /etc/mibs/data_1g_8q.ini.bak
sed 's/256 0 HWTC 0000000000000/256 0 YOUR_VENDOR_ID YOUR_ONU_VERSION/' -i /etc/mibs/data_1g_8q.ini
```

## Enable `data_1g_8q_us1280_ds512.ini` OMCI MIB file for 2500 Mbps profiles
{% include alert.html content="The patch below is only compatible with the firmware version `6BA1896SPLQA42`" alert="Info" icon="svg-info" color="blue" %}
{% include alert.html content="If you need to set the ONU version remember that you will have to do it using the MIB file `/etc/mibs/data_1g_8q_us1280_ds512.ini` instead of `/etc/mibs/data_1g_8q.ini`" alert="Info" icon="svg-info" color="blue" %}

The MIB file `data_1g_8q_us1280_ds512.ini` is very useful to avoid performance problems in situations where 2500 Mbps speed profiles are used, to enable it you need to run this command:
```sh
fw_setenv mib_file data_1g_8q_us1280_ds512.ini
```

## Use custom OMCI MIB file
{% include alert.html content="If you need to set the ONU version remember that you will have to do it using your custom MIB file instead of `/etc/mibs/data_1g_8q.ini`" alert="Info" icon="svg-info" color="blue" %}

You have to copy the MIB file to /etc/mibs and then run this command:
```sh
fw_setenv mib_file YOUR_MIB_FILENAME
```

## Change image software version (ME 7)
{% include alert.html content="The patch below is only compatible with the firmware version `6BA1896SPLQA42`" alert="Info" icon="svg-info" color="blue" %}

The image version normally couldn't be changed because it was hard-coded into the `/opt/lantiq/bin/omcid` binary, 
so you need to then modify the binary with the following hex patch which removes the hardcoded version.

```
< 000084c0: 9a43 931f f760 d840 9b64 f760 d864 1a00  .C...`.@.d.`.d..
< 000084d0: 1acf 6500 1a20 2268 940a 2205 b468 1a00  ..e.. "h.."..h..
---
> 000084c0: 9a43 931f f760 d840 9b64 f760 d864 6500  .C...`.@.d.`.de.
> 000084d0: 6500 6500 1a20 2268 940a 2205 b468 1a00  e.e.. "h.."..h..

```

{% include alert.html content="Proceed only if your `md5sum /opt/lantiq/bin/omcid` has the correct checksum `7e97163e24c9cb39439589c65b438168`" alert="Info" icon="svg-info" color="blue" %}

This is the patch, encoded in base64
```
QlNESUZGNDA1AAAAAAAAAD4AAAAAAAAA2C8JAAAAAABCWmg5MUFZJlNZYqnvBwAACFBSQWAAAMAA
AAgAQCAAMQwIIwjImgDOdMvi7kinChIMVT3g4EJaaDkxQVkmU1lrJSbUAACFTAjAACAAAAiCAAAI
IABQYAFKQ01INxUgd6Soj2JURm8pUR8XckU4UJBrJSbUQlpoORdyRThQkAAAAAA=
```
Save it on your computer (not on the stick) as `omcid_patch.base64`, then run:
```sh
base64 -d omcid_patch.base64 > omcid.bspatch
bspatch <your_original_omcid> omcid omcid.bspatch
```
{% include alert.html content="if you don't have bspatch installed, most distributions includes it in bsdiff package" alert="Info" icon="svg-info" color="blue" %}

After patching the resulting patched `omcid` should have an md5 checksum of `525139425009c4138e92766645dad7d0`.
If that also checks, go on making a backup copy of your original `omcid` on the stick.

```sh
cd /opt/lantiq/bin
cp omcid omcid.original
```

And finally to copy via SCP the modified `omcid` binary in the `/opt/lantiq/bin/omcid` path.
Before restarting the stick and applying changes, make sure omcid has execution bit set.

```sh
chmod ugo+x /opt/lantiq/bin/omcid
```

Is also a good time to set the image0/image1_version. Crash has reported if they are not set correctly before reboot.
```sh
fw_setenv image0_version YOUR_IMAGE0_VERSION
fw_setenv image1_version YOUR_IMAGE1_VERSION
```

Now you can restart the stick.
{% include alert.html content="Be aware that sometimes `omcid` can rewrite the two variables when runs in non patched state. After reboot, double check the values you put are still there." alert="Info" icon="svg-info" color="blue" %}

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
- [6BA1896SPLQA42 MTD2/Image0](https://mega.nz/file/AgshDICC#md1vLN14JBF3iaNoZBqQH_zwALHmEaOk3_rDm1FfOic){: .btn } md5hash: 04533554bb0c8b997697fbc048159002

# Known Bugs
# Miscellaneous Links

- [FS.com](https://www.fs.com/it/products/133619.html)
- [General setting of lantiq](https://forum.fibra.click/d/23881-ma5671a-e-vodafone-25-gbps/64)
- [Usage GPON module SFP in Spain](https://forum.mikrotik.com/viewtopic.php?t=116364&start=300)
