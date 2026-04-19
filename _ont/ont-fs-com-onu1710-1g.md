---
title: FS.com ONU1710-1G
has_children: false
layout: default
parent: FS.com
---

# Hardware Specifications

|              |                                              |
| ------------ | -------------------------------------------- |
| Vendor/Brand | FS.com                                       |
| Model        | ONU1710-1G                                   |
| P/N          | ONU1710-1G                                   |
| SKU          | 154796                                       |
| Chipset      | Realtek RTL9601D                             |
| CPU          | MIPS-I 32-bit (big-endian)                   |
| CPU Clock    | 300 MHz                                      |
| RAM          | 32 MB (DDR2, 325 MHz)                        |
| Flash        | 4 MB (SPI NOR, ZBIT JEDEC 5E4016)            |
| Bootloader   | U-Boot 2011.12.NA (Realtek-modified)         |
| System       | Linux 2.6.30.9 (Luna SDK / RSDK-1.5.6p2)     |
| XPON Mode    | GPON + EPON dual-mode adaptive               |
| Optics       | 1x PON (SC/UPC)                              |
| Power        | 12V DC, 5.5mm barrel jack (center positive)  |
| Ethernet     | 1x GE (1000BASE-T, RJ45)                     |
| IP address   | 192.168.123.1                                |
| Web Gui      | port 80, user `admin`, password `super&123`  |
| SSH          | no                                           |
| Telnet       | port 23, user `admin`, password `super&123`  |
| Serial       | 115200 8-N-1 3.3V                            |
| Form Factor  | Desktop ONT                                  |


## Specifications

The ONU1710-1G is an XPON (GPON + EPON) dual-mode adaptive ONT with 1x GE Ethernet port. It supports 1.25 Gbps upstream and 2.5 Gbps downstream (GPON mode), complies with ITU-T G.984/G.987/G.988/G.989 standards, and supports network deployment up to 20 km.

*Adapted from vendor's marketing material.*

## List of software versions
- 10.0.52B.2095 (2025-03-20)

## Default credentials

Only the `user` account is publicly documented by FS.com. The `admin` account was discovered through firmware analysis.

| Username | Password      | Access     | Notes                                                  |
| -------- | ------------- | ---------- | ------------------------------------------------------ |
| `user`   | `123456`      | Web/Telnet | Limited user account (publicly documented)             |
| `admin`  | `super&123`   | Web/Telnet | Super user / administrator                             |

## Hardware

{% include image.html file="fs-com-onu1710-1g/pcb.jpg" alt="FS.com ONU1710-1G PCB" caption="FS.com ONU1710-1G PCB" %}

Key components:
- SoC: Realtek RTL9601D (MIPS-I 32-bit, 88-pin)
- RAM: 32 MB DDR2
- Flash: 4 MB SPI NOR (ZBIT JEDEC 5E4016)
- Optical transceiver: Semtech GN25L95 BOSA, SC/UPC connector
- Serial port: 4-pin 2.54mm header (unpopulated) 3.3V 115200 8-N-1

## U-Boot environment

{% include serial_dump.html title="Full <code>printenv</code> output" file="fs-com-onu1710-1g/uboot-env.txt" %}

Key variables:

| Variable       | Value (default) | Description                                                        |
| -------------- | --------------- | ------------------------------------------------------------------ |
| `sw_active`    | `1`             | Currently active image slot (0 or 1; both point to same flash)     |
| `sw_commit`    | `1`             | Last committed image slot                                          |
| `sw_tryactive` | `2`             | Boot control: `2` = boot by `sw_commit`; `0`/`1` = first-boot try |
| `sw_valid0/1`  | `1`             | Image slot validity flag                                           |
| `sw_version0/1`| `10.0.52B.2095` | Firmware version string for each slot                              |
| `ethaddr`      | `00:E0:4C:86:70:01` | Factory MAC address                                            |
| `bootdelay`    | `2`             | U-Boot countdown in seconds before autoboot                        |
| `serverip`     | `192.168.123.100` | TFTP server address for firmware upload                          |

From the running Linux shell, U-Boot environment variables can be read and written using `/bin/nv getenv <variable>` and `/bin/nv setenv <variable> <value>`.

## List of partitions

The flash uses a single-image layout — both image slots (`k0`/`k1`, `r0`/`r1`) point to the same physical offsets.

