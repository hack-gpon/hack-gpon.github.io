---
title: ODI Realtek DFP-34X-C2C 
description: New model 2022
has_children: false
layout: default
parent: ODI
---

# Hardware Specifications

|             |                                   |
| ----------- | --------------------------------- |
| Vendor      | ODI                               |
| Model       | DFP-34X-C2C                       |
| Chipset     | Realtek RTL9601D                  |
| Flash       | 8 MB                              |
| RAM         | 64 MB                             |
| System      | Linux (Luna SDK)                  |
| HSGMII      | Yes                               |
| Optics      | SC/APC                            |
| IP address  | 192.168.1.1                       |
| Web Gui     | ✅ user `admin`, password `admin` |
| SSH         | ✅ user `admin`, password `admin` |
| Form Factor | miniONT SFP                       |

{% include alert.html content="SSH uses an outdated set of algorithm/ciphers, you can connect using the following command:" alert="Note"  icon="svg-info" color="blue" %}

```shell
ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 -oCiphers=+3des-cbc admin@192.168.1.1
```

{% include image.html file="realtek-dfp-34x-2c2.jpg" alt="ODI Realtek DFP-34X-C2C" caption="ODI Realtek DFP-34X-C2C" %}


## List of software versions
- V1.0-220530 
- V1.0-220414
- V1.0-220304

## List of firmwares and files
- [V1.0-220530 Modded](https://github.com/Anime4000/RTL960x/files/8821809/M114_sfp_ODI_hybrid_220527_stich86_220530.tar.zip){: .btn } 
 by [stich86](https://github.com/stich86) **SUGGESTED** since it has working VLAN translation.  

## List of partitions
 
| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00001000  | "boot"          |
| mtd1  | 00002000 | 00001000  | "env"           |
| mtd2  | 00002000 | 00001000  | "env2"          |
| mtd3  | 0003c000 | 00001000  | "config"        |
| mtd4  | 0014c000 | 00001000  | "k0"            |
| mtd5  | 00274000 | 00001000  | "r0"            |
| mtd6  | 0014c000 | 00001000  | "k1"            |
| mtd7  | 00274000 | 00001000  | "r1"            |
| mtd8  | 00001000 | 00001000  | "Partition_008" |
| mtd9  | 00001000 | 00001000  | "Partition_009" |
| mtd10 | 00001000 | 00001000  | "Partition_010" |
| mtd11 | 00001000 | 00001000  | "Partition_011" |
| mtd12 | 0014c000 | 00001000  | "linux"         |
| mtd13 | 00274000 | 00001000  | "rootfs"        |

This stick supports dual boot. 

`k0` and `r0` respectively contain the kernel and firmware of the first image, `k1` and `r1` the kernel and the firmware of the second one

# Serial

The stick has exposed TTL pads:

{% include image.html file="ont-odi-realtek-dfp-34x-2c2/ttl.jpg"  alt="DFP-34X-2C2 TTL Connection" caption="DFP-34X-2C2 TTL Connection" %}
{% include image.html file="ont-odi-realtek-dfp-34x-2c2/ttl-2.jpg"  alt="DFP-34X-2C2 TTL Pin" caption="DFP-34X-2C2 TTL Pin" %}

| USB TTL(UART) Adapter | wire colour in picture | SFP 20pins Molex connector and TTL pinout |
| --------------------- | ---------------------- | ----------------------------------------- |
| 3.3V                  | blue                   | pin #15 and #16                           |
| TX                    | purple                 | TX                                        |
| RX                    | white                  | RX                                        |
| GND                   | green                  | pin #10                                   |

Configuration: asc0=0 115200 8-N-1

# Useful Commands

## Getting/Setting the ONT's S/N
```sh
# flash get GPON_SN
GPON_SN=TMBB00000000
# flash set GPON_SN TMBB0A1B2C3D
```

## Getting/Setting the ONT's PLOAM password

{% include alert.html content="The PLOAM password is stored in HEX format, with no 0x or separator" alert="Note"  icon="svg-info" color="blue" %}

```sh
# flash get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=41414141414141414141
# flash set GPON_PLOAM_PASSWD 41414141414141414141
```

## Getting/Setting the ONT Vendor ID

{% include alert.html content="this may need OMCI_OLT_MODE set to 3 to work" alert="Note" icon="svg-info" color="blue" %}

```sh
# flash get PON_VENDOR_ID  
PON_VENDOR_ID=ZTEG
# flash set PON_VENDOR_ID HWTC
```

## Getting/Settng the ONT Custom software version
{% include alert.html content="this needs OMCI_OLT_MODE set to 3 and firmware 220530 modded by stich86" alert="Note" icon="svg-info" color="blue" %}

```sh
# nv setenv sw_custom_version0 YOURFIRSTSWVER
# nv setenv sw_custom_version1 YOURSECONDSWVER
```

## Getting/Setting a custom HW Version
{% include alert.html content="this probably needs OMCI_OLT_MODE set to 3" alert="Note" icon="svg-info" color="blue" %}


```sh
# flash get HW_HWVER
HW_HWVER=V2.0
# flash set HW_HWVER MYHWVERSION
```

## Getting/Setting a custom ONT Equipment ID
{% include alert.html content="this probably needs OMCI_OLT_MODE set to 3" alert="Note" icon="svg-info" color="blue" %}
```sh
# flash get GPON_ONU_MODEL
GPON_ONU_MODEL=DFP-34X-2C2
# flash set GPON_ONU_MODEL DFP-34X-XXX
```

## Checking the currently active image
```sh
# nv getenv sw_active
sw_active=1
```

## Booting to a different image
```sh
# nv setenv sw_commit 0|1
# reboot
```

## Querying a particular OMCI ME
```sh
# omcicli mib get MIB_IDX
```

# Known Bugs

- Auto-sensing mode to switch between SGMII/HiSGMII

# Low level modding


# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [Ditch ONU, use GPON SFP on Business Grade Router, Mikrotik/Ubiquiti/pfSense (Home Networking)](https://forum.lowyat.net/topic/4925452)
- [For the new model ODI ZTE DFP-34X-C2C](/ont-odi-zte-dfp-34x-2c2)


