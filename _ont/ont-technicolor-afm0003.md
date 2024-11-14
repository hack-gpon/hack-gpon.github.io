---
title: Vantiva AFM0003 (formerly Technicolor AFM0003)
has_children: false
layout: default
parent: Vantiva (formerly Technicolor)
alias: HiSense LTE3415-SH+
---

# Hardware Specifications

|                  |                                                 |
| ---------------- | ----------------------------------------------- |
| Vendor/Brand     | Vantiva (formerly Technicolor)                  |
| Model            | AFM0003TIM                                      |
| ODM              | HiSense                                         |
| ODM Product Code | LTE3415-SH+                                     |
| Chipset          | Realtek RTL9601CI                               |
| Flash            | 128MB                                           |
| RAM              | 32MB                                            |
| System           | Linux 2.6 (Luna SDK 1.9)                        |
| HSGMII           | Yes, but not working with stock firmware        |
| Optics           | SC/APC                                          |
| IP address       | 192.168.2.1                                     |
| Web Gui          | Can be enabled, user `admin`, password `system` |
| SSH              | No                                              |
| Telnet           | ✅                                              |
| Form Factor      | miniONT SFP                                     |
| Serial           | ✅                                              |
| Serial baud      | 115200                                          |
| Serial encoding  | 8-N-1                                           |
| Multicast        | ✅                                              |

{% include image.html file="afm0003tim.jpg" alt="AFM0003TIM" caption="AFM0003TIM" %}

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the stick's shield:

{% include image.html file="ont-leox-lxt-010s-h_ttl.jpg" alt="Vantiva (formerly Technicolor) AFM0003 TTL Pinout" caption="Vantiva (formerly Technicolor) AFM0003 TTL Pinout" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

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

`k0` and `r0` respectively contain kernel and firmware of the first image, while `k1` and `r1` contain kernel and firmware of the second one.

{% include_relative ont-luna-sdk-useful-commands.md
    flash='/etc/scripts/flash'
    ploam='ascii'
    speedLan='123456'
    customSpeedLanAlert='The default firmware does not allow modification of the `LAN_SDS_MODE` parameter. Using modded firmware is needed. Before editing the sync speed make sure your hardware supports it.'
    lastgoodHs=true
    flashSwVersion=true
%}

## Enabling the Web UI
```sh
# /bin/iptables -D INPUT -p tcp --dport 80 -j DROP
```

## Transfering files from/to the stick
Works with binary files too, just run md5sum on source and destination to make sure you are not corrupting anything...
From the stick to the PC:
```sh
# tftp <IP>
tftp> put <filename> <directory>
tftp> q
```
From the PC to the stick:
```sh
# tftp <IP>
tftp> get <filename>
tftp> q
```

## Extracting and repacking the rootfs
{% include alert.html content="Make sure you run both commands as root, otherwise you might get a damaged rootfs image" alert="Warning" icon="svg-warning" color="red" %}

```sh
# unsquashfs mtd5.bin
# mksquashfs squashfs-root rootfs -b 131072 -comp lzma -no-recovery
```
## Flashing a new rootfs

{% include alert.html content="Only the inactive image can be flashed, change sw_versionX and sw_commit X based on the bank you have flashed" alert="Info" icon="svg-info" color="blue" %}

Flash mtd4/5 if you are on image1, mtd6/7 if you are on image0.

The following commands are used to flash a new rootfs to image1 and then boot to it
```sh
# flash_eraseall /dev/mtd7
# cat /tmp/rootfs.new > /dev/mtd7
```

If you get this error on `cat` command
```sh
# cat /tmp/rootfs.new > /dev/mtd7
cat: write error: Invalid Argument
```

Use this proceudre instead to write firmware back to mtd:
```sh
# flash_eraseall /dev/mtd7
# cat /tmp/rootfs.new > /dev/mtdblock7
```

Then make new firmware bootable
```sh
# nv setenv sw_version1 NEW_SOFTWARE_VERSION
# nv setenv sw_commit 1
# reboot
```

# Miscellaneous Links

- [omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap)

