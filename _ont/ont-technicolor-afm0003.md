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
| SSH         | ✅ user `admin`, password `system`              |
| Form Factor | miniONT SFP                                     |
| Multicast   | ✅                                              |

{% include image.html file="afm0003tim.jpg" alt="AFM0003TIM" caption="AFM0003TIM" %}

## Serial

Configuration: asc0=0 115200 8-N-1

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
- `/etc/scripts/flash`  - Used to manipulate the config files in a somewhat safe manner
- `xmlconfig` - Used for low-level manipulation of the XML config files. Called by `flash`
- `nv` - Used to manipulate nvram storage, including persistent config entries via `nv setenv`/`nv getenv`
- `omcicli` - Used to interact with the running OMCI daemon
- `omci_app` - The OMCI daemon
- `diag` - Used to run low-level diagnostics commands on the stick

# Useful Commands

## Getting/Setting the ONT's S/N
```sh
# /etc/scripts/flash get GPON_SN
GPON_SN=TMBB00000000
# /etc/scripts/flash set GPON_SN TMBB0A1B2C3D
```

## Getting/Setting the ONT's PLOAM password

{% include alert.html content="The PLOAM password is stored in ASCII format" alert="Info" icon="svg-info" color="blue" %}

```sh
# /etc/scripts/flash get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# /etc/scripts/flash set GPON_PLOAM_PASSWD AAAAAAAAAA
```

## Enabling the Web UI
```sh
# /bin/iptables -D INPUT -p tcp --dport 80 -j DROP
```

## Checking the currently active image
```sh
# nv getenv sw_active
sw_active=1
# nv getenv sw_version0
sw_version0=V1_7_8_210412
# nv getenv sw_version1
sw_version1=V1_7_8_210412
```

## Booting to a different image
```sh
# nv setenv sw_commit 0|1
# reboot
```

## Querying a particular OMCI ME
```sh
# omcicli mib get MIB_IDX
```

# Low Level Modding

# Known Bugs

# Miscellaneous Links

- [omcilog2pcap](https://github.com/ADeltaX/omcilog2pcap)
