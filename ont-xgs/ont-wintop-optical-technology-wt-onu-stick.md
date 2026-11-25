---
title: Wintop Optical Technology WT-ONU-STICK
has_children: false
alias: Banana PI BPI-XGS-PON-ONU, Yunvo YV-XGS-Stick-T
parent: Wintop Optical Technology
---

# Hardware Specifications

|                  |                                                                    |
| ---------------- | ------------------------------------------------------------------ |
| Vendor/Brand     | Wintop Optical Technology[^wintop]                                 |
| Model            | WT-ONU-STICK (WT XGSPON ONU Stick)                                |
| ODM              | ✅                                                                 |
| Chipset          | MaxLinear PRX126[^prx126]                                          |
| Flash            | 128 MB SPI NAND                                                    |
| RAM              | 1 GB                                                               |
| CPU              | MIPS interAptiv (34Kc family)                                      |
| CPU Clock        | 400MHz                                                             |
| SFP interfaces   | 10GBASE-R (SFI/XFI)                                                |
| Optics           | SC/UPC or SC/APC (Tx 1270 nm / Rx 1577 nm)                         |
| IP address       | 192.168.1.1                                                        |
| SSH              | ✅                                                                 |
| Telnet           |                                                                    |
| Serial           | ✅ on SFP (Rx pin 7, Tx pin 2)                                     |
| Serial baud      | 115200                                                             |
| Serial encoding  | 8-N-1                                                              |
| Form Factor      | miniONT SFP+                                                       |

<ImageFigure file="ont-xgs-wintop-wt-onu-stick.webp" alt="Wintop Optical Technology WT-ONU-STICK" caption="Wintop Optical Technology WT-ONU-STICK (photo: pon.wiki, CC BY-NC-SA 4.0)" />

All the information on this page, unless otherwise stated, comes from [pon.wiki: WT-ONU-STICK](https://pon.wiki/xgs-pon/ont/wintop-optical-technology/wt-onu-stick/)[^ponwiki-wintop].

::: info Info
The WT-ONU-STICK is a PRX126-based stick that is compatible with the [8311 community firmware](https://github.com/djGrrr/8311-was-110-firmware-builder). See the [BFW Solutions WAS-110](/xgs/ont-bfw-solutions-was-110) page for more details on the community firmware.
:::

## Rebrands and resellers

| Company                                        | Product Number                                                                                               | Firmware      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------- |
| [Banana PI](https://forum.banana-pi.org)       | [BPI-XGS-PON-ONU](https://www.bpi-shop.com/products/xgs-pononustick.html)                                    | Unknown       |
| [Yunvo](https://www.yunvoptic.com/)             | YV-XGS-Stick-T                                                                                                | 8311 fork     |

::: warning Warning
Vendor forks of the 8311 firmware are not supported by the 8311 community: ask the vendor for support or [install the official 8311 community firmware](https://pon.wiki/guides/install-the-8311-community-firmware-on-the-was-110/#supplementary-upgrades).
:::

<!--@partial: ./_partials/ont-prx126-architecture.md-->

## Default credentials

### Bootloader

To access the U-Boot console hold <kbd>Esc</kbd> on device hot-plug to abort autoboot. At the prompt `### Please input uboot password: ###` enter `abc123`.


# Miscellaneous Links

- [pon.wiki: WT-ONU-STICK](https://pon.wiki/xgs-pon/ont/wintop-optical-technology/wt-onu-stick/)
- [8311 community firmware builder](https://github.com/djGrrr/8311-was-110-firmware-builder)

[^wintop]: <https://www.enwintoptec.com/>
[^prx126]: <https://www.maxlinear.com/product/access/fiber-access/socs-for-optical-networking-units-onu/prx126>
[^ponwiki-wintop]: [pon.wiki: WT-ONU-STICK](https://pon.wiki/xgs-pon/ont/wintop-optical-technology/wt-onu-stick/), licensed [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
