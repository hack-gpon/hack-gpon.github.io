---
title: Vantiva AFM0003 (formerly Technicolor AFM0003)
has_children: false
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
| SFP interfaces   | HSGMII (not working with stock firmware)        |
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

<ImageFigure file="afm0003tim.jpg" alt="AFM0003TIM" caption="AFM0003TIM" />

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the stick's shield:

<ImageFigure file="ont-leox-lxt-010s-h_ttl.jpg" alt="Vantiva (formerly Technicolor) AFM0003 TTL Pinout" caption="Vantiva (formerly Technicolor) AFM0003 TTL Pinout" />

::: warning Note
Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work.
:::

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

<!--@partial: ./_partials/ont-luna-sdk-useful-commands.md
flash: "/etc/scripts/flash"
ploam: "ascii"
speedLan: "123456"
customSpeedLanAlert: "The default firmware does not allow modification of the `LAN_SDS_MODE` parameter. Using modded firmware is needed. Before editing the sync speed make sure your hardware supports it."
lastgoodHs: true
flashSwVersion: true
ip: "192.168.2.1"
-->

::: info Info
On this stick the files are usually transferred via TFTP (see [Transferring files from/to the stick](#transferring-files-from-to-the-stick)), and writing the rootfs to `/dev/mtd7` may fail with `Invalid Argument`: in that case write it to the block device `/dev/mtdblock7`.
:::

## Enabling the Web UI
```sh
# /bin/iptables -D INPUT -p tcp --dport 80 -j DROP
```

# Miscellaneous Links

- [omcilog2pcap](https://github.com/hack-gpon/omcilog2pcap)

