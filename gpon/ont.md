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
    * Cortina CA8289 (HGU, XGS-PON and 10G-EPON)
    * CA8271 series (XGS-PON and 10G-EPON)
        - CA8271A
        - CA8271S
        - CA8271NI
        - CA8271N
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
- Faraday Technology (Galachip)
    * GC1601
## Realtek Chipsets

HSGMII chipsets are relatively recent, they became more common starting in 2020, and are used in many ONTs. Realtek offers an official SDK, Luna SDK, which offers very good performance in queue management, unfortunately it is not used by all devices based on these chipsets.

The Realtek xPON ICs (RTL9601, RTL9602, RTL9603, RTL9607 and the RTL8290 laser driver) support GPON, EPON and Active Fiber mode, and are distributed in Europe by [MEV Elektronik](https://shop.mev-elektronik.com/product/xpon-ics/).

The RTL960x family[^rtl960x]:

| Chipset   | Architecture | Type    | Notes                                                       |
| --------- | ------------ | ------- | ----------------------------------------------------------- |
| RTL9601B  | Lexra        | SFU     | First generation of GPON SFP ONTs, 1G only                  |
| RTL9601C1 | Lexra        | SFU     | Second generation of GPON SFP ONTs, 1G and partially 2.5G   |
| RTL9601D  | Lexra        | SFU/HGU | Third generation of GPON SFP ONTs, stable 2.5G              |
| RTL9602C  | Lexra        | SFU/HGU | Only in box ONTs                                            |
| RTL9603C  | MIPS         | SFU/HGU | All-in-one, 1 core at 900 MHz                               |
| RTL9607C  | MIPS         | SFU/HGU | All-in-one, 2 cores at 1.15 GHz, USB and POTS               |
| RTL9607DQ | ARM64        | SFU/HGU | All-in-one, 4 cores at 1 GHz, optional 2.5GbE and POTS      |
| RTL9607F  | ARM64        | SFU/HGU | All-in-one, 2 cores at 1 GHz, optional USB and POTS         |

The most common RTL960x based SFP ONTs:

| Stick                                                        | Chipset   | Flash  | UNI         | 4-port emulation | 2.5G               |
| ------------------------------------------------------------ | --------- | ------ | ----------- | ---------------- | ------------------ |
| [V-SOL V2801F](/ont-vsol-v2801f)                             | RTL9601CI | 8 MB   | VEIP & PPTP | ✅               | modded firmware    |
| [T&W TWCGPON657](/ont-t-w-twcgpon657)                        | RTL9601CI | 16 MB  | VEIP & PPTP | ✅ (V2801F fw)   | modded firmware    |
| [UFiber UF-Instant](/ont-ufiber-uf-instant)                  | RTL9601CI | 16 MB  | PPTP        | ❌ LAN 1 only    | ❌                 |
| [ODI DFP-34X-2C2 (Realtek)](/ont-odi-realtek-dfp-34x-2c2)    | RTL9601D  | 8 MB   | VEIP & PPTP | ✅ SFU firmwares | ✅                 |
| [Nokia G-010S-Q](/ont-nokia-g-010s-q)                        | RTL9601CI | 16 MB  | PPTP        | ❌               | ❌                 |
| [LEOX LXT-010S-H](/ont-leox-lxt-010s-h)                      | RTL9601CI | 128 MB |             |                  | ✅                 |

Community guides for the RTL960x based sticks and ONTs (OMCI cloning, flash variables, 4-port emulation, 2.5G compatibility, firmwares and key generators): [Hacking RTL960x](https://github.com/Anime4000/RTL960x) by Anime4000 and its [forum](https://pururin.moe/viewtopic.php?t=7), and the [Hacking RTL960x your ISP Fiber](https://github.com/fernandothx/Hacking-RTL960x-your-ISP-Fiber) fork. The XGS-PON sticks based on the Realtek/Cortina CA8271x are documented in [CA8271x](https://github.com/YuukiJapanTech/CA8271x).

The useful commands for the Realtek sticks running the Luna SDK are in each device page, e.g. [ODI DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2#gpon-onu-status).

::: warning End Of Life
Realtek announced that the RTL9601C and RTL9601CI will be End Of Life at the end of November 2026, and they will not get a replacement.
:::

## Cortina Chipsets

Cortina Access makes the 10G SoCs used by many XGS-PON and 10G-EPON ONTs and SFP+ sticks[^ca8271x]:

| Family   | CPU                       | Applications                                                                                              |
| -------- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| CA8271   | MIPS R3000                | SFU ONTs and SFP+ sticks, with the minimum ports for a bridge and a low power CPU                          |
| CA8289   | AArch64 Cortex-A55, 4 cores | HGU ONTs, with multiple LAN PHYs, USB 3.0 and PCIe for the Wi-Fi                                          |
| RTL9615C | AArch64 Cortex-A55, 2 cores | Low cost version of the CA8289 made by Realtek, with 2 XFI and 1 1G LAN, half the cores and memory channels |
| CA7774   | AArch64 Cortex-A53, 4 cores | HGU routers, like the CA8289 without the PON interface                                                     |

| SoC        | Family | Code name | Applications                                                   |
| ---------- | ------ | --------- | -------------------------------------------------------------- |
| CA8271A    | CA8271 | SATURN    | PON SFU ONTs, cable TV RF                                      |
| CA8271N    | CA8271 |           | PON SFU ONTs                                                   |
| CA8271NI   | CA8271 | SATURN2   | PON SFU ONTs (e.g. [Nokia XS-010X-R](/xgs/ont-nokia-xs-010x-r)) |
| NLD0605APB | CA8271 | SATURN2   | CA8271NI made by NTT Electronics for the NTT 10G-EPON ONUs      |
| CA8271S    | CA8271 | SATURN    | SFP+ sticks (e.g. [FS.com XGS-ONU-25-20NI](/xgs/ont-fs-XGS-ONU-25-20NI), [HiSense LTF7267-BHA+](/xgs/ont-hisense-ltf7267-bha+)) |
| CA8289     | CA8289 | VENUS     | PON HGU ONTs                                                   |
| RTL9615C   | CA8289 | TAURUS    | Realtek XG-PON/XGS-PON ONTs                                    |
| CA7774     | CA7774 | G3        | Routers without PON                                            |

Some CA8271S sticks are the same hardware in an XGS-PON and in a 10G-EPON version, and can be switched between the two by replacing the firmware: CIG XG-99S ↔ [CIG XE-99S](/epon/CIG_XE-99S) and [HiSense LTF7267-BH+](/xgs/ont-hisense-ltf7267-bha+) ↔ [LTF7263-BH+](/epon/LTF7263-BH+). The community guides (root shell, `scfg.txt`, mtd dumps, SIEPON Package-A custom firmware) are in [Hacking CA8271x](https://github.com/YuukiJapanTech/CA8271x) by YuukiJapanTech.

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

[^rtl960x]: *Hacking RTL960x*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x
[^ca8271x]: *Hacking CA8271x / CA8289x XGS-PON & 10G-EPON ONTs*, YuukiJapanTech/CA8271x https://github.com/YuukiJapanTech/CA8271x
