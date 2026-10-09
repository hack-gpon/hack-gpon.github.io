---
title: GPON ONT Chipset
has_children: false
nav_order: 2
---


# Major Chipset Manufacturers

Currently, there are only a few main PON chipset vendors:

- Realtek:
    * RTL9601 series (for SFU ONT and SFP ONT)
        - RTL9601B
        - RTL9601C (End Of Life)
        - RTL9601CI (HSGMII, End Of Life)
        - RTL9601D (HSGMII)
    * RTL9602/RTL9603 series (for routers with integrated PON)
        - RTL9602C
    * RTL9607 series (multi WAN SoC for HGU with integrated PON)
        - RTL9607C
        - RTL9607Cv2
        - RTL9607FS
        - RTL9607DQ
    * RTL9615C (XGS-PON)
    * RTL8290 (laser driver)
- Cortina Systems/Cortina Access (previously StorLink)
    * Cortina QWCS8032E
    * Cortina CA8289
    * CA8271 series (XGS-PON and 10G-EPON)
        - CA8271A
        - CA8271S
        - CA8271NI
- Lantiq (then Intel, then MaxLinear):
   * Falcon series (GPON, End Of Life)
    - PEB98010
    - PEB98035 (HSGMII)
    - PEB98036
   * PRX series (XGS-PON, MaxLinear)
    - PRX120
    - PRX126
    - PRX321
- ZTE:
    * FA626TE
    * ZX279110a1
    * ZX279125
    * ZX279127S
    * ZX279133 (HSGMII)
- HiSilicon (Huawei)
    * SD5116
    * SD5117 (XGS-PON)
    * SD5182S (GPON and XGS-PON SFP ONT)
- Marvell
    * 88F6601
- Broadcom
    * BCM68 series
        - BCM6838/BCM68380
        - BCM6848
        - BCM68360
    * BCM63153 (router with integrated PON)
    * BCM55030 (10G-EPON)
- MediaTek/EcoNet
    * MT7511
    * MT/EN752 series (EN7520T HSGMII)
    * EN751221 series (EN7512, EN7513, EN7521, EN7526(G/F))
    * EN751627 series (EN7516, EN7527)
    * EN7528
    * EN7580
- Airoha (continuation of EcoNet)
    * AN7581
    * AN7583/AN7553
## Realtek Chipsets

HSGMII chipsets are relatively recent, they became more common starting in 2020, and are used in many ONTs. Realtek offers an official SDK, Luna SDK, which offers very good performance in queue management, unfortunately it is not used by all devices based on these chipsets.

The Realtek xPON ICs (RTL9601, RTL9602, RTL9603, RTL9607 and the RTL8290 laser driver) support GPON, EPON and Active Fiber mode, and are distributed in Europe by [MEV Elektronik](https://shop.mev-elektronik.com/product/xpon-ics/).

Community guides for the RTL960x based sticks and ONTs (OMCI cloning, flash variables, 4-port emulation, firmware and key generators): [Hacking RTL960x](https://github.com/fernandothx/Hacking-RTL960x-your-ISP-Fiber).

::: warning End Of Life
Realtek announced that the RTL9601C and RTL9601CI will be End Of Life at the end of November 2026, and they will not get a replacement.
:::

## Lantiq Chipsets

Unfortunately Lantiq no longer exists as it has been bought out and dismembered by Intel. This purchase was a huge deal as at the time Lantiq was at the forefront of the GPON and xDSL chipset market.
The GPON part of Lantiq ended up in `/dev/null`, while the XGS-PON sector ended up in the hands of MaxLinear and the whole Wi-Fi part remained in the hands of Intel itself.

The last produced batches of these SFPs date back to 2020/2021. All OEMs are currently migrating to Realtek.

::: warning End Of Life
The Lantiq Falcon GPON chipsets (PEB98010, PEB98035, PEB98036) are End Of Life: the SFPs based on them (Huawei MA5671A, Nokia G-010S-P, FS.com GPON-ONU-34-20BI, CarlitoxxPro/Hilink, ...) are no longer produced and are now hard to find, see the [MikroTik forum](https://forum.mikrotik.com/t/usage-gpon-module-sfp-in-spain/104807?page=17).
:::

::: danger Warning
Playing with ONTs can cause your serial number/PLOAM password to be banned and faults to the optics, ONTs and OLTs. Always pay close attention to the calibration of the laser, under no circumstances should the calibration be changed.
:::

::: tip Tip
You can also help us with the content of this site, on each page you will find a button to edit on GitHub.
:::
