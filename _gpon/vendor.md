---
title: ONU Vendor ID
has_children: false
nav_order: 4
layout: default
---

> 4 ASCII characters

Needs to be set for the OLT to authenticate your ONT; please read your original ONT's Serial Number, it can be either in HEX or ASCII: if it's codified in HEX, you need to convert the first eight HEX digits to ASCII, for example `48575443` = `HWTC`.

Here is a list of the most popular Vendor IDs:


| ID     | HEX ID     | Vendor Name          |
| ------ | ---------- | -------------------- |
| `ALCL` | `414c434c` | Nokia/Alcatel-Lucent |
| `ALLG` | `414c4c47` | ALLNET               |
| `AVMG` | `41564d47` | AVM (FRITZ!Box)      |
| `ASKY` | `41534b59` | Askey                |
| `CDKT` | `43444B54` | KingType             |
| `CIGG` | `43494747` | Cig                  |
| `CXNK` | `43584e4b` | Calix                |
| `DDKT` | `44444b54` | DKT                  |
| `DLNK` | `444c4e4b` | Dlink                |
| `DSNW` | `44534e57` | DASAN                |
| `ELTX` | `454c5458` | Eltex                |
| `FHTT` | `46485454` | FiberHome            |
| `GMTK` | `474d544b` | GemTek               |
| `GNXS` | `474e5853` | Genexis              |
| `GPON` | `47504f4e` | Generic vendor name  |
| `GTHG` | `47544847` | Alcatel-Lucent (ODM) |
| `HALN` | `48414c4e` | HALNy                |
| `HBMT` | `48424d54` | HiSense              |
| `HUMA` | `48554d41` | Humax                |
| `HWTC` | `48575443` | Huawei               |
| `ICTR` | `49435452` | Icotera              |
| `ISKT` | `49534b54` | Iskratel             |
| `KAON` | `4b414f4e` | KAONMEDIA            |
| `LEOX` | `4c454f58` | LEOX                 |
| `LQDE` | `4c514445` | Lantiq               |
| `NOKG` | `4e4f4b47` | Nokia (GemTek ODM)   |
| `NOKW` | `4e4f4b57` | Nokia (GemTek ODM)   |
| `MSTC` | `4d535443` | Mitrastar            |
| `PTIN` | `5054494e` | Altice/PT Inovação   |
| `RTKG` | `52544b47` | Realtek              |
| `SCOM` | `53434f4d` | Sercomm              |
| `SKYW` | `534b5957` | Skyworth             |
| `SMBS` | `534d4253` | Sagemcom             | 
| `SPGA` | `53504741` | SourcePhotonics      |
| `TMBB` | `544d4242` | Technicolor          |
| `TPLG` | `54504c47` | TP-Link              |
| `UBNT` | `55424e54` | Ubiquiti             |
| `UGRD` | `55475244` | UGrid                |
| `YHTC` | `59485443` | Youhua               |
| `ZNTS` | `5a4e5453` | DZS                  |
| `ZRMT` | `5a524d54` | Zaram                |
| `ZTEG` | `5a544547` | ZTE                  |
| `ZYWN` | `5a59574e` | Zyxel                |
| `ZYXE` | `5a595845` | Zyxel                |

{% include alert.html content="You can also help us with adding content to this site, you can find a button to edit on GitHub on each page." alert="Tip"  icon="svg-info" color="green" %}
