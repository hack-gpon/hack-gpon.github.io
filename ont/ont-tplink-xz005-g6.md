---
title: TP-Link XZ005-G6
has_children: false
parent: TP-Link
---

# Hardware Specifications

|                 |                                                              |
| --------------- | ------------------------------------------------------------ |
| Vendor/Brand    | TP-Link                                                      |
| Model           | XZ005-G6 (UN) V1.0                                           |
| Chipset         | Realtek RTL9601D                                             |
| CPU             | MIPS, 300 MHz                                                |
| Flash           | 4 MB SPI NOR (XMC XM25QH32CHIG, 32 Mbit)                     |
| RAM             | 32 MB DDR2 (embedded in the SoC)                             |
| System          | Linux (Realtek SDK), U-Boot 2011.12.NA                       |
| 2.5GBaseT       | Yes, 1x 2.5 Gbit/s (PHY Realtek RTL8221B)                    |
| Optics          | SC/APC (laser driver / BOSA controller UX3320S)              |
| Power           | DC 9 V / 600 mA                                              |
| IP address      | 192.168.1.1 (`tplinkmodem.net`)                              |
| Web Gui         | ✅ no default password (set on first access, see Web Access) |
| SSH             | ❌ (can be enabled from the web UI, but returns an error)    |
| Telnet          | ✅ limited TP-Link CLI (see Telnet)                          |
| Serial          | ✅ 4-pin header next to the `VCC` silkscreen (unpopulated)   |
| Form Factor     | ONT                                                          |

<ImageFigure file="tp-link/xz005-g6-pcb-front.jpg" alt="TP-Link XZ005-G6 PCB front" caption="TP-Link XZ005-G6 (UN) V1.0: PCB front (source: tripleoxygen.net)" />
<ImageFigure file="tp-link/xz005-g6-pcb-back.jpg" alt="TP-Link XZ005-G6 PCB back" caption="TP-Link XZ005-G6 (UN) V1.0: PCB back, XMC SPI NOR flash (source: tripleoxygen.net)" />

# Default GPON Identifiers

|                  |                                         |
| ---------------- | --------------------------------------- |
| ONU Type         | SFU (Ethernet UNI: 1, VEIP: 0)          |
| Vendor ID        | TPLG                                    |
| Equipment ID     | XZ005-G6                                |
| Hardware Version | 1.0                                     |
| OMCC Version     | 128 (0x80)                              |
| Software Version | `V0.1-3.0.0` (main), none (standby)     |

The default GPON authentication parameters logged by the firmware are LOID `tplink`, password `tplink`.

## List of software versions

- `V0.1-3.0.0` (`softwareVersion 0.1.0 3.0.0 v6066.0 Build 231212 Rel.36338n`)

The stock firmware images are signed and verified both by the web upgrade and by the OMCI upgrade, so no custom firmware is available. Loading an unsigned image would require more invasive methods (e.g. via serial/U-Boot).

# Flash Layout

There is no root shell on the stock firmware, so the full `/proc/mtd` is not available yet. The following layout of the 4 MB SPI NOR flash is derived from the boot log (see below):

| Flash offset | Size          | Content                                                                    |
| ------------ | ------------- | -------------------------------------------------------------------------- |
| `0x000000`   |               | Preloader (Bismarck 3.5) + LZMA-compressed U-Boot (at `0x0179c0`, ~68 KB)  |
| `0x040000`   | `0x2000` (8 KB) | U-Boot environment                                                       |
| `0x042000`   | `0x2000` (8 KB) | U-Boot environment (redundant copy)                                      |
| `0x078000`   | ~860 KB       | Linux kernel (legacy uImage, LZMA, loaded from `0x94078000`)               |
| ...          |               | Root filesystem                                                            |
| `mtd3`       |               | Configuration data, mounted on `/var/config`                               |

::: info Note
The SPI NOR flash is memory-mapped at `0x94000000` (and at `0x9fc00000` as boot vector), so the U-Boot `bootm 0x94078000` address corresponds to flash offset `0x78000`.
:::

