---
title: Potron Technology X-ONU-SFPP
has_children: false
alias: FiberMall XGSPON-ONU-STICK-V8, Full Vision FV-NS10S, H-COM SPP425H-GAB4, LuLeey LL-XS1025
parent: Potron Technology
---

# Hardware Specifications

|                  |                                                                    |
| ---------------- | ------------------------------------------------------------------ |
| Vendor/Brand     | Potron Technology[^potron]                                         |
| Model            | X-ONU-SFPP (SFP+ XGSPON ONU Stick)                                |
| ODM              | ✅                                                                 |
| Chipset          | [MaxLinear PRX126](/chipset-maxlinear-prx)[^prx126]                |
| Flash            | 128 MB SPI NAND (Winbond W25N01GV)                                 |
| RAM              | 1 GB (Rayson RS256M32LD3D1LMZ)                                     |
| CPU              | MIPS interAptiv (34Kc family)                                      |
| CPU Clock        | 400MHz                                                             |
| System           | OpenWrt based MaxLinear SDK                                        |
| SFP interfaces   | 10GBASE-R (SFI/XFI)                                                |
| Optics           | SC/UPC or SC/APC (Tx 1270 nm / Rx 1577 nm), laser driver MACOM M02181 |
| IP address       | 192.168.1.1 (OEM PTXG firmware)                                    |
| Web Gui          | ❌ (OEM firmware)                                                  |
| SSH              | ✅ see [Default credentials](#default-credentials)                 |
| Telnet           |                                                                    |
| Serial           | ✅ on SFP (Rx pin 7, Tx pin 2)                                     |
| Serial baud      | 115200                                                             |
| Serial encoding  | 8-N-1                                                              |
| Form Factor      | miniONT SFP+                                                       |

<ImageFigure file="ont-xgs-potron-x-onu-sfpp.webp" alt="Potron Technology X-ONU-SFPP" caption="Potron Technology X-ONU-SFPP (photo: pon.wiki, CC BY-NC-SA 4.0)" />

All the information on this page, unless otherwise stated, comes from [pon.wiki: X-ONU-SFPP](https://pon.wiki/xgs-pon/ont/potron-technology/x-onu-sfpp/)[^ponwiki-potron].

::: info Info
The X-ONU-SFPP is a PRX126-based stick that is compatible with the [8311 community firmware](https://github.com/djGrrr/8311-was-110-firmware-builder). See the [BFW Solutions WAS-110](/xgs/ont-bfw-solutions-was-110) page for more details on the community firmware.
:::

## Rebrands and resellers

| Company                                              | Product Number                                                                                     | Firmware               |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------- |
| [Better Internet](https://store.betterinternet.ltd/) | [X-ONU-SFPP](https://store.betterinternet.ltd/products/x-onu-sfpp)                                 | 8311                   |
| [EXEN](https://exen.sh/)                             | [X-ONU-SFPP](https://exen.sh/products/x-onu-sfpp-was-110-alternative)                              | 8311                   |
| [FiberMall](https://www.fibermall.com/)              | [XGSPON-ONU-STICK-V8](https://www.fibermall.com/sale-462134-xgspon-onu-sfp-stick-i-temp.htm)       | 8311 fork              |
| [Full Vision Com-Tech](https://fullvisiontech.com/)  | FV-NS10S                                                                                           | PTXG (Potron)          |
| [H-COM](https://www.zhaoyongoptics.com/)             | SPP425H-GAB4                                                                                       | 8311 fork              |
| [LuLeey](https://www.luleey.com/)                    | [LL-XS1025](https://www.luleey.com/product/xgspon-stick-onu-sfp-transceiver/)                      | 8311 fork              |
| [Yunvo](https://www.yunvoptic.com/)                   | SFP+ONU-XGSPON                                                                                     | PTXG (Potron), 8311 fork |

::: warning Warning
Vendor forks of the 8311 firmware are not supported by the 8311 community: ask the vendor for support or [install the official 8311 community firmware](https://pon.wiki/guides/install-the-8311-community-firmware-on-the-was-110/#supplementary-upgrades).
:::

<!--@partial: ./_partials/ont-prx126-architecture.md-->

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the SFP connector: Rx on pin 7, Tx on pin 2. See the [TTL UART adapter](/ttl-uart-adapter) page.

## EEPROM

The DDM (Digital Diagnostic Monitoring, SFF-8472) interface is driven by the MACOM M02181 laser driver over I²C (`/dev/i2c-0`).

### Read

A0 (0x50), physical EEPROM:

```sh
hexdump -Cv /sys/class/pon_mbox/pon_mbox0/device/eeprom50
ethtool -m pon0 raw on | head -c 256 | hexdump -Cv
i2cdump -fy 0 0x50
```

A2 (0x51), physical EEPROM:

```sh
hexdump -Cv /sys/class/pon_mbox/pon_mbox0/device/eeprom51
ethtool -m pon0 raw on | tail -c 256 | hexdump -Cv
i2cdump -fy 0 0x51
```

### Write

The EEPROM is write-protected. There are two known passcodes: a user passcode and a vendor passcode.

#### User passcode

The A2 (0x51) User EEPROM section from offset `0x80` to `0xF7` can be unlocked using the passcode `68646762` by writing it to A2 (0x51) at offset `0x7B`:

```sh
i2cset -fy 0 0x51 0x7B 0x68 0x64 0x67 0x62 i
```

#### Vendor passcode

::: warning Warning
Incorrect writes to the EEPROM can prevent the host from recognizing the X-ONU-SFPP.
:::

A0 (0x50) can be unlocked using the passcode `9142F007` by writing it to A2 (0x51) at offset `0x7B`:

```sh
i2cset -fy 0 0x51 0x7B 0x91 0x42 0xF0 0x07 i
```

## Default credentials

### Shell credentials (OEM PTXG firmware)

::: info Info
Modern OpenSSH (≥ 8.8) disables the legacy algorithms this firmware needs. Connect with:
`ssh -oHostKeyAlgorithms=+ssh-rsa -oPubkeyAcceptedKeyTypes=+ssh-rsa root@192.168.1.1`
:::

| Username | Password |
| -------- | -------- |
| `root`   | *(empty)* |

### Web credentials (reseller 8311 forks)

::: warning Warning
8311 forks are **not** supported by the 8311 community. Ask the vendor for support or [install the official 8311 community firmware](https://pon.wiki/guides/install-the-8311-community-firmware-on-the-was-110/#supplementary-upgrades).
:::

| Username | Password   |
| -------- | ---------- |
| `root`   | `Aa123456` |

### Bootloader

To access the U-Boot console type `admin` at the prompt: `Hit enter to stop autoboot`.


## System Information

The following dumps were captured by the pon.wiki contributors[^ponwiki-potron].

::: details Boot log
<<< ./serial_dump/potron-x-onu-sfpp/bootlog.txt
:::

::: details /proc/cmdline
<<< ./serial_dump/potron-x-onu-sfpp/procfs_cmdline.txt
:::

::: details /proc/cpuinfo
<<< ./serial_dump/potron-x-onu-sfpp/procfs_cpuinfo.txt
:::

::: details /proc/meminfo
<<< ./serial_dump/potron-x-onu-sfpp/procfs_meminfo.txt
:::

::: details /proc/mtd
<<< ./serial_dump/potron-x-onu-sfpp/procfs_mtd.txt
:::

# Miscellaneous Links

- [pon.wiki: X-ONU-SFPP](https://pon.wiki/xgs-pon/ont/potron-technology/x-onu-sfpp/)
- [8311 community firmware builder](https://github.com/djGrrr/8311-was-110-firmware-builder)

[^potron]: <https://www.potrontec.com/index/index/list/cat_id/2.html#11-83>
[^prx126]: <https://www.maxlinear.com/product/access/fiber-access/socs-for-optical-networking-units-onu/prx126>
[^ponwiki-potron]: [pon.wiki: X-ONU-SFPP](https://pon.wiki/xgs-pon/ont/potron-technology/x-onu-sfpp/), licensed [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/); boot log and `procfs` dumps imported from the [PONwiki repository](https://github.com/up-n-atom/PONwiki/tree/main/docs/xgs-pon/ont/potron-technology/x-onu-sfpp).
