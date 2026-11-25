---
title: Nokia XS-010X-Q
has_children: false
parent: Nokia
---

# Hardware Specifications

|                  |                                                                                  |
| ---------------- | -------------------------------------------------------------------------------- |
| Vendor           | Nokia                                                                            |
| Model            | XS-010X-Q (3FE48118AC)[^ponwiki-xs010xq]                                         |
| ODM              | CIG                                                                              |
| ODM Product Code | XG-99YF                                                                           |
| Chipset          | [Cortina CA8271A](/chipset-cortina-ca827x)                                       |
| CPU              | Taroko (MIPS)[^ponwiki-xs010xq]                                                  |
| CPU Clock        | 500MHz[^ponwiki-xs010xq]                                                         |
| Bootloader       | U-Boot 2015.04 (CIG XGS-PON Boot Version 1.0.0)                                  |
| Manufacter       | CIG                                                                              |
| Flash            | 128MB SPI NAND (Macronix MX35LF1GE4AB)[^ponwiki-xs010xq]                         |
| RAM              | 128MB DDR3 (Nanya NT5CC64M16GP)[^ponwiki-xs010xq]                                |
| System           | Custom Linux by Cortina (Saturn SDK) based on Kernel 4.4                         |
| 10GBaseT         | Yes                                                                              |
| Optics           | SC/APC (Tx 1270 nm / Rx 1577 nm), laser driver MACOM M02181[^ponwiki-xs010xq]    |
| IP address       | 192.168.100.1                                                                    |
| Web Gui          | ✅ Port 80 user: `admin`, password: `1234`                                       |
| SSH              | ✅ (see Enable SSH)                                                              |
| Telnet           | ✅ Port 23 user: `admin`, password: `1234` (see Telnet Full Shell)               |
| Serial           | ✅                                                                               |
| Serial baud      | 115200                                                                           |
| Serial encoding  | 8-N-1                                                                            |
| Form Factor      | ONT                                                                              |


## Default credentials

