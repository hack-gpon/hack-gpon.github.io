---
title: ZTE F6005 
has_children: false
layout: default
parent: ZTE
---

# Hardware Specifications

|              |                                   |
| ------------ | --------------------------------- |
| Vendor/Brand | ZTE                               |
| Model        | F6005                             |
| ODM          | [CIG G-97CP](/ont-cig-g-97cp)     |
| Chipset      | Realtek RTL9601D                  |
| Flash        |                                   |
| RAM          |                                   |
| System       | Linux (Luna SDK 1.9.0)            |
| 2.5GBaseT    | Yes                               |
| Optics       | SC/APC                            |
| IP address   | 192.168.1.1                       |
| Web Gui      | ✅ user `admin`, password `admin` |
| SSH          |                                   |
| Telnet       |                                   |
| Serial       |                                   |
| Form Factor  | ONT                               |
 
{% include image.html file="f6005_of.jpg" alt="F6005 Open Fiber" caption="F6005 with Open Fiber branding <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f6005_tim.jpg" alt="F6005 TIM" caption="F6005 with ZTE branding, like the ones used by TIM" %}
{% include image.html file="f6005_teardown.jpg" alt="F6005 teardown" caption="F6005 teardown" %}


## List of software versions
- V6.0.10N14
- V6.0.10P2N02

# Use

## Enable password

You can use this tool to generate the enable password:

{% include cig_password.html username="ont" %}

# Known Bugs

Buffer size is suboptimal: because of this the ONT is unable to work at full speed during uploads if the server is geographically, and/or latency-wise, far. There are no known problems if there is only one person in the GPON tree.