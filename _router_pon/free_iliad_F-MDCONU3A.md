---
title: Free/Iliad F-MDCONU3A
has_children: false
layout: default
parent: Free/Iliad
---

# Hardware Specifications

|                  |                                         |
| ---------------- | --------------------------------------- |
| Vendor/Brand     | Free/Iliad                              |
| Model            | F-MDCONU3A                              |
| ODM              |           			             |
| ODM Product Code |                                         |
| Chipset          | BCM55030                                |
| Flash            | W25Q32J (4MB SPI)                       |
| RAM              | embedded                                |
| CPU              | ?                                	     |
| CPU Clock        | ?                   			|
| Bootloader       | ?                                        	|
| System           | ?                                        	|
| Load addr        | ?                                        	|
| HSGMII           | Yes?        				|
| 2.5GBaseX        | No         				|
| 2.5GBaseT        | No			                     	|
| XGMII/XSGMII     | No           				|
| 10GBaseX         | No        					|
| 10GBaseT         | No                    			|
| 2.5/5/10GBaseT   | No?           				|
| Optics           | SFP	                             |
| IP address       | ?                                       |
| Web Gui          | ?                              	     |
| SSH              | ?					     |
| Telnet           | ?					     |
| Serial           | ✅                                       |
| Serial baud      | 57600                                   |
| Serial encoding  | 8-N-1                                   |
| Form Factor      | ONT		                     |

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

## Firmware is interchangeable with

## List of software versions

## List of partitions

Encrypted.

# Userful files and binaries

## Useful files

## Useful binaries

# GPON ONU status

## Get the operational status of the ONU

## Get information of the OLT vendor

## Querying a particular OMCI ME

## Getting/Setting Speed LAN Mode

# GPON/OMCI settings

## Getting/Setting ONU GPON Serial Number

## Getting/Setting ONU GPON PLOAM password

## Getting/Setting ONU GPON LOID and LOID password

## Getting/Setting OMCI software version (ME 7)

## Getting/Setting OMCI hardware version (ME 256)

## Getting/Setting OMCI vendor ID (ME 256)

## Getting/Setting OMCI equipment ID (ME 257)

# Advanced settings

## Setting management MAC

## Setting management IP

## Rebooting the ONU

## Creating a new rootfs

## Flashing a new rootfs

# SFP EEPROM settings

## Reading all EEPROM

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

# Known Bugs

# Miscellaneous Links

{% include image.html file="iliad\onu1\BCM55030_features.jpg" alt="BCM55030 features" caption="BCM55030 features" %} 
