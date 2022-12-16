---
title: MikroTik CRS305-1G-4S+IN
has_children: false
layout: default
---

# Hardware Specifications

|        |                 |
| ------ | --------------- |
| Vendor | MikroTik        |
| Model  | CRS305-1G-4S+IN |
| SFP    | 4 SFP+          |
| XGMII  | ✅              |
| HSGMII | ✅              |
| SGMII  | ✅              |
| Type   | Switch          |

## Bridge Mode

Bridge mode allows full HSGMII speed without any major issues and seems to work in a mixed mode too.

Positive results in mixed mode with the following hardware:

|                                                                         | Huawei MA5671A |
| ----------------------------------------------------------------------- | -------------- |
| [6COM 6C-SFP-10G-T-Intel](https://www.amazon.it/gp/product/B07H9Q91WV/) | ✅             |

In any case, the use of a DAC or MikroTik S+RJ10 is always recommended.


## Router Mode

Unfortunately the CPU will have a major impact on end performance with resulting downlink speed topping at ~700Mbps.

Note that when using **Huawei MA5671A with right.com.cn firmware** on a Fastweb Italy IPoE connection you may run into some issues since no VLANs are used. The ONT responds to DHCP requests with **a 802.1Q tag for VLAN 0**, which should be properly handled by bridging properly the WAN as well. Other providers that do rely on VLANs such as 835 won't probably need to resort to the this workaround.

- [2.5Gb Compatibility](https://github.com/Anime4000/RTL960x/blob/main/Docs/2.5Gb.md)
- [CRS305 Fastweb Italy SFP Router Mode](https://pastebin.com/zRaidTx4)
- [@stich86 tweaks](https://github.com/Anime4000/RTL960x/issues/17#issuecomment-1101435506)
- [Mikrotik changelogs](https://mikrotik.com/download/changelogs)