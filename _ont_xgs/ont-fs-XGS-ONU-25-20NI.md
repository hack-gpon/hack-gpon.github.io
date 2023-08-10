---
title: ONT FS.com
has_children: false
layout: default
parent: ONT FS.com
---

# Hardware Specifications

|     |     |
| --- | --- |
| Vendor/Brand | FS  |
| Model | XGS-ONU-25-20NI |
| ODM |     |
| Chipset | Cortina CA8271A |
| Flash | 128MB |
| RAM | 128MB |
| System | Custom Linux by Cortina (Saturn SDK) based on Kernel 4.4.198 Saturn-sfpplus-r1 |
| XGMII/XSGMII | Yes |
| Optics | SC/APC |
| IP address | 192.168.100.1 |
| Web Gui |None     |
| SSH |Default Disable     |
| Telnet | ✅ user `PON S/N`, password `8digit HMAC-MD5 (PON S/N uppercase)` |
| Serial | ✅   |
| Serial baud | 115200 |
| Serial encoding | 8-N-1 |
| Form Factor | miniONT SFP+ |

{% include image.html file="XGS-ONU-25-20NI/front.jpg" alt="XGS-ONU-25-20NI front plate" caption="XGS-ONU-25-20NI front plate" %}
{% include image.html file="XGS-ONU-25-20NI/internal.jpg" alt="XGS-ONU-25-20NI internal" caption="XGS-ONU-25-20NI internal layout" %}

