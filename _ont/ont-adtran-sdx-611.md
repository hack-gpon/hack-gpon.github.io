---
title: Adtran SDX 611
has_children: false
layout: default
parent: Adtran
---

# Hardware Specifications

|              |                                          |
| ------------ | ---------------------------------------- |
| Vendor/Brand | Adtran                                   |
| Model        | SDX 611                                  |
| Chipset      |                                          |
| Flash        |                                          |
| RAM          |                                          |
| System       |                                          |
| 2.5GbaseT    | No                                       |
| Optics       | SC/APC                                   |
| IP address   |                                          |
| Web Gui      |                                          |
| SSH          |                                          |
| Telnet       |                                          |
| Serial       |                                          |
| Form Factor  | ONT                                      |

# Product Variants

| Description                                       | P/N        |
| ------------------------------------------------- | ---------- |
| SDX 611 GPON SFU ONT, 1GE with NA power adapter   | 1287833F1  |
| SDX 611 GPON SFU ONT, 1GE with UK power adapter   | 1287833F2  |
| SDX 611 GPON SFU ONT, 1GE with EU power adapter   | 1287833F3  |
| SDX 611 GPON SFU ONT, 1GE with AU power adapter   | 1287833F4  |

# Optical Specifications

|                    |                    |
| ------------------ | -------------------|
| TX wavelength      | 1310 nm            |
| RX wavelength      | 1490 nm            |
| TX min power       | +0.5 dBm           |
| TX max power       | +5.0 dBm           |
| RX max sensitivity | -27.0 dBm          |
| RX overload        | -8.0 dBm           |

# Physical and Electrical Specifications

|                       |                           |
| --------------------- | ------------------------- |
| Dimensions (WxDxH)    | 80.0 x 80.0 x 24.0 mm    |
| Weight                | 0.09 kg                   |
| Power input           | 12 V DC, 0.5 A            |
| Max power consumption | 6 W                       |
| Operating temperature | 0°C to +40°C              |
| Storage temperature   | -40°C to +70°C            |
| Relative humidity     | up to 95%, non-condensing |

# Network Features

- GPON uplink: ITU-T G.984.x, 2.488 Gbps downstream, 1.244 Gbps upstream
- 1x GE RJ-45 customer LAN interface
- Forward Error Correction (FEC) support
- Advanced Encryption Standard (AES) support
- Supports up to 1:128 split ratio
- Rogue ONU mitigation
- 802.1q (2018) bridges and bridge networks
- 802.1x port-based network access control
- 802.1ad VLAN stacking (Q-in-Q) and VLAN translation
- 802.1p bit marking/remarking
- Eight queues, strict priority and/or weighted fair queue schedulers
- VLAN IDs 0-4095
- 9k jumbo frame support
- Synchronous Ethernet (SyncE) support

# Management

- ITU-T G.988 OMCI embedded operations channel interface
- Hardware-based Y.1731 PM
- Continuity Check (CC), Link Trace (LTM/LTR), Loopback (LBM/LBR)
- TR-471 NPT speed test support
- Dying gasp alarm
- Remote firmware upgrades and downgrades
- Zero-touch service provisioning

# LEDs

| LED           | Status                | Indication                                                   |
| ------------- | --------------------- | ------------------------------------------------------------ |
| Power         | Off                   | Power is off                                                 |
|               | Green                 | Power is on, self-test passed, normal operation              |
|               | Green Flashing        | Unit is powering up                                          |
| Optical       | Green                 | ONU ranged, authenticated, and configured with services      |
|               | Green Flashing (Fast) | ONU is ranging and synchronization in progress               |
|               | Green Flashing (Slow) | ONU ranged and authenticated but not configured with services|
|               | Red                   | PON is down due to LOF/LOS                                   |
| LAN           | Off                   | No Ethernet connectivity                                     |
|               | Green                 | Ethernet connectivity present, no activity                   |
|               | Green Flashing        | Ethernet connectivity present, activity detected             |
| Alarm/Update  | Off                   | No alarm detected                                            |
|               | Green                 | Software upgrade in progress                                 |
|               | Green Flashing        | Software download in progress                                |
|               | Red                   | Software upgrade failed                                      |

# Miscellaneous Links

* [ispreview.co.uk](https://www.ispreview.co.uk/index.php/2022/09/pictured-openreachs-future-2-5gbps-ont-for-fttp-broadband.html)
* [Adtran SDX 600 Series](https://www.adtran.com/en/products-and-services/sdx-600-series)
* [SDX 600 Series Data Sheet](https://www.adtran.com/en/resources/downloads/data-sheets/sdx-600-series)
* [Quick Start Manual (ManualsLib)](https://www.manualslib.com/manual/3269164/Adtran-Sdx-600-Series.html)
* [Netceed Product Page](https://us-store.netceed.com/adtran-sdx611-simple-ont/)
