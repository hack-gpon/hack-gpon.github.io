---
title: ONU Vendor ID
has_children: false
nav_order: 4
layout: default
---

> 4 ASCII character

Needs to be set for the OLT to authenticate your ONT; please read your original ONT's Serial Number, it can be either in HEX or ASCII: if it's codified in HEX, you need to convert the first eight HEX digits to ASCII, for example `48575443` = `HWTC`.

Here is a list of the most popular Vendor IDs:


| ID     | HEX ID     | Vendor Name          |
| ------ | ---------- | -------------------- |
| `ALCL` | `414c434c` | Nokia/Alcatel-Lucent |
| `AVMG` | `41564d47` | AVM (FRITZ!Box)      |
| `CIGG` | `43494747` | Cig                  |
| `DLNK` | `444c4e4b` | Dlink                |
| `ELTX` | `454c5458` | Eltex                |
| `FHTT` | `46485454` | Fiber Home           |
| `GNXS` | `474e5853` | Genexis              |
| `GPON` | `47504f4e` | Generic vendor name  |
| `HALN` | `48414c4e` | HALNy                |
| `HBMT` | `48424d54` | HiSense              |
| `HWTC` | `48575443` | Huawei               |
| `ICTR` | `49435452` | Icotera              |
| `ISKT` | `49534b54` | Iskratel             |
| `LEOX` | `4c454f58` | LEOX                 |
| `LQDE` | `4c514445` | Lantiq               |
| `PTIN` | `5054494e` | Altice/PT Inovação   |
| `RTKG` | `52544b47` | Realtek              |
| `SCOM` | `53434f4d` | Sercomm              |
| `SMBS` | `534d4253` | Sagemcom             | 
| `SPGA` | `53504741` | SourcePhotonics      |
| `TMBB` | `544d4242` | Technicolor          |
| `TPLG` | `54504c47` | TP-Link              |
| `UBNT` | `55424e54` | Ubiquiti             |
| `ZTEG` | `5a544547` | ZTE                  |
| `ZYWN` | `5a59574e` | Zyxel                |

{% include alert.html content="You can also help us with the content of this site, on each page you will find a button to edit on GitHub." alert="Tip"  icon="svg-info" color="green" %}