| dev  | offset     | size     | erasesize | name     | type                           |
| ---- | ---------- | -------- | --------- | -------- | ------------------------------ |
| mtd0 | 0x000000   | 0x02A000 | 0x001000  | "boot"   | Preloader + U-Boot (LZMA)      |
| mtd1 | 0x02A000   | 0x002000 | 0x001000  | "env"    | U-Boot environment (primary)   |
| mtd2 | 0x02C000   | 0x002000 | 0x001000  | "env2"   | U-Boot environment (backup)    |
| mtd3 | 0x02E000   | 0x012000 | 0x001000  | "config" | JFFS2 configuration filesystem |
| mtd4 | 0x040000   | 0x139000 | 0x001000  | "k0"     | Kernel uImage (LZMA)           |
| mtd5 | 0x179000   | 0x287000 | 0x001000  | "r0"     | Root filesystem (SquashFS+LZMA)|
| mtd6 | 0x040000   | 0x139000 | 0x001000  | "k1"     | Kernel uImage (same as k0)     |
| mtd7 | 0x179000   | 0x287000 | 0x001000  | "r1"     | Root filesystem (same as r0)   |

To dump the full flash contents over serial from the U-Boot prompt, read it in 1 MB chunks using `sf read` and dump each chunk as hex with `md.b`:

```
sf probe
sf read 0x80000000 0x000000 0x100000
md.b 0x80000000 0x100000
sf read 0x80000000 0x100000 0x100000
md.b 0x80000000 0x100000
sf read 0x80000000 0x200000 0x100000
md.b 0x80000000 0x100000
sf read 0x80000000 0x300000 0x100000
md.b 0x80000000 0x100000
```

Capture the serial output with a terminal emulator, then convert the hex dump to binary.

## Bootup

{% include serial_dump.html title="Full boot log captured on serial port" file="fs-com-onu1710-1g/bootlog.txt" %}


1. **Preloader** (Bismarck 3.5) initializes DDR2 DRAM, decompresses and launches U-Boot
2. **U-Boot** (2s delay, 115200 baud) checks `sw_tryactive`: if it equals `2`, boots by `sw_commit`; otherwise it is a first-boot attempt that sets `sw_tryactive=2`, saves env, and boots the selected image
3. **Kernel** boots with `console=ttyS0,115200`, mounts SquashFS root
4. **`/etc/init.d/rcS`** runs init scripts `rc0`–`rc63` sequentially:
   - `rc2`: Mounts `/proc`, ramfs, sysfs, tmpfs `/dev`; mounts JFFS2 config to `/var/config`; brings up `lo` and `nas0`
   - `rc3`: Runs `configd`, loads XML config (`config_xmlconfig.sh -b`), inserts kernel modules (`insdrv.sh`), runs SDK init (`runsdk.sh`), starts OMCI (`checkomci`)
   - `rc10`: Tunes kernel network parameters (conntrack timeouts, IP forwarding)
   - `rc14`: Configures IPv6 sysctl settings
   - `rc32`: Launches `startup` daemon and BOSA optical calibration (`rtkbosa.sh`)
   - `rc34`: Enables hardware watchdog
   - `rc35`: Enables PHY ports

## Filesystem

The root filesystem is a SquashFS image (LZMA-compressed) with 525 files and stripped binaries. Runtime state is kept on a tmpfs (`/var`) and the JFFS2 config partition (mounted at `/var/config`).

```
squashfs-root/
  bin/         -- BusyBox 1.12.4 + OMCI tools (omcicli, omci_app, checkomci), boa, iptables,
               -- diag, ethctl, flash (aliased as nv), configd, xmlconfig, pondetect, igmpd, ...
  etc/
    init.d/    -- rcS, rc2, rc3, rc10, rc14, rc32, rc34, rc35
    scripts/   -- mnt_cfgfs.sh, insdrv.sh, runsdk.sh, rtkbosa.sh, factory reset helpers
  home/httpd/
    boa.conf   -- Boa v0.94 web server configuration (User 0, Group 0)
    web/       -- 243 ASP pages (WAN, LAN, OMCI info, VLAN, QoS, firewall, TR-069, diagnostics, ...)
  lib/
    librtk.so        -- Realtek SDK (~964 KB, largest userspace library)
    libmib.so        -- MIB management
    libomci_*.so     -- OMCI stack (API, FAL, GOS, MIB, voice)
    libmultilang_*.so -- i18n strings (Chinese + English)
    modules/         -- Kernel modules (omcidrv.ko, pf_rtk.ko, epon_drv.ko, igmp_drv.ko,
                     --   europa_drv.ko, rldp_drv.ko, dpbcaster.ko, ...)
    omci/            -- 127 OMCI MIB handler plugins (.so), one per managed entity type
    voip/            -- SIP/VoIP libraries
  etc/scripts/flash  -- Shell script for reading/writing MIB variables via xmlconfig
```

The config partition (`/var/config`) holds `lastgood.xml` (XML runtime config, persisted across reboots) and OMCI MIB state (`omci_mib.cfg`).

Note: the `flash` MIB tool (`/etc/scripts/flash`) and the `nv` U-Boot env tool (`/bin/nv`) are separate commands for different purposes.


# GPON/OMCI settings

## Via web UI

The ONU1710-1G exposes several hidden web UI pages for GPON/OMCI configuration that are not linked in the main navigation. Log in as `admin` and access them by URL.