## List of software versions
- R4.4.20.018 - 20230426061821 (from #ONT>System/ontver - /etc/version)

## List of partitions
| dev | name | Start Addr | End Addr | size |
| --- | --- | --- | --- | --- |
| mtd0 | ssb | 0x000000000000 | 0x000000400000 | 0x400000 |
| mtd1 | uboot-env | 0x000000400000 | 0x000000500000 | 0x100000 |
| mtd2 | dtb0 | 0x000000500000 | 0x000000600000 | 0x100000 |
| mtd3 | kernel0 | 0x000000600000 | 0x000000c00000 | 0x600000 |
| mtd4 | rootfs0 | 0x000000c00000 | 0x000003400000 | 0x2800000 |
| mtd5 | dtb1 | 0x000003400000 | 0x000003500000 | 0x100000 |
| mtd6 | kernel1 | 0x000003500000 | 0x000003b00000 | 0x600000 |
| mtd7 | rootfs1 | 0x000003b00000 | 0x000006300000 | 0x2800000 |
| mtd8 | userdata | 0x000006300000 | 0x000007700000 | 0x1400000 |
| mtd9 | mfginfo1 | 0x000007700000 | 0x000007800000 | 0x100000 |
| mtd10 | mfginfo2 | 0x000007800000 | 0x000007900000 | 0x100000 |
| mtd11 | uboot-env2 | 0x000007900000 | 0x000007a00000 | 0x100000 |

This ONT supports dual boot. 

`kernel0` and `rootfs0` respectively contain the kernel and firmware of the first image, `kernel1` and `rootfs1` the kernel and the firmware of the second one.

# Serial

This stick has UART pulled out to SFP connectors 2 and 7, but no components are mounted.<br>
Signal level is `3.3V TTL`<br>
Baud rate is `115200 bps`<br>

The UART can be accessed by any of the following methods.
- Touch the needle to a specific point
- Shorting a specific pad to access from SFP

### Touch the needle
The UART can be accessed by connecting a wire or touching a needle to the following points.

{% include image.html file="XGS-ONU-25-20NI/UART_needle.png" alt="XGS-ONU-25-20NI UART Touch point" caption="XGS-ONU-25-20NI UART Touch point" %}

### Access from SFP
By shorting these two points with solder, you can access the UART from SFP pins 2 and 7.<br>

TX : `2 pin`<br>
RX : `7 pin`<br>

{% include image.html file="XGS-ONU-25-20NI/UART_SFP.png" alt="XGS-ONU-25-20NI UART Short point" caption="XGS-ONU-25-20NI UART Short point" %}

{% include image.html file="XGS-ONU-25-20NI/UART_bridge.png" alt="XGS-ONU-25-20NI UART solder bridge" caption="XGS-ONU-25-20NI UART solder bridge" %}


# Login Password
{% include alert.html content="This is an external file ([emulate ONT in QEMU](https://github.com/YuukiJapanTech/CA8271x)), so use it at your own risk!" alert="Note"  icon="svg-info" color="blue" %}

This stick does not have a web console.
To configure it, you must log in via `UART` or `Telnet`.

| User | Password |
| --- | --- |
| `PON S/N` | `8digit HMAC-MD5 (PON S/N uppercase)` |

To generate a password, emulate CIG ONT in Linux QEMU and run GponCLI and execute the following command.
```
sudo apt-get install qemu-user
wget https://github.com/YuukiJapanTech/CA8271x/raw/main/emulate_CIG/GponCLI.tar.gz
sudo tar -xvcf GponCLI.tar.gz -C /emulate_CIG
ROOT=/emulate_CIG/root
sudo chroot $ROOT /bin/GponCLI
ONT> enable
#ONT> system/debug/md5 "your PON-S/N uppercase" 8
```

For example, if the SN is `GPON2350004b`, the user name and password would be

```
#ONT> system/debug/md5 GPON2350004B 8
MD5 Value: UzwugGYT
```

- User : `GPON2350004b`
- Password : `UzwugGYT`

UART does not ask for a login, it is possible to get a root shell without know the password.<br>

### ATTENTION

fscom Stick (`XGS-ONU-25-20NI`) does not have `PON S/N` on the label.<br>
(The S/N field stamped on the label is `fscom internal S/N`. **it is not** `PON S/N`)<br>
The only way to get the `PON S/N` on fscom Stick is to check the boot Log from the `UART` !<br>

# How to get Linux Shell
After logging in via `telnet` or `UART`, you will first get the CLI with user privileges.

```
ONT>
```

The root CLI can be obtained by executing the `enable` command on this CLI.

```
ONT> enable
#ONT>
```

can switch to the Linux root shell by executing the following command.

```
#ONT> system/shell
#ONT/System/Shell> sh
#
```

# Configuration
XGS-ONU-25-20NI ONT uses scfg.txt file and misc command for configuration.
## scfg.txt
In the XGS-ONU-25-20NI ONT, the settings are loaded by four scfg.txt files.
For rewriting settings, `/userdata/scfg.txt` and `/tmp/scfg.txt` are used.

- `/config/default_scfg.txt`  (ReadOnly) <br>
Contains the manufacturer's default settings,<br>
which are read first at ONT startup and are the lowest priority settings.<br>
- `/config/scfg.txt` (ReadOnly)<br>
Contains settings set by the firmware creator,<br>
which have higher priority than default_scfg.txt and will overwrite the settings if there is a conflict.<br>
- `/userdata/scfg.txt` (RW)<br>
Contains settings set by the user or ISP.<br>
It has a higher priority than /config/scfg.txt and will overwritte the settings if there is a conflict.<br>
Can be edited and saved.<br>
- `/tmp/scfg.txt` (Can't Save)<br>
It contains dynamically generated settings based on values stored on its custom ROM (mtd9, mtd10)<br>
Since they are generated on tmpfs and cannot be saved directly,<br>
they are rewritten via the `#ONT> system/misc` command on the ONT.<br>

The settings are overwritten and loaded at startup with the following priority.

***(High)*** `/tmp/scfg.txt` > `/userdata/scfg.txt` > `/config/scfg.txt` > `/config/default_scfg.txt` ***(Low)***

## Misc Command
To configure settings using the MISC command, execute the following command.
```
#ONT> system/misc
#ONT/system/misc>
```


### eqsn set "XXXXxxxxxxxx"
 Write PON S/N.
 For example, if the SN like `ZTEG21100005` (`5a54454721100005`) ,
```
#ONT/system/misc> eqsn set "ZTEG21100005"
```

The get command can also be used to retrieve the set PON S/N.
```
#ONT/system/misc> eqsn get
eqsn: ZTEG21100005
```


### Vendor set "XXXX"
 Write MIB OntG (256) Vendor Code.
 For example, if the Vendor like `ZTEG`,
```
#ONT/system/misc> vendor set "ZTEG"
```

The get command can also be used to retrieve the set PON S/N Vendor field.
```
#ONT/system/misc> vendor get
vendor: ZTEG
```

In this ONT, the MIB OntG Vendor can be set to a value different from the S/N Vendor value.
example,
```
#ONT/system/misc> eqsn get
eqsn: GPON21100005
#ONT/system/misc> vendor get
vendor: ZTEG
```


### pon_passwd set "xxxxxxxxxx"
 Write Loid Password. (Max 20 bytes)
 For example, if the Loid password like `0123456789` ,
```
#ONT/system/misc> pon_passwd set 0123456789
```

The get command can also be used to retrieve the set Loid password.
```
#ONT/system/misc> pon_passwd get
eqsn: 01234567890000000000
```


### exeep_w8 "xxxxxxxxxx"
 Write PLOAM Password (Registration ID).
 For example, if the Loid password like `G01234567` ,
```
#ONT/system/misc> exeep_w8 "G01234567"
```

The `exeep_r8` command can also be used to retrieve the set PLOAM password.
```
#ONT/system/misc> exeep_r8
[00, 000] 44 45 46 41 55 4c 54 00 - 00 00 00 00 00 00 00 00     |  DEFAULT......
[10, 016] 00 00 00 00 00 00 00 00 - 00 00 00 00 00 00 00 00     |  .............
[20, 032] 00 00 00 00 ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[30, 048] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[40, 064] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[50, 080] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[60, 096] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[70, 112] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[80, 128] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[90, 144] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[a0, 160] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[b0, 176] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[c0, 192] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[d0, 208] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[e0, 224] ff ff ff ff ff ff ff ff - ff ff ff ff ff ff ff ff     |  .............
[f0, 240] ff ff ff ff ff ff ff ff - ff ff ff ff 15 91 f3 9f     |  ............k
```

# Show ONT Registration State
Can check the ONT Registration State with the following command.

```
#ONT> traffic/pon/show onu

------------------------- ONU INFO --------------------------

Onu id 65535
sdThreshold:   0
sfThreshold:   0
TO1:   80000
TO2:   1
eqd:   0
Serial Number(vendor code): GPON
Serial Number(sn):          2350004b
Password:                   41 42 43 44 45 46 47 48 49 4a
Registration ID:           0x44454641554c540000000000000000000000000000000000000000000000000000000000
------------------------- INFO END --------------------------

#ONT> 
```

# Show MIB info
Can check the ONT MIB info with the following command.
```
#ONT> system/mib
#ONT/system/mib> 

```

### show
Displays a list of MIBs supported by ONT.
```
#ONT/system/mib> show
This command prints out the content of a mib table.
Usage: show CLASSID
CLASSID:
      the class ID of the ME, defined in 983.2/984.4, currently
the following MEs are supported:
ClassID  Name            Desc
256      Ontg            Ont-g
etc...
```

### show XXX
Displays the value of a specific MIB.
For example, When displaying MIB256 (ont-g).
```
#ONT/system/mib>show 256
Table Ontg, Ont-g, total 1 instances

EntityID                  = 0x0000
VID                       = "GPON"
Version                   = 58 47 2d 39 39 53 00 00 00 00 00 00 00 00
SerialNum                 = 47 50 4f 4e 23 50 00 4b
TraffMgtOpt               = 2
AtmCCOpt                  = 0
BatteryBack               = 1
AdminState                = 0
OpState                   = 0
OnuSurvivalTime           = 0
Loid                      = ""
Password                  = ""
AuthState                 = 0
OntState                  = 1

#ONT/system/mib>
```

### dump
Output a dump of mib to `/tmp/mibdump.txt`
```
#ONT/system/mib> dump
MIB is saved to the file /tmp/mibdump.txt.
#ONT/system/mib>
```

# Bricked Stick Repair
{% include alert.html content="This is an external file ([mtd dump](https://github.com/YuukiJapanTech/CA8271x)), so use it at your own risk!" alert="Note"  icon="svg-info" color="blue" %}

If the stick is bricked, it can be repaired by accessing uboot from the UART.

If Stick fails to boot, uboot will enable text input.
```
ERROR: can't get kernel image!
SATURN#
```

Download Stick's mtd dump from [mtd dump.](https://github.com/YuukiJapanTech/CA8271x/tree/main/mtd)

Enable nand with the following command.
```
SATURN# spi_nand probe 0
SPI_NAND ID: 0x12c200
SPI-NAND: MX35LF1GE4AB is found.
MX35LF1GE4AB
spinand_oob_size:0x40
spinand_page_size:0x800
spinand_blk_size:0x20000
spinand_size:0x8000000
SATURN#
```

Receive the file with the loadb command.
```
SATURN# loadb 0x80000000
## Ready for binary (kermit) download to 0x80000000 at 115200 bps...
```

Using Tera Term, send the Kernel image (mtd3 or mtd6) by kermit transfer.
{% include image.html file="XGS-ONU-25-20NI/Stick_Rep.png" alt="XGS-ONU-25-20NI Repair" caption="XGS-ONU-25-20NI Repair" %}

Erase NAND and write the transferred kernel.
```
SATURN# spi_nand erase 0x000000600000 0x600000
SATURN# spi_nand erase 0x000003500000 0x600000
SATURN# spi_nand write 0x80000000 0x000000600000 0x600000
SATURN# spi_nand write 0x80000000 0x000003500000 0x600000
```

Receive the file with the loadb command.
and Using Tera Term, send the rootfs image (mtd4 or mtd7) by kermit transfer.
```
SATURN# loadb 0x81000000
## Ready for binary (kermit) download to 0x81000000 at 115200 bps...
```

Erase NAND and write the transferred rootfs.
```
SATURN# spi_nand erase 0x000000c00000 0x2800000
SATURN# spi_nand erase 0x000003b00000 0x2800000
SATURN# spi_nand write 0x81000000 0x000000c00000 0x2800000
SATURN# spi_nand write 0x81000000 0x000003b00000 0x2800000
```

When the Stick is turned back on, it will boot with the transferred kernel and rootfs.

# Miscellaneous Links
- [GitHub - CA8271x](https://github.com/YuukiJapanTech/CA8271x)
