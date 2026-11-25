---
title: Cortina Access
has_children: false
---

The Cortina Systems / Cortina Access (previously StorLink) SoCs: the CA8271 series (XGS-PON and 10G-EPON SFU ONTs and SFP+ sticks), the CA8289 (HGU, XGS-PON and 10G-EPON) and its Realtek version RTL9615C. The firmwares run the Cortina Linux of the Saturn SDK.

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

# Devices

<ChipsetDevices />

# Firmware

<ChipsetFirmwares />

[^ca8271x]: *Hacking CA8271x / CA8289x XGS-PON & 10G-EPON ONTs*, YuukiJapanTech/CA8271x https://github.com/YuukiJapanTech/CA8271x
