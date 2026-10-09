---
title: Adtran SDX 611
has_children: false
parent: Adtran
---

# Hardware Specifications

|                 |                                          |
| --------------- | ---------------------------------------- |
| Vendor/Brand    | Adtran                                   |
| Model           | SDX 611 (Adtran-611-V2 REV1.0)           |
| Chipset         | Realtek RTL9601D                         |
| Flash           | 16 MB (Winbond W25Q128JVSQ)              |
| RAM             |                                          |
| System          |                                          |
| Optics          | SC/APC (U&T UTG24P05)                    |
| 2.5GbaseT       | No                                       |
| IP address      | 192.168.1.1                              |
| Web Gui         |                                          |
| SSH             |                                          |
| Telnet          |                                          |
| Serial          | ✅, no credentials needed                |
| Serial baud     | 115200                                   |
| Serial encoding | 8-N-1                                    |
| Form Factor     | ONT                                      |

## Disassembly

1. Remove the two screws hidden under the rubber feet on the back of the unit
2. Use a plastic pry tool to separate the rear cover, as it is held in place by a snap fit

::: warning Note
Be careful when prying the rear cover off, the snap fit clips can break easily.
:::

<ImageFigure file="sdx611-teardown-1.jpg" alt="Adtran SDX 611 Teardown" caption="Adtran SDX 611: Teardown" />
<ImageFigure file="sdx611-teardown-2.jpg" alt="Adtran SDX 611 Board" caption="Adtran SDX 611: Board" />
<ImageFigure file="sdx611-board-rev.jpg" alt="Adtran SDX 611 Board Revision" caption="Adtran SDX 611: Board revision (Adtran-611-V2 REV1.0)" />

## Serial

The board has GND, TX and RX headers already soldered. A USB UART adapter such as a CH340G can be used to access the serial console.

| USB TTL(UART) Adapter | Board header |
| --------------------- | ------------ |
| GND                   | GND          |
| TX                    | RX           |
| RX                    | TX           |

::: warning Note
Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work.
:::

## Chip identification

| Chip                   | Function           |
| ---------------------- | ------------------ |
| Realtek RTL9601D       | GPON SoC           |
| U&T UTG24P05           | Optical transceiver (BOSA) |
| Winbond W25Q128JVSQ    | 128Mbit (16MB) SPI NOR Flash |

<ImageFigure file="sdx611-rtl9601d.jpg" alt="Realtek RTL9601D" caption="Realtek RTL9601D GPON SoC" />
<ImageFigure file="sdx611-utg24p05.jpg" alt="U&T UTG24P05" caption="U&T UTG24P05 Optical Transceiver" />
<ImageFigure file="sdx611-w25q128jvsq.jpg" alt="Winbond W25Q128JVSQ" caption="Winbond W25Q128JVSQ 16MB SPI NOR Flash" />

# Miscellaneous Links

* [ispreview.co.uk](https://www.ispreview.co.uk/index.php/2022/09/pictured-openreachs-future-2-5gbps-ont-for-fttp-broadband.html)
* [Adtran SDX 611](https://www.adtran.com/solutions/by-segment/products/by-category/fiber-access/optical-network-terminals-ont/611.html)


