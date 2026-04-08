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

The serial port is easily accessible at TP5 and TP6. A prompt is available without authentication, it is structured as a tree of directories. To navigate type the subdirectory name. To go back type `/` and hit enter. To list available commands type `help` or `?`.

### CLI Permission Levels

The CLI has a 3-level permission system. By default, UART connects at level 0 (restricted). The **`pl`** (Permission Level) built-in command switches between levels without any authentication:

| Command      | Level | Effect                                    |
| ------------ | ----- | ----------------------------------------- |
| `pl reset`   | 0     | Default restricted access                 |
| `pl alpha`   | 1     | Debug mode — unlocks ~20 additional commands |
| **`pl omega`** | **2** | **Full manufacturing access — unlocks ALL commands** |

The `pl` command is a framework built-in keyword (like `help` and `..`) that is processed *before* the permission-checked command tree walk. It never passes through the permission gate, so it works from any level — including the default level 0.

The permission byte is stored at a single RAM address and persists for the duration of the session. It resets to 0 on reboot. To persist a higher level across reboots, use `fds/write` (available at level 1+) to write to FDS group 4, record 7.

### Command tree

Level 0 (default — ~60 total commands):

```
- mac/
    - epon                  show EPON MAC address
    - user                  show UNI MAC address
- alm/
    - info                  show alarm status
    - gpio                  show GPIO/channel state
- debug/
    - mcast                 dump active classifier rules
    - mpcp                  dump MPCP BW queue config
    - nco                   dump NCO sync state
    - rstp                  dump debug ring buffer
    - sysd                  dump system event log
- epon/
    - eponmac               show EPON MAC address
    - usermac               show UNI MAC address
    - dom                   date of manufacture
    - ponspeed              get/set PON speed mode
- fds/
    - erase                 erase FDS banks 2+3 (⚠️)
- load/
    - info                  show firmware slot info
    - commit                activate flashed firmware (⚠️)
    - setRecoveryPoint      mark Diag as recovery
    - runRecoveryPoint      prepare boot from recovery
    - rx                    receive firmware over UART (⚠️)
- mcast/
    - igmpinfo              IGMP snooping state
    - igmpsources           IGMP SSM sources
- mem/
    - rf                    read data memory
- mpcp/
    - info                  MPCP registration state
    - failsafe              get/set failsafe mode
    - oltmac                show OLT MAC address
- pers/
    - read                  dump personality data
- serdes/
    - sdextlptest           SerDes loopback test
    - serdesTestInit        init PRBS test
    - serdesRx              check SerDes RX status
- stats/
    - clear                 reset all counters
    - gather                trigger counter collection
    - epon                  EPON MAC counters
    - fifo                  FIFO/queue counters
    - lif                   laser interface counters
    - uni                   UNI port counters
    - xif                   cross-connect counters
    - statsmode             get/set counter read mode
- log/
    - show                  show system event log
    - level                 get/set log verbosity
- sysd/
    - frmdmp                toggle EPON frame dump
- clionly                   disable all subsystems except CLI (⚠️)
- clr                       clear terminal
- ints                      show interrupt status
- reg                       read CLI register
- reset                     full system reset (⚠️)
- set                       write CLI register
- echo                      echo text
- sftver                    show firmware version
```

Level 1 (`pl alpha` — adds these):

```
- access/
    - read                  hardware peripheral bus read (I2C/SPI)
    - write                 hardware peripheral bus write
- mdio/
    - read                  MDIO PHY register read
    - readlst               list MDIO registers
    - write                 MDIO PHY register write
- lue/
    - lin/
        - inst              LUE linear lookup
    - bin/
        - inst              LUE binary lookup
- cust/
    - e                     examine custom data
    - r                     read custom data
    - w                     write custom data
- fds/
    - info                  FDS bank status
    - write                 write FDS record (⚠️)
    - read                  read specific FDS record
- mem/
    - rm                    read memory (alternate)
    - wm                    write 32-bit word to memory (⚠️)
    - wf                    fill memory region (⚠️)
    - ef                    erase/zero memory region (⚠️)
```

Level 2 (`pl omega` — adds these):

