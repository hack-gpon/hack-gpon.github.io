---
title: CIG G-95SP
has_children: false
parent: CIG
---

# Hardware Specifications

|                  |                                                          |
| ---------------- | -------------------------------------------------------- |
| Vendor/Brand     | CIG                                                      |
| Model            | G-95SP                                                   |
| ODM              | ✅                                                       |
| Chipset          | Lantiq PEB98035                                          |
| CPU              |                                                          |
| CPU Clock        |                                                          |
| Flash            |                                                          |
| RAM              |                                                          |
| System           |                                                          |
| HSGMII           | No (SGMII / 1000Base-X)                                  |
| Optics           | SC/APC                                                   |
| IP address       |                                                          |
| Web Gui          |                                                          |
| SSH              |                                                          |
| Telnet           |                                                          |
| Serial           |                                                          |
| Form Factor      | miniONT SFP                                              |

The G-95SP is the older CIG GPON SFP stick, based on a Lantiq board (the newer [CIG G-97SP](/ont-cig-g-97sp) uses a Realtek board).

It is also sold by AVM with a custom firmware, see [AVM GmbH (G-95SP)](/ont-avm-g-95sp).

## Optical and electrical specifications

From the CIG platform briefing (version 2, Jan 2018):

|                   |                                                            |
| ----------------- | ---------------------------------------------------------- |
| Standard          | ITU-T G.984, G.984.2 Amd1 Class B+ (Class C/C+ optional)   |
| Wavelengths       | US 1310 nm, DS 1490 nm                                     |
| Upstream          | 1.244 Gbps burst mode, DFB transmitter                     |
| Downstream        | 2.488 Gbps, APD receiver                                   |
| Launch power      | 0.5 ~ +5 dBm                                               |
| Sensitivity       | -27 dBm                                                    |
| Overload          | -8 dBm                                                     |
| Power consumption | < 2.5 W                                                    |
| Case temperature  | -40 ~ +85 °C                                               |
| Dimensions        | 82 mm x 14 mm x 12.5 mm (L x W x D)                        |
| Management        | OMCI (ITU-T G.984.4 and G.988), dual image with rollback   |

## Module pinout

| PIN | Name                 |
| --- | -------------------- |
| 1   | VEET/BOOT4           |
| 2   | TX_FAULT/ASC_TX/TOD  |
| 3   | TX_DISABLE           |
| 4   | SDA                  |
| 5   | SCL                  |
| 6   | MOD_ABS              |
| 7   | Rate SEL/Dyinggasp   |
| 8   | RX_LOS               |
| 9   | VEET/1PPS            |
| 10  | VEET/BOOT0           |
| 11  | VEER                 |
| 12  | RD-                  |
| 13  | RD+                  |
| 14  | VEER                 |
| 15  | VCCR                 |
| 16  | VCCT                 |
| 17  | VEET                 |
| 18  | TD+                  |
| 19  | TD-                  |
| 20  | VEET                 |

# Miscellaneous Links

- [GPON ONT G-95SP Platform Briefing (archive.org)](https://web.archive.org/web/20221022023845/https://www.cigtech.com/wp-content/uploads/2018/03/G-95SP_DataSheet_V2.pdf)
- [Tech Info Depot Wiki](http://en.techinfodepot.shoutwiki.com/wiki/Cigtech_G-95SP)
- [AVM GmbH (G-95SP)](/ont-avm-g-95sp)
