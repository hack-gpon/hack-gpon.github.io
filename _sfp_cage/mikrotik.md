---
title: MikroTik
has_children: false
layout: default
---

# Hardware Specifications

|          | RB5009          | CRS305-1G-4S+IN | CCR2004-1G-12S+2XS | CCR2116-12G-4S+ |
| -------- | --------------- | --------------- | ------------------ | --------------- |
| Vendor   | MikroTik        | Mikrotik        | Mikrotik           | Mikrotik        |
| Model    | RB5009          | CRS305-1G-4S+IN | CCR2004-1G-12S+2XS | CCR2116-12G-4S+ |
| SFP      | 1 SFP+          | 4 SFP+          | 12 SFP+, 2 SFP28   | 4 SFP+          |
| Ethernet | 1 2.5GbE, 7 GbE | 1 GbE           | 1 GbE              | 13 GbE          |
| XGMII    | ✅              | ✅              | ✅                 | ✅              |
| HSGMII   | ✅              | ✅              | ✅                 | ✅              |
| SGMII    | ✅              | ✅              | ✅                 | ✅              |
| Type     | Router          | Switch          | Router             | Router          |

Note that Mikrotik RouterOS before 7.15beta4 requires the fiber to be plugged before allowing ping/telnet/webGUI to the xPON SFP.
This will trigger an alarm on the OLT at least on the first config.
It is suggested upgrade to 7.15 and activate "Interface/SFP/Ignore Rx LOS", or use a media converter for the first config.

# CRS305-1G-4S+IN

## Bridge Mode

Bridge mode allows full HSGMII speed without any major issues and seems to work in mixed mode too.

Positive results in mixed mode with the following hardware:

|                                                                         | Huawei MA5671A |
| ----------------------------------------------------------------------- | -------------- |
| [6COM 6C-SFP-10G-T-Intel](https://www.amazon.it/gp/product/B07H9Q91WV/) | ✅             |

In any case, the use of a DAC or MikroTik S+RJ10 is always recommended.


## Router Mode

Unfortunately the CPU will have a major impact on end performance with resulting downlink speed topping at ~700Mbps.

Note that when using **Huawei MA5671A with right.com.cn firmware** on a Fastweb Italy IPoE connection you may run into some issues since no VLANs are used. The ONT responds to DHCP requests with **a 802.1Q tag for VLAN 0**, which should be handled by properly bridging the WAN as well. Other providers that do rely on VLANs such as 835 won't probably need to resort to the this workaround.

- [2.5Gb Compatibility](https://github.com/Anime4000/RTL960x/blob/main/Docs/2.5Gb.md)
- [CRS305 Fastweb Italy SFP Router Mode](https://pastebin.com/zRaidTx4)
- [@stich86 tweaks](https://github.com/Anime4000/RTL960x/issues/17#issuecomment-1101435506)
- [Mikrotik changelogs](https://mikrotik.com/download/changelogs)
