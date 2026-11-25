---
title: Chipsets
has_children: false
nav_order: 1
---

# Major Chipset Manufacturers

Currently, there are only a few main PON chipset vendors:

- [Realtek](/chipset-realtek-rtl960x)
  - RTL9601 series (for SFU ONT and SFP ONT)
    - RTL9601B
    - RTL9601C (End Of Life)
    - RTL9601CI (HSGMII, End Of Life)
    - RTL9601D (HSGMII)
  - RTL9602/RTL9603 series (for routers with integrated PON)
    - RTL9602C
  - RTL9607 series (multi WAN SoC for HGU with integrated PON)
    - RTL9607C
    - RTL9607Cv2
    - RTL9607FS
    - RTL9607DQ
  - RTL9615C (XGS-PON, version of the [Cortina CA8289](/chipset-cortina-access))
  - RTL8290 (laser driver)
- [Cortina Systems/Cortina Access](/chipset-cortina-access) (previously StorLink)
  - Cortina QWCS8032E
  - Cortina CA8289 (HGU, XGS-PON and 10G-EPON)
  - CA8271 series (XGS-PON and 10G-EPON)
    - CA8271A
    - CA8271S
    - CA8271NI
    - CA8271N
- Lantiq (then Intel, then MaxLinear)
  - [FALC ON series](/chipset-lantiq-falc-on) (GPON, End Of Life)
    - PEB98010
    - PEB98035 (HSGMII)
    - PEB98036
  - [PRX series](/chipset-maxlinear-prx) (XGS-PON, MaxLinear)
    - PRX120
    - PRX126
    - PRX321
- [ZTE](/chipset-zte-zx279)
  - FA626TE
  - ZX279110a1
  - ZX279125
  - ZX279127S
  - ZX279133 (HSGMII)
- [HiSilicon (Huawei)](/chipset-hisilicon)
  - SD5116
  - SD5117 (XGS-PON)
  - SD5182S (GPON and XGS-PON SFP ONT)
- Marvell
  - 88F6601
- [Broadcom](/chipset-broadcom)
  - BCM68 series
    - BCM6838/BCM68380
    - BCM6848
    - BCM68360
  - BCM63153 (router with integrated PON)
  - BCM55030 (10G-EPON)
- [MediaTek/EcoNet](/chipset-econet)
  - MT7511
  - MT/EN752 series (EN7520T HSGMII)
  - EN751221 series (EN7512, EN7513, EN7521, EN7526(G/F))
  - EN751627 series (EN7516, EN7527)
  - EN7528
  - EN7580
- [Airoha](/chipset-econet) (continuation of EcoNet)
  - AN7581
  - AN7583/AN7553
- [Faraday Technology (Galachip)](/chipset-galachip)
  - GC1601

# Families

Each family page lists its devices, generated from the device pages, and the firmwares that run on them.

<ChipsetIndex />

::: danger Warning
Playing with ONTs can cause your serial number/PLOAM password to be banned and faults to the optics, ONTs and OLTs. Always pay close attention to the calibration of the laser, under no circumstances should the calibration be changed.
:::

::: tip Tip
You can also help us with the content of this site, on each page you will find a button to edit on GitHub.
:::

# Linking a device to its family

The device pages link their family from the `Chipset` row of the "Hardware Specifications" table, and the family pages list their devices automatically:

```md
| Chipset | [Realtek RTL9601D](/chipset-realtek-rtl960x) |
| System  | Linux 3.18 (Luna SDK 3.3)                    |
```

The `Chipset` row holds only the chip; the operating system and the SDK (e.g. Luna SDK, Saturn SDK, OpenWrt) go in the `System` row.
