---
title: ZTE F601 
has_children: false
layout: default
parent: ZTE
---

# Hardware Specifications

|              |                                                                   |                                                                   |             |                           |
| ------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- | ------------------------- |
| Vendor/Brand | ZTE                                                               | ZTE                                                               | ZTE         | ZTE                       |
| Model        | F601v6                                                            | F601v7                                                            | F601v8      | F601v9                    |
| ODM          | ✅                                                                | ✅                                                                |             | ✅                        |
| CPU          | ZTE FA626TE                                                       | ZTE ZX279125@A9                                                   |             | ZX279127S                 |
| CPU Clock    | 266 MHz                                                           | 600 MHz                                                           |             |                           |
| Chipset      | ZTE FA626TE                                                       | ZTE ZX279125@A9                                                   |             |                           |
| Flash        | 16 MB (SPI Flash w25q128)                                         | 16 MB (SPI Flash mx25l12805d)                                     |             | ZX279127S                 |
| RAM          | 32 MB                                                             | 32 MB                                                             |             | 128 MB (ESMT M15T1G1664A) |
| System       |                                                                   |                                                                   |             |                           |
| 2.5GBaseT    | No                                                                | No                                                                | No          | No                        |
| Optics       | SC/APC or SC/UPC                                                  | SC/APC                                                            | SC/APC      | SC/APC                    |
| IP address   | 192.168.1.1                                                       | 192.168.1.1                                                       | 192.168.1.1 |                           |
| Web Gui      | ✅ user `admin`, password `admin` or user `user`, password `user` | ✅ user `admin`, password `admin` or user `user`, password `user` |             |                           |
| SSH          |                                                                   |                                                                   |             |                           |
| Telnet       |                                                                   |                                                                   |             |                           |
| Serial       | ✅                                                                | ✅                                                                 |             |                           |
| Form Factor  | ONT                                                               | ONT                                                               | ONT         | ONT                       |

