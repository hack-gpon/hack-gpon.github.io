---
title: Banana Pi
has_children: false
layout: default
---

# Hardware Specifications

|              | BPI-R3               | BPI-R4               | BPI-R4 var           |
| ------------ | -------------------- | -------------------- | -------------------- |
| Vendor       | Banana Pi            | Banana Pi            |                      |
| Model        | BPI-R3               | BPI-R4               |                      |
| SoC          | MT7986 (filogic 830) | MT7988 (filogic 880) | MT7988 (filogic 880) |
| SFP          | 2x SFP 2.5 GbE       | 2x SFP 10 GbE        | 1x SFP 10 GbE        |
| Ethernet     | 5x GbE               | 4x GbE               | 4x GbE + 1 2.5 GbE   |
| USXGMII      | No                   | ✅                   | ✅                   |
| 2500Base-X   | ✅                   | ✅                   | ✅                   |
| SGMII        | ✅                   | ✅                   | ✅                   |
| Type         | Router               | Router               | Router               |

# Notes
## SFP power behavior on the Banana Pi R4  
Unlike some devices, the Banana Pi R4 does not apply 3.3 V to the SFP cage immediately when a module is inserted.  
Instead, the board uses a load-switch MOSFET which only enables power once the module asserts the MOD_DEF0 pin (the presence/ID signal defined in the SFP specification).  
This design can cause problems with “smart” GPON sticks such as the Zyxel PMG3000-D20B.  
The stick’s internal SoC requires a long time to boot before, and only then it pulls MOD_DEF0 low.  
Because the R4 waits for MOD_DEF0 before supplying power, the stick never receives power at all, resulting in a deadlock where the module stays unpowered.
  
Some users in the BPI-R4 forums discussed a [workaround](https://forum.banana-pi.org/t/bpi-r4-zyxel-pmg3000-d20b-sfp-module-not-detected/18413/2) which bypasses the load-switch and feeds 3.3 V directly to the cage.  
This allows modules like the PMG3000-D20B to start, but at the cost of losing proper hot-plug behavior.  
  
FS.com also offers GPON ONU sticks advertised as “with MAC,” which reportedly assert MOD_DEF0 early and may therefore avoid the issue without hardware modification.  
However, evaluation of these modules on the R4 is still outstanding.