The runtime configuration files are `/var/config/lastgood.xml` and `/var/config/lastgood_hs.xml`; factory defaults are `/etc/config_default.xml` and `/etc/config_default_hs.xml`. The BOSA calibration is read from `/var/config/rtkbosa_k.bin` (falling back to `/var/config/ux3320s_bob.conf`).

# Serial

The serial console is available on the unpopulated 4-pin header near the `VCC` silkscreen (right side of the PCB front). U-Boot shows `Hit any key to stop autoboot` with a 0 second timeout.

::: details TP-Link XZ005-G6 boot log
<<< ./serial_dump/tp-link-xz005-g6-bootlog.txt
:::

# Web Access

The device ships **without** default credentials: the password is chosen by the user on first access.

1. Factory reset by holding the rear reset button for a few seconds.
2. Open `http://192.168.1.1/superadmin` and set (and confirm) the **superadmin** password.
3. Open `http://192.168.1.1` to set the normal **user** password (log out from superadmin first if needed).

The superadmin account must be created **before** the normal user password, otherwise a factory reset is needed. Afterwards use:

- Normal user: `http://192.168.1.1`
- Superadmin: `http://192.168.1.1/superadmin`

The superadmin account unlocks a few extra web settings (enable SNMP, CWMP, SSH) and a higher-privilege CLI over Telnet.

## Enabling Telnet

Using "Inspect Element", you can see that the blocks for Telnet and SSH are set to `display: none`; you can make them visible. SSH does not work (it returns an error), but Telnet does; you just need to use a port other than 23, as that one is filtered (e.g. 2323). Before clicking "Save", open the browser console and enter:

```js
INCLUDE_WEB_TELNET = 1;
INCLUDE_SSH_ACCESS = 1; // SSH returns an error
```

Then click "Save" and log in via Telnet using the same superadmin password set in the GUI.

# Telnet

Telnet exposes TP-Link's own (limited) CLI, not a Linux shell. Once logged in, the following prompts are available:

```sh
TP-Link>          # user EXEC
TP-Link#          # privileged EXEC
TP-Link(conf)#    # configuration mode
```

::: warning Note
Even the superadmin-level Telnet CLI is fairly restricted compared to a full shell.
:::

# Configuration backup (conf.bin) decryption

Several GPON/OMCI parameters have no web field but can be changed by exporting the configuration backup, editing it and importing it back.

The backup (`conf.bin`) is a compressed XML blob encrypted with **DES in ECB mode** (zero-padded to an 8-byte boundary), prefixed by a 16-byte MD5 digest of the compressed payload. Support for this exact model was merged into [`sta-c0000/tpconf_bin_xml`](https://github.com/sta-c0000/tpconf_bin_xml) ([PR #45](https://github.com/sta-c0000/tpconf_bin_xml/pull/45)), so the tool handles compression, hashing and encryption automatically:

```sh
# decrypt / unpack conf.bin to XML
python3 tpconf_bin_xml.py conf.bin conf.xml

# edit conf.xml, then pack it back
python3 tpconf_bin_xml.py conf.xml conf.bin
```

The DES key used for the `XZ005-G6 (UN) V1.0` is the 8-byte constant:

```
45 EE 92 32 CF 5B 1D FE
```

::: info Note
The product ID for this variant is `0x1c796e01` (readable at offset `0x34` of a same-format firmware update file).
:::

# Known limitations

The following OMCI fields are forced by the firmware and any user edit (including via config import) is ignored, so this device is not suitable when those fields need to be changed:

- Version of ME 256 `ONU-G` (hardware version)
- Version of ME 7 `Software image` (software version)

# References

- [TP-Link XZ005-G6 (UN) V1.0 — tripleoxygen wiki](https://www.tripleoxygen.net/wiki/ont/tplink/xz005-g6-un-v1) (photos and boot log, CC BY-NC-SA 4.0)
- [tpconf_bin_xml — configuration backup tool](https://github.com/sta-c0000/tpconf_bin_xml) ([PR #45](https://github.com/sta-c0000/tpconf_bin_xml/pull/45))
- [TP-Link XZ000-G3](/ont-tplink-xz000-g3) — related TP-Link ONT
