---
title: Zisa OP151S
has_children: false
layout: default
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
| HSGMII           | Yes                                                        |
| Optics           | SC/APC                                                     |
| IP address       | 10.10.1.1                                                  |
| Web Gui          | ✅ username `admin` or `guest`, password `1234` or `guest` |
| SSH              | ✅ username `admin`, password `admin`                      |
| Telnet           |                                                            |
| Serial           | ✅                                                         |
| Serial baud      | 115200                                                     |
| Serial encoding  | 8-N-1                                                      |
| Form Factor      | miniONT SFP                                                |

{% include image.html file="op151s.png" alt="Zisa OP151S" caption="Zisa OP151S" %}

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface: it's near the SFP header. TX, RX and ground pads need to be connected to a USB2TTL adapter that supports 3V3 logic.

{% include image.html file="tw236h-cdel-serial.jpg" alt="PMG3000-D20B Serial Pinout" caption="PMG3000-D20B Serial Pinout" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

## Firmware is interchangeable with:

- [Halny HL-GSFP](/ont-halny-hl-gsfp)
- [D-LINK DPN-100-Rev-A2](/ont-d-link-dpn-100-rev-a2)
- [Zisa OP151s](/ont-Zisa-op151s)
- [T&W TW2362H-CDEL](/ont-t-w-tw2362h-cdel)

# Miscellaneous Links

- [Tech Info Depot Wiki](http://en.techinfodepot.shoutwiki.com/wiki/ZISA_OP151S)
- [Zisa OP151S 1GE GPON SFU SFP module](https://www.zisacom.com/admin/ewebeditor/uploadfile/20181116154842842.pdf)