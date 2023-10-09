---
title: Broadcom 57810S
has_children: false
alias: HPE 530SFP+, DELL N20KJ
layout: default
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

In order for the card to be able to sync at 2.5G speeds, the kernel's bnx2x module has to be patched. The easiest way to do so is via DKMS which rebuilds that module only:

- [DKMS for Linux 6.0.y](https://github.com/darkbasic/bnx2x-2_5g-dkms/tree/6.0.y)

It also adds a module option that can be set to disable SFP TX fault detection, otherwise the SFP mini-ONT will not be accessible if serial output to SFP is enabled. Alternatively the serial interface can be disabled on the SFP module.

Unfortunately, despite the patches, UEFI eDiag still has to be used to unlock 2.5G capabilities:

- [How-to enable 2.5G capability via UEFI eDiag](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)

At this point, use the following command to set the speed to 2.5G:
```
sudo ethtool -s your_network_interface autoneg off speed 2500 duplex full
```

# Miscellaneous Links
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
