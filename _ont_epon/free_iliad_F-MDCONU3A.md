---
title: Free/Iliad F-MDCONU3A (v1)
has_children: false
layout: default
parent: Free/Iliad
---

# Hardware Specifications

|                  |                                 |
| ---------------- | ------------------------------- |
| Vendor/Brand     | Free/Iliad                      |
| Model            | F-MDCONU3A                      |
| ODM              | ✅                              |
| ODM Product Code |                                 |
| Chipset          | BCM55030B2FBG rev B2            |
| Flash            | W25Q32J (4 MB SPI)              |
| RAM              | embedded SRAM (DCCM)            |
| CPU              | ARCompact[^arc-isa], big endian |
| CPU Clock        |                                 |
| Bootloader       | TK2000 Boot v3.27               |
| System           | bare-metal (no OS)              |
| Load addr        | 0x20000000 (ICCM)              |
| HSGMII           | No                              |
| Optics           | SFP w/o MAC                     |
| IP address       |                                 |
| Web Gui          |                                 |
| SSH              |                                 |
| Telnet           |                                 |
| Serial           | ✅                              |
| Serial baud      | 57600                           |
| Serial encoding  | 8-N-1                           |
| Form Factor      | ONT                             |

The BCM55030 is a 10G-EPON DPoE (DOCSIS Provisioning over EPON) ONU/ONT used by Free/Iliad (France) on their FTTH network. The PON side operates in asymmetric 10G/1G mode: downstream at 1577 nm / 10.3125 Gb/s, upstream at 1310 nm / 1.25 Gb/s burst (IEEE 802.3av).

The BCM55030's UNI (User Network Interface) side should be capable of 4xSGMII (1 GbE) or 1xXAUI (10 GbE) or 1xXFI (10 GbE SFP) or 1xRGMII, but only one SGMII lane is actually routed (1000BASE-X via soldered SFP+ male connector).

UNI link won't go up when connected to a media converter or directly to a NIC. The firmware waits for a valid 1000BASE-X partner before activating the PON side (circular dependency).

The CPU uses a Harvard architecture: ICCM (Instruction Closely-Coupled Memory) for code execution and DCCM/SRAM for data. Code in ICCM is not readable via the data bus — the `mem/rf` command can only read data memory, not firmware code.

## Serial

The serial port is easily accessible at TP5 and TP6. A prompt is available without authentication, it is structured as a tree of directories. To navigate type the subdirectory name. To go back type `/` and hit enter. To list available commands type `help`.

### CLI Permission Levels

The CLI has a 3-level permission system. By default, UART connects at level 0 (restricted). The **`pl`** (Print Level) built-in command switches between levels without any authentication:

| Command      | Level | Effect                                    |
| ------------ | ----- | ----------------------------------------- |
| `pl reset`   | 0     | Default restricted access                 |
| `pl alpha`   | 1     | Debug mode — unlocks ~20 additional commands |
| **`pl omega`** | **2** | **Full manufacturing access — unlocks ALL commands** |

The `pl` command is a framework built-in keyword (like `help` and `..`) that is processed *before* the permission-checked command tree walk. It never passes through the permission gate, so it works from any level — including the default level 0.

The permission byte is stored at a single RAM address and persists for the duration of the session. It resets to 0 on reboot. To persist a higher level across reboots, use `fds/write` (available at level 1+) to write to FDS group 4, record 7.

### Available commands

Level 0 (default — 22 root entries, ~60 total commands):

```
- mac/
    - epon
    - user
- alm/
    - info
    - gpio
- debug/
    - mcast
    - mpcp
    - nco
    - rstp
    - sysd
- epon/
    - eponmac
    - usermac
    - dom
    - ponspeed
- fds/
    - erase
- load/
    - info
    - commit
    - setRecoveryPoint
    - runRecoveryPoint
    - rx
- mcast/
    - domains
    - groups
    - sources
    - reporters
    - igmpinfo
    - igmpsources
- mem/
    - rf
- mpcp/
    - info
    - failsafe
    - oltmac
- pers/
    - read
- serdes/
    - sdextlptest
- stats/
    - clear
    - gather
    - epon
    - fifo
    - lif
    - uni
    - xif
    - statsmode
- log/
    - show
    - level
- sysd/
    - frmdmp
- clionly
- clr
- ints
- reg
- reset
- set
- echo
- sftver
```

