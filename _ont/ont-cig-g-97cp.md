---
title: CIG G-97CP
has_children: false
layout: default
parent: CIG
---

# Hardware Specifications

|                  |                                                                          |
| ---------------- |--------------------------------------------------------------------------|
| Vendor/Brand     | CIG                                                                      |
| Model            | G-97CP                                                                   |
| ODM              | CIG                                                                      |
| ODM Product Code | G-97CP                                                                   |
| ODM              | ✅                                                                        |
| Chipset          | Realtek RTL9601D                                                         |
| Flash            |                                                                          |
| RAM              |                                                                          |
| System           | Linux                                                                    |
| 2.5GbaseT        | Yes                                                                      |
| Optics           | SC/APC                                                                   |
| IP address       | 192.168.100.1                                                            |
| Web Gui          |                                                                          |
| SSH              | ✅ user ```root```, password same as [enable](##Enable-Password) password |
| Telnet           |                                                                          |
| Serial           | ✅                                                                        |
| Form Factor      | ONT                                                                      |

{% include image.html file="cig/cig-1.jpg" alt="CIG G-97CP Unidata" caption="CIG G-97CP
Unidata <a href='https://forum.fibra.click/u/papin'>@papin</a>" %} {% include image.html file="cig/cig-2.jpg" alt="CIG
G-97CP Unidata" caption="CIG G-97CP Unidata <a href='https://forum.fibra.click/u/papin'>@papin</a>" %}

## Enable password

{% include alert.html content="The following enable password is used to enter GponCLI, but currently in the models distributed in Italy by TIM and OpenFiber there is no way to enter GponCLI either by SSH, Telnet or Serial, with the exception of Unidata, with the Unidata one you can access the GponCLI by Serial and SSH. The enable password is not useful for entering the Web Gui." alert="Note" icon="svg-info" color="blue" %}

You can use this tool to generate the enable password:

{% include cig_password.html username="ont" %}

# Note

This ONT has the same internal hardware as the [Nokia G-010G-T](/ont-nokia-g-010g-t) and even the same plastic shell of the [ZTE F6005](/ont-zte-f6005).






