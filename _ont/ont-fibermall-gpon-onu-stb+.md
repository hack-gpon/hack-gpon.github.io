---
title: FiberMall GPON-ONU-STB+
has_children: false
layout: default
parent: FiberMall
---

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

## Vendor Datasheet Specifications

|                              |                                        |
| ---------------------------- | -------------------------------------- |
| TX Data Rate                 | 1.244 Gbps                             |
| RX Data Rate                 | 2.488 Gbps                             |
| TX Wavelength                | 1310 nm (DFB)                          |
| RX Wavelength                | 1490 nm (APD-TIA)                      |
| Optical Power (TX)           | +0.5 to +5.0 dBm                      |
| Receiver Sensitivity         | -28 dBm                                |
| Saturation Optical Power     | -8 dBm                                 |
| Class                        | B+                                     |
| Max Distance                 | 20 km                                  |
| Fiber Type                   | Single Mode (9/125 µm)                 |
| Power Supply                 | 3.3V single supply                     |
| Power Dissipation            | 2.48 W typical                         |
| Operating Temperature        | 0 to 70°C (C-Temp) / -40 to 85°C (I-Temp) |
| DDM                          | ✅ SFF-8472                            |

## Product Variants

| Part Number      | Connector | Temperature | Description                                                                              |
| ---------------- | --------- | ----------- | ---------------------------------------------------------------------------------------- |
| GPON-ONU-STB+    | SC/UPC    | 0 to 70°C   | SFP, 1.244G/2.488G, T1310nm/R1490nm, GPON Class B+, MAC inside, RoHS 6, DDM             |
| GPON-ONU-ISTB+   | SC/UPC    | -40 to 85°C | Industrial temperature variant                                                           |
| GPON-ONU-STAB+   | SC/APC    | 0 to 70°C   | SFP, 1.244G/2.488G, T1310nm/R1490nm, GPON Class B+, MAC inside, RoHS 6, DDM             |
| GPON-ONU-ISTAB+  | SC/APC    | -40 to 85°C | Industrial temperature variant                                                           |

## Standards Compliance

- ITU-T G.984.2 / G.984.2 Amendment 1
- ITU-T G.988 (OMCI)
- SFP MSA (SFF-8074i)
- SFF-8472 v9.5 (DDM)
- FCC 47 CFR Part 15, Class B
- FDA 21 CFR 1040.10 and 1040.11
- IEC-60825 (Class 1 laser safety)

## Notes

- The GPON-ONU-STB+ is described as a dual-mode ONU stick: it supports both GPON and EPON ONU OAM and will automatically establish a link with either a GPON OLT or EPON OLT.
- Pin 7 (RateSelect) is repurposed for Dying Gasp detection (input, active low).

{% include alert.html content="This page has been created from the vendor datasheet and product listing only. Contributions with hands-on information (chipset identification, firmware details, serial/SSH access, IP address, web GUI, etc.) are very welcome." alert="Note" icon="svg-info" color="blu" %}

# Miscellaneous Links

- [FiberMall GPON-ONU-STAB+ product page (SC/APC)](https://www.fibermall.com/sale-462750-gpon-onu-sticak-sfp-class-b-apc.htm)
- [FiberMall GPON-ONU-STB+ product page (SC/UPC)](https://www.fibermall.com/sale-437801-gpon-onu-sticak-sfp-class-b.htm)
- [Datasheet (PDF)](https://www.fibermall.com/file/datasheet/gpon-onu-stb%2B.pdf)
