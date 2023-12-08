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

# Compatibility

{% include alert.html content="This card requires a solder mod in order to work with some SFP ONTs." alert="Note"  icon="svg-warning" color="yellow" %}

According to a [blog post](https://rsaxvc.net/blog/2020/8/15/Nokia_G-010S-A_Pin_6_Issue.html), some manufacturers designed their SFP ONTs in a way that doesn't 100% comply with the SFF specification. A solder mod like described in a [dslreports thread](https://www.dslreports.com/forum/r32529545-) might be required to get certain SFP modules to work with this card. This mod grounds `MOD_ABS PIN (6)`, which signals to the card that a module is inserted in the slot. This signals the card to send power to the SFP module.

## Affected SFP Modules

- [Zyxel PMG3000-D20B](/ont-zyxel-pmg3000-d20b) (see Github issue discussion linked below)
- [Nokia G-010S-A](/ont-nokia-g-010s-a)

# Miscellaneous Links
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
- [Solder mod required to make some SFP ONTs work with this card](https://github.com/xvzf/zyxel-gpon-sfp/issues/10)
