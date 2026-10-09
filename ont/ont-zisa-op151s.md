---
title: Zisa OP151S
has_children: false
alias: T&W TW2362H-CDEL
parent: Zisa
---

# Hardware Specifications

|                  |                                                            |
| ---------------- | ---------------------------------------------------------- |
| Vendor/Brand     | Zisa                                                       |
| Model            | OP151S                                                     |
| ODM              | T&W                                                        |
| ODM Product Code | TW2362H-CDEL                                               |
| Chipset          | Lantiq PEB98035                                            |
| CPU              | MIPS 34Kc interAptiv                                       |
| CPU Clock        | 400MHz                                                     |
| Flash            | 8 MB (GigaDevice GD25Q64CW16)                              |
| RAM              | 64 MB (Nanya NT5TU32M16FG-AC1)                             |
| System           | eCoS                                                       |
| SFP interfaces   | HSGMII                                                     |
| Optics           | SC/APC                                                     |
| IP address       | 10.10.1.1                                                  |
| Web Gui          | ✅ username `admin` or `guest`, password `1234` or `guest` |
| SSH              | ✅ username `admin`, password `admin`                      |
| Telnet           |                                                            |
| Serial           | ✅                                                         |
| Serial baud      | 115200                                                     |
| Serial encoding  | 8-N-1                                                      |
| Form Factor      | miniONT SFP                                                |

<ImageFigure file="op151s.png" alt="Zisa OP151S" caption="Zisa OP151S" />

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface: it's near the SFP header. TX, RX and ground pads need to be connected to a USB2TTL adapter that supports 3V3 logic.

<ImageFigure file="tw236h-cdel-serial.jpg" alt="PMG3000-D20B Serial Pinout" caption="PMG3000-D20B Serial Pinout" />

::: warning Note
Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work.
:::

## Setting MAC address

The MAC address can be changed via the `manufactory` menu:
```
manufactory -> set uni mac addr xx:xx:xx:xx:xx:xx
```

::: warning RSTP bridge mode
Enabling RSTP bridge mode with `set rstp bridge enable` may cause loss of telnet access. If this happens, access can be recovered via UART serial console.
:::

## Firmware is interchangeable with:

- [Halny HL-GSFP](/ont-halny-hl-gsfp)
- [D-LINK DPN-100-Rev-A2](/ont-d-link-dpn-100-rev-a2)
- [T&W TW2362H-CDEL](/ont-t-w-tw2362h-cdel)

# Miscellaneous Links

- [Tech Info Depot Wiki](http://en.techinfodepot.shoutwiki.com/wiki/ZISA_OP151S)
- [Zisa OP151S 1GE GPON SFU SFP module](https://www.zisacom.com/admin/ewebeditor/uploadfile/20181116154842842.pdf)
