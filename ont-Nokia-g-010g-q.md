---
title: Nokia G-010G-Q
has_children: false
parent: ONT
---

# Hardware Specifications

|                       |                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Vendor                | Nokia                                                                                                                         |
| Model                 | G-010G-Q                                                                                                                      |
| Alias                 |                                                                                                                               |
| Chipset               | Realtek RTL9601B                                                                                                              |
| Flash                 | Winbond <a href="https://www.winbond.com/resource-files/w25q128jv%20revf%2003272018%20plus.pdf">W25Q128JV</a> 3V 128M-BIT SPI |
| RAM                   | DDR2 325MHz                                                                                                                   |
| System                | Linux (Luna SDK)                                                                                                              |
| HSGMII                | No                                                                                                                            |
| Optics                | SC/APC                                                                                                                        |
| IP address            | 192.168.100.1                                                                                                                 |
| Web Gui (HTTP)        | ✅ Port 80 (⚠️ *only available when the PON connection **ISN'T** estabilished*)                                             |
| Web Gui (HTTPS)       | ✅ Port 443 **NO SSL SUPPORT**                                                                                                |
| Web Gui Default Login | user `admin` password `1234`                                                                                                  |
| SSH                   |                                                                                                                               |
| Form Factor           | ONT                                                                                                                           |

# Hardware revisions

{% include image.html file="g-010g-q.jpg"  alt="G-010G-Q " caption="G-010G-Q: ventilation grid version" %}

{% include image.html file="g-010g-q.png"  alt="G-010G-Q " caption="G-010G-Q: square version with relief circle" %}

# List of software version
# List of partition

| dev  | size     | erasesize | name     |
| ---- | -------- | --------- | -------- |
| mtd0 | 00080000 | 00010000  | "Boot"   |
| mtd1 | 00180000 | 00010000  | "Config" |
| mtd2 | 00700000 | 00010000  | "ImageA" |
| mtd3 | 00700000 | 00010000  | "ImageB" |

This ont seems to be supporting dual boot (notice partitions "ImageA" and "ImageB"), however we haven't tested it out. 

# Setting up the serial interface
{% include image.html file="g-010g-q-serial-pinout.png"  alt="G-010G-Q " caption="G-010G-Q: serial pinout" %}
You can easily communicate with the ONT using a TTL converter (for example i've used the CH341A programmer in TTL mode) by connecting the converters' pins to the ONT ones accordingly to the pinout shown in the image above

*You don't actually need the two VCC pins, just use TX/RX and GND*

⚠️ **The ONT's serial logic is 3V3**: Make sure the logic of your TTL converter is 3V3 too otherwise you might damage the ONT, in my case i wasn't sure the CH341A had a 3V3 logic for the TTL part so i've set up a voltage divider made of 2 resistors between the TX pin and ground as shown in the image below

*Also make sure that your TTL converter RX pin voltage threshold is less than (or equal to) 3V3*

{% include image.html file="g-010g-q-serial-voltage-divider.png"  alt="G-010G-Q " caption="G-010G-Q: simple serial level converter" %}

Once you've done all that, you can use the TTY client you wish, such as PuTTY, set its baud rate to 115200 and open the connection, then you can start the ONT

You'll see a shell like prompt:
```
ONT>
```
there you'll have to type `enable` and then `login`, unluckily there's no default user/password

Once you've logged in you will be shown a custom menu, and you'll be able to access the linux shell by first typing `system` and finally `shell`

You can then exit the shell to reach the parent menu by typing `exit` or `x`, and you can get help for each menu with the `help` command

# List of firmware and files
# Miscellaneous Links
- <a href="https://github.com/nanomad/nokia-ont-mib-parser">MIB file parser</a> for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
