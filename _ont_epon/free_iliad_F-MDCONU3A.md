---
title: Free/Iliad F-MDCONU3A (v1)
has_children: false
layout: default
parent: Free/Iliad
---

# Hardware Specifications

|                  |                                 |
| ---------------- | ------------------------------- |
| Vendor/Brand     | Free/Iliad                      |
| Model            | F-MDCONU3A                      |
| ODM              | ✅                              |
| ODM Product Code |                                 |
| Chipset          | BCM55030                        |
| Flash            | W25Q32J (4MB SPI)               |
| RAM              | embedded                        |
| CPU              | ARCompact[^arc-isa], big endian |
| CPU Clock        |                                 |
| Bootloader       |                                 |
| System           |                                 |
| Load addr        |                                 |
| HSGMII           | No                              |
| Optics           | SFP w/o MAC                     |
| IP address       |                                 |
| Web Gui          |                                 |
| SSH              |                                 |
| Telnet           |                                 |
| Serial           | ✅                              |
| Serial baud      | 57600                           |
| Serial encoding  | 8-N-1                           |
| Form Factor      | ONT                             |

The BCM55030 is a 10G-EPON ONU/ONT.
The BCM55030's UNI (User Network Interface) side should be capable of 4xSGMII (1 GbE) or 1xXAUI (10 GbE) or 1xXFI (10 GbE SFP) or 1xRGMII, but only one SGMII lane is actually routed.
UNI link won't go up when connected to a media converter or directly to a NIC.

## Serial

The serial port is easily accessible at TP5 and TP6. A prompt is available without authentication, it is structured as a tree of directories. To navigate type the subdirectory name. To go back type `/` and hit enter. To list available commands type `help`.

Available commands:

```
- mac/
	- epon
	- user
- alm/
	- info
	- gpio
- debug/
	- mcast
	- mpcp
	- nco
	- rstp
	- sysd
- epon/
	- eponmac
	- usermac
	- dom
	- ponspeed
- fds/
	- erase
- load/
	- info
	- commit
	- setRecoveryPoint
	- runRecoveryPoint
	- rx
- mcast/
	- domains
	- groups
	- sources
	- reporters
	- igmpinfo
	- igmpsources
- mem/
	- rf
- mpcp/
	- info
	- failsafe
	- oltmac
- pers/
	- read
- serdes/
	- sdextlptest
- stats/
	- clear
	- gather
	- epon
	- fifo
	- lif
	- uni
	- xif
	- statsmode
- log/
	- show
	- level
- sysd/
	- frmdmp
- clionly
- clr
- ints
- reg
- reset
- set
- echo
- sftver
```

`load/info` output:
```
TK2000 APP 3.27 May 13 2016 02:48:05  Chip: 4701 B2110816
Mode: App Normal
EPON MAC: 0x8C97EA6C17AC

Executing: NA
2000 0001 v3.2.7 (Rel)
Size: 319044 CRC: 0x2FAF887F
Type: 02 Subtype 0C Flags 04
Stream: 112 Revision: 131152
Time: 2016-05-18 01:28:44Z

Boot: pass
2000 0000 v3.2.7 (NA)
Size: 42896 CRC: 0xC87371F8
Type: 01 Subtype 0C Flags 04
Stream: 114 Revision: 127457
Time: 2016-01-20 05:45:49Z

App 0: fail
FFFF 0000 vFF.FF.FFFF (NA)
Size: 4294967258 CRC: 0xFFFFFFFF
Type: FF Subtype FF Flags FF
Stream: 4294967295 Revision: 4294967295
Time: 65535-255-255 255:255:255Z

App 1: pass
2000 0001 v3.2.7 (Rel)
Size: 319044 CRC: 0x2FAF887F
Type: 02 Subtype 0C Flags 04
Stream: 112 Revision: 131152
Time: 2016-05-18 01:28:44Z

App 2: pass
2000 0001 v3.2.9 (Rel)
Size: 319240 CRC: 0x3FBE2A30
Type: 02 Subtype 0C Flags 04
Stream: 116 Revision: 167733
Time: 2019-03-13 01:47:37Z

Diag: pass
2000 0001 v3.2.7 (Rel)
Size: 319044 CRC: 0x2FAF887F
Type: 02 Subtype 0C Flags 04
Stream: 112 Revision: 131152
Time: 2016-05-18 01:28:44Z
```

`mem/rf [start address] [lenght]` reads bytes from the flash memory, wraps every 512 kB.

## List of partitions

The flash memory is not actually partitioned, upon reset the CPU loads from address 0 (reset vector) and jumps to another address ([page 74](http://me.bios.io/images/d/dd/ARCompactISA_ProgrammersReference.pdf#%5B%7B%22num%22%3A177%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C72%2C157%2C0%5D)). Each section ends with its CRC.

| Section               | Start address    | End address      | Size           |
| --------------------- | ---------------- | ---------------- | -------------- |
| Bootloader            | 0                | 42896/0xA790     | 42896/0xA790   |
| App 0                 | ?                | ?                | ?              |
| App 1                 | 1179687/0x120027 | 1498731/0x16DE6B | 319044/0x4DE44 |
| App 2                 | 1703975/0x1A0027 | 2023215/0x1EDF2F | 319240/0x4DF08 |
| Diag (copy of App 1?) | 2555943/0x270027 | 2874987/0x2BDE6B | 319044/0x4DE44 |

(End address is non-inclusive)
App 1 and App 2 sections are located at a distance of 512 kB (0x80000) from each other. This probably means that the CPU is capable of addressing only 512 kB of flash. It can be verified also by running the `mem/rf` command, which wraps every 512 kB.

# Userful files and binaries

# EEPROM

There is an SFP plug on the UNI side with an embedded EEPROM.

## EEPROM layout

```
00000000  03 04 00 00 00 00 00 00  00 00 00 00 0a 00 00 00  |................|
00000010  00 00 00 00 46 52 45 45  42 4f 58 00 00 00 00 00  |....FREEBOX.....|
00000020  00 00 00 00 00 8c 97 ea  46 2d 4d 44 43 4f 4e 55  |........F-MDCONU|
00000030  33 41 00 00 00 00 00 00  30 32 00 00 00 00 00 38  |3A......02.....8|
00000040  00 00 00 00 38 36 38 38  30 32 4a 32 30 32 33 34  |....868802J20234|
00000050  36 32 39 35 32 30 30 36  30 39 30 30 00 00 00 ec  |629520060900....|
00000060  38 36 38 38 30 32 4a 32  30 32 33 34 36 32 39 35  |868802J202346295|
00000070  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000080  ff ff ff ff ff ff ff ff  ff ff ff ff ff ff ff ff  |................|
*
00000100  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00000200
```

# Miscellaneous Links

![](https://web.archive.org/web/20230609184811/https://xtech.nikkei.com/dm/article/NEWS/20110121/188932/Broadcom_4.jpg)

[^arc-isa]: *ARCompact Instruction Set Architecture Programmer's Reference* http://me.bios.io/images/d/dd/ARCompactISA_ProgrammersReference.pdf
