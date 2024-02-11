---
title: FreeBox Pop/IliadBox
has_children: false
layout: default
parent: Free/Iliad
---

# Hardware Specifications

|                  |                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------- |
| Vendor/Brand     | Free/Iliad                                                                         |
| Model            |                                                                                    |
| ODM              |                                                                                    |
| ODM Product Code |                                                                                    |
| Chipset          | BCM63153                                                                           |
| Flash            | 4GB eMMC 5.1 KLM4G1FETE-B041                                                       |
| RAM              | 2x 512MB DDR3L-1866 NT5CC128M16JR-EK                                               |
| CPU              |                                                                                    |
| CPU Clock        |                                                                                    |
| Bootloader       |                                                                                    |
| System           |                                                                                    |
| Load addr        |                                                                                    |
| SFP              | 1G-BASEX, 10G-BASESR-LR, HSGMII (only AFM0003ILD), PON equivalent symbol EPON 10/1 |
| Ethernet         | 2 1GbE, 1 2.5GbE LAN/WAN                                                           |
| Optics           | SC/UPC                                                                             |
| IP address       | 192.168.1.254                                                                      |
| Web Gui          | ✅                                                                                 |
| SSH              |                                                                                    |
| Telnet           |                                                                                    |
| Serial           |                                                                                    |
| Serial baud      | 115200                                                                             |
| Serial encoding  | 8-N-1                                                                              |
| Form Factor      | CPE with SFP w/o MAC support                                                       |



## Serial

The serial port is routed through the USB-C port used for power (which is PD compliant, tested with a notebook power supply). The pins are SBU1 and SBU2, reversal is handled using an open drain buffer (SN74LVC2G07) so a pull-up resistor on RX is needed. On the power daughter board TP7 is TX and TP8 is RX. There is also a USB differential pair routed through the USB-C connector but there is no use for it yet.
At the moment nothing more than a boot log is available. [^bcm61650hack] [^freeboxhack]

## SFP Whitelist
- WTD RTXM166-401-C13 (EPON w/o MAC)
- WTD RTXM166-401-C11 (EPON w/o MAC)
- Hisense LTF7215-BH+ (EPON w/o MAC)
- [Technicolor AFM0003](/ont-technicolor-afm0003) (GPON with MAC)
- SFP Copper 10Gtek  (1 and 10 Gbps)

# Miscellaneous Links

[^bcm61650hack]: *Pwning the bcm61650* https://blog.xilokar.info/pwning-the-bcm61650.html
[^freeboxhack]: *Firmware key extraction by gaining EL3* https://blog.xilokar.info/firmware-key-extraction-by-gaining-el3.html
