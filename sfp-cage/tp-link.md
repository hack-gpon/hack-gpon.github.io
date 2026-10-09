---
title: TP-Link 
has_children: false
---


# Hardware Specifications

|          | TL-XDR5480 | TL-ER2260T -- |
| -------- | ---------- | ------------- |
| Vendor   | TP-Link    | TP-Link       |
| Model    | TL-XDR5480 | TL-ER2260T    |
| SFP      | 1 SFP 2.5  | 2 SFP+        |
| Ethernet | 4 2.5GbE   | 4 GbE         |
| XGMII    | No         | ✅            |
| HSGMII   | ✅         | ✅            |
| SGMII    | ✅         | ✅            |
| Type     | Router     | VPN Router    |


With the Realtek RTL960x based sticks the 2.5G link works on the TL-XDR5480 with the ODI DFP-34X-2C2 `220304` firmware, and on the TL-ER2260T with `LAN_SDS_MODE` set to `4` (HiSGMII PHY)[^rtl960x_25g].

# Archer GE800, BE800 and BE900

The 2.5G mode on the SFP port of these routers is available only on debug firmwares[^rtl960x_tplink]. The BE800 and BE900 are End Of Life and can't be downgraded to the debug firmware anymore, while the GE800 with the firmware `1.1.5` or older can use the [debug firmware](https://github.com/Anime4000/RTL960x/tree/main/Firmware_Router/TP-Link/Archer%20GE800).

On the GE800 set up the internet with the stick at 1 Gbps first, then open `http://192.168.0.1/webpages/debug.html` and enter:

```
combo_debug stop
combo_debug set plus
combo_debug ipg_set combo10g 1_192bit
```

`combo_debug ipg_set combo10g 1` goes back to 1 Gbps. The setting is lost at every reboot.

On the hosts that detect the 2.5G modules from the EEPROM (e.g. Linux `sfp-bus.c`), the stick must report the transceiver code `00h` at the offset `06h` and the nominal bit rate `1Fh` (2500 Mbps) at the offset `0Ch`, see [SFP standard](/sfp/sfp-standard).

- [2.5Gb Compatibility](https://github.com/Anime4000/RTL960x/blob/main/Docs/2.5Gb.md)

[^rtl960x_25g]: *2.5Gb Compatibility*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/2.5Gb.md
[^rtl960x_tplink]: *TP-Link Archer GE800*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/tree/main/Firmware_Router/TP-Link/Archer%20GE800
