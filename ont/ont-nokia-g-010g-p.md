---
title: Nokia G-010G-P
---













# Hardware Specifications

|                  |                                                                     |
| ---------------- | ------------------------------------------------------------------- |
| Vendor/Brand     | Nokia                                                               |
| Model            | G-010G-P                                                            |
| ODM              | CIG                                                                 |
| ODM Product Code | G-97C1                                                              |
| Chipset          | Realtek RTL9601B                                                    |
| Flash            |                                                                     |
| RAM              |                                                                     |
| System           | Linux (Luna SDK 1.9.0)                                              |
| 2.5GBaseT        | No                                                                  |
| Optics           | SC/APC                                                              |
| IP address       | 192.168.100.1  (after a factory reset the ONT uses 10.89.42.157/16) |
| Web Gui          | ✅ user `admin`, password `1234`                                    |
| SSH              |                                                                     |
| Telnet           | ✅ user `root`, password `huigu309`                                 |
| Serial           | ✅                                                                  |
| Serial baud      | 115200                                                              |
| Serial encoding  | 8-N-1                                                               |
| Form Factor      | ONT                                                                 |

<ImageFigure file="g-010g-p.jpg" alt="G-010G-P" caption="Nokia G-010G-P" />

## List of software versions

- 3FE45655AOCK94
- 3FE45655AOCK88

# Usage of GponSLID

## Access Full Shell

To access a complete linux shell just type:
```sh
#ONT>system
#ONT/system>shell
```

To exit the shell and reach the parent menu type `exit` or `x`, in each menu the `help` command will show how to use the shell

<!-- TODO: Include relative file: ont-nokia-useful-command.md -->

# Miscellaneous Links
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser) for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)