| Service | Username  | Password | Notes                                                       |
| ------- | --------- | -------- | ----------------------------------------------------------- |
| Web GUI | `admin`   | `1234`   | `http://192.168.100.1/`                                     |
| Telnet  | `admin`   | `1234`   | limited `GponSLID` shell, see [Enable Telnet Full Shell](#enable-telnet-full-shell) |
| Telnet  | `ONTUSER` | generated | full shell, only after changing `admin_mask`               |
| Serial  | `ONTUSER` | generated | full shell                                                 |

The telnet and web credentials are also confirmed by [pon.wiki](https://pon.wiki/xgs-pon/ont/nokia/xs-010x-q/#telnet-credentials)[^ponwiki-xs010xq].

## EEPROM

The ONT has no SFP cage, but the optical module still has a DDM EEPROM: it is handled by the MACOM M02181 laser driver[^ponwiki-xs010xq].

## Accessing the Web GUI

The ONT's web GUI is available at `192.168.100.1` on port 80. To access it, your device must be on the same subnet (`192.168.100.0/24`). If your router uses a different subnet (e.g. `10.0.0.0/20`), you have two options:

- **Direct connection**: connect your PC directly to the ONT's Ethernet port and set a static IP address (e.g. `192.168.100.2`, netmask `255.255.255.0`)
- **Via router**: add a virtual IP in the `192.168.100.0/24` range to your router's WAN interface and create the appropriate routing/NAT rules

# External/Internal Photo

<ImageFigure file="ont-nokia_xs-010x-q_front.jpg" alt="Nokia XS-010X-Q Front" caption="Nokia XS-010X-Q Front" />

<ImageFigure file="ont-nokia_xs-010x-q_rear.jpg" alt="Nokia XS-010X-Q Rear" caption="Nokia XS-010X-Q Rear" />

<ImageFigure file="ont-nokia_xs-010x-q_internal_1.jpg" alt="Nokia XS-010X-Q Internal 1" caption="Nokia XS-010X-Q Internal 1" />

<ImageFigure file="ont-nokia_xs-010x-q_internal_2.jpg" alt="Nokia XS-010X-Q Internal 2" caption="Nokia XS-010X-Q Internal 2" />

## Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface: it's on the top left of the board, when the Ethernet\Power\Optical ports are facing down. TX, RX and ground pads need to be connected to a USB2TTL adapter supporting 3V3 logic.

<ImageFigure file="ont-nokia_xs-010x-q_ttl.jpg" alt="Nokia XS-010X-Q TTL Pads" caption="Nokia XS-010X-Q TTL Pads" />

::: warning Note
Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work.
:::

::: warning Firmware 3FE49337BOCK28
Newer firmware versions (starting from 3FE49337BOCK28) disable the serial console after the boot process completes. The boot log is still visible via UART, but no interactive shell or prompt is available. Interrupting the boot into U-Boot via Ctrl+C does not appear to work on this firmware.
:::

## List of software versions
- 3FE49337AOCK80 - (R4.4.17.063 CIG 25/06/2021)
- 3FE49337BOCK28

## List of partitions

| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00020000  | "ssb"           |
| mtd1  | 00100000 | 00020000  | "uboot-env"     |
| mtd2  | 00100000 | 00020000  | "dtb0"          |
| mtd3  | 00600000 | 00020000  | "kernel0"       |
| mtd4  | 02800000 | 00020000  | "rootfs0"       |
| mtd5  | 00100000 | 00020000  | "dtb1"          |
| mtd6  | 00600000 | 00020000  | "kernel1"       |
| mtd7  | 02800000 | 00020000  | "rootfs1"       |
| mtd8  | 01400000 | 00020000  | "userdata"      |
| mtd9  | 00100000 | 00020000  | "mfginfo1"      |
| mtd10 | 00100000 | 00020000  | "mfginfo2"      |
| mtd11 | 00001000 | 00001000  | "uboot-env2"    |
| mtd12 | 00b09000 | 0001f000  | "squashfs_ubi"  |
| mtd13 | 01078000 | 0001f000  | "userdata"      |
| mtd14 | 00b09000 | 0001f000  | "squashfs_ubi"  |

::: info Info
The `/proc/mtd` captured by pon.wiki on another unit shows slightly different sizes for `ssb` (`00400000`), `uboot-env2` (`00100000`) and the first `squashfs_ubi` (`00be1000`): the UBI volumes depend on the installed firmware. See the dump below[^ponwiki-xs010xq].
:::

This ONT supports dual boot. 

`kernel0` and `rootfs0` respectively contain the kernel and firmware of the first image, `kernel1` and `rootfs1` the kernel and firmware of the second one.

## Boot log and system information

The following dumps were taken by the pon.wiki contributors[^ponwiki-xs010xq].

::: details Boot log
<<< ./serial_dump/nokia-xs-010x-q/bootlog.txt
:::

::: details /proc/cpuinfo
<<< ./serial_dump/nokia-xs-010x-q/procfs_cpuinfo.txt
:::

::: details /proc/meminfo
<<< ./serial_dump/nokia-xs-010x-q/procfs_meminfo.txt
:::

::: details /proc/mtd
<<< ./serial_dump/nokia-xs-010x-q/procfs_mtd.txt
:::

<!--@partial: ./_partials/ont-nokia-use.md-->

<!--@partial: ./_partials/ont-nokia-useful-command.md-->

## Enable SSH (not persistent)

Port 22 is filtered by default and the SSH daemon can be only enabled in runtime. Here is the procedure but it's not persistent and will need to be done again after each reboot:

Access UART with `ONTUSER`, then enter `system\misc`.

Set `ssh_en` to `1` with the command:
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>ssh_en set 1
---ATECMDRESULT--- OK
```

Go back to `system`, then `shell` and run this command:
```sh
#ONT/system/misc>exit
#ONT/system>shell
#ONT/system/shell>iptables -F
```
## Enable Telnet Full Shell

When using the default credentials to access telnet (`admin`\\`1234`), the prompt is limited to the `GponSLID` shell that only permits modifying or displaying the `PLOAM` password.
If you change the `admin_mask` to `255.255.255.255`, default credentials stop working but you can login as `ONTUSER` using the generated password to have full shell like when using UART.

Here is the procedure to change `admin_mask`:

Access UART with `ONTUSER`, then enter `system\misc`.

Set `admin_mask` to `255.255.255.255` with the command:
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>admin_mask set 255.255.255.255
normal load eep datat
---ATECMDRESULT--- OK
```

Now reboot the ONT and you can access telnet with `ONTUSER` and full power :)

# Miscellaneous Links

- [pon.wiki: Nokia XS-010X-Q](https://pon.wiki/xgs-pon/ont/nokia/xs-010x-q/)

[^ponwiki-xs010xq]: [pon.wiki: XS-010X-Q (3FE48118AC) / CIG XG-99YF](https://pon.wiki/xgs-pon/ont/nokia/xs-010x-q/), licensed [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/); boot log and `procfs` dumps imported from the [PONwiki repository](https://github.com/up-n-atom/PONwiki/tree/main/docs/xgs-pon/ont/nokia/xs-010x-q).
