---
title: Nokia G-010G-Q
has_children: false
layout: default
parent: Nokia
alias: CIG G-97CU
---

# Hardware Specifications

|                       |                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Vendor/Brand          | Nokia                                                                                                             |
| Model                 | G-010G-Q                                                                                                          |
| ODM                   | CIG                                                                                                               |
| ODM Product Code      | G-97C                                                                                                            |
| Chipset               | Realtek RTL9601B                                                                                                  |
| Flash                 | 16 MB (Winbond [W25Q128JV](https://www.winbond.com/resource-files/w25q128jv%20revf%2003272018%20plus.pdf) 3V SPI) |
| RAM                   | DDR2 325MHz                                                                                                       |
| System                | Linux (Luna SDK 1.9.0)                                                                                            |
| 2.5GBaseT             | No                                                                                                                |
| Optics                | SC/APC                                                                                                            |
| IP address            | 192.168.100.1                                                                                                     |
| Web Gui (HTTP)        | ✅ Port 80 (⚠️ *only available when the PON connection **IS NOT** estabilished*)                                |
| Web Gui (HTTPS)       | ✅ Port 443 **NO SSL SUPPORT**                                                                                    |
| Web Gui Default Login | user `admin` password `1234`                                                                                      |
| SSH                   |                                                                                                                   |
| Telnet                | ✅ user `ONTUSER`, but has access to GponSLID and not GponCLI                                                     |
| Serial                | ✅                                                                                                                |
| Serial baud           | 115200                                                                                                            |
| Serial encoding       | 8-N-1                                                                                                             |
| Form Factor           | ONT                                                                                                               |

{% include image.html file="g-010g-q.png"  alt="G-010G-Q " caption="Nokia G-010G-Q" %}

## List of software versions
- 3FE49494AOCK21

## List of partitions

| dev  | size     | erasesize | name     |
| ---- | -------- | --------- | -------- |
| mtd0 | 00080000 | 00010000  | "Boot"   |
| mtd1 | 00180000 | 00010000  | "Config" |
| mtd2 | 00700000 | 00010000  | "ImageA" |
| mtd3 | 00700000 | 00010000  | "ImageB" |

This ONT seems to support dual boot (notice partitions "ImageA" and "ImageB"), however this has not been tested. 

## Serial

{% include image.html file="g-010g-q-serial-pinout.jpg"  alt="G-010G-Q " caption="G-010G-Q: serial pinout" %}
You can easily communicate with the ONT using a TTL converter (for example the CH341A programmer in TTL mode) by connecting the converters' pins to the ONT following the pinout shown in the image above.

*You don't actually need the two VCC pins, just use TX/RX and GND*

{% include alert.html content="The ONT's serial logic is 3V3." alert="Warning"  icon="svg-warning" color="red" %}

Make sure the logic of your TTL converter is 3V3 too, otherwise you might damage the ONT. To be sure 3V3 is being used, a voltage divider made of 2 resistors between the TX pin and ground as shown in the image below can be used.

*Also make sure that your TTL converter RX pin voltage threshold is less than (or equal to) 3V3*

{% include image.html file="g-010g-q-serial-voltage-divider.png"  alt="G-010G-Q " caption="G-010G-Q: simple serial level converter" %}

Once everything is ok, any TTY client, such as PuTTY, can be used to open the connection with its baud rate set to 115200. At this point, the ONT can be turned on.

A shell-like prompt will be visible:
```
ONT>
```

{% include_relative ont-nokia-use.md username="ONTUSER" %}

{% include_relative ont-nokia-useful-command.md %}

# Miscellaneous Links
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser) for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)


