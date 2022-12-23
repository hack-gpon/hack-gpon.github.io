---
title: ZTE F6005 
has_children: false
layout: default
parent: ZTE
---

# Hardware Specifications

|             |                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Vendor      | ZTE                                                                                                                                    |
| Model       | F6005                                                                                                                                  |
| Chipset     | Realtek RTL9601D                                                                                                                       |
| Manufacter  | [CIG G-97CP](/ont-cig-g-97cp)                                                                                                          |
| Flash       |                                                                                                                                        |
| RAM         |                                                                                                                                        |
| System      | Linux (Luna SDK 1.9.0)                                                                                                                 |
| HSGMII      | Yes                                                                                                                                    |
| Optics      | SC/APC                                                                                                                                 |
| IP address  | 192.168.1.1                                                                                                                            |
| Web Gui     | ✅ user `admin`, password `admin`                                                                                                      |
| Telnet      | ✅ user `ont`, password should be computed based on a hash of the username and the serial number (see the paragraph [Telnet](#telnet)) |
| SSH         |                                                                                                                                        |
| Form Factor | ONT                                                                                                                                    |
 
{% include image.html file="f6005_of.jpg" alt="F6005 Open Fiber" caption="F6005 with Open Fiber branding <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f6005_tim.jpg" alt="F6005 TIM" caption="F6005 with ZTE branding, like the ones used by TIM" %}
{% include image.html file="f6005_teardown.jpg" alt="F6005 teardown" caption="F6005 teardown" %}


## List of software versions
- V6.0.10N14
- V6.0.10P2N02

## List of partitions
## List of firmwares and files

# Telnet

To calculate the password for telnet access, you can use this tool, simply by entering the S/N

{% include cig_password.html username="ont" %}

# Known Bugs

Buffer size is suboptimal: because of this the ONT is unable to work at full speed during uploads if the server is geographically, and/or latency-wise, far. There are no known problems with multiple connections.

# Miscellaneous Links


