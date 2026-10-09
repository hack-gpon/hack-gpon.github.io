---
title: MikroTik
has_children: false
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

# 2.5G with the Realtek sticks

With the Realtek RTL960x based sticks (e.g. [ODI DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2)) the 2.5G link works on RouterOS 7.11+ with the port forced to `2.5G-baseX` and `LAN_SDS_MODE` set to `6` (2500BASE-X) on the stick[^rtl960x_25g]:

```rsc
/interface/ethernet/set sfp-sfpplus1 auto-negotiation=no speed=2.5G-baseX
```

| Model                    | Working configuration                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| RB4011iGS+RM             | ❌ 2.5G not supported                                                                                  |
| RB5009UG+S+IN            | ROS 7.11+, `2.5G-baseX`, `LAN_SDS_MODE 6`                                                              |
| hEX S 2025 (E60iUGS)     | `2.5G-baseX`, `LAN_SDS_MODE 6`                                                                         |
| CCR1036-8G-2S+           | ROS 7.11.2, `2.5G-baseX`, `LAN_SDS_MODE 6`                                                             |
| CCR2004-1G-12S+2XS       | [@stich86 tweaks](https://github.com/Anime4000/RTL960x/issues/17#issuecomment-1101435506)              |
| CCR2116-12G-4S+          | `LAN_SDS_MODE 4`                                                                                       |
| CRS305-1G-4S+IN          | [@stich86 tweaks](https://github.com/Anime4000/RTL960x/issues/17#issuecomment-1101435506)              |
| CRS309-1G-8S+IN          | ROS 7.11+, `2.5G-baseX`, `LAN_SDS_MODE 6`                                                              |
| CRS310-1G-5S-4S+IN       | ROS 7.11+, `2.5G-baseX`, `LAN_SDS_MODE 6`                                                              |
| CRS317-1G-16S+RM         | ROS 7.11+, `2.5G-baseX`, `LAN_SDS_MODE 6`                                                              |
| CRS328-24P-4S+RM         | ROS 7.11.2, `2.5G-baseX`, `LAN_SDS_MODE 6`                                                             |
| CRS354-48G-4S+2Q+RM      | ROS 7.9.1+, `LAN_SDS_MODE 4`                                                                           |

## GPON upstream flooding

The GPON upstream is ~1.24 Gbps: with a 2.5G link the router can send faster than the stick can transmit, causing drops, bufferbloat and a slow upload[^rtl960x_slow]. On the devices with a switch chip (e.g. RB5009) limit the egress of the port and enable the flow control:

```rsc
/interface/ethernet/switch/port/set sfp-sfpplus1 egress-rate=1200M
/interface/ethernet/set sfp-sfpplus1 auto-negotiation=no speed=2.5G-baseX rx-flow-control=on tx-flow-control=on
/queue interface set sfp-sfpplus1 queue=multi-queue-ethernet-default
```

On the devices without a switch chip (e.g. CCR2004-1G-12S+2XS) use a CAKE queue instead:

```rsc
/queue type add name=cake-egress-gpon kind=cake cake-bandwidth=1200M
/queue interface set sfp-sfpplus1 queue=cake-egress-gpon
```

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

[^rtl960x_25g]: *2.5Gb Compatibility*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/2.5Gb.md
[^rtl960x_slow]: *Slow Upload Speed*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/SlowUploadSpeed.md
