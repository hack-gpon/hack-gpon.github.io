---
title: FiberMall GPON-ONU-CLB+
has_children: false
layout: default
parent: FiberMall
---

{% include alert.html content="This is a raw GPON ONU SFP transceiver <strong>without MAC function</strong>. It requires an external PON MAC to operate. For the ONU Stick with integrated MAC, see <a href='/ont-fibermall-gpon-onu-stb+'>FiberMall GPON-ONU-STB+</a>. See also <a href='/sfp-standard'>SFP Standard</a> and <a href='/ont-wo-mac'>SFP with PON MAC and w/o PON MAC</a> for background." alert="Warning" icon="svg-warning" color="yellow" %}

# Hardware Specifications

|                       |                                                                       |
| --------------------- | --------------------------------------------------------------------- |
| Vendor/Brand          | FiberMall                                                             |
| Model                 | GPON-ONU-CLB+                                                         |
| Chipset               |                                                                       |
| Optics                | SC/UPC                                                                |
| Form Factor           | SFP                                                                   |
| PON MAC               | ❌ None (raw transceiver, requires external PON MAC)                  |

## Product Variants

| Part Number      | TX Enable | Temperature  | Price  |
| ---------------- | --------- | ------------ | ------ |
| GPON-ONU-CLB+    | Low level | -5 to 70°C   | $15.00 |
| GPON-ONU-ILB+    | Low level | -40 to 85°C  |        |
| GPON-ONU-CHB+    | High level| -5 to 70°C   |        |
| GPON-ONU-IHB+    | High level| -40 to 85°C  |        |

All variants: SFP, TX-1.244G/RX-2.488G, T1310nm/R1490nm, GPON Class B+, no MAC, DDM.

## Datasheet Specifications

### General

|                              |                                            |
| ---------------------------- | ------------------------------------------ |
| TX Data Rate                 | 1.244 Gbps (burst mode)                   |
| RX Data Rate                 | 2.488 Gbps (continuous mode)              |
| Max Distance                 | 20 km                                      |
| Fiber Type                   | Single Mode 9/125 µm                      |
| Class                        | B+                                         |
| Power Supply                 | 3.3V ± 5% (3.135–3.465V)                  |
| Supply Current               | 300 mA max                                 |
| Power Consumption            | 1 W                                        |
| Operating Temperature        | -5 to 70°C (C-Temp) / -40 to 85°C (I-Temp)|
| DDM                          | ✅ SFF-8472                                |

### Transmitter Optical Characteristics

| Parameter                          | Min    | Typical | Max    | Unit   |
| ---------------------------------- | ------ | ------- | ------ | ------ |
| Launched Power (avg.)              | +0.5   |         | +5.0   | dBm    |
| Operating Wavelength Range         | 1260   |         | 1360   | nm     |
| Output Spectrum Width (RMS)        |        |         | 1.0    | nm     |
| Side Mode Suppression Ratio        | 30     |         |        | dB     |
| Extinction Ratio                   | 9      |         |        | dB     |
| Optical Rise Time                  |        |         | 260    | ps     |
| Optical Fall Time                  |        |         | 260    | ps     |
| Output Power After TX Disable      |        |         | -50    | dBm    |
| Burst Turn-On Time                 |        |         | 12.8   | ns     |
| Burst Turn-Off Time                |        |         | 12.8   | ns     |
| TX Reflectance                     |        |         | -15    | dB     |

### Receiver Optical Characteristics

| Parameter                          | Min    | Typical | Max    | Unit   |
| ---------------------------------- | ------ | ------- | ------ | ------ |
| Wavelength Range                   | 1480   |         | 1500   | nm     |
| Sensitivity (BER ≤ 10⁻¹²)         |        |         | -28    | dBm    |
| Saturation Optical Power           | -8     |         |        | dBm    |
| SD Assert Level                    |        |         | -29    | dBm    |
| SD Deassert Level                  | -45    |         |        | dBm    |
| SD Hysteresis                      | 0.5    |         | 6      | dB     |
| Receiver Reflectance               |        |         | -12    | dB     |

### Electrical Characteristics

| Parameter                          | Min    | Typical | Max    | Unit   |
| ---------------------------------- | ------ | ------- | ------ | ------ |
| TX Differential Input Voltage      | 300    |         | 2400   | mV     |
| RX Differential Output Voltage     | 500    |         | 1200   | mV     |
| TX Common-Mode Input Voltage       | 1.6    |         | 2.4    | V      |
| Input Differential Impedance       | 90     | 100     | 110    | Ω      |
| TX Fault Output (Normal)           | 0      |         | 0.4    | V      |
| TX Fault Output (Fault)            | 2.4    |         | VCC+0.3| V      |
| SD Assert Time                     |        |         | 100    | µs     |
| SD Deassert Time                   |        |         | 100    | µs     |

Transmitter: 1310 nm DFB laser, LVPECL input (DC coupled). Receiver: 1490 nm Super-TIA, CML output (AC coupled).

### DDM Accuracy

| Parameter    | Accuracy |
| ------------ | -------- |
| Temperature  | ±3°C     |
| Voltage      | ±3%      |
| Bias Current | ±10 mA   |
| TX Power     | ±3 dB    |
| RX Power     | ±3 dB    |

## Pin Definition

| Pin | Name       | Description                                                                  |
| --- | ---------- | ---------------------------------------------------------------------------- |
| 1   | VeeT       | Transmitter Ground                                                           |
| 2   | TX_Fault   | Transmitter Fault Indication (LVTTL output: low = normal, high = abnormal)   |
| 3   | TX_Burst   | **Transmitter Burst Enable Input** (LVTTL)                                   |
| 4   | MOD-DEF(2) | I²C Data (SDA), LVTTL                                                        |
| 5   | MOD-DEF(1) | I²C Clock (SCL), LVTTL                                                       |
| 6   | MOD-DEF(0) | Module Definition 0, grounded within module                                  |
| 7   | TX_SD      | **Transmitter Signal Detect** (LVTTL output, active high)                    |
| 8   | RX_SD      | **Receiver Signal Detect** (LVTTL output: high = signal, low = loss)         |
| 9   | VeeR       | Receiver Ground                                                              |
| 10  | VeeR       | Receiver Ground                                                              |
| 11  | VeeR       | Receiver Ground                                                              |
| 12  | RD-        | Inverted Receiver Data Out (CML, AC coupled)                                 |
| 13  | RD+        | Receiver Data Out (CML, AC coupled)                                          |
| 14  | VeeR       | Receiver Ground                                                              |
| 15  | VccR       | Receiver Power                                                               |
| 16  | VccT       | Transmitter Power                                                            |
| 17  | VeeT       | Transmitter Ground                                                           |
| 18  | TD+        | Transmit Data In (LVPECL, DC coupled)                                        |
| 19  | TD-        | Inverted Transmit Data In (LVPECL, DC coupled)                               |
| 20  | VeeT       | Transmitter Ground                                                           |

{% include alert.html content="Note the key Pin differences vs the <a href='/ont-fibermall-gpon-onu-stb+'>STB+ (with MAC)</a>: Pin 3 is TX_Burst (burst enable) instead of TX_Disable, Pin 7 is TX_SD (transmitter signal detect) instead of Dying Gasp, and Pin 8 is RX_SD instead of LOS." alert="Note" icon="svg-info" color="blue" %}

### EEPROM (A0h) Key Fields

| Address | Field           | Value        | Description                         |
| ------- | --------------- | ------------ | ----------------------------------- |
| 00      | Identifier      | 03           | SFP                                 |
| 01      | Ext. Identifier | 04           | Module soldered to motherboard      |
| 02      | Connector       | 01           | Optical Pigtail                     |
| 11      | Encoding        | 03           | NRZ                                 |
| 12      | BR, Nominal     | 0C           | 1.2 Gbps                            |
| 14      | Length (9µm km) | 14           | 20 km                               |
| 40–55   | Vendor P/N      | GPON-ONU-xxB+| ASCII                               |
| 60–61   | Laser Wavelength| 051E         | 1310 nm                             |
| 92      | Diag. Mon. Type | 68           | Internal calibration, avg. power RX |

## Standards Compliance

- ITU-T G.984.2 (GPON)
- SFP MSA (SFF-8074i)
- SFF-8472 (DDM)
- FCC 47 CFR Part 15, Class B
- FDA 21 CFR 1040.10 and 1040.11 (Laser Notice No. 50)
- IEC-60825 (Class 1 laser safety)
- Telcordia GR-468-CORE
- TR-NWT-000870 ESD Class 2

## Key Differences vs STB+ (with MAC)

| Feature              | CLB+ (no MAC)                | STB+ (with MAC)                      |
| -------------------- | ---------------------------- | ------------------------------------ |
| PON MAC              | ❌ None                      | ✅ Integrated                        |
| Receiver Type        | Super-TIA                    | APD-TIA                              |
| Power Consumption    | 1 W                          | 2.48 W                               |
| GPON/EPON Dual-Mode  | ❌ GPON only                 | ✅ Auto-detect GPON/EPON             |
| OMCI (G.988)         | ❌                           | ✅                                   |
| Pin 3                | TX_Burst (burst enable)      | TX_Disable                           |
| Pin 7                | TX_SD (TX signal detect)     | Dying Gasp detect                    |
| Pin 8                | RX_SD (RX signal detect)     | LOS                                  |
| Price                | $15.00                       | $45.00                               |

{% include alert.html content="This page has been created from the vendor datasheet and product listing. Contributions with hands-on information are welcome." alert="Note" icon="svg-info" color="blue" %}

# Miscellaneous Links

- [FiberMall GPON-ONU-CLB+ product page](https://www.fibermall.com/sale-437481-gpon-onu-sfp-tx1310nm-class-b.htm)
- [Datasheet (PDF)](https://www.fibermall.com/file/datasheet/gpon-onu-xxb%2B.pdf)
