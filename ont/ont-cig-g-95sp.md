---
title: CIG G-95SP
has_children: false
alias: AVM GmbH G-95SP
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
| System           | Linux (kernel 3.10.4, AVM firmware `SFP_7.5.13`)         |
| HSGMII           | No (SGMII / 1000Base-X)                                  |
| Optics           | SC/APC                                                   |
| IP address       | 192.168.47.1                                             |
| Web Gui          | No                                                       |
| SSH              | No                                                       |
| Telnet           | No                                                       |
| Serial           |                                                          |
| Form Factor      | miniONT SFP                                              |

The G-95SP is the older CIG GPON SFP stick, based on a Lantiq board (the newer [CIG G-97SP](/ont-cig-g-97sp) uses a Realtek board).

It is shipped by AVM, labelled "AVM GmbH (G-95SP)", together with some FRITZ!Box models with an SFP cage (e.g. FRITZ!Box 5491).

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

# AVM configuration protocol

The AVM version of the stick does not store the GPON serial number: when the FRITZ!Box detects the SFP it opens a TCP connection to the stick on `192.168.47.1:8888` (the FRITZ!Box uses `192.168.47.2`) and pushes the configuration with a binary protocol.

The protocol is not documented. A capture taken from a FRITZ!Box 5491 (see the videos linked below) contains the following messages, each one starting with the `AVM` magic:

```
41564d00000007000400000001
41564d000000030000
41564d000200120000
41564d0604000b000400000001
41564d060600080000
41564d00080009000a4621426f783534393100
41564d000a0010000d30372e31325f312e332e323600
41564d000c000c0000
41564d000e000a000a20202020202020202020
41564d00100013000c41564d473632373233383341
41564d0012000d0000
41564d001400140000
```

Some of the payloads are readable strings:

- `F!Box5491` (shortened product name of the FRITZ!Box 5491)
- `07.12_1.3.26` (probably a firmware version)
- 10 spaces (probably the PLOAM password)
- `AVMG6272383A` (the GPON serial number)

Replaying the captured frames (e.g. with `tcpreplay`) brings the stick online with other hardware.

::: info Note
The capture and its decoding come from [issue #46](https://github.com/hack-gpon/hack-gpon.github.io/issues/46). If you have a G-95SP and a FRITZ!Box, captures from other models or ISPs are welcome.
:::

# Miscellaneous Links

- [GPON ONT G-95SP Platform Briefing (archive.org)](https://web.archive.org/web/20221022023845/https://www.cigtech.com/wp-content/uploads/2018/03/G-95SP_DataSheet_V2.pdf)
- [Tech Info Depot Wiki](http://en.techinfodepot.shoutwiki.com/wiki/Cigtech_G-95SP)
- [OpenWrt Forum](https://forum.openwrt.org/t/cigtech-g-95sp-sfp-gpon/63352)
- [Video: FRITZ!Box SFP capture (tomazzaman)](https://www.youtube.com/watch?v=Hi7JMTojT-4&t=6m20s)
- [Video: FRITZ!Box SFP configuration (tomazzaman)](https://www.youtube.com/watch?v=7RZ6JtjHBfo&t=11m11s)
