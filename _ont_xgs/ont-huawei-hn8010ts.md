---
title: Huawei HN8010Ts
has_children: false
layout: default
parent: Huawei
---

# Hardware Specifications

| ------------ | --------------------------------------------------------------- |
| Vendor/Brand | Huawei                                                          |
| Model        | HN8010Ts                                                        |
| ODM          |                                                                 |
| Chipset      | HiSilicon SD5117                                                |
| Flash        | 128MB                                                           |
| RAM          | 32MB                                                            |
| System       | Dopra Linux                                                     |
| 10GBaseT     | Yes                                                             |
| Optics       | SC/APC                                                          |
| IP address   | 192.168.100.1                                                   |
| Web Gui      | ✅ user: `telecomadmin`, password: `admintelecom`               |
| SSH          |                                                                 |
| Telnet       | After Enabling (via XML file) user: `root`, password: `adminHW` |
| Serial       |                                                                 |
| Form Factor  | ONT                                                             |

{% include image.html file="huawei-hn8010ts-20/top_board_view2.jpg" alt="Huawei HN8010Ts teardown top" caption="Huawei HN8010Ts teardown top" %}
{% include image.html file="huawei-hn8010ts-20/bottom_board_view.jpg" alt="Huawei HN8010Ts teardown bottom" caption="Huawei HN8010Ts teardown bottom" %}
{% include image.html file="huawei-hn8010ts-20/broadcom_bcm84891.jpg" alt="Huawei HN8010Ts Broadcom chipset" caption="Huawei HN8010Ts Broadcom chipset" %}
{% include image.html file="huawei-hn8010ts-20/chip_sd5.82s_rfiv100__9657_cn_05.jpg" alt="Huawei HN8010Ts HiSilicon PON chipset" caption="Huawei HN8010Ts HiSilicon PON chipset" %}
{% include image.html file="huawei-hn8010ts-20/nand_ds35q1ga.jpg" alt="Huawei HN8010Ts NAND" caption="Huawei HN8010Ts NAND" %}

## Software Version

- V5R02C0C10S165

## List of partitions

0x000000000000-0x000000100000 : "bootcode" (1MiB)  
0x000000100000-0x000008000000 : "ubilayer_v5" (127MiB)  


{% include_relative ont-huawei-useful-command.md %}
