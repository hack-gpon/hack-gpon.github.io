---
title: Huawei OptiXstar S600E
has_children: false
alias: Huawei MA5671B
parent: Huawei
---

# Hardware Specifications

|                  |                                         |
| ---------------- | --------------------------------------- |
| Vendor/Brand     | Huawei                                  |
| Model            | OptiXstar S600E                         |
| Chipset          | HiSilicon SD5182S                       |
| BOSA             | UX5176 (GPON)                           |
| Flash            |                                         |
| RAM              |                                         |
| System           |                                         |
| SFP interfaces   |                                         |
| Host interface   | GE/2.5GE/5GE/10GE adaptive (per Huawei) |
| Optics           | SC/APC                                  |
| IP address       |                                         |
| Web Gui          |                                         |
| SSH              |                                         |
| Telnet           |                                         |
| Serial           |                                         |
| Form Factor      | miniONT SFP                             |

The OptiXstar S600E is a GPON SFP ONU designed by Huawei to be plugged into the SFP port of cameras and access points for video or wireless backhaul.

It is also sold as MA5671B, the successor of the [Huawei MA5671A](/ont-huawei-ma5671a). The XGS-PON version is the [OptiXstar S800E](/xgs/ont-huawei-optixstar-s800e): the two sticks share the same SoC (HiSilicon SD5182S) and differ only in the BOSA.

## Board configuration

```
# MA5671B T600
board_id=2001; pcb_id=0; soc_type=SD5182S; slic_type=NONE; ext_phy_type=NONE; bob_type=UX5176; xml_path=S600E_SD5182S/; usb=N; sd=N; rf=N; battery=N; iot=N; nfc=N; lte=N; pse_type=NONE; rs485=Y;
```

## Optical and electrical specifications

From the Huawei product page and datasheet:

|                           |                                                       |
| ------------------------- | ----------------------------------------------------- |
| NNI                       | GPON, SC/APC                                          |
| UNI                       | GE/2.5GE/5GE/10GE interface adaptive                  |
| Standard                  | ITU-T G.984.2, Class B+                               |
| TX wavelength             | 1290 ~ 1330 nm (center 1310 nm)                       |
| RX wavelength             | 1480 ~ 1500 nm (center 1490 nm)                       |
| Rate                      | TX 1.244 Gbit/s, RX 2.488 Gbit/s                      |
| TX power                  | 0.5 ~ 5 dBm                                           |
| Extinction ratio          | ≥ 8.2 dB                                              |
| Receiver sensitivity      | ≤ -27 dBm                                             |
| Overload                  | ≥ -8 dBm                                              |
| Power supply              | 3.3 V                                                 |
| Maximum power consumption | 1.5 W                                                 |
| Operating temperature     | -40 °C ~ +85 °C (shell temperature)                   |
| Operating humidity        | 5% ~ 95% RH (non-condensing)                          |
| Dimensions (H x W x D)    | 56.5 mm x 13.6 mm x 12.7 mm                           |
| Weight                    | about 23 g                                            |
| MAC addresses             | up to 1K                                              |
| Other                     | Type B dual-homing (50 ms switching), secure boot     |

# Miscellaneous Links

- [Huawei OptiXstar S600E](https://e.huawei.com/it/products/optical-terminal/optixstar-s600e)
- [Huawei OptiXstar S600E Datasheet (Scribd)](https://www.scribd.com/document/956550051/Huawei-OptiXstar-S600E-Datasheet-04)
- [Huawei OptiXstar S800E](/xgs/ont-huawei-optixstar-s800e)
- [Huawei MA5671A](/ont-huawei-ma5671a)
