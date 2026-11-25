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
| Flash           | 4 MB (XMC XM25QH32CHIG, 32 Mbit SPI NOR)                    |
| RAM             | 32 MB (embedded)                                            |
| System          | Linux (MIPS), U-Boot 2011.12.NA                             |
| 2.5GBaseT       | Yes, 1x 2.5 Gbit/s (PHY Realtek RTL8221B)                   |
| Optics          | SC/APC (laser driver UX3320S)                               |
| Power           | DC 9 V / 600 mA                                             |
| IP address      | 192.168.1.1                                                |
| Web Gui         | ✅ no default password (set on first access, see Web Access) |
| SSH             |                                                            |
| Telnet          | ✅ limited TP-Link CLI (see Telnet)                         |
| Serial          | ✅                                                          |
| Form Factor     | ONT                                                        |

# Default GPON Identifiers

|              |                       |
| ------------ | --------------------- |
| ONU Type     | SFU (Ethernet UNI: 1) |
| Vendor ID    | TPLG                  |
| Equipment ID | XZ005-G6              |
| Hardware Verion | 1.0                |
| OMCC Version | 128 (0x80)            |

The default GPON authentication parameters logged by the firmware are LOID `tplink`, password `tplink`.

## List of software versions

- `V0.1-3.0.0` (`softwareVersion 0.1.0 3.0.0 v6066.0 Build 231212 Rel.36338n`)

## List of partitions

The firmware only exposes the configuration partition.

| dev       | mount         | content            |
| --------- | ------------- | ------------------ |
| mtdblock3 | `/var/config` | configuration data |

The runtime configuration files are `/var/config/lastgood.xml` and `/var/config/lastgood_hs.xml`; factory defaults are `/etc/config_default.xml` and `/etc/config_default_hs.xml`.

# Web Access

The device ships **without** default credentials: the password is chosen by the user on first access.

1. Factory reset by holding the rear reset button for a few seconds.
2. Open `http://192.168.1.1/superadmin` and set (and confirm) the **superadmin** password.
3. Open `http://192.168.1.1` to set the normal **user** password (log out from superadmin first if needed).

The superadmin account unlocks a few extra web settings (enable SNMP, CWMP, SSH) and a higher-privilege CLI over Telnet.

Using "Inspect Element," you can see that the blocks for Telnet and SSH are set to `display: none`; you can make them visible. SSH does not work (it returns an error), but Telnet does—you just need to use a port other than 23, as that one is filtered (e.g., 2323). Before clicking "Save," go to the console and enter:

```js
INCLUDE_WEB_TELNET = 1;
INCLUDE_SSH_ACCESS = 1; // SSH returns an error
```
Then, click "Save" and log in via Telnet using the same "superadmin" password set in the GUI. The issue is that it’s a very basic shell, so you can’t do much with it.

# Telnet

Telnet exposes TP-Link's own (limited) CLI. Once logged in, the following prompts are available:

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

The `ONU-G` (hardware) version and the `Software image` version reported over OMCI are forced by the firmware and ignored on config import, so this device is not suitable when those fields need to be edited.

# References

- [TP-Link XZ005-G6 (UN) V1.0 — tripleoxygen wiki](https://www.tripleoxygen.net/wiki/ont/tplink/xz005-g6-un-v1)
- [tpconf_bin_xml — configuration backup tool](https://github.com/sta-c0000/tpconf_bin_xml) ([PR #45](https://github.com/sta-c0000/tpconf_bin_xml/pull/45))
- [All about the TP-Link XZ000-G3 GPON ONT](https://vantc.net/all-about-the-tp-link-xz000-g3-gpon-ont.html)
