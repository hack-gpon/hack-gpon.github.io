---
title: Carlito Firmware for Huawei MA5671A
has_children: false
parent: Huawei MA5671A
layout: default
---

# General setting

{% include alert.html content="Be careful, back up the goi_config from ubot before changing firmware." alert="Info" icon="svg-info" color="blue" %}

## Setting image version
```sh
fw_setenv image0_version V1.7.6-170626
fw_setenv image1_version V1.7.6-170626
```

## Setting S/N
```sh
fw_setenv ont_serial ABCD12345678
```
or
```sh
uci set gpon.ploam.nSerial="0x48 0x57 0x54 0x43 0x9D 0xAC 0xC7 0xA3"
uci commit 
```

## Setting PLOAM Password
```sh
fw_setenv nPassword "0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39"
```
or
```sh
uci set gpon.ploam.nPassword="0x30 0x31 0x32 0x33 0x34 0x35 0x36 0x37 0x38 0x39"
uci commit 
```

## Setting LOID and Checkcode Password
```sh
fw_setenv omci_loid 1234567890
fw_setenv omci_lpwd password01
```
If LOID is disabled in the firmware try alternative software.

## Setting and check oem-generic
```sh
fw_setenv target oem-generic
fw_printenv target=oem-generic
```

## Setting HSMIII
```sh
fw_setenv sgmii_mode 5
```