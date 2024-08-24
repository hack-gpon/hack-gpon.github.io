---
title: Nokia XS-010S-Q
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|                  |                                                                    |
| ---------------- | ------------------------------------------------------------------ |
| Vendor           | Nokia                                                              |
| Model            | XS-010S-Q                                                          |
| ODM              | ?                                                                  |
| ODM Product Code | ?                                                                  |
| Chipset          | Cortina CA8271S                                                    |
| CPU              | Dual core CPU (four virtual CPUs) running at 800 MHz               |
| L1 Cache         | 64KB (32KB instruction, 32KB data)                                 |
| L2 Cache         | 256KB with I/O coherency                                           |
| Manufacter       | ?                                                                  |
| Flash            | 1GB                                                                |
| RAM              | ?                                                                  |
| System           | ?                                                                  |
| 10GBaseT         | Yes                                                                |
| Optics           | SC/APC                                                             |
| IP address       | 192.168.100.1                                                      |
| Web Gui          | ✅ Port 80 user: `admin`, password: `1234`                         |
| SSH              | ✅ (see Enable SSH)                                                |
| Telnet           | ✅ Port 23 user: `admin`, password: `1234` (see Telnet Full Shell) |
| Form Factor      | SFP+                                                               |

# Module Pinout

|     |     |     |
| --- | --- | --- |
| PIN | Description
| 1. VeeT | Module transmitter ground | |
| 2. Tx Fault |Transmitter fault indication output | |
| 3. TX_DISABLE |Transmitter shut-off input | |
| 4. SDA | 2-wire serial interface data line (MOD-DEF2) 2: I/O | |
| 5. SCL | 2-wire serial interface clock (MOD-DEF1) 2 input | |
| 6. MOD_ABS | Module absent | connected to VeeT or VeeR in the module |
| 7. DYING GASP1 | Dying gasp message indicator input | |
| 8. LOS | Loss of signal output | |
| 9. VeeR | Module receiver ground | |
| 10. VeeR | Module receiver ground | |
| 11. VeeR | Module receiver ground | |
| 12. RXD | Receiver inverted data output | |
| 13. RXD+ | Receiver non-inverted data output | |
| 14. VeeR | Module receiver ground | |
| 15. VCCR | Module receiver 3.3V supply | |
| 16. VCCT | Module transmitter 3.3V supply | |
| 17. VeeT | Module transmitter ground | |
| 18. TXD+ | Transmitter non-inverted data input | |
| 19. TXD | Transmitter inverted data input | |
| 20. VeeT | Module transmitter ground | |
