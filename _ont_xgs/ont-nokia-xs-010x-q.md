---
title: Nokia XS-010X-Q
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|                  |                                                                                  |
| ---------------- | -------------------------------------------------------------------------------- |
| Vendor           | Nokia                                                                            |
| Model            | XS-010X-Q                                                                        |
| ODM              | CIG                                                                              |
| ODM Product Code | XG-99YF                                                                           |
| Chipset          | Cortina CA8271A                                                                  |
| Manufacter       | CIG                                                                              |
| Flash            | 128MB                                                                            |
| RAM              | 128MB                                                                            |
| System           | Custom Linux by Cortina (Saturn SDK) based on Kernel 4.4                         |
| 10GBaseT         | Yes                                                                              |
| Optics           | SC/APC                                                                           |
| IP address       | 192.168.100.1                                                                    |
| Web Gui          | ✅ Port 80 user: `admin`, password: `1234`                                       |
| SSH              | ✅ (see Enable SSH)                                                              |
| Telnet           | ✅ Port 23 user: `admin`, password: `1234` (see Telnet Full Shell)               |
| Serial           | ✅                                                                               |
| Serial baud      | 115200                                                                           |
| Serial encoding  | 8-N-1                                                                            |
| Form Factor      | ONT                                                                              |


# External/Internal Photo

{% include image.html file="ont-nokia_xs-010x-q_front.jpg" alt="Nokia XS-010X-Q Front" caption="Nokia XS-010X-Q Front" %}

{% include image.html file="ont-nokia_xs-010x-q_rear.jpg" alt="Nokia XS-010X-Q Rear" caption="Nokia XS-010X-Q Rear" %}

{% include image.html file="ont-nokia_xs-010x-q_internal_1.jpg" alt="Nokia XS-010X-Q Internal 1" caption="Nokia XS-010X-Q Internal 1" %}

{% include image.html file="ont-nokia_xs-010x-q_internal_2.jpg" alt="Nokia XS-010X-Q Internal 2" caption="Nokia XS-010X-Q Internal 2" %}

## Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface: it's on the top left of the board, when the Ethernet\Power\Optical ports are facing down. TX, RX and ground pads need to be connected to a USB2TTL adapter supporting 3V3 logic.

{% include image.html file="ont-nokia_xs-010x-q_ttl.jpg" alt="Nokia XS-010X-Q TTL Pads" caption="Nokia XS-010X-Q TTL Pads" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

## List of software versions
- 3FE49337AOCK80 - (R4.4.17.063 CIG 25/06/2021)
- 3FE49337BOCK28

## List of partitions

| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00020000  | "ssb"           |
| mtd1  | 00100000 | 00020000  | "uboot-env"     |
| mtd2  | 00100000 | 00020000  | "dtb0"          |
| mtd3  | 00600000 | 00020000  | "kernel0"       |
| mtd4  | 02800000 | 00020000  | "rootfs0"       |
| mtd5  | 00100000 | 00020000  | "dtb1"          |
| mtd6  | 00600000 | 00020000  | "kernel1"       |
| mtd7  | 02800000 | 00020000  | "rootfs1"       |
| mtd8  | 01400000 | 00020000  | "userdata"      |
| mtd9  | 00100000 | 00020000  | "mfginfo1"      |
| mtd10 | 00100000 | 00020000  | "mfginfo2"      |
| mtd11 | 00001000 | 00001000  | "uboot-env2"    |
| mtd12 | 00b09000 | 0001f000  | "squashfs_ubi"  |
| mtd13 | 01078000 | 0001f000  | "userdata"      |
| mtd14 | 00b09000 | 0001f000  | "squashfs_ubi"  |

This ONT supports dual boot. 

`kernel0` and `rootfs0` respectively contain the kernel and firmware of the first image, `kernel1` and `rootfs1` the kernel and firmware of the second one.

{% include_relative ont-nokia-use.md %}

{% include_relative ont-nokia-useful-command.md %}

## Enable SSH (not persistent)

Port 22 is filtered by default and the SSH daemon can be only enabled in runtime. Here is the procedure but it's not persistent and will need to be done again after each reboot:

Access UART with `ONTUSER`, then enter `system\misc`.

Set `ssh_en` to `1` with the command:
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>ssh_en set 1
---ATECMDRESULT--- OK
```

Go back to `system`, then `shell` and run this command:
```sh
#ONT/system/misc>exit
#ONT/system>shell
#ONT/system/shell>iptables -F
```
## Enable Telnet Full Shell

When using the default credentials to access telnet (`admin`\\`1234`), the prompt is limited to the `GponSLID` shell that only permits modifying or displaying the `PLOAM` password.
If you change the `admin_mask` to `255.255.255.255`, default credentials stop working but you can login as `ONTUSER` using the generated password to have full shell like when using UART.

Here is the procedure to change `admin_mask`:

Access UART with `ONTUSER`, then enter `system\misc`.

Set `admin_mask` to `255.255.255.255` with the command:
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>admin_mask set 255.255.255.255
normal load eep datat
---ATECMDRESULT--- OK
```

Now reboot the ONT and you can access telnet with `ONTUSER` and full power :)
