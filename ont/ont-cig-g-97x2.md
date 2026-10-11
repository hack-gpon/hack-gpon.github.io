---
title: CIG G-97X2
has_children: false
parent: CIG
alias: Frontier FOG421
---

# Hardware Specifications

|                 |                                                     |
| --------------- | --------------------------------------------------- |
| Vendor/Brand    | CIG                                                 |
| Model           | G-97X2                                              |
| ODM             | ✅                                                  |
| CPU             | Realtek RTL9606                                     |
| DRAM            | 128 MB (MXIC MX30LF1G18AC)                          |
| Flash Size      | 128 MB (Nanya NT5CC64M16GP-DI)                      |
| CPU Arch        | MIPSBE Realtek Lexra                                |
| CPU Clock       | 700MHz                                              |
| Bootloader      | U-Boot CIG custom RSDK 2011                         |
| System          | Linux 2.6.30.9-cig-sfu-1 (Realtek RSDK-1.5.6p2)     |
| Ethernet ports  | 4x 1000Base-T                                       |
| Voice           | 2x POTS                                             |
| Optics          | SEMTECH 25L95 SC/APC                                |
| IP address      | GE1 Port - 192.168.100.1/24                         |
| Web Gui         | ❌                                                  |
| SSH             | ❌                                                  |
| Telnet          | ✅                                                  |
| FTP             | ✅(Basic ftpput/ftpget)                             |
| Serial          | ✅                                                  |
| Serial baud     | 115200                                              |
| Serial encoding | 8-N-1                                               | 
| Form Factor     | ONT                                                 |

<ImageFigure file="cig/ont-cig-g-97x2-pcb.jpg" alt="G-97X2 PCB" caption="G-97X2 PCB" />

<ImageFigure file="cig/ont-cig-g-97x2-power.png" alt="G-97X2 power connector" caption="G-97X2 power connector" />


## List of software versions
- R4.2.114.054 (Frontier FOG421)

## Enable telnet (not persistent)
The login password can be generated using the following form:

<CigPassword xgspon :password-len="8" />

```py
#!/usr/bin/python3
import sys
from scapy.all import Ether, Raw, sendp, get_if_list

if len(sys.argv) != 2:
    print(f"{sys.argv[0]} GPONSN")
    sys.exit(1)

gpon_sn = sys.argv[1]
# Convert to GPONabc12345 format - this will also be username for telnet
gpon_sn = gpon_sn[0:4].upper() + gpon_sn[4:12].lower()
load = (
#        | enable bytes                            |
         b'\xee\xee\x00\x00\x00\x00\xff\xff\xff\xff' + 
#        | GPON SN (reversed)       | 
         bytes(gpon_sn, "utf8")[::-1] + 
#        | Null bytes to XOR SN with itself      |
         bytes.fromhex("000000000000000000000000") +
#        | padding |
         b'a' * 32 
)

pkt = Ether(dst="ff:ff:ff:ff:ff:ff", type=0xC199) / Raw(load=load)
for i in get_if_list():
    if i != "lo":
        sendp(pkt, iface=i, count=1, verbose=False)

print(f"Login at 192.168.100.1 with username:\n{gpon_sn}")

```


## U-Boot access
```
# When U-Boot prints:
**************************************
*                                    *
*  KEY -- Enter console terminal     *
*                                    *
**************************************
waiting for your select ...

# Send unlock sequence from terminal
echo -en "\x1B\x1D\x0F\x0B" > /dev/ttyUSB0
# Or with Tera Term
send $1B $1D $0F $0B
```



