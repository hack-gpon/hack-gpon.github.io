---
title: BFW Solutions WAS-110
has_children: false
alias: Azores XSS, DZS 5311XP, E.C.I. Networks EN-XGSFPP-OMAC-V2, FiberMall XGSPON-ONU-STICK, Ascent Optics XSPU-P8T9R-NxCM, ZISA OP151XGS
parent: BFW Solutions
---

# Hardware Specifications

|                  |                                                                    |
| ---------------- | ------------------------------------------------------------------ |
| Vendor/Brand     | BFW Solutions                                                      |
| Model            | WAS-110                                                            |
| ODM              | ✅                                                                 |
| Chipset          | MaxLinear PRX126                                                   |
| Flash            | 128 MB SPI NAND (Winbond W25N01GV)                                 |
| RAM              | 1 GB LPDDR3 (Nanya NT6CL256M32AM) (256 MB seen by U-Boot)          |
| CPU              | MIPS interAptiv (34Kc family)                                      |
| CPU Clock        | 400MHz                                                             |
| Bootloader       | U-Boot 2016.07-MXL-v-3.1.261                                       |
| System           | OpenWrt 19.07 based MaxLinear SDK (Kernel 4.9)                     |
| SFP interfaces   | 10GBASE-R (SFI/XFI)                                                |
| Optics           | SC/APC (Tx 1270 nm / Rx 1577 nm), laser driver MACOM M02180        |
| IP address       | 192.168.11.1                                                       |
| Web Gui          | ✅ HTTPS, see [Default credentials](#default-credentials)          |
| SSH              | ✅ disabled by default on the OEM firmware                         |
| Telnet           |                                                                    |
| Serial           | ✅ on SFP (Rx pin 7, Tx pin 2)                                     |
| Serial baud      | 115200                                                             |
| Serial encoding  | 8-N-1                                                              |
| Form Factor      | miniONT SFP+                                                       |

<ImageFigure file="ont-xgs-bfw-was-110.webp" alt="BFW Solutions WAS-110" caption="BFW Solutions WAS-110 (photo: pon.wiki, CC BY-NC-SA 4.0)" />

All the information on this page, unless otherwise stated, comes from [pon.wiki: WAS-110](https://pon.wiki/xgs-pon/ont/bfw-solutions/was-110/)[^ponwiki-was110].

::: info Info
The WAS-110 is the reference PRX126 XGS-PON stick of the [8311 community](https://pon.wiki/), which maintains an open [community firmware](https://github.com/djGrrr/8311-was-110-firmware-builder) for it. The same firmware also runs on the other PRX126 sticks, such as the [Potron X-ONU-SFPP](/xgs/ont-potron-technology-x-onu-sfpp) and the [Wintop WT-ONU-STICK](/xgs/ont-wintop-optical-technology-wt-onu-stick).
:::

## Rebrands and resellers

The WAS-110 is sold under several names[^ponwiki-was110]:

| Company                                         | Product Number                                                                     | Firmware                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------- |
| [Ascent Optics](https://ascentoptics.com/)      | [XSPU-P8T9R-NxCM](https://ascentoptics.com/product/xgspon-onu-stick.html)          | PTXG (Potron), 8311 fork  |
| [Azores Networks](https://azoresnetworks.com/)  | XSS                                                                                | Azores (BFW)              |
| [DZS](https://dzsi.com/)                        | 5311XP                                                                             |                           |
| [E.C.I. Networks](https://ecin.ca/)             | [EN-XGSFPP-OMAC-V2](/xgs/ont-ECIN-EN-XGSFPP-OMAC-v2)                               | Azores (BFW), 8311        |
| [FiberMall](https://www.fibermall.com/)         | [XGSPON-ONU-STICK](https://www.fibermall.com/sale-460693-xgspon-onu-sfp-stick.htm) | Azores (BFW), 8311 fork   |
| [FEPL](https://ontolt.com/)                     | XGSPON-ONU-STICK                                                                   |                           |
| [ZISA](https://zisacom.com/)                    | OP151XGS                                                                           |                           |

::: warning Warning
Vendor forks of the 8311 firmware are not supported by the 8311 community: ask the vendor for support or [install the official 8311 community firmware](https://pon.wiki/guides/install-the-8311-community-firmware-on-the-was-110/).
:::

<!--@partial: ./_partials/ont-prx126-architecture.md-->

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the SFP connector: Rx on pin 7, Tx on pin 2. See the [TTL UART adapter](/ttl-uart-adapter) page.

To stop the autoboot of the OEM (Azores) U-Boot press <kbd>Esc</kbd> (`Hit Esc key to stop autoboot`).

## List of partitions

| dev   | size     | erasesize | name           |
| ----- | -------- | --------- | -------------- |
| mtd0  | 00100000 | 00020000  | "uboot"        |
| mtd1  | 00040000 | 00020000  | "ubootconfigA" |
| mtd2  | 00040000 | 00020000  | "ubootconfigB" |
| mtd3  | 00040000 | 00020000  | "gphyfirmware" |
| mtd4  | 00100000 | 00020000  | "calibration"  |
| mtd5  | 01000000 | 00020000  | "bootcore"     |
| mtd6  | 06600000 | 00020000  | "system_sw"    |
| mtd7  | 00600000 | 00020000  | "ptdata"       |
| mtd8  | 00140000 | 00020000  | "res"          |
| mtd9  | 0024d000 | 0001f000  | "kernelA"      |
| mtd10 | 00554000 | 0001f000  | "bootcoreA"    |
| mtd11 | 00ac7000 | 0001f000  | "rootfsA"      |
| mtd12 | 0022b510 | 0001f000  | "kernelB"      |
| mtd13 | 005b1000 | 0001f000  | "bootcoreB"    |
| mtd14 | 01322000 | 0001f000  | "rootfsB"      |
| mtd15 | 005d0000 | 0001f000  | "ptconf"       |
| mtd16 | 02017000 | 0001f000  | "rootfs_data"  |

`mtd9`–`mtd16` are UBI volumes inside `system_sw` (`/dev/ubi0`). The stick is dual-bank (A and B): each bank has its own `kernel`, `bootcore` and `rootfs`, while `ptconf` and `rootfs_data` are shared.

### Switch banks

::: warning Warning
Verify the target bank is valid before committing to it.
:::

Alternate between banks A and B. From the OpenWrt shell:

```sh
fw_printenv commit_bank   # verify the currently committed bank
fw_printenv img_validB    # verify bank B is valid before committing
fw_setenv commit_bank B
```

From the U-Boot shell the same operation is `env set commit_bank B` followed by `env save`. Swap `A`/`B` and `img_validB`/`img_validA` to go back to bank A.

## EEPROM

The DDM (Digital Diagnostic Monitoring, SFF-8472) interface is driven by the MACOM M02180 laser driver over I²C. Linux exposes a virtual EEPROM (through the `mod_sfp_i2c` kernel module and `/etc/init.d/sfp_eeprom.sh`) that takes precedence over the physical one once loaded.

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

The virtual (non-persistent) EEPROM can be read with `sfp_i2c -r -i 0 -l 256` (A0) and `sfp_i2c -r -i 256 -l 256` (A2), or via `/dev/sfp_eeprom0` and `/dev/sfp_eeprom1`.

### Write

::: warning Warning
Incorrect writes to the EEPROM can prevent the host from recognizing the WAS-110.
:::

The physical EEPROM is write-protected. Disable the protection by writing `12345678` to A2 (0x51) at offset `0x7B`:

```sh
i2cset -fy 0 0x51 0x7B 0x12 0x34 0x56 0x78 i
```

Re-enable it by writing zeros:

```sh
i2cset -fy 0 0x51 0x7B 0x00 0x00 0x00 0x00 i
```

## Default credentials

::: info Info
These credentials are for the OEM (Azores/BFW) firmware and are **not** compatible with the 8311 community firmware.
:::

The default web credentials are stored in `/ptrom/ptconf/param_ct.xml`; UI changes are saved base64-encoded in `/ptrom/ptconf/usrconfig_conf`.

### Web credentials

| Firmware                  | Username | Password         |
| ------------------------- | -------- | ---------------- |
| Azores v1.0.21            | `admin`  | `BR#22729%635e9` |
| Azores v1.0.21            | `user`   | `user1234`       |
| Azores ≤ v1.0.20          | `admin`  | `QsCg@7249#5281` |
| Azores ≤ v1.0.20          | `user`   | `user1234`       |
| Reseller 8311 forks       | `root`   | `Aa123456`       |

### Shell credentials

SSH must be enabled from the web UI at `https://192.168.11.1/html/main.html#service/servicecontrol`.

| Firmware                  | Username | Password         |
| ------------------------- | -------- | ---------------- |
| Azores ≤ v1.0.20          | `root`   | `QpZm@4246#5753` |
| Azores v1.0.21            | `root`   | undisclosed      |

::: info Info
Modern OpenSSH (≥ 8.8) disables the legacy algorithms this firmware needs. Connect with:
`ssh -oHostKeyAlgorithms=+ssh-rsa -oPubkeyAcceptedKeyTypes=+ssh-rsa root@192.168.11.1`
:::


## System Information

The following dumps were captured by the pon.wiki contributors[^ponwiki-was110].

::: details Boot log
<<< ./serial_dump/bfw-was-110/bootlog.txt
:::

::: details /proc/cmdline
<<< ./serial_dump/bfw-was-110/procfs_cmdline.txt
:::

::: details /proc/cpuinfo
<<< ./serial_dump/bfw-was-110/procfs_cpuinfo.txt
:::

::: details /proc/meminfo
<<< ./serial_dump/bfw-was-110/procfs_meminfo.txt
:::

::: details /proc/mtd
<<< ./serial_dump/bfw-was-110/procfs_mtd.txt
:::

# Miscellaneous Links

- [pon.wiki: WAS-110](https://pon.wiki/xgs-pon/ont/bfw-solutions/was-110/)
- [8311 community firmware builder](https://github.com/djGrrr/8311-was-110-firmware-builder)
- [Install the 8311 community firmware on the WAS-110](https://pon.wiki/guides/install-the-8311-community-firmware-on-the-was-110/)

[^ponwiki-was110]: [pon.wiki: WAS-110](https://pon.wiki/xgs-pon/ont/bfw-solutions/was-110/), licensed [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/); boot log and `procfs` dumps imported from the [PONwiki repository](https://github.com/up-n-atom/PONwiki/tree/main/docs/xgs-pon/ont/bfw-solutions/was-110).
