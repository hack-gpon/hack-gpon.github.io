---
title: FiberMall GPON-ONU-STB+
has_children: false
layout: default
parent: FiberMall
---

{% include alert.html content="This is an ONU Stick SFP with integrated GPON MAC. For the raw SFP transceiver without MAC, see [FiberMall GPON-ONU-CLB+](/ont-fibermall-gpon-onu-clb+)." alert="Info" icon="svg-info" color="blu" %}

# Hardware Specifications

|                       |                                                                       |
| --------------------- | --------------------------------------------------------------------- |
| Vendor/Brand          | FiberMall                                                             |
| Model                 | GPON-ONU-STB+ (SC/UPC) / GPON-ONU-STAB+ (SC/APC)                    |
| Chipset               | Unknown                                                               |
| Flash                 |                                                                       |
| RAM                   |                                                                       |
| System                |                                                                       |
| HSGMII                |                                                                       |
| Optics                | SC/UPC or SC/APC                                                      |
| IP address            |                                                                       |
| Web Gui               |                                                                       |
| SSH                   |                                                                       |
| Telnet                |                                                                       |
| Serial                |                                                                       |
| Form Factor           | miniONT SFP                                                           |

## Product Variants

| Part Number      | Connector | Temperature  | Price  |
| ---------------- | --------- | ------------ | ------ |
| GPON-ONU-STB+    | SC/UPC    | 0 to 70°C    | $45.00 |
| GPON-ONU-ISTB+   | SC/UPC    | -40 to 85°C  |        |
| GPON-ONU-STAB+   | SC/APC    | 0 to 70°C    | $45.00 |
| GPON-ONU-ISTAB+  | SC/APC    | -40 to 85°C  |        |

All variants: SFP, TX-1.244G/RX-2.488G, T1310nm/R1490nm, GPON Class B+, MAC inside, RoHS 6, DDM.

## Datasheet Specifications

### General

|                              |                                            |
| ---------------------------- | ------------------------------------------ |
| TX Data Rate                 | 1.244 Gbps (burst mode)                   |
| RX Data Rate                 | 2.488 Gbps (continuous mode)              |
| Max Distance                 | 20 km                                      |
| Fiber Type                   | Single Mode 9/125 µm                      |
| Class                        | B+                                         |
| Power Supply                 | 3.3V ± 5% (3.13–3.47V)                    |
| Power Dissipation            | 2.48 W typical                             |
| Operating Temperature        | 0 to 70°C (C-Temp) / -40 to 85°C (I-Temp) |
| DDM                          | ✅ SFF-8472 v9.5                           |

### Transmitter Optical Characteristics

| Parameter                          | Min    | Typical | Max    | Unit   |
| ---------------------------------- | ------ | ------- | ------ | ------ |
| Centre Wavelength                  | 1290   |         | 1330   | nm     |
| Side Mode Suppression Ratio        | 30     |         |        | dB     |
| Optical Spectrum Width (RMS)       |        |         | 1      | nm     |
| Average Launch Power               | +0.5   |         | +5.0   | dBm    |
| Power-OFF TX Optical Power         |        |         | -45    | dBm    |
| Extinction Ratio                   | 9      |         |        | dB     |
| Rise/Fall Time (20%-80%)           |        |         | 260    | ps     |
| Burst Turn-On Time                 |        |         | 12.8   | ns     |
| Burst Turn-Off Time                |        |         | 12.8   | ns     |
| RIN15 OMA                          |        |         | -115   | dB/Hz  |
| Optical Return Loss Tolerance      | 15     |         |        | dB     |
| TX Reflectance                     |        |         | -6     | dB     |
| TX and Dispersion Penalty          |        |         | 2      | dB     |

### Receiver Optical Characteristics

| Parameter                          | Min    | Typical | Max    | Unit   |
| ---------------------------------- | ------ | ------- | ------ | ------ |
| Operating Wavelength               | 1480   | 1490    | 1500   | nm     |
| Sensitivity (BER 10⁻¹²)           |        |         | -28    | dBm    |
| Saturation Optical Power           | -8     |         |        | dBm    |
| LOS Deassert Level                 |        |         | -29    | dBm    |
| LOS Assert Level                   | -40    |         |        | dBm    |
| LOS Hysteresis                     | 0.5    |         | 5      | dB     |
| Receiver Reflectance               |        |         | -20    | dB     |
| WDM Filter Isolation (1550 nm)     | 38     |         |        | dB     |
| WDM Filter Isolation (1650 nm)     | 35     |         |        | dB     |

