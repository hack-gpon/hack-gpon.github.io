---
title: Realtek RTL960x
has_children: false
---

The Realtek RTL960x xPON SoCs: RTL9601 series (SFU ONTs and SFP ONTs), RTL9602/RTL9603 series (routers with integrated PON) and RTL9607 series (multi WAN SoCs for HGUs). The XGS-PON RTL9615C is a version of the Cortina CA8289, see [Cortina Access](/chipset-cortina-access).

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

Community guides for the RTL960x based sticks and ONTs (OMCI cloning, flash variables, 4-port emulation, 2.5G compatibility, firmwares and key generators): [Hacking RTL960x](https://github.com/Anime4000/RTL960x) by Anime4000 and its [forum](https://pururin.moe/viewtopic.php?t=7), and the [Hacking RTL960x your ISP Fiber](https://github.com/fernandothx/Hacking-RTL960x-your-ISP-Fiber) fork. The XGS-PON sticks based on the Realtek/Cortina CA8271x are documented in [CA8271x](https://github.com/YuukiJapanTech/CA8271x), see [Cortina Access](/chipset-cortina-access).

The useful commands for the Realtek sticks running the Luna SDK are in each device page, e.g. [ODI DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2#gpon-onu-status).

::: warning End Of Life
Realtek announced that the RTL9601C and RTL9601CI will be End Of Life at the end of November 2026, and they will not get a replacement.
:::

# Chip names and dies

The name printed on the chip does not always match the die inside it: several RTL960x models are variants of the same die.

- The RTL9601D of the [ODI Realtek DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2) turned out to be an RTL9602C die, and the Realtek vendor tools list the RTL9601C as another variant of the same die[^rtl9602c-die].
- The boot log of the [Nokia G-010G-R](/ont-nokia-g-010g-r#boot-log), listed with an RTL9601B, prints `RTL9602C PLL`.

For the block diagram of the RTL9601D see [ODI Realtek DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2#architecture).

The Chipset column below lists the name printed on the chip. The drivers and the firmwares of one variant can often be ported to the others, but the boards (flash, GPIOs, optics) still differ.

[^rtl9602c-die]: *ODI Realtek DFP-34X-2C2: add the odi-oss open firmware*, hack-gpon/hack-gpon.github.io#538 https://github.com/hack-gpon/hack-gpon.github.io/pull/538#issuecomment-7116400087

# Devices

<ChipsetDevices />

# Firmware

<ChipsetFirmwares />

[^rtl960x]: *Hacking RTL960x*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x
