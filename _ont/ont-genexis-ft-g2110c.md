---
title: FiberTwist G2110C-2.5G
has_children: false
layout: default
parent: Genexis
---

# Hardware Specifications

|             |                                      |
| ----------- | ------------------------------------ |
| Vendor      | Genexis                              |
| Model       | FiberTwist G2110C-2.5G               |
| Chipset     | RTL9601D                             |
| Flash       | 128MB                                |
| RAM         | 32MB                                 |
| System      | Linux 3.18 (Luna SDK 3.3)            |
| HSGMII      | ✅                                   |
| Optics      | SC/APC                               |
| IP address  | 192.168.100.1/24 or 192.168.1.1/24   |
| Web Gui     | Can be enabled, locked down by iptables rule and missing CSS |
| Telnet      | ✅ user `company`, password `amyM77yY` |
| Form Factor | ONT                                  |

# External/Internal Photo

{% include image.html file="ft-g2110c-front.jpg"  alt="FiberTwist G2110C-2.5G Front" caption="FiberTwist G2110C-2.5G Front" %}

{% include image.html file="ft-g2110c-back.jpg"  alt="FiberTwist G2110C-2.5G Back" caption="FiberTwist G2110C-2.5G Back" %}

## Optical Header installation backplate
{% include image.html file="ft-g2110c-optical-header-1.jpg"  alt="FiberTwist G2110C-2.5G Optical Header installation backplate" caption="FiberTwist G2110C-2.5G Optical Header installation backplate" %}

{% include image.html file="ft-g2110c-optical-header-2.jpg"  alt="FiberTwist G2110C-2.5G Optical Header installation backplate" caption="FiberTwist G2110C-2.5G Optical Header installation backplate" %}

{% include image.html file="ft-g2110c-optical-header-3.jpg"  alt="FiberTwist G2110C-2.5G Optical Header installation backplate" caption="FiberTwist G2110C-2.5G Optical Header installation backplate" %}

## Internal (TTL is on CM3 header)
{% include image.html file="ft-g2110c-internal.jpg"  alt="FiberTwist G2110C-2.5G Internal" caption="FiberTwist G2110C-2.5G Internal" %}

## List of software versions
- C-5.6.1-R
- C-5.7.0-R
- C.5.7.1-DEV

## List of partitions

| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00001000  | "boot"          |
| mtd1  | 00002000 | 00001000  | "env"           |
| mtd2  | 00002000 | 00001000  | "env2"          |
| mtd3  | 0003c000 | 00001000  | "config"        |
| mtd4  | 00300000 | 00001000  | "k0"            |
| mtd5  | 004c0000 | 00001000  | "r0"            |
| mtd6  | 00300000 | 00001000  | "k1"            |
| mtd7  | 004c0000 | 00001000  | "r1"            |
| mtd8  | 00001000 | 00001000  | "Partition_008" |
| mtd9  | 00001000 | 00001000  | "Partition_009" |
| mtd10 | 00001000 | 00001000  | "Partition_010" |
| mtd11 | 00001000 | 00001000  | "Partition_011" |
| mtd12 | 00300000 | 00001000  | "linux"         |
| mtd13 | 004c0000 | 00001000  | "rootfs"        |

This ONT supports dual boot. 

`k0` and `r0` respectively contain the kernel and firmware of the first image, `k1` and `r1` the kernel and the firmware of the second one

## List of firmwares and files

# Useful Commands

{% include alert.html content="Some variables are write-protected, you need to unlock them before proceed" alert="Info" icon="svg-info" color="blue" %}

Use this command to unlock write-protected variables:

```sh
# nv setenv ProtectEnv 0
```

## Getting/Setting the ONT's S/N

```sh
# nv setenv GponSn GNXS05542100
```
Reboot ONT to apply the change

You can check if the serial number was correclty changed using the following command:

```sh
# diag gpon get serialnumber
GNXS05542100
```

## Changing Hardware Version

```sh
# nv setenv HV G2110CE2V1D0
```
Reboot ONT to apply the change

## Changing Equipment ID

```sh
# nv setenv ProdName FT-G2110C-2.5G
```
Reboot ONT to apply the change

## Changing the IP address
```sh
# /etc/scripts/flash get LAN_IP_ADDR
LAN_IP_ADDR=192.168.1.1
# /etc/scripts/flash set LAN_IP_ADDR 192.168.1.1
 ```

## Getting/Setting the ONT's PLOAM password

{% include alert.html content="The PLOAM password is stored in ASCII format" alert="Info" icon="svg-info" color="blue" %}

```sh
# /etc/scripts/flash get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# /etc/scripts/flash set GPON_PLOAM_PASSWD AAAAAAAAAA
```
Looks like Genexis has also included an U-Boot variable to store the PLOAM. On currently known firmwares (5.6.1 and 5.7.0) it is not read by the `omci_app` daemon.
If you want to be future proof, put your PLOAM also on U-Boot env using the following command on the OS shell:

```sh
# nv setenv ploampwd 1234567890
ploampwd=1234567890
```

# Known Bugs

- Most of the values inside the XML configuration file are not read by the `omci_app` deamon, so changing parameters like `PON_VENDOR_ID`, `OLT_MODE` or `SW_VER*` is not supported. At the moment this unit cannot be fully spoofed like other Realtek's ONT with stock Luna SDK

# Miscellaneous Links
- [FiberTwist G2110C-2.5G](https://genexis.eu/content/uploads/2020/07/FiberTwist-G2110C-2.5G-Installation-Guide-v1.0-EN.pdf)
