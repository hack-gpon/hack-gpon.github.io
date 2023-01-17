---
title: FiberTwist G2110C-2.5G
has_children: false
layout: default
parent: Genexis
---

# Hardware Specifications

|                 |                                                              |
| --------------- | ------------------------------------------------------------ |
| Vendor/Brand    | FiberTwist                                                   |
| Model           | G2110C-2.5G                                                  |
| Chipset         | Realtek RTL9601D                                             |
| Flash           | 128MB                                                        |
| RAM             | 32MB                                                         |
| System          | Linux 3.18 (Luna SDK 3.3)                                    |
| 2.5GBaseT       | Yes                                                          |
| Optics          | SC/APC                                                       |
| IP address      | 192.168.100.1/24 or 192.168.1.1/24                           |
| Web Gui         | Can be enabled, locked down by iptables rule and missing CSS |
| SSH             |                                                              |
| Telnet          | ✅ user `company`, password `amyM77yY`                       |
| Serial          | ✅                                                           |
| Serial baud     | 115200                                                       |
| Serial encoding | 8-N-1                                                        |
| Form Factor     | ONT                                                          |

{% include image.html file="ft-g2110c-front.jpg"  alt="FiberTwist G2110C-2.5G Front" caption="FiberTwist G2110C-2.5G Front" %}

{% include image.html file="ft-g2110c-back.jpg"  alt="FiberTwist G2110C-2.5G Back" caption="FiberTwist G2110C-2.5G Back" %}

## Optical Header installation backplate
{% include image.html file="ft-g2110c-optical-header-1.jpg"  alt="FiberTwist G2110C-2.5G Optical Header installation backplate" caption="FiberTwist G2110C-2.5G Optical Header installation backplate" %}

{% include image.html file="ft-g2110c-optical-header-2.jpg"  alt="FiberTwist G2110C-2.5G Optical Header installation backplate" caption="FiberTwist G2110C-2.5G Optical Header installation backplate" %}

{% include image.html file="ft-g2110c-optical-header-3.jpg"  alt="FiberTwist G2110C-2.5G Optical Header installation backplate" caption="FiberTwist G2110C-2.5G Optical Header installation backplate" %}

## Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the ONT's shield:

{% include image.html file="ft-g2110c-internal.jpg"  alt="FiberTwist G2110C-2.5G Internal" caption="FiberTwist G2110C-2.5G Internal" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

## List of software versions
- C-5.6.1-R
- C-5.7.0-R
- C-5.7.1-DEV3
- C-5.7.1-EFT1

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

# General Settings and Useful Commands

{% include alert.html content="Some variables are write-protected, you need to unlock them before proceed" alert="Info" icon="svg-info" color="blue" %}

Use the following command to unlock write-protected variables:

```sh
# nv setenv ProtectEnv 0
```

## Getting/Setting the ONT's S/N

{% include alert.html content="If your serial number has letters after the Vendor ID (e.g. ZTEGAAA01234), put them in lower case (e.g. ZTEGaaa01234)" alert="Info" icon="svg-info" color="blue" %}

```sh
# nv setenv GponSn ZTEGaaa01234
```
Reboot the ONT to apply any changes

You can check if the serial number was correclty changed using the following command:

```sh
# diag gpon get serialnumber
ZTEGaaa01234
```

## Changing the Hardware Version

```sh
# nv setenv HV G2110CE2V1D0
```
Reboot ONT to apply the change

## Changing the Equipment ID

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
If you want to be future proof, put your PLOAM also on U-Boot env using the following command in the OS shell:

```sh
# nv setenv ploampwd 1234567890
ploampwd=1234567890
```

## Spoofing firmware version

{% include alert.html content="To change this data you need to upload a modified firmware. Do it at your own risk!" alert="Warning" icon="svg-warning" color="red" %}

- Download the modified firmware from [here](https://mega.nz/file/f0QGwLSb#pyxCUQmlD-KgFU595mHYUsPPUFKJGD2Ug__mCyYIdWs) md5: `2a12b2bbc0971d76fa8201a046544a44`
- Logon on the OS shell of the ONT and run this command: `iptables -F`
- Open a web browser and go to `http://192.168.1.1/upgrade.asp` or `http://192.168.100.1/upgrade.asp`, enter the same credentials used for telnet session, select the modified firmware and click on `Upgrade`
- Once the upgrade is done and you are able to reach the ONT via telnet, log back in and run these commands to change the firmware version on both banks:

```sh
# /etc/scripts/flash set OMCI_OLT_MODE 3
OMCI_OLT_MODE=3
# nv setenv sw_custom_version0=V6.0.10N14
# nv setenv sw_custom_version1=V6.0.10N14
```

Reboot the ONT and check if the version was correctly applied with this command (take a look at the `Version` field):

```sh
# omcicli mib get 7
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SWImage
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
=================================
EntityID: 0x00
Active: 0
Committed: 0
Valid: 1
*Version: V6.0.10N14*
ProductCode:
ImageHash: 0x00000000000000000000000000000000
=================================
=================================
EntityID: 0x01
Active: 1
Committed: 1
Valid: 1
*Version: V6.0.10N14*
ProductCode:
ImageHash: 0x00000000000000000000000000000000
=================================
```

# Known Bugs
- Modified image (based on C-5.7.1-DEV3 and C-5.7.1-EFT1) has the Web UI enabled, but without an attached fiber the daemon will crash

# Miscellaneous Links
- [FiberTwist G2110C-2.5G](https://genexis.eu/content/uploads/2020/07/FiberTwist-G2110C-2.5G-Installation-Guide-v1.0-EN.pdf)
- [Modded Firmware C-5.7.1-DEV3](https://mega.nz/file/yspFRTJT#JjeDS7NwLZxCzFklQGMJVIuPawo8utQRGbMGEXQv84M)
- [Modded Firmware C-5.7.1-EFT1](https://mega.nz/file/f0QGwLSb#pyxCUQmlD-KgFU595mHYUsPPUFKJGD2Ug__mCyYIdWs)