{% include image.html file="f601_v6_1.jpg" alt="F601 v6" caption="F601 v6" %}
{% include image.html file="f601_v7.jpg" alt="F601 v7" caption="A wall made out of broken F601 v7" %}
{% include image.html file="f601v9/front.jpg" alt="F601 v9" caption="F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}

## List of software versions
### HW V6.0 
- V6.0.10P6T1 (OpenFiber) 
- V6.0.10P6T4 (OpenFiber)
- V6.0.10P6N7 (OpenFiber)
- V6.0.10N40 (TIM Italy)
- V6.0.10P3T1 (Generic)
- V6.0.10P1T26 (Generic)

### HW V7.0
- V7.0.10P6N7 (OpenFiber)
- V7.0.10P6T4 (Generic)

### HW V9.0
- V9.0.10P2N1

## List of partitions (V6.0/V7.0)
 
| dev  | size     | erasesize | name           |
| ---- | -------- | --------- | -------------- |
| mtd0 | 01000000 | 00010000  | "whole flash"  |
| mtd1 | 00080000 | 00010000  | "uboot"        |
| mtd2 | 00700000 | 00010000  | "kernel0"      |
| mtd3 | 00700000 | 00010000  | "kernel1"      |
| mtd4 | 00010000 | 00010000  | "others"       |
| mtd5 | 00010000 | 00010000  | "parameter tags" |
| mtd6 | 00160000 | 00010000  | "usercfg"  |


This ONT supports dual boot, as visible from the presence of `kernel0` and `kernel1`, which contain the rootfs.
The boot image can be swapped with the following command:

```sh
upgradetest switchver X
```

Where `X` can be `0/1` based on the image you want to boot.

# General Settings and Useful Commands 
{% include alert.html content="Commands have been tested on V6/V7 HW rev on TIM and OF firmware" alert="Note"  icon="svg-info" color="blue" %}

## Changing the ONT's S/N
{% include alert.html content="You have to change S/N and the VID. 2176 is for the VID (first 4 letters of the S/N) and 2177 is for the last 8 digits" alert="Note"  icon="svg-info" color="blue" %}
```sh
setmac 1 2176 ZTEG
setmac 1 2177 AABBCCDD
```

## Changing the ONT's PLOAM password
{% include alert.html content="The PLOAM password is stored in the ASCII format." alert="Note"  icon="svg-info" color="blue" %}
This can be done easily via web ui. If you prefer to do it via the shell use:
```sh
setmac 1 2181 1234567890
setmac 1 2178 1234567890
```

## Checking connection state
To see the connection state use the following command:
```
gpontest -gstate
```
`[gpontest] gpon state is [O5]` for O5 state

## Querying a particular OMCI ME

First enable printf on console usin the following command:

```sh
redir printf
```

Then query the OMCI ME Class needed with this command:

```sh
sendcmd 132 omcidebug showmedata ID_MIB (eg. 131 for OLT type)
```

This command will print out the result like this one:

```sh
##################################
MIB INFO:
         ME CLASS: 131
         DB NAME: olt_g, DBHandle: 32
##################################

<-----MeID[ 0x0000,0 ], Addr[ 0x19a2b1]----->
         Vendorid:48 57 54 43
      EquipmentID:00 00 00 00 00 00 00 00 00 00
                    00 00 00 00 00 00 00 00 00 00
          Version:31 30 00 00 00 00 00 00 00 00
                    00 00 00 00
        TimeofDay:00 00 00 00 00 00 00 00 00 00
                    00 00 00 00
---------------------------------------------------------------------
```

# Random notes
- The F601v7 is mounted 'upside down' to save on waveguides, the LEDs would be on the bottom of the PCB, so it would have to be turned upside down to make it cooler...
- The F601v6 turns on and runs even with 9V input
- The F601v7 turns on and runs even with 5V input

# Miscellaneous Links

- [ZTE config.bin decoder](https://github.com/mkst/zte-config-utility)
- [Usource GPON ONU STICK](https://www.usourcetech.com/web/userfiles/download/GPONSTICKSFPCLASSB-2B_Rev01.pdf)
- [GPON module Dfp-34g-2c2 sfp](https://forum.openwrt.org/t/gpon-module-dfp-34g-2c2-sfp/51641)

# Theardown and other photos

## HW V6.0

{% include image.html file="f601_v6_2.jpg"  alt="Bottom of the F601 v6" caption="Bottom of the F601 v6 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v6_teardown_1.jpg"  alt="Teardown of the F601 v6" caption="Teardown of the F601 v6  <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v6_teardown_2.jpg"  alt="Teardown of the F601 v6" caption="Teardown of the F601 v6 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v6_teardown_3.jpg"  alt="Teardown of the F601 v6" caption="Teardown of the F601 v6 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}

## HW V7.0

{% include image.html file="f601_v7_1.jpg"  alt="Bottom of the F601 v7" caption="Bottom of the F601 v6 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown.jpg"  alt="Bottom of the F601 v7" caption="Teardown of the F601 v7 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown_1.jpg"  alt="Teardown of the F601 v7" caption="Teardown of the F601 v7  <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown_2.jpg"  alt="Teardown of the F601 v7" caption="Teardown of the F601 v7 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown_3.jpg"  alt="Teardown of the F601 v7" caption="Teardown of the F601 v7 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown_4.jpg"  alt="Teardown of the F601 v7" caption="Teardown of the F601 v7 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}

## HW V9.0

{% include image.html file="f601v9/front.jpg"  alt="Front of the F601 v9" caption="Bottom of the F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f601v9/back.jpg"  alt="Bottom of the F601 v9" caption="Bottom of the F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f601v9/teardown-1.jpg"  alt="Teardown of the F601 v9" caption="Teardown of the F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f601v9/teardown-2.jpg"  alt="Teardown of the F601 v9" caption="Teardown of the F601 v9  <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f601v9/teardown-3.jpg"  alt="Teardown of the F601 v9" caption="Teardown of the F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
