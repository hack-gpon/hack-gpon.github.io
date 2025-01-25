---
title: TP-Link XX800V 
has_children: false
layout: default
parent: TP-Link
---

# Hardware Specifications

|              |                               |
| ------------ | ----------------------------- |
| Vendor/Brand | TP-Link                       |
| Model        | XX800V                        |
| ODM          |                               |
| CPU          |                               |
| CPU Clock    |                               |
| Chipset      |                               |
| Flash        |                               |
| RAM          |                               |
| System       |                               |
| Ethernet     | 3 1GbE LAN, 1 2.5GbE WAN      |
| Optics       | SC/APC                        |
| IP address   | 192.168.1.1                   |
| Web Gui      | ✅                            |
| SSH          |                               |
| Telnet       |                               |
| Serial       | Only RX                       |
| Form Factor  | CPE with ONT                  |


# GPON/OMCI settings

## Setting ONU GPON Serial Number

In the "Rete -> Impostazioni GPON" page, GPON SN field is disabled and not editable. It can be enabled via the browser’s developer console by editing the HTML code and setting HTML `disabled` attribute to `enabled`.

{% include image.html file="tp-link/xb432v-change-sn.jpg" alt="XB432V procedure for changing GPON SN" caption="XB432V procedure for changing GPON SN" %}

## Setting ONU GPON PLOAM password

This can be easily done via the Web UI from the same "Rete -> Impostazioni GPON" page. The password field is already editable.


# Miscellaneous Links

- [User manual](https://www.windtre.it/Document/manuali/modem/XX800v-ITWIND3_UG_REV1-0-0_Italian.pdf.docview.pdf)
