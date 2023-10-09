---
title: Carlito Firmware for Huawei MA5671A
has_children: false
parent: Huawei MA5671A
layout: default
---

{% include alert.html content="Be careful, backup goi_config from uboot before changing the firmware." alert="Info" icon="svg-info" color="blue" %}

# GPON ONU status

## Querying a particular OMCI ME
```sh
omci_pipe.sh meg MIB_IDX ME_IN
```
Where `MIB_IDX` is the MIB ID and `ME_IN` is the ME instance number

## Getting/Setting Speed LAN Mode

To enable the interface to sync at 2.5 Gbps / using HSGMII with auto-neg on:

```sh
fw_setenv sgmii_mode 5
```

To revert the afore-mentioned command:
```sh
fw_setenv sgmii_mode
```

To check the set value fo the LAN Mode:

```sh
onu lanpsg 0
```
The `link_status` variable tells the current speed:

| Value (for `sgmii_mode` and `link_status`) | Speed                              |
| ------------------------------------------ | ---------------------------------- |
| 3                                          | 1 Gbps / SGMII with auto-neg on    |
| 4                                          | 1 Gbps / SGMII with auto-neg off   |
| 5                                          | 2.5 Gbps / HSGMII with auto-neg on |

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