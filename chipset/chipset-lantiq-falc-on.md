---
title: Lantiq FALC ON
has_children: false
---

The Lantiq FALC ON GPON SoCs (PEB98010, PEB98035, PEB98036). The firmwares are built either on the Lantiq SDK with OpenWrt, see [Lantiq SDK (OpenWrt)](/firmware-lantiq-openwrt), or on other systems like eCos.

Some sticks have a physical EEPROM, on the others the SoC emulates it on the I2C interface: check the device page.

For the block diagram of the PEB98035 see [Nokia / Alcatel-Lucent G-010S-P](/ont-nokia-g-010s-p#architecture). Its XGS-PON successor is the [MaxLinear PRX126](/chipset-maxlinear-prx).

# History

Unfortunately Lantiq no longer exists as it has been bought out and dismembered by Intel. This purchase was a huge deal as at the time Lantiq was at the forefront of the GPON and xDSL chipset market.
The GPON part of Lantiq ended up in `/dev/null`, while the XGS-PON sector ended up in the hands of MaxLinear and the whole Wi-Fi part remained in the hands of Intel itself.

The last produced batches of these SFPs date back to 2020/2021. All OEMs are currently migrating to Realtek.

::: warning End Of Life
The Lantiq FALC ON GPON chipsets (PEB98010, PEB98035, PEB98036) are End Of Life: the SFPs based on them (Huawei MA5671A, Nokia G-010S-P, FS.com GPON-ONU-34-20BI, CarlitoxxPro/Hilink, ...) are no longer produced and are now hard to find, see the [MikroTik forum](https://forum.mikrotik.com/t/usage-gpon-module-sfp-in-spain/104807?page=17).
:::

# Devices

<ChipsetDevices />

# Firmware

<ChipsetFirmwares />