Level 1 (`pl alpha` — adds these commands):

```
- access/
    - read          (hardware peripheral bus read — I2C/SPI)
    - write         (hardware peripheral bus write)
- mdio/
    - read
    - readlst
    - write
- lue/
    - lin/
        - inst
    - bin/
        - inst
- cust/
    - e             (examine custom data)
    - r             (read custom data)
    - w             (write custom data)
- fds/
    - write         (write FDS record)
- mem/
    - wm            (write memory)
    - wf            (write flash)
    - ef            (erase flash)
```

Level 2 (`pl omega` — adds these commands):

```
- efuse             (read eFuse OTP memory)
- efusebits         (read eFuse bit-level detail)
- learn/
    - inst
    - tbl
    - age
    - limit
- gmc/
    - le
    - ld
- serdes/
    - dump
- debug/
    - fc
    - epon
    - learn
    - eap
- fifo/
    - queue
- eae/
    - eap
    - mka
    - mtime
    - klen
- xau/
    - xcap
- fec/
    - auto
- reglist
- regbits
```

### Useful commands

| Command | Description |
| ------- | ----------- |
| `sftver` | Print firmware version and chip ID |
| `load/info` | Show all firmware slots with versions and CRCs |
| `epon/eponmac` | Show EPON MAC address |
| `epon/ponspeed` | Show current PON link speed |
| `mpcp/info` | Show MPCP registration state |
| `mpcp/oltmac` | Show OLT MAC address |
| `pers/read` | Dump personality data (raw hex) |
| `mem/rf <addr> <len>` | Read `len` bytes of data memory starting at `addr` |
| `stats/epon` | Show EPON statistics counters |
| `reg <index>` | Read a software register by index |
| `set <index> <value>` | Write a software register |
| `pl omega` | Unlock full manufacturing access |
| `mem/wm <addr> <value>` | Write to memory (level 1+) |
| `efuse` | Dump eFuse OTP contents (level 2) |
| `load/rx` | Receive firmware image over UART |
| `load/commit` | Commit received firmware to active slot |

`load/info` output:
```
TK2000 APP 3.27 May 13 2016 02:48:05  Chip: 4701 B2110816
Mode: App Normal
EPON MAC: 0x8C97EA6C17AC

Executing: NA
2000 0001 v3.2.7 (Rel)
Size: 319044 CRC: 0x2FAF887F
Type: 02 Subtype 0C Flags 04
Stream: 112 Revision: 131152
Time: 2016-05-18 01:28:44Z

Boot: pass
2000 0000 v3.2.7 (NA)
Size: 42896 CRC: 0xC87371F8
Type: 01 Subtype 0C Flags 04
Stream: 114 Revision: 127457
Time: 2016-01-20 05:45:49Z

App 0: fail
FFFF 0000 vFF.FF.FFFF (NA)
Size: 4294967258 CRC: 0xFFFFFFFF
Type: FF Subtype FF Flags FF
Stream: 4294967295 Revision: 4294967295
Time: 65535-255-255 255:255:255Z

App 1: pass
2000 0001 v3.2.7 (Rel)
Size: 319044 CRC: 0x2FAF887F
Type: 02 Subtype 0C Flags 04
Stream: 112 Revision: 131152
Time: 2016-05-18 01:28:44Z

App 2: pass
2000 0001 v3.2.9 (Rel)
Size: 319240 CRC: 0x3FBE2A30
Type: 02 Subtype 0C Flags 04
Stream: 116 Revision: 167733
Time: 2019-03-13 01:47:37Z

Diag: pass
2000 0001 v3.2.7 (Rel)
Size: 319044 CRC: 0x2FAF887F
Type: 02 Subtype 0C Flags 04
Stream: 112 Revision: 131152
Time: 2016-05-18 01:28:44Z
```

