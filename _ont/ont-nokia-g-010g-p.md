---
title: Nokia G-010G-P
has_children: false
layout: default
parent: Nokia
alias: CIG G-97C1/CIG G-97CU
---

# Hardware Specifications

|             |                                                                     |
| ----------- | ------------------------------------------------------------------- |
| Vendor      | Nokia                                                               |
| Model       | G-010G-P                                                            |
| Chipset     | Realtek RTL9601B                                                    |
| Manufacter  | CIG G-97C1                                                          |
| Flash       |                                                                     |
| RAM         |                                                                     |
| System      | Linux (Luna SDK 1.9.0)                                              |
| HSGMII      | No                                                                  |
| Optics      | SC/APC                                                              |
| IP address  | 192.168.100.1  (after a factory reset the ONT uses 10.89.42.157/16) |
| Web Gui     | ✅ user `admin`, password `1234`                                    |
| Telnet      | ✅ user `root`, password `huigu309`                                 |
| SSH         |                                                                     |
| Form Factor | ONT                                                                 |

{% include image.html file="g-010g-p.jpg"  alt="G-010G-P" caption="Nokia G-010G-P" %}

## List of software versions

- 3FE45655AOCK94
- 3FE45655AOCK88

## List of partitions

# Use of GponSLID

## Access Full Shell

To access a complete linux shell just type:
```sh
#ONT>system
#ONT/system>shell
```

To exit the shell and reach the parent menu type `exit` or `x`, in each menu the `help` command will show how to use the shell

{% include_relative ont-nokia-userful-command.md %}

# Miscellaneous Links
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser) for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)


