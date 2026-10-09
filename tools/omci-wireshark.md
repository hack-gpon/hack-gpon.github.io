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
3. open the `.pcap` file in Wireshark with the [OMCI Wireshark dissector](https://github.com/hack-gpon/omci-wireshark-dissector);
4. optionally, analyze large captures with [omcipcap](#omcipcap).

## omcilog2pcap

[omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap) converts the OMCI logs of the ONTs into `.pcap` files. The format of the log is detected automatically:

| Log                                                                                   | Detected by                |
| ------------------------------------------------------------------------------------- | -------------------------- |
| Lantiq based chips (e.g. [Huawei MA5671A](/ont-huawei-ma5671a)), `omcid` log         | `[omcid]` lines            |
| Sagemcom devices (e.g. the TIM [F@st 5684S](/router/sagemcom_fast_5684s))             | `:omci capture:` lines     |
| Cortina Access devices: merge the `pkt_rx` and `pkt_tx` logs into a single file, the packets are re-ordered automatically | ` debug: ` lines |
| Huawei devices (e.g. [OptiXstar S800E](/xgs/ont-huawei-optixstar-s800e), B450)        | `OLT->ONT` / `ONT->OLT` blocks |
| Realtek based chips (e.g. [Technicolor AFM0002TIM](/ont-technicolor-afm0002)): one OMCI message in hex per line | any other text log |

The default version is the .NET one (native AOT), in the [`C#` branch](https://github.com/hack-gpon/omcilog2pcap/tree/C%23). Download the executable for your OS from the [releases](https://github.com/hack-gpon/omcilog2pcap/releases), or build it from `src/` with the .NET SDK.

To convert a log, drag and drop it on the executable, or pass it as argument:

```sh
omcilog2pcap omci_log.txt
```

The `.pcap` file is written in the current directory with the same name as the log (`omci_log.pcap`). Each OMCI message is wrapped in a fake Ethernet frame with EtherType `0x88B5` (OLT MAC `08:87:01:70:17:01`, ONT MAC `08:87:88:00:00:00`), which is the EtherType the dissector is registered on.

::: warning
The [`js` branch](https://github.com/hack-gpon/omcilog2pcap/tree/js) contains an experimental JavaScript port (ALPHA) that has never been tested: use the `C#` version.
:::

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

## omcipcap

[omcipcap](https://github.com/RainbowCloudLabs/omcipcap) is an open-source GPON/XGS-PON OMCI semantic analysis framework for `.pcap` and `.pcapng` files. It complements packet-level inspection tools such as Wireshark by reconstructing protocol-level engineering information from OMCI traffic:

- Detect OMCI provisioning failures and error responses
- Build and compare MIB snapshots
- Analyze Extended VLAN Tagging Operation Configuration Data (ME 171)
- Reconstruct T-CONT, GEM Port and Priority Queue relationships
- Generate OMCI topology information
- Produce structured JSON and Markdown output for automation and AI-assisted analysis
- Support vendor-specific Managed Entity definitions and semantic extensions

It is available on [GitHub](https://github.com/RainbowCloudLabs/omcipcap) and [PyPI](https://pypi.org/project/omcipcap/).

# Miscellaneous Links

- [omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap)
- [OMCI Wireshark dissector](https://github.com/hack-gpon/omci-wireshark-dissector)
- [omcipcap](https://github.com/RainbowCloudLabs/omcipcap)
- [GPON OMCI VLAN parser](/gpon-omci-vlan-parser)
