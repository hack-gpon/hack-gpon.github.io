---
title: TTL UART Adapter
has_children: false
nav_order: 2
---

A TTL UART adapter makes it possible to connect the stick's serial interface to a computer via a USB interface. This makes it easy to send commands on modern computers through serial emulation, just like the serial ports of the 1990s.

These adapters are widely used in the modding of SFPs, and in general of most embedded devices, since a serial port is always present in all of them and is also used to de-brick such devices.

TTL adapters can be easily found on Amazon, the most recommended one being:

- DSD TECH USB to TTL Serial Adapter with FTDI FT232RL Chip [Amazon.com](https://www.amazon.com/dp/B07BBPX8B8) [Amazon.it](https://www.amazon.it/dp/B07BBPX8B8)

Alternatively, an [Arduino can be used to emulate a TTL adapter](https://create.arduino.cc/projecthub/PatelDarshil/ways-to-use-arduino-as-usb-to-ttl-converter-475533)

# Serial console of the SFP sticks

The SFP MSA does not define a UART, so the manufacturers reuse some low speed pins of the 20-pin SFP edge connector:

| Pins           | Modules                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| 2 and 7        | Most of the sticks: Huawei MA5671A, Nokia G-010S-P, FS.com GPON-ONU-34-20BI, Realtek RTL960x based sticks, BFW WAS-110 |
| 3 and 6        | Nokia G-010S-A                                                                                             |
| 4/5 or 8/9     | Some other modules (SDA/SCL or RX_LOS/RS1)                                                                 |

- Power the stick with +3.3 V on pins 15/16 (VccR/VccT) and ground on a Vee pin (e.g. 10, 14 or 17).
- The SFP logic is 3.3 V: do not use a 5 V adapter.
- Almost all the sticks use 115200 8-N-1.
- Cross the wires (stick TX to adapter RX and vice versa); if there is no output after power-up, swap pins 2 and 7.

To avoid soldering, use an SFP-to-TTL breakout (an SFP cage with all the 20 pins on headers), a soldered harness or a pogo-pin jig. The pinout of each stick is on its page.

See [GPON SFP Serial Console](https://github.com/tomav/gpon-sfp-serial-console) for a vendor-neutral guide.