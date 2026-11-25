---
title: Realtek RTL960x
has_children: false
---

The Realtek RTL960x GPON SoCs (RTL9601B, RTL9601CI, RTL9601D, RTL9602C, RTL9606, RTL9607C, RTL9607F...). Most of the sticks run Linux with the Realtek Luna SDK, the RTL9607C based ONTs the Realtek MSDK: the version is in the System column.

The [RTL960x repository](https://github.com/Anime4000/RTL960x) collects firmwares, tools and documentation for these SoCs.

# Chip names and dies

The name printed on the chip does not always match the die inside it: several RTL960x models are variants of the same die.

- The RTL9601D of the [ODI Realtek DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2) turned out to be an RTL9602C die, and the Realtek vendor tools list the RTL9601C as another variant of the same die[^rtl9602c-die].
- The boot log of the [Nokia G-010G-R](/ont-nokia-g-010g-r#boot-log), listed with an RTL9601B, prints `RTL9602C PLL`.

The Chipset column below lists the name printed on the chip. The drivers and the firmwares of one variant can often be ported to the others, but the boards (flash, GPIOs, optics) still differ.

[^rtl9602c-die]: *ODI Realtek DFP-34X-2C2: add the odi-oss open firmware*, hack-gpon/hack-gpon.github.io#538 https://github.com/hack-gpon/hack-gpon.github.io/pull/538#issuecomment-7116400087

# Devices

<ChipsetDevices />

# Firmware

<ChipsetFirmwares />
