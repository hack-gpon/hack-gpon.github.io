---
title: Technicolor AFM0003
has_children: false
layout: default
parent: Technicolor
alias: Hisense LTE3415-SH+
---

# Hardware Specifications

|             |                                                 |
| ----------- | ----------------------------------------------- |
| Vendor      | Technicolor                                     |
| Model       | AFM0003TIM                                      |
| Chipset     | Realtek RTL9601C                                |
| Flash       | 256 MB                                          |
| RAM         |                                                 |
| System      | Linux 2.6 (Luna SDK 1.9)                        |
| HSGMII      | Yes, but not working with stock firmware        |
| Optics      |                                                 |
| IP address  | 192.168.2.1                                     |
| Web Gui     | Can be enabled, user `admin`, password `system` |
| Telnet      | ✅                                              |
| Form Factor | miniONT SFP                                     |
| Multicast   | ✅                                              |

{% include image.html file="afm0003tim.jpg" alt="AFM0003TIM" caption="AFM0003TIM" %}

## Serial

Configuration: 115200 8-N-1

# Hardware Revisions

- AFM0003TIM (IP address: 192.168.2.1)
 
# List of software versions
- V1_7_8_220201
 
# List of partitions 

| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 000c0000 | 00020000  | "boot"          |
| mtd1  | 00020000 | 00020000  | "env"           |
| mtd2  | 00020000 | 00020000  | "env2"          |
| mtd3  | 01800000 | 00020000  | "config"        |
| mtd4  | 00800000 | 00020000  | "k0"            |
| mtd5  | 02a40000 | 00020000  | "r0"            |
| mtd6  | 00800000 | 00020000  | "k1"            |
| mtd7  | 02a40000 | 00020000  | "r1"            |
| mtd8  | 00001000 | 00020000  | "Partition_008" |
| mtd9  | 00001000 | 00020000  | "Partition_009" |
| mtd10 | 00001000 | 00020000  | "Partition_010" |
| mtd11 | 00001000 | 00020000  | "Partition_011" |
| mtd12 | 00800000 | 00020000  | "linux"         |
| mtd13 | 02a40000 | 00020000  | "rootfs"        |

This stick supports dual boot. 

`k0` and `r0` respectively contain the kernel and firmware of the first image, `k1` and `r1` the kernel and firmware of the second one

# List of firmwares and files
## Useful files
- `/var/config/lastgood.xml` - Contains the user portion of the configuration
- `/var/config/lastgood-hs.xml` - Contains the "hardware" configuration (which _should not_ be changed)
- `/tmp/omcilog` - OMCI messages logs (must be enabeled, see below)

## Useful binaries
- `/etc/scripts/flash` - Used to manipulate the config files in a somewhat safe manner
- `xmlconfig` - Used for low-level manipulation of the XML config files. Called by `flash`
- `nv` - Used to manipulate nvram storage, including persistent config entries via `nv setenv`/`nv getenv`
- `omcicli` - Used to interact with the running OMCI daemon
- `omci_app` - The OMCI daemon
- `diag` - Used to run low-level diagnostics commands on the stick

{% include_relative luna-sdk-userful-commands.md flash='/etc/scripts/flash' ploam='ascii' %}

## Enabling the Web UI
```sh
# /bin/iptables -D INPUT -p tcp --dport 80 -j DROP
```

# Low Level Modding

# Known Bugs

# Miscellaneous Links

- [omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap)

