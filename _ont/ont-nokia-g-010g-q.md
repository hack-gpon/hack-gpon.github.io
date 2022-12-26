---
title: Nokia G-010G-Q
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|                       |                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Vendor                | Nokia                                                                                                             |
| Model                 | G-010G-Q                                                                                                          |
| Chipset               | Realtek RTL9601B                                                                                                  |
| Manufacter            | CIG G-97C                                                                                                         |
| Flash                 | 16 MB (Winbond [W25Q128JV](https://www.winbond.com/resource-files/w25q128jv%20revf%2003272018%20plus.pdf) 3V SPI) |
| RAM                   | DDR2 325MHz                                                                                                       |
| System                | Linux (Luna SDK 1.9.0)                                                                                            |
| HSGMII                | No                                                                                                                |
| Optics                | SC/APC                                                                                                            |
| IP address            | 192.168.100.1                                                                                                     |
| Web Gui (HTTP)        | ✅ Port 80 (⚠️ *only available when the PON connection **IS NOT** estabilished*)                                |
| Web Gui (HTTPS)       | ✅ Port 443 **NO SSL SUPPORT**                                                                                    |
| Web Gui Default Login | user `admin` password `1234`                                                                                      |
| Telnet                | ✅ user `ONTUSER`, but has access to GponSLID and not GponCLI                                                     |
| SSH                   |                                                                                                                   |
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

# Serial

{% include image.html file="g-010g-q-serial-pinout.jpg"  alt="G-010G-Q " caption="G-010G-Q: serial pinout" %}
You can easily communicate with the ONT using a TTL converter (for example the CH341A programmer in TTL mode) by connecting the converters' pins to the ONT following the pinout shown in the image above

*You don't actually need the two VCC pins, just use TX/RX and GND*

{% include alert.html content="The ONT's serial logic is 3V3." alert="Warning"  icon="svg-warning" color="red" %}

Make sure the logic of your TTL converter is 3V3 too otherwise you might damage the ONT, in my case I wasn't sure whether the CH341A programmer used 3V3 logic for the TTL part so I set up a voltage divider made of 2 resistors between the TX pin and ground as shown in the image below.

*Also make sure that your TTL converter RX pin voltage threshold is less than (or equal to) 3V3*

{% include image.html file="g-010g-q-serial-voltage-divider.png"  alt="G-010G-Q " caption="G-010G-Q: simple serial level converter" %}

Once you've done all that, you can use the TTY client you wish, such as PuTTY, set its baud rate to 115200 and open the connection, then you can start the ONT

You'll see a shell-like prompt:
```
ONT>
```

{% include_relative ont-nokia-use.md %}

{% include_relative ont-nokia-userful-command.md %}

# Miscellaneous Links
- <a href="https://github.com/nanomad/nokia-ont-mib-parser">MIB file parser</a> for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)