`mem/rf [start address] [length]` reads bytes from data memory (DCCM/SRAM). Due to the Harvard architecture, this command cannot read firmware code (which resides in ICCM). The address space wraps every 512 kB.

## Firmware Flash Protocol

The `load/rx` command accepts a firmware image over UART using a raw binary transfer (no XMODEM, no handshake):

1. Wait for the `2000/>` prompt
2. Send `load/rx\r`
3. ONU responds: `Begin binary transfer...`
4. Send the TKF image as raw binary at 57600 baud (~55 seconds for 319 KB)
5. ONU responds: `Transfer complete: N bytes received`
6. Send `load/commit\r` to activate the new slot
7. Send `reset\r` to reboot

The firmware image must be wrapped in a TKF (Teknovus) container:

```
[header 39 bytes] [payload N bytes] [CRC32 4 bytes]
```

The trailing CRC32 covers the entire header+payload (standard IEEE 802.3 CRC). The ONU writes to App 0 and App 1 slots in rotation.

## List of partitions

The flash memory (W25Q32J, 4 MB SPI) has 5 regions. Each application section starts with a 39-byte TKF header and ends with its CRC.

| Section    | Start address    | End address      | Size           | Version |
| ---------- | ---------------- | ---------------- | -------------- | ------- |
| Bootloader | 0x000000         | 0x00A790         | 42 KB          | v3.27   |
| FDS/Config | 0x00A790         | 0x120000         | ~460 KB        | —       |
| App 1      | 0x120027         | 0x16DE6B         | 319 KB         | v3.2.7  |
| App 2      | 0x1A0027         | 0x1EDF2F         | 319 KB         | v3.2.9  |
| Diag       | 0x270027         | 0x2BDE6B         | 319 KB         | v3.2.7  |

(End address is non-inclusive)

App slots are located at 512 KB (0x80000) intervals. The CPU can address only 512 KB of flash at a time (verified by `mem/rf` wrapping behavior). The FDS (Flash Data Storage) region between the bootloader and App 1 contains personality records, MAC addresses, SerDes configuration, and CLI config data (34 known FDS record types).

# Useful files and binaries

# EEPROM

There is an SFP plug on the UNI side with an embedded EEPROM.

## EEPROM layout

```
00000000  03 04 00 00 00 00 00 00  00 00 00 00 0a 00 00 00  |................|
00000010  00 00 00 00 46 52 45 45  42 4f 58 00 00 00 00 00  |....FREEBOX.....|
00000020  00 00 00 00 00 8c 97 ea  46 2d 4d 44 43 4f 4e 55  |........F-MDCONU|
00000030  33 41 00 00 00 00 00 00  30 32 00 00 00 00 00 38  |3A......02.....8|
00000040  00 00 00 00 38 36 38 38  30 32 4a 32 30 32 33 34  |....868802J20234|
00000050  36 32 39 35 32 30 30 36  30 39 30 30 00 00 00 ec  |629520060900....|
00000060  38 36 38 38 30 32 4a 32  30 32 33 34 36 32 39 35  |868802J202346295|
00000070  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000080  ff ff ff ff ff ff ff ff  ff ff ff ff ff ff ff ff  |................|
*
00000100  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00000200
```

# Miscellaneous Links

![](https://web.archive.org/web/20230609184811/https://xtech.nikkei.com/dm/article/NEWS/20110121/188932/Broadcom_4.jpg)

[^arc-isa]: *ARCompact Instruction Set Architecture Programmer's Reference* http://me.bios.io/images/d/dd/ARCompactISA_ProgrammersReference.pdf
