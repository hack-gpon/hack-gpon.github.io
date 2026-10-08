---
title: T3 Technology T723
has_children: false
parent: T3 Technology
---

# Hardware Specifications

|                  |                                                              |
| ---------------- | ------------------------------------------------------------ |
| Vendor/Brand     | T3 Technology / TrueOnline                                   |
| Model            | T723                                                         |
| CPU              | 2x ARM Cortex-A9 (ARMv7 Processor rev 1)                     |
| Chipset          | HiSilicon A9, board description `HWSOC13`                    |
| Flash            | 256 MB SPI-NAND                                              |
| RAM              | 512 MB DDR (`434M` exposed by the kernel boot arguments)      |
| System           | Huawei Dopra/WAP-derived Linux 5.10.0                        |
| Ethernet         | 1x 2.5GbE LAN, 3x 1GbE LAN                                  |
| Voice            | 1x POTS                                                      |
| Web Gui          | ✅ HTTPS                                                     |
| SSH              | Disabled by default; vendor WAP CLI when enabled              |
| Telnet           | Disabled by default; vendor WAP CLI when enabled              |
| Serial           | `ttyAMA1`, 115200 baud in boot arguments; physical access untested |
| Form Factor      | Wi-Fi 7 CPE with integrated GPON ONT                         |

<ImageFigure file="t3-t723/top.jpg" alt="TrueOnline-branded T3 Technology T723" caption="TrueOnline-branded T3 Technology T723 (credentials redacted)" />

<ImageFigure file="t3-t723/bottom.jpg" alt="T3 Technology T723 rear ports and underside" caption="T723 rear ports and underside label (identifiers and credentials redacted)" />

::: info Note
The details below were verified on a TrueOnline unit with hardware revision 4EF8.D.
:::

## Software versions

```text
hardware version          = 4EF8.D
main software version     = V5R025C00S126
standby software version  = V5R025C00S121
uboot version             = 2022.07
kernel version            = 5.10.0
```

## Flash layout

The boot arguments report `flashsize=0x10000000`, `ddr_realsize=512M`,
`flash_chip=spinand`, and a SquashFS root inside `ubilayer_v5`.

| dev   | size       | erasesize | name            |
| ----- | ---------- | --------- | --------------- |
| mtd0  | `00100000` | `00020000` | `bootcode`      |
| mtd1  | `0ff00000` | `00020000` | `ubilayer_v5`   |
| mtd2  | `0001f000` | `0001f000` | `flash_configA` |
| mtd3  | `0001f000` | `0001f000` | `flash_configB` |
| mtd4  | `0001f000` | `0001f000` | `slave_paramA`  |
| mtd5  | `0001f000` | `0001f000` | `slave_paramB`  |
| mtd6  | `03548000` | `0001f000` | `allsystemA`    |
| mtd7  | `03548000` | `0001f000` | `allsystemB`    |
| mtd8  | `0001f000` | `0001f000` | `wifi_paramA`   |
| mtd9  | `0001f000` | `0001f000` | `wifi_paramB`   |
| mtd10 | `00117000` | `0001f000` | `keyfile`       |
| mtd11 | `00a0d000` | `0001f000` | `file_system`   |
| mtd12 | `07820000` | `0001f000` | `app_system`    |

The `allsystemA` and `allsystemB` volumes provide the A/B firmware images. The tested
unit booted the SquashFS image embedded in `allsystemB`; writable application data is
stored on UBI volumes mounted below `/mnt/jffs2`.

# Access

## Vendor CLI

Both Telnet and SSH were disabled in the tested TrueOnline configuration. After they
were enabled, Telnet (TCP 23) and the vendor-modified Dropbear service (TCP 22) both
opened the Huawei-style WAP CLI. SSH does not provide a normal POSIX shell and may
present a second `Login:` prompt inside the SSH session.

The tested configuration has separate privileged accounts:

- `superadmin` is the `X_HW_CLIUserInfoInstance` used by the WAP CLI;
- `telecomadmin` is a level-0 `X_HW_WebUserInfoInstance` used by the web interface.

They are not interchangeable, and their passwords are operator/device-specific.

Useful read-only commands include:

```text
display version
display onu info
display pppoe client all
display current-configuration
display tr069 info
```

The `su` command changes the prompt from `WAP>` to `SU_WAP>`. The subsequent vendor
`shell` command remains restricted and must not be confused with unrestricted Linux
root access.

# GPON status

## Getting the operational status of the ONU

```text
SU_WAP> display onu info
onuid:<redacted> reg status:O5 xpon module:1

success!
```

## Confirming bridge mode

When the Internet WAN is bridged, the ONT has no local PPP client:

```text
SU_WAP> display pppoe client all
----------------------------------------------------------------------
Index  Interface HW Addr             State           IP/Netmask
----------------------------------------------------------------------
----------------------------------------------------------------------
Total: 0
success!
```

On the tested TrueOnline service, VLAN 100 with priority 0 was retained while the WAN
was changed to `PPPoE_Bridged` with NAT disabled. A downstream router connected to the
2.5GbE LAN1 port then established the PPPoE session. These VLAN and authentication
details are operator-specific.

# Configuration format

Configuration exports use two layers of Huawei encryption:

1. The complete XML is gzip-compressed, encrypted with the AESCrypt2
   AES-256-CBC/HMAC-SHA256 format, and prefixed by an eight-byte Huawei header.
   The header checksum uses polynomial `0x04C11DB7`, flushing four zero bytes after
   every 1024-byte chunk of `IV || ciphertext || HMAC`.
2. Sensitive XML attribute values may additionally use Huawei `$2...$` strings:
   AES-256-CBC with an appended IV and a custom printable base-93 representation.

[`NetworkAndRouterTools`](https://github.com/KevinZonda/NetworkAndRouterTools/tree/master/huawei_ctree_tool)
supports the outer configuration wrapper, while
[`huawei-utility-page`](https://github.com/andreluis034/huawei-utility-page)
documents and implements the inline `$2...$` format.

::: warning Warning
Configuration exports contain device identifiers and credentials. Do not publish an original or decrypted export; use generated fixtures when testing tools.
:::
