---
title: OMCI Wireshark and PCAP tools
has_children: false
description: Capture the OMCI messages of an ONT and analyze them with Wireshark
---

# OMCI Wireshark and PCAP tools

The OMCI (ONT Management and Control Interface, ITU-T G.984.4 / G.988) messages exchanged between the OLT and the ONT contain the whole provisioning of the line: managed entities, VLAN rules, T-CONTs, GEM ports and the values the OLT expects from the ONT. Capturing them is the best way to understand why an ONT does not work, or to clone the configuration of the ISP ONT.

The workflow is:

1. enable the OMCI log on the ONT and copy the log to the PC;
2. convert the log to a `.pcap` file with [omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap);
3. open the `.pcap` file in Wireshark with the [OMCI Wireshark dissector](https://github.com/hack-gpon/omci-wireshark-dissector).

## omcilog2pcap

[omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap) converts the OMCI logs of the ONTs into `.pcap` files. It supports the logs of:

- Lantiq based chips (e.g. [Huawei MA5671A](/ont-huawei-ma5671a))
- Realtek based chips (e.g. [Technicolor AFM0002TIM](/ont-technicolor-afm0002))
- Sagemcom devices
- Cortina Access devices: you can merge the `pkt_rx` and `pkt_tx` logs into a single file and the software re-orders the packets automatically

The current version is written in JavaScript (ALPHA); the previous .NET 7.0 version is in the [`C#` branch](https://github.com/hack-gpon/omcilog2pcap/tree/C%23).

### Getting the OMCI log on Realtek based sticks

On the Realtek (Luna SDK) based sticks the OMCI daemon can write a binary log to `/tmp/omcilog`:

```sh
/etc/scripts/flash set OMCI_DBGLVL 1
/etc/scripts/flash set OMCI_DBGLOGFILE 1
reboot
/bin/omcicli set logfile 1 ffffffff
```

Then copy the log to the PC, for example:

```sh
ssh admin@192.168.2.1 "cat /tmp/omcilog" > omcilog.log
```

To log the messages since the boot of the stick, add the last command at the end of `etc/runomci.sh` in a custom rootfs. See the [Technicolor AFM0002](/ont-technicolor-afm0002#enabling-ploam-logging) page for the details.

## OMCI Wireshark dissector

The [OMCI Wireshark dissector](https://github.com/hack-gpon/omci-wireshark-dissector) is a Lua plugin that decodes the OMCI messages in Wireshark. It requires Wireshark 1.4.3 or newer with Lua 5.1 or newer (check it in *Help > About*).

To install it, copy both `omci.lua` and `BinDecHex.lua` in the Wireshark personal plugins folder:

| OS            | Folder                                    |
| ------------- | ----------------------------------------- |
| Linux/\*nix   | `$HOME/.config/wireshark/plugins`         |
| Windows       | `%APPDATA%\Wireshark\plugins`             |
| macOS         | `$HOME/.config/wireshark/plugins`         |

Restart Wireshark and open `omci-example.pcap` from the repository to check that the dissector works. Use the `omci` display filter to show only the OMCI messages.

The dissector is a fork of [0liv1er/omci-wireshark-dissector](https://github.com/0liv1er/omci-wireshark-dissector), originally published on Google Code.

## Semantic analysis

To analyze large captures (failed provisioning, MIB snapshots, VLAN rules of ME 171, T-CONT/GEM topology) see [omcipcap](/omcipcap).

# Miscellaneous Links

- [omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap)
- [OMCI Wireshark dissector](https://github.com/hack-gpon/omci-wireshark-dissector)
- [omcipcap](/omcipcap)
- [GPON OMCI VLAN parser](/gpon-omci-vlan-parser)
