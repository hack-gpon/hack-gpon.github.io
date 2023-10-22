---
title: Turris
has_children: false
layout: default
---

# Hardware Specifications

|          | Omnia         | Mox                                 |
| -------- | ------------- | ----------------------------------- |
| Vendor   | Turris        | Turris                              |
| Model    | Omnia         | Mox                                 |
| SFP      | 1 SFP 2.5 GbE | 1 SFP 2.5 GbE (need Mox D)          |
| Ethernet | 5 GbE         | 1 + (4 × #Mox B) + (8 × #Mox E) GbE |
| XGMII    | No            | No                                  |
| HSGMII   | ✅            | ✅                                  |
| SGMII    | ✅            | ✅                                  |
| Type     | Router        | Router                              |


As the (Turris Forum)[https://forum.turris.cz/t/ma5671a-sfp-issues-on-turris-os-5-0-3/13443] reports, the following SFPs are known to work:
- Huawei MA5671A (Original Firmware)
- Nokia Alcatel G-010S-A (2.5 Gbps)
- ODI ZTE DFP-34G-2C2 (1 Gbps)
- ODI Realtek DFP-34G-2C2
- ODI Realtek DFP-34X-2C2
- Technicolor AFM0002 (1 Gbps)
- HALNy HL-GSFP[^2min]
- Zisa OP151S[^2min]
- Zyxel PMG3000-D20B[^2min]

In ONTs that expose the serial port on SFP it must be activated, otherwise the Turris sees a TX Fault.


<hr>

[^2min]: Turris doesnt recognize it and doesn't change to SFP interface cold boot issue you need to wait 2 min and the reboot Turris.