```
- efuse                     read eFuse OTP memory
- efusebits                 read eFuse bit-level detail
- learn/
    - dump                  dump MAC learning table
    - flood                 enable/disable flood mode
    - switch                enable/disable L2 switching
    - max                   get/set max MAC entries
    - apply                 apply config to hardware
- gmc/
    - le                    multicast config
    - ld                    multicast config
- serdes/
    - sdp                   SerDes PON debug
    - sdu                   SerDes UNI debug
    - clk                   SerDes clock config
    - dump                  dump SerDes debug registers
- debug/
    - fc                    flow control debug
    - epon                  EPON link context dump
    - learn                 MAC learning engine debug
    - eap                   EAP-TLS auth debug
- fifo/
    - queue                 FIFO queue management
- eae/
    - eap                   EAP MAC address
    - mka                   MKA protocol state
    - mtime                 MKA timing parameters
    - klen                  MACsec key length
- xau/
    - xcap                  10G AU system capture
- fec/
    - auto                  FEC auto-negotiation
- fds/
    - append                append FDS record (⚠️)
    - export                export FDS records
    - copygroup             copy FDS group (⚠️)
- mem/
    - tf                    memory test (destructive) (⚠️)
- reglist                   list all CLI registers
- regbits                   show register bit fields
```

### CLI command reference

#### System

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `sftver` | `sftver` | Print firmware version, chip ID, and DPoE OAM mode. Output: `2000 0000 v3.2.9 (Rel)` / `DPoE OAM: Off`. Build types: 0=Rel, 1=Custom, 2=Beta, 3=Alpha, 4=Eng. |
| `reset` | `reset` | Full system reset. Gracefully shuts down EPON link, flushes pending FDS writes, logs the reset event with timestamp, then halts the ARC CPU (aux register 0x28). **The ONU reboots.** |
| `clionly` | `clionly` | Disable all firmware subsystems (EPON, MPCP, DPoE, MACsec) except CLI UART processing. The ONU becomes non-functional for PON but still responds to commands. Requires `reset` to return to normal. |
| `clr` | `clr` | Clear terminal screen (ANSI escape). |
| `echo` | `echo [text]` | Echo text back to UART. |
| `ints` | `ints` | Dump interrupt controller status: 26 IRQ sources with priority levels (3-bit fields), pending/enable bitmaps, ARC STATUS32 E1/E2 bits. |
| `reg` | `reg [name]` | Read a CLI framework register by name. Without arguments, lists all registers. These are *software* configuration registers, not hardware MMIO. |
| `set` | `set <name> <value>` | Write a CLI framework register. Value is a uint8 (0–255). Changes are RAM-only, lost on reboot. |
| `reglist` | `reglist` | List all CLI framework registers with values. *(Level 2)* |
| `regbits` | `regbits <name>` | Show a register value with individual bit fields expanded. *(Level 2)* |

#### EPON / MAC

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `epon/eponmac` | `epon/eponmac` | Show the EPON MAC address (6 bytes, no separators). This is the MAC used for MPCP registration. Example: `68A378C25F94`. |
| `epon/usermac` | `epon/usermac` | Show the UNI-side MAC address. On this ONU, identical to the EPON MAC. |
| `epon/dom` | `epon/dom [year] [month] [day]` | Get or set the Date of Manufacture. Without args, prints current date. With 3 args, writes the date. Output: `Date of Manufacture: 2020-1-15`. |
| `epon/ponspeed` | `epon/ponspeed [dnrate uprate [port]]` | Get or set the PON speed mode. Without args, shows current speed/FEC config. `dnrate`: 0=1G, 1=2G, 2=10G. `uprate`: 0=1G, 1=10G. `port` (optional): 0=secondary, 1=primary (default). **Persists to flash (FDS) and triggers full EPON link reinitialization.** Free uses asymmetric 10G/1G = `epon/ponspeed 2 0`. |
| `mac/epon` | `mac/epon` | Same as `epon/eponmac`. |
| `mac/user` | `mac/user` | Same as `epon/usermac`. |

#### MPCP

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `mpcp/info` | `mpcp/info` | Show MPCP registration state and slot count. Output is JSON-like: `[[state,slots]]` per LLID. States: 1=WAITING (unregistered), 2=TRANSITION (discovery), 3=REGISTERED. Example: `[[1,32]]` = waiting, 32 slots. |
| `mpcp/oltmac` | `mpcp/oltmac` | Show the OLT MAC address from the last MPCP registration. `000000000000` = never registered. |
| `mpcp/failsafe` | `mpcp/failsafe [mode]` | Get or set the MPCP failsafe mode. Controls ONU behavior on registration failure/timeout. Without args, shows current mode. |

