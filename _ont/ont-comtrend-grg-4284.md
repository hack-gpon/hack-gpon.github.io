---
title: Comtrend GRG-4284
has_children: false
layout: default
parent: Comtrend
---

|                 |                                                                            |
| --------------- | -------------------------------------------------------------------------- |
| Vendor/Brand    | Comtrend                                                                   |
| Model           | GRG-4284                                                                   |
| ODM             | Unknown                                                                    |
| CPU             | Realtek RTL9601D                                                           |
| DRAM            | 32 MB                                                                      |
| Flash Size      | 16 MB                                                                      |
| CPU Arch        | MIPSBE Realtek Lexra                                                       |
| CPU Clock       | 300MHz                                                                     |
| Bootloader      | U-Boot RSDK 2011                                                           |
| System          | Linux 3.10                                                                 |
| Optics          | SC/APC                                                                     |
| IP address      | 192.168.1.1/24                                                             |
| Web Gui         | ✅                                                                         |
| SSH             | ✅                                                                         |
| Telnet          | ✅                                                                         |
| FTP             | ✅                                                                         |
| Serial          | ✅                                                                         |
| Serial baud     | 115200                                                                     |
| Serial encoding | 8-N-1                                                                      | 
| Form Factor     | ONT                                                                        |

## Hardware Revisions

- V1.0 
# External/Internal Photo

{% include image.html file="comtrend_grg-4284_teardown_1.jpg" alt="Comtrend GRG-4284 PCB" caption="Comtrend GRG-4284 PCB" %}

## List of software versions

- CTN-1.0.2b51 (Cetin)
- CTN-1.1.4b6 (Cetin)
 
{% include_relative ont-luna-sdk-useful-commands.md 
    flash='flash' 
    ploam='asciiAndHex' 
%}

## Unlocking full shell
Although the option to enter linux shell is displayed in help command, it silently fails until per-firmware password is provided.

This string is stored plaintext and hardcoded into `/bin/cli` and can be easily dumped.

```sh
# Example commands for firmware CTN-1.1.4b6
version --debug 23KcykMddk
factorymode --password y0S4QbPhAD96GYp
shell
```

## Extracting and repacking the rootfs
{% include alert.html content="Make sure you run both commands as root, otherwise you might get a damaged rootfs image" alert="Warning" icon="svg-warning" color="red" %}

```sh
# unsquashfs mtd5.bin
# mksquashfs squashfs-root rootfs -b 131072 -comp lzma -no-recovery
```

## Firmware patch
Simple change with a hex editor can be done to enable full shell, inside /lib/libmib.so, change `/bin/cli` to `/bin/ash`

Then add /bin/ash to /etc/shells to enable normal shell.

Binary patch is required to prevent `/bin/startup` from reseting ME 256 and 257 parameters on reboot.

## Flashing new firmware

U-Boot has working network and commands provided to load kernel and rootfs over TFTP.

It's recommended you preserve old firmware with md.b, SPI base address and size can be found in env.

TFTP requested filenames:
- uImage - U-Boot OS Kernel image
- rootfs - SquashFS root 


```sh
# Update image0
run upk;run upr;
# Update image1
run upk1;run upr1
```

Or from linux system

```sh
# tftp <IP>
tftp> mode octet
tftp> get rootfs.img /tmp/rootfs.new 
tftp> quit
# flash_eraseall /dev/mtd7
# cat /tmp/rootfs.new > /dev/mtd7
```

# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [Modded firmware for GRG4284](https://github.com/Troll338cz/CTN_GPON/tree/main/Comtrend_GRG-4284/)
