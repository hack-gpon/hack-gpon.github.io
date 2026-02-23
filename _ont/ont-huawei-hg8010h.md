---
title: Huawei HG8010H 
has_children: false
layout: default
parent: Huawei
---

# Hardware Specifications

|              |                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Vendor/Brand | Huawei                                                                                         |
| Model        | HG8010H                                                                                        |
| ODM          | ✅                                                                                             |
| Chipset      | HiSilicon SD5116                                                                               |
| Flash        | 128MiB (SLC NAND DS35Q1GA-IB)                                                                  |
| RAM          | 256MiB                                                                                         |
| CPU          | Hisilicon A9 dual core (ARMv7)                                                                 |
| System       | Dopra Linux                                                                                    |
| 2.5GBaseT    | No                                                                                             |
| Optics       | SC/APC and SC/UPC                                                                              |
| IP address   | 192.168.100.1                                                                                  |
| Web Gui      | ✅ user `root`, password `admin` or `adminHW` and user `telecomadmin`, password `admintelecom` |
| SSH          |                                                                                                |
| Telnet       | After Enabling user `root`, password `admin` or `adminHW`                                      |
| Serial       |                                                                                                |
| Form Factor  | ONT                                                                                            |


{% include image.html file="hg8010h.jpg"  alt="HG8010H" caption="HG8010H: Horizontal PON port (left, middle); vertical PON port (right)" %}
{% include image.html file="hg8010hvorr.jpg"  alt="HG8010Hv3/4/5" caption="Bottom of the HG8010Hv3/4/5" %}
{% include image.html file="hg8010hv6.jpg"  alt="HG8010Hv6" caption="Bottom of the HG8010Hv6" %}

## Hardware revisions
- v1: Horizontal PON port 
- v2: Horizontal PON port 
- v3: Vertical PON port
- v4: Vertical PON port
- v5: Vertical PON port
- v6: Vertical PON port

## List of software versions

- HWTCA31610003
- V3R013C10S112
- V3R015C10S106
- V3R016C10S003 (V300R016C10SPC003B010)
- V3R017C00S100
- V3R017C10S201 (V300R017C10SPC201B255) 
- V5R020C10S020 (V500R020C10SPC020B014 - V500R020C10SPC020A2011020049)
- V5R020C10S024 (V500R020C10SPC024B001)
- V5R020C10S025 (V500R020C10SPC025B002)
- V5R020C10S115 (V500R020C10SPC115B270)
- V3R017C10S265

## List of partitions

0x000000000000-0x000000100000 : "bootcode" (1MiB)  
0x000000100000-0x000008000000 : "ubilayer_v5" (127MiB)  

{% include_relative ont-huawei-useful-command.md %}

# Miscellaneous Links

- [Exploring the Huawei HG8010H GPON ONT](https://www.linux.it/~md/text/gpon-sha2017.pdf)
- [Unlock HG8010Hv3 softmode](https://lafibre.info/orange-installation/unlock-hg8010gv3-softmode/)
- [Notes on a Huawei HG810H (N.B. SSL error)](https://umbriel.fr/blog/Notes_on_a_Huawei_HG8010H.html)
- [Encrypt/Decrypt configuration file of most HuaWei HG routers](https://github.com/clippit/huawei-hg)


# Teardown and other photos

## v1-2

{% include image.html file="hg8010h_teardown_1.jpg"  alt="HG8010Hv1/2 Teardown" caption="HG8010Hv1/2: Teardown" %}
{% include image.html file="hg8010h_teardown_2.jpg"  alt="HG8010Hv1/2 Teardown" caption="HG8010Hv1/2: Teardown" %}

## v6

{% include image.html file="hg8010h_teardown_1_v6.jpg"  alt="HG8010Hv6 Teardown" caption="HG8010Hv6: Teardown" %}
{% include image.html file="hg8010h_teardown_2_v6.jpg"  alt="HG8010Hv6 Teardown" caption="HG8010Hv6: Teardown" %}
