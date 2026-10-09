---
title: AVM GmbH (G-95SP)
has_children: false
parent: AVM
---

# Hardware Specifications

|                  |                                                  |
| ---------------- | ------------------------------------------------ |
| Vendor/Brand     | AVM GmbH                                         |
| Model            | G-95SP                                           |
| ODM              | CIG                                              |
| ODM Product Code | G-95SP                                           |
| Chipset          | Lantiq PEB98035                                  |
| CPU              |                                                  |
| CPU Clock        |                                                  |
| Flash            |                                                  |
| RAM              |                                                  |
| System           | Linux (kernel 3.10.4, AVM firmware `SFP_7.5.13`) |
| HSGMII           | No (SGMII / 1000Base-X)                          |
| Optics           | SC/APC                                           |
| IP address       | 192.168.47.1                                     |
| Web Gui          | No                                               |
| SSH              | No                                               |
| Telnet           | No                                               |
| Serial           |                                                  |
| Form Factor      | miniONT SFP                                      |

<ImageFigure file="AVM_G-95SP/module.png" alt="AVM GmbH (G-95SP)" caption="AVM GmbH (G-95SP) label (from the tomazzaman video)" />

The AVM GmbH (G-95SP) is the [CIG G-95SP](/ont-cig-g-95sp) with an AVM firmware, shipped together with some FRITZ!Box models with an SFP cage (e.g. FRITZ!Box 5491). For the optical and electrical specifications and the pinout see the [CIG G-95SP](/ont-cig-g-95sp) page.

The firmware image of the stick (`SFP_7.5.13`, MIPS uImage with Linux 3.10.4 and a SquashFS root filesystem) is contained in the FRITZ!Box firmware.

# AVM configuration protocol

The stick does not store the GPON serial number: when the FRITZ!Box detects the SFP it opens a TCP connection to the stick on `192.168.47.1:8888` (the FRITZ!Box uses `192.168.47.2`) and pushes the configuration with a binary protocol. The stick does not listen on other ports.

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

- [CIG G-95SP](/ont-cig-g-95sp)
- [OpenWrt Forum](https://forum.openwrt.org/t/cigtech-g-95sp-sfp-gpon/63352)
- [Video: FRITZ!Box SFP capture (tomazzaman)](https://www.youtube.com/watch?v=Hi7JMTojT-4&t=6m20s)
- [Video: FRITZ!Box SFP configuration (tomazzaman)](https://www.youtube.com/watch?v=7RZ6JtjHBfo&t=11m11s)
