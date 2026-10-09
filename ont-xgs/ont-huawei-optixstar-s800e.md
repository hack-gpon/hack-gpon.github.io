---
title: Huawei OptiXstar S800E
has_children: false
alias: Huawei OptiXstar S800E-M
parent: Huawei
---

# Hardware Specifications

|                 |                                         |
| --------------- | --------------------------------------- |
| Vendor/Brand    | Huawei                                  |
| Model           | OptiXstar S800E                         |
| Chipset         | HiSilicon SD5182S                       |
| BOSA            | HN517X (XGS-PON)                        |
| Flash           |                                         |
| RAM             |                                         |
| System          |                                         |
| Host interface  | GE/2.5GE/5GE/10GE adaptive (per Huawei) |
| Optics          | SC/APC                                  |
| IP address      |                                         |
| Web Gui         |                                         |
| SSH             |                                         |
| Telnet          |                                         |
| Serial          |                                         |
| Form Factor     | miniONT SFP+                            |

The OptiXstar S800E is an XGS-PON SFP+ ONU designed by Huawei to be plugged into the SFP+ port of cameras, access points or routers. The GPON version is the [OptiXstar S600E / MA5671B](/ont-huawei-optixstar-s600e): the two sticks share the same SoC (HiSilicon SD5182S) and differ only in the BOSA.

## Board configuration

```
# S800E-M S800E
board_id=2014; pcb_id=0; soc_type=SD5182S; slic_type=NONE; ext_phy_type=NONE; bob_type=HN517X; xml_path=S800E_SD5182S/; usb=N; sd=N; rf=N; battery=N; iot=N; nfc=N; lte=N; pse_type=NONE; rs485=Y; sfp_onu=Y;
```

## Optical and electrical specifications

From the Huawei product page:

|                        |                                     |
| ---------------------- | ----------------------------------- |
| Standard               | ITU-T G.9807 XGS-PON                |
| TX wavelength          | 1270 nm                             |
| Receiver sensitivity   | ≤ -28 dBm                           |
| Overload               | ≥ -9 dBm                            |
| Power supply           | 3.3 V                               |
| Power consumption      | ≤ 2 W                               |
| Operating temperature  | -40 °C ~ +85 °C                     |
| Dimensions             | 65 mm x 13.6 mm x 12.6 mm           |
| Weight                 | about 27 g                          |

# Miscellaneous Links

- [Huawei OptiXstar S800E](https://e.huawei.com/en/products/optical-terminal/optixstar-s800e)
- [Huawei OptiXstar S800E support](https://support.huawei.com/enterprise/en/optical-access/optixstar-s800e-pid-250646194)
- [Huawei OptiXstar S600E / MA5671B](/ont-huawei-optixstar-s600e)
