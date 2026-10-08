---
title: Zyxel PM5100-T0 
has_children: false
layout: default
parent: Zyxel
---

# Hardware Specifications

|              |                            |
| ------------ | -------------------------- |
| Vendor/Brand | Zyxel                      |
| Model        | PM5100-T0                  |
| Chipset      | MediaTek/EcoNet EN7523OT   |
| Flash        | 128 MB (Macronix W25N01G)  |
| RAM          | 256 MB (Winbond W623GU6MB) |
| System       |                            |
| 2.5GBaseT    | Yes                        |
| Optics       | SC/APC                     |
| IP address   | 192.168.0.1/24             |
| Web Gui      | ✅                         |
| SSH          | ✅                         |
| Telnet       | ✅                         |
| Serial       | ✅                         |
| Form Factor  | ONT                        |


{% include image.html file="zyxel-pmg5100\front.jpg" alt="PM5100-T0" caption="PM5100-T0" %}
{% include image.html file="zyxel-pmg5100\back.jpg" alt="PM5100-T0" caption="PM5100-T0" %}
{% include image.html file="zyxel-pmg5100\port.jpg" alt="PM5100-T0" caption="PM5100-T0" %}
{% include image.html file="zyxel-pmg5100\back-board.jpg" alt="PM5100-T0 Teardown" caption="PM5100-T0 Teardown" %}
{% include image.html file="zyxel-pmg5100\front-board.jpg" alt="PM5100-T0 Teardown" caption="PM5100-T0 Teardown" %}

## List of software versions
- V5.42-ACEQ-0b10 (Cetin)
- V5.42-ACBF.1.1-C0 (Zyxel)

## Unlock bootloader and root shell
Full linux shell can be accessed if the current firmware allows it, this ONT has per-device password burned into flash.

Depending on Z-Loader version bootloader access might be protected with supervisors password until `EngDebugFlag` is enabled.

Default passwords can be obtained with normal ATEN/ATSE unlock process.

```sh
# Generate unlock seed
ATSE PM5100-T0
# Generate ATEN key with https://github.com/cjdelisle/ATENv3
ATEN 1,RESULT
# Allow nvram write
ATBT 1
# Write EngDebugFlag to nvram
ATSB
# Dump passwords from nvram
ATCK
```

If network upgrade isn't disabled by ISP branding [zyeng](https://github.com/bmork/zyxel-hacks) tool can be used to write EngDebugFlag it over the network.

When both methods fail only option is to desolder the SPI flash and locate passwords inside U-Boot ENV.