### Version modification (vermod.asp)

Accessible at `http://192.168.123.1/vermod.asp`, this page allows changing:
- Manufacturer, OUI, Product Class
- Serial Number, Provisioning Code
- Spec Version, Software Version, Hardware Version
- GPON Serial Number
- ELAN MAC Address
- **Export**: Download the current OMCI event log
- **Import**: Upload a shell script that is executed as root (see Security section)

{% include image.html file="fs-com-onu1710-1g/vermod.png" alt="FS.com ONU1710-1G vermod.asp" caption="Version modification page (vermod.asp)" %}

### GPON configuration (gpon.asp)

Accessible at `http://192.168.123.1/gpon.asp`, this page allows changing:
- PLOAM Password (max 10 characters)
- LOID (max 24 characters)
- LOID Password (max 12 characters)

### OMCI information (omci_info.asp)

Accessible at `http://192.168.123.1/omci_info.asp`, this page allows viewing/changing:
- OMCI Software Version 1/2
- CWMP Product Class
- CWMP Hardware Version
- OMCI Vendor ID

### WAN configuration (waneth.asp)

Accessible at `http://192.168.123.1/waneth.asp`, this page supports the following connection types:
- **Bridge**: Transparent L2 bridge (no NAT, no routing)
- **PPPoE**: PPP over Ethernet (typical ISP authentication)
- **IPoE**: IP over Ethernet (DHCP or static IP)

The page also allows configuring NAPT (NAT), IGMP snooping, QoS, default route, and IPv6.

## Via Telnet

Configuration can be done via telnet using the `flash` command (`/etc/scripts/flash`). The user and admin passwords can also be changed through the web UI.

```sh
# LOID and PLOAM password
flash get LOID
flash set LOID YOURLOID
flash get LOID_PASSWD
flash set LOID_PASSWD YOURLOIDPASSWORD
flash get GPON_ONU_PASSWD
flash set GPON_ONU_PASSWD 1234567890

# GPON serial number / vendor ID
flash get GPON_SN
flash set GPON_SN ABCD12345678
flash get PON_VENDOR_ID
flash set PON_VENDOR_ID ABCD

# Hardware / software version strings (reported via OMCI)
flash get HW_HWVER
flash set HW_HWVER 1.0
flash get HW_CWMP_PRODUCTCLASS
flash set HW_CWMP_PRODUCTCLASS MyProduct

# OMCI software version
flash get OMCI_SW_VER1
flash set OMCI_SW_VER1 V1.9.0
flash get OMCI_SW_VER2
flash set OMCI_SW_VER2 V1.9.0

# PON mode (1=GPON, 2=EPON, 3=Ethernet)
flash get PON_MODE
flash set PON_MODE 1

# Bridge mode
flash get DIRECT_BRIDGE_MODE
flash set DIRECT_BRIDGE_MODE 1

# User and admin passwords
flash get USER_PASSWORD
flash set USER_PASSWORD newpassword
flash get SUSER_PASSWORD
flash set SUSER_PASSWORD newpassword
```


# Security considerations

{% include alert.html content="This device has extremely poor security practices and should not be used in any environment where it may be reachable by untrusted parties." alert="Warning" icon="svg-warning" color="red" %}

- **Undocumented default credentials**: The `admin` account (`super&123`) is not mentioned in any FS.com documentation but has full administrative access. The firmware also contains references to additional accounts (`adsl`/`xponadmin`, `xponadmin`/`xponre@1t3k`) in inactive backup config files and hardcoded code paths. These were not usable but are likely leftovers from the Realtek SDK.
- **Unencrypted management protocols**: Both the web interface (HTTP port 80) and Telnet (port 23) transmit credentials and configuration in cleartext. Both are enabled by default.
- **Arbitrary script upload and execution**: The `vermod.asp` page has an "Import" form that posts to `/boaform/formImportOMCIShell`. The handler writes the uploaded file to `/tmp/omcishell` and executes it immediately via `system("/bin/sh /tmp/omcishell")`. Likely an intentional debug feature that allows the `admin` user to execute commands as root without going through telnet.
- **Privilege escalation via auth realm mismatch**: The Boa web server maps `/` to admin credentials and `/boaform/admin` to user credentials. Admin-only handlers like `formImportOMCIShell` can be reached by the low-privilege `user` account by requesting `/boaform/admin/formImportOMCIShell` instead. This gives the unprivileged account full root access.
- **All services run as root**: The web server (Boa), telnet daemon, and OMCI stack all run with root privileges (UID 0).
- **Management services bind on all interfaces**: Boa (port 80) and telnet (port 23) bind to `::` with no iptables rules. When connected to GPON, depending on the ISP's network configuration, these services may be reachable beyond the LAN; though this has not been practically verified.

# Miscellaneous Links

- [FS.com ONU1710-1G Product Page](https://www.fs.com/eu-en/products/154796.html)
- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
