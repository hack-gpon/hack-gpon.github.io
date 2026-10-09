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

From the Huawei product page and datasheet (2020-06-01):

|                           |                                                        |
| ------------------------- | ------------------------------------------------------ |
| NNI                       | XGS-PON, SC/APC                                        |
| UNI                       | GE/2.5GE/5GE/10GE interface adaptive                   |
| Standard                  | ITU-T G.9807                                           |
| Maximum distance          | 20 km                                                  |
| TX wavelength             | 1260 ~ 1280 nm (center 1270 nm)                        |
| RX wavelength             | 1575 ~ 1580 nm (center 1577 nm)                        |
| Rate                      | TX 9.953 Gbit/s, RX 9.953 Gbit/s                       |
| TX power                  | 4 ~ 9 dBm                                              |
| Extinction ratio          | ≥ 6 dB                                                 |
| Receiver sensitivity      | ≤ -28 dBm                                              |
| Overload                  | ≥ -9 dBm                                               |
| Power supply              | 3.3 V                                                  |
| Maximum power consumption | 2 W                                                    |
| Operating temperature     | -40 °C ~ +85 °C (shell temperature)                    |
| Operating humidity        | 5% ~ 95% RH (non-condensing)                           |
| Dimensions                | 65 mm x 13.6 mm x 12.6 mm                              |
| Weight                    | about 27 g (product page), about 20 g (2020 datasheet) |
| Other                     | Type B dual-homing (50 ms switching), secure boot      |

Supported functions: variable-length OMCI messages, rogue ONT detection and isolation, PPPoE/DHCP simulation testing, dual-system software backup and rollback, 802.1ag Ethernet OAM, optical link measurement, IGMP v2/v3 and MLD v1/v2 snooping with fast leave, 802.1p priority and SP/WRR scheduling, MAC address filtering.

# Miscellaneous Links

- [Huawei OptiXstar S800E](https://e.huawei.com/it/products/optical-terminal/optixstar-s800e)
- [Huawei OptiXstar S800E Datasheet (PONPlanet)](https://www.ponplanet.eu/user/related_files/huawei_optixstar_s800e_datasheet_01_en-draft.pdf)
- [PONPlanet: Huawei OptiXstar S800E](https://www.ponplanet.eu/optixstar-s800e/)
- [Huawei OptiXstar S800E support](https://support.huawei.com/enterprise/en/optical-access/optixstar-s800e-pid-250646194)
- [Huawei OptiXstar S600E / MA5671B](/ont-huawei-optixstar-s600e)