### Electrical Characteristics

| Parameter                          | Min    | Typical | Max    | Unit   |
| ---------------------------------- | ------ | ------- | ------ | ------ |
| Data Input Differential Swing      | 300    |         | 1600   | mV     |
| Data Output Differential Swing     | 300    |         | 1200   | mV     |
| Input Differential Impedance       | 90     | 100     | 110    | Ω      |
| TX Disable Voltage (Enable)        | 0      |         | 0.8    | V      |
| TX Disable Voltage (Disable)       | 2.0    |         | VCC    | V      |

Transmitter: 1310 nm DFB laser. Receiver: 1490 nm APD-TIA, CML output (AC coupled).

## Pin Definition

| Pin | Name       | Description                                                            |
| --- | ---------- | ---------------------------------------------------------------------- |
| 1   | VeeT       | Transmitter Ground                                                     |
| 2   | TX Fault   | Transmitter Fault Indication (LVTTL output: low = normal, high = fault)|
| 3   | TX Disable | Transmitter Disable; turns off transmitter laser output                |
| 4   | MOD-DEF(2) | SDA I²C Data line                                                      |
| 5   | MOD-DEF(1) | SCL I²C Clock line                                                     |
| 6   | MOD-DEF(0) | Module Absent, connected to VeeR                                       |
| 7   | RateSelect | **Dying Gasp detect** (input, active low)                              |
| 8   | LOS        | Loss of Signal                                                         |
| 9   | VeeR       | Receiver Ground                                                        |
| 10  | VeeR       | Receiver Ground                                                        |
| 11  | VeeR       | Receiver Ground                                                        |
| 12  | RD-        | Inverted Received Data Output                                          |
| 13  | RD+        | Received Data Output                                                   |
| 14  | VeeR       | Receiver Ground                                                        |
| 15  | VccR       | Receiver Power                                                         |
| 16  | VccT       | Transmitter Power                                                      |
| 17  | VeeT       | Transmitter Ground                                                     |
| 18  | TD+        | Transmit Data In                                                       |
| 19  | TD-        | Inverted Transmit Data In                                              |
| 20  | VeeT       | Transmitter Ground                                                     |

## Standards Compliance

- ITU-T G.984.2 / G.984.2 Amendment 1 (GPON)
- ITU-T G.988 (OMCI)
- SFP MSA (SFF-8074i)
- SFF-8472 v9.5 (DDM)
- FCC 47 CFR Part 15, Class B
- FDA 21 CFR 1040.10 and 1040.11
- IEC-60825 (Class 1 laser safety)

## Notes

- The GPON-ONU-STB+ is described as a **dual-mode ONU stick**: it supports both GPON and EPON ONU OAM and will automatically establish a link with either a GPON OLT or EPON OLT.
- Pin 7 (RateSelect) is repurposed for **Dying Gasp detection** (input, active low).
- Data input is LVPECL compatible, DC coupled internally.
- Receiver is APD-TIA based, providing higher sensitivity than the [non-MAC CLB+ variant](/ont-fibermall-gpon-onu-clb+) which uses Super-TIA.
- This is a complete "PON on a Stick" — an entire FTTH ONU in a slightly oversized SFP that can be plugged into networking equipment (switch, router, PBX, etc.).

{% include alert.html content="This page has been created from the vendor datasheet and product listing. Contributions with hands-on information (chipset identification, firmware details, serial/SSH access, IP address, web GUI, etc.) are very welcome." alert="Note" icon="svg-info" color="blu" %}

# Miscellaneous Links

- [FiberMall GPON-ONU-STAB+ product page (SC/APC)](https://www.fibermall.com/sale-462750-gpon-onu-sticak-sfp-class-b-apc.htm)
- [FiberMall GPON-ONU-STB+ product page (SC/UPC)](https://www.fibermall.com/sale-437801-gpon-onu-sticak-sfp-class-b.htm)
- [Datasheet (PDF)](https://www.fibermall.com/file/datasheet/gpon-onu-stb%2B.pdf)