#### Memory

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `mem/rf` | `mem/rf <addr> [count]` | Read `count` bytes (default 4) from data memory at `addr`. Address is passed as-is; displayed address adds 0x80000 (cosmetic). Due to Harvard architecture, only reads DCCM/SRAM — cannot read ICCM (firmware code). Wraps every 512 kB. Example: `mem/rf 0x2003e174 4` → `200be174: 09 9b ff ff`. |
| `mem/wm` | `mem/wm <addr> <value>` | Write a 32-bit word to memory. *(Level 1)* **Direct write to arbitrary address — can corrupt state or crash.** |
| `mem/wf` | `mem/wf <addr> <value> <count>` | Fill memory region with a value. *(Level 1)* |
| `mem/ef` | `mem/ef <addr> <count>` | Erase (zero-fill) a memory region. *(Level 1)* |
| `mem/tf` | `mem/tf <addr> <count>` | Memory test with write/readback patterns. Destructive. *(Level 2)* |

#### Statistics

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `stats/epon` | `stats/epon` | Show EPON MAC counters for all 32 LLIDs (18 TX + 15 RX per LLID) plus 6 global counters. Counters are 64-bit in software mode, 32-bit in register mode. |
| `stats/uni` | `stats/uni` | Show UNI port counters (PHY1: 50 counters × 4 channels). |
| `stats/lif` | `stats/lif` | Show laser interface counters (PHY3: 47 counters per channel). All zeros when PON inactive. |
| `stats/xif` | `stats/xif` | Show cross-connect interface counters (PHY2: 30 counters per channel) plus SerDes config words. |
| `stats/fifo` | `stats/fifo` | Show FIFO/DMA queue counters with channel occupancy and throughput. |
| `stats/clear` | `stats/clear` | Reset ALL statistics counters to zero (EPON, PHY, MACsec, channel). Silent on success. |
| `stats/gather` | `stats/gather [mode]` | Get or set the periodic stats collection mode. Output: `Gather N`. |
| `stats/statsmode` | `stats/statsmode [mode]` | Get or set counter read mode. 0 = Software (64-bit accumulated buffers), 1 = Register (32-bit direct HW read). Output: `statistic mode 0(Software(64bit))`. |

