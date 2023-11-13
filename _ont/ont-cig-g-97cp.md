---
title: CIG G-97CP
has_children: false
layout: default
parent: CIG
---

# Hardware Specifications

|                  |                                                                          |
| ---------------- | ------------------------------------------------------------------------ |
| Vendor/Brand     | CIG                                                                      |
| Model            | G-97CP                                                                   |
| ODM              | ✅                                                                       |
| Chipset          | Realtek RTL9601D                                                         |
| Flash            |                                                                          |
| RAM              |                                                                          |
| System           | Linux (Luna SDK 1.9.0)                                                   |
| 2.5GbaseT        | Yes                                                                      |
| Optics           | SC/APC                                                                   |
| IP address       | 192.168.100.1                                                            |
| Web Gui          |                                                                          |
| SSH              | ✅ user ```root```, password same as [enable](#enable-password) password |
| Telnet           |                                                                          |
| Serial           | ✅                                                                       |
| Form Factor      | ONT                                                                      |

{% include image.html file="cig/cig-1.jpg" alt="CIG G-97CP Unidata" caption="CIG G-97CP Unidata <a href='https://forum.fibra.click/u/papin'>@papin</a>" %} 
{% include image.html file="cig/cig-2.jpg" alt="CIG G-97CP Unidata" caption="CIG G-97CP Unidata <a href='https://forum.fibra.click/u/papin'>@papin</a>" %}

{% include_relative ont-nokia-use.md username="ont" alertEnablePassword="The following enable password is used to enter GponCLI via serial connection in in firmware where it is not disabled." %}

{% include_relative ont-nokia-useful-command.md %}

# Note

This ONT has the same internal hardware as the [Nokia G-010G-T](/ont-nokia-g-010g-t) and even the same plastic shell of the [ZTE F6005](/ont-zte-f6005).


