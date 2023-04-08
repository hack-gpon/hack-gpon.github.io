---
title: FreeBox Pop/IliadBox
has_children: false
layout: default
parent: Free/Iliad
---

# Hardware Specifications

|                  |                                         |
| ---------------- | --------------------------------------- |
| Vendor/Brand     | Free/Iliad                              |
| Model            |                                         |
| ODM              |                                         |
| ODM Product Code |                                         |
| Chipset          | BCM63153                                |
| Flash            | KLM4G1FETE-B041 (4GB eMMC 5.1)          |
| RAM              | 2x NT5CC128M16JR-EK (512MB DDR3L-1866)  |
| CPU              |                                 |
| CPU Clock        |                                         |
| Bootloader       |                                         |
| System           |                                         |
| Load addr        |                                         |
| HSGMII           |                                         |
| 2.5GBaseX        |                                         |
| 2.5GBaseT        | Yes (AQR112R PHY)                       |
| XGMII/XSGMII     |                                         |
| 10GBaseX         |                                         |
| 10GBaseT         | No                                      |
| 2.5/5/10GBaseT   |                                         |
| Optics           | SC/UPC                                  |
| IP address       | 192.168.1.254                           |
| Web Gui          | ✅                                      |
| SSH              | ?                                       |
| Telnet           | ?                                       |
| Serial           | ?                                       |
| Serial baud      | 115200                                  |
| Serial encoding  | 8-N-1                                   |
| Form Factor      | ONT                                     |



## Serial

The serial port is routed through the USB-C port used for power (which is PD compliant, tested with a notebook power supply). The pins are SBU1 and SBU2, reversal is handled using an open drain buffer (SN74LVC2G07) so a pull-up resistor on RX is needed. On the power daughter board TP7 is TX and TP8 is RX. There is also a USB differential pair routed through the USB-C connector but there is no use for it yet.
At the moment nothing more than a boot log is available. [^bcm61650hack] [^freeboxhack]

## Firmware is interchangeable with

## List of software versions

## List of partitions

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

# EEPROM (I2C slave simulated EEPROM)

## EEPROM0 layout

## EEPROM1 layout

# Known Bugs

# Miscellaneous Links

[^bcm61650hack]: *Pwning the bcm61650* https://blog.xilokar.info/pwning-the-bcm61650.html
[^freeboxhack]: *Firmware key extraction by gaining EL3* https://blog.xilokar.info/firmware-key-extraction-by-gaining-el3.html