#### Firmware / Flash

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `load/info` | `load/info` | Show all firmware slots (Boot, App 0/1/2, Diag) with version, size, CRC, build timestamp, and pass/fail status. `pass` = valid CRC, `fail` = bad CRC or empty slot (0xFFFFFFFF). See output example below. |
| `load/rx` | `load/rx` | Enter raw binary firmware receive mode over UART. See [Firmware Flash Protocol](#firmware-flash-protocol). |
| `load/commit` | `load/commit` | Activate the most recently flashed firmware by swapping the active bank pointer in FDS. Must be followed by `reset`. |
| `load/setRecoveryPoint` | `load/setRecoveryPoint` | Mark the Diag slot as a valid recovery point. Verifies CRC first. Output: `OK` or `FAIL`. |
| `load/runRecoveryPoint` | `load/runRecoveryPoint` | Prepare boot from the recovery point. Output: `Ready to run recovery point, please reset` or `No recovery load to jump to`. Must be followed by `reset`. |

#### FDS (Flash Data Storage)

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `fds/erase` | `fds/erase` | **Erase FDS banks 2 (events) and 3 (provisioning).** Loses DPoE config (VLANs, classifiers) and event history. Bank 0 (firmware) and bank 1 (personality/MAC) are preserved. ONU must be re-provisioned by OLT after reboot. |
| `fds/info` | `fds/info` | Show FDS bank status (active bank, record count, free space). *(Level 1)* |
| `fds/read` | `fds/read <group> <record> [sub]` | Read a specific FDS record by group/record/sub IDs. *(Level 1)* |
| `fds/write` | `fds/write <group> <record> <data...>` | Write data to an FDS record. *(Level 1)* |
| `fds/export` | `fds/export [group]` | Export FDS records as hex dump. *(Level 2)* |

#### Alarms / Debug

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `alm/info` | `alm/info` | Show current alarm status (MpcpFErr, OnuReset, UniLinkDown, PonPortLos, etc.). |
| `alm/gpio` | `alm/gpio` | Show GPIO/channel states. On the BCM55030, LEDs are controlled through EPON MAC queue-to-pin mapping, not raw GPIO. |
| `debug/mpcp` | `debug/mpcp` | Dump MPCP bandwidth queue config for both PON lanes: per-queue VLAN, min/max BW, priority, scheduling mode (Strict/Weighted), total BW. |
| `debug/mcast` | `debug/mcast` | Dump active DPoE classifier rules (8 slots with rule type, VLAN, priority, match value). |
| `debug/nco` | `debug/nco` | Dump NCO (Numerically Controlled Oscillator) synchronization state, used for MPCP timestamp generation. |
| `debug/rstp` | `debug/rstp` | Dump debug ring buffer (32 timestamped event entries). |
| `debug/sysd` | `debug/sysd` | Dump system event log from FDS. Same as `log/show`. |
| `debug/epon` | `debug/epon` | Dump full EPON link context: LLID state, encryption, cipher config, MACsec SA. *(Level 2)* |
| `debug/eap` | `debug/eap` | Dump EAP-TLS authentication state: TLS handshake, certificate, RSA sign. *(Level 2)* |
| `log/show` | `log/show` | Show system event log with timestamps: MpcpFErr, OnuReset, UniLinkDown, PonPortLos, etc. |
| `log/level` | `log/level [level]` | Get or set log verbosity level (0–255). Without args, shows current level. Not persistent. |

#### Multicast

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `mcast/igmpinfo` | `mcast/igmpinfo` | Show IGMP snooping state: enabled/disabled, per-group forwarding qualifier, IPv4 flag, group address, SSM domain bitmap, group state, timer values. Supports IGMPv1/v2/v3 and MLDv1/v2 (RFC 3376). |
| `mcast/igmpsources` | `mcast/igmpsources` | Show IGMP Source-Specific Multicast (SSM) source entries: in-use flag, IPv4 flag, SSM ID, source IP. |

#### Personality

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `pers/read` | `pers/read` | Dump personality data from FDS: 34 records across multiple groups (MAC addresses, serial number, SerDes calibration, crypto certificates, provisioning defaults) + 47 SerDes PHY calibration blocks. Total: ~49 KB. |

#### SerDes

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `serdes/sdextlptest` | `serdes/sdextlptest [lane]` | Run PRBS external loopback test on a SerDes lane (0–3, PON lanes only). Enables loopback, runs test, dumps debug registers (0x60–0x7D), disables loopback. |
| `serdes/dump` | `serdes/dump` | Dump SerDes debug registers: PON lane (0x70–0x7D) and UNI lane (0x60–0x6D). *(Level 2)* |

#### Hardware access (Level 1+)

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `access/read` | `access/read` | Read from the hardware peripheral bus (I2C/SPI/MDIO). *(Level 1)* |
| `access/write` | `access/write` | Write to the hardware peripheral bus. *(Level 1)* |
| `mdio/read` | `mdio/read <phy> <reg>` | Read a PHY register via MDIO bus. Supports Clause 22 and Clause 45. *(Level 1)* |
| `mdio/write` | `mdio/write <phy> <reg> <value>` | Write a PHY register via MDIO bus. *(Level 1)* |
| `efuse` | `efuse` | Read and display eFuse (OTP) contents: chip MAC, serial number, manufacturing trim values. *(Level 2)* |
| `efusebits` | `efusebits` | Display eFuse bit-level detail. *(Level 2)* |

#### MACsec / EAP (Level 2)

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `eae/eap` | `eae/eap` | Show EAP MAC address used for EAP-TLS authentication. |
| `eae/mka` | `eae/mka` | Show MKA (MACsec Key Agreement) protocol state and MKPDU source address. |
| `eae/mtime` | `eae/mtime` | Show MKA timing parameters (hello interval, lifetime, SAK rekey interval). |
| `eae/klen` | `eae/klen` | Show MACsec key length config (AES-GCM-128 or AES-GCM-256). |

### PON speed mode encoding

| dnrate | uprate | Mode | Description |
| ------ | ------ | ---- | ----------- |
| 0 | 0 | 1G/1G | Standard EPON |
| 1 | 0 | 2G/1G | Mixed mode |
| 2 | 0 | 10G/1G | Asymmetric 10G-EPON (Free/Iliad) |
| 2 | 1 | 10G/10G | Symmetric 10G-EPON |

### `load/info` output

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

The trailing CRC32 covers the entire header+payload (standard IEEE 802.3 CRC, big-endian). The ONU writes to App 0 and App 1 slots in rotation. There is no flow control and no error correction — the UART link must be reliable.

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
