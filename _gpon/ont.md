---
title: GPON ONT Chipset
has_children: false
nav_order: 2
layout: default
---


# Major Chipset Manufacturers

Currently, there are only a few main GPON chipset vendors:

- Realtek:
    * RTL9601 series (for ONT)
        - RTL9601B  
        - RTL9601CI (HSGMII)
        - RTL9601D (HSGMII)
    * RTL9602/RTL9603 series (for routers with integrated PON)
- Cortina Systems/Cortina Access (previously StorLink)
    * Cortina QWCS8032E
    * Cortina CA8289
- Lantiq:
   * Falcon series (GPON)
    - PEB98010
    - PEB98035 (HSGMII)
    - PEB98036
   * PRX series (XGSPON)
    - PRX120
    - PRX126
    - PRX321
- ZTE:
    * FA626TE 
    * ZX279110a1
    * ZX279125
- HiSilicon (Huawei)
    * SD5116
- Marvell 
    * 88F6601
- Broadcom
    * BCM68 series
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

## Lantiq Chipsets

Unfortunately Lantiq no longer exists as it has been bought out and dismembered by Intel. This purchase was a huge deal as at the time Lantiq was at the forefront of the GPON and xDSL chipset market.
The GPON part of Lantiq ended up in `/dev/null`, while the XGS-PON sector ended up in the hands of MaxLinear and the whole Wi-Fi part remained in the hands of Intel itself.

The last produced batches of these SFPs date back to 2020/2021. All OEMs are currently migrating to Realtek.

{% include alert.html content="Playing with ONTs can cause your serial number/PLOAM password to be banned and faults to the optics, ONTs and OLTs. Always pay close attention to the calibration of the laser, under no circumstances should the calibration be changed." alert="Warning"  icon="svg-warning" color="red" %}

{% include alert.html content="You can also help us with the content of this site, on each page you will find a button to edit on GitHub." alert="Tip"  icon="svg-info" color="green" %}
