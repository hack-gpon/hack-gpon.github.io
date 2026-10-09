---
title: OMCI PCAP Analyzer
has_children: false
description: Tool for semantic analysis of GPON/XGS-PON OMCI PCAP files
---

# omcipcap

[omcipcap](https://github.com/RainbowCloudLabs/omcipcap) is an open-source GPON/XGS-PON OMCI semantic analysis framework for `.pcap` and `.pcapng` files.

It complements packet-level inspection tools such as Wireshark by reconstructing protocol-level engineering information from OMCI traffic.

Main features include:

- Detect OMCI provisioning failures and error responses
- Build and compare MIB snapshots
- Analyze Extended VLAN Tagging Operation Configuration Data (ME 171)
- Reconstruct T-CONT, GEM Port and Priority Queue relationships
- Generate OMCI topology information
- Produce structured JSON and Markdown output for automation and AI-assisted analysis
- Support vendor-specific Managed Entity definitions and semantic extensions

Project:

- [GitHub](https://github.com/RainbowCloudLabs/omcipcap)
- [PyPI](https://pypi.org/project/omcipcap/)

To capture the OMCI messages of an ONT and open them in Wireshark see [OMCI Wireshark and PCAP tools](/omci-wireshark).
