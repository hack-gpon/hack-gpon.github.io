---
title: T&W TW2362H-CDEL original firmwares
has_children: false
badge: stock
platform: T&W (Lantiq PEB98035)
devices: ont-zyxel-pmg3000-d20b:works, ont-halny-hl-gsfp:works, ont-zisa-op151s:works, ont-d-link-dpn-100-rev-a2:works
---

The original firmwares of the sticks made by T&W on the TW2362H-CDEL design. The firmware of one vendor can be flashed on the sticks of the other vendors.

| Vendor firmware                                     | System                                                  |
| --------------------------------------------------- | ------------------------------------------------------- |
| [Zyxel PMG3000-D20B](/ont-zyxel-pmg3000-d20b)       | OpenWrt 12.09 (kernel 3.10.12) / 14.07 (kernel 3.10.49) |
| [HALNy HL-GSFP](/ont-halny-hl-gsfp)                 | OpenWrt                                                 |
| [Zisa OP151S](/ont-zisa-op151s)                     | eCoS                                                    |
| [D-LINK DPN-100 Rev A2](/ont-d-link-dpn-100-rev-a2) |                                                         |

::: warning
These firmwares are not built on the plain Lantiq SDK: the commands start from the T&W `twmanu` shell, and the [Lantiq SDK (OpenWrt)](/firmware-lantiq-openwrt) commands are only available from its `linuxshell`.
:::

# Compatibility

<FirmwareCompatibility />

After changing the MTD layout, these sticks can technically run the [FS modded firmware](/firmware-fs-mod) too.

# Usage

The settings of these firmwares are still documented in the device pages: see [Zyxel PMG3000-D20B](/ont-zyxel-pmg3000-d20b#general-settings-and-useful-commands) and [D-LINK DPN-100 Rev A2](/ont-d-link-dpn-100-rev-a2#gpon-omci-settings).
