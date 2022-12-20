---
title: Broadcom 57810S
has_children: false
alias: HPE 530SFP+, DELL N20KJ
layout: default
redirect_to: https://hack-xpon.github.io/broadcom-57810s
---

# Hardware Specifications

|        |                      |
| ------ | -------------------- |
| Vendor | Broadcom             |
| Model  | 57810S               |
| SFP    | 2 SFP+               |
| XGMII  | ✅                   |
| HSGMII | ✅                   |
| SGMII  | ✅                   |
| Type   | PCI express SFP card |

In order to be able to set 2.5G speed you will have to patch your kernel's bnx2x module. The easiest way to do so is via DKMS which rebuilds only that module:

- [DKMS for Linux 6.0.y](https://github.com/darkbasic/bnx2x-2_5g-dkms/tree/6.0.y)

It also adds a module option that can be set to disable SFP TX fault detection, otherwise you won't be able to access your SFP mini-ONT if it's not connected to the fiber cable.

Unfortunately, despite the patches, you will still have to use UEFI eDiag to unlock 2.5G capabilities:

- [How-to enable 2.5G capability via UEFI eDiag](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)

At this point you will be able to use the following command to set the speed to 2.5G:
```
sudo ethtool -s your_network_interface autoneg off speed 2500 duplex full
```

# Miscellaneous Links
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
