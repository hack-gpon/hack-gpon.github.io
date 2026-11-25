---
title: Carlito firmware
has_children: false
parent: Lantiq SDK (OpenWrt)
badge: unverified
platform: Lantiq SDK (OpenWrt)
devices: ont-huawei-ma5671a:works, ont-nokia-g-010s-p:reported, ont-fs-com-gpon-onu-stick-with-mac:reported, ont-hilink-hl23446:reported, ont-nokia-g-010s-a:procedure
---

A modified firmware found on the internet: the original author is unknown and there is no source code. It supports the physical EEPROM of the [Nokia G-010S-P](/ont-nokia-g-010s-p).

::: info Info
Be careful, backup goi_config from uboot before changing the firmware.
:::

For the commands shared with the other Lantiq firmwares see [Lantiq SDK (OpenWrt)](/firmware-lantiq-openwrt).

# Compatibility

<FirmwareCompatibility />

The [Nokia G-010S-A](/ont-nokia-g-010s-a) can run this firmware after changing its MTD layout, see [Nokia G-010S-A](/firmware-lantiq-openwrt#nokia-g-010s-a).

# Files

- [Carlito MTD2](https://ma5671a.s3.nl-ams.scw.cloud/mtd2.bin){.btn} md5hash: d3cb6f7efec201b37931139feb4bb23b
- [Carlito MTD5](https://ma5671a.s3.nl-ams.scw.cloud/mtd5.bin){.btn} md5hash: 59d2dc15227d6f693a38131eca89b29e

# Usage

## Speed LAN Mode

To enable the interface to sync at 2.5 Gbps / using HSGMII with auto-neg on:

```sh
fw_setenv sgmii_mode 5
```

See [Getting/Setting Speed LAN Mode](/firmware-lantiq-openwrt#getting-setting-speed-lan-mode) for the other values.

# GPON/OMCI settings

## Getting/Setting OMCI software version (ME 7)
```sh
fw_setenv image0_version V1.7.6-170626
fw_setenv image1_version V1.7.6-170626
```

## Setting ONU GPON PLOAM password
```sh
fw_setenv nPassword "0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39"
```
or
```sh
uci set gpon.ploam.nPassword="0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39"
uci commit 
```

## Setting ONU GPON LOID and LOID password
```sh
fw_setenv omci_loid 1234567890
fw_setenv omci_lpwd password01
```
If LOID is disabled in the firmware try alternative software.

## Setting ONU GPON Serial Number
```sh
fw_setenv ont_serial ABCD12345678
```
or
```sh
uci set gpon.ploam.nSerial="0x48 0x57 0x54 0x43 0x9D 0xAC 0xC7 0xA3"
uci commit 
```

## Setting and checking oem-generic
```sh
fw_setenv target oem-generic
fw_printenv target=oem-generic
```
