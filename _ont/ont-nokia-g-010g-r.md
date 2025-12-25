---
title: Nokia G-010G-R
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|                  |                                                                             |
| ---------------- |-----------------------------------------------------------------------------|
| Vendor/Brand     | Nokia                                                                       |
| Model            | G-010G-R                                                                    |
| ODM              | CIG                                                                         |
| ODM Product Code | G-97C                                                                       |
| Chipset          | RTL9601B                                                                    |
| Flash            | 16MB                                                                        |
| RAM              | 32MB                                                                        |
| System           | Linux (Luna SDK 1.9.0)                                                      |
| 2.5GBaseT        | No                                                                          |
| Optics           | SC/APC                                                                      |
| IP address       | 192.168.100.1  (after a factory reset the ONT uses 10.89.42.157/16)         |
| Web Gui          | ✅ user `admin`, password `1234`                                             |
| SSH              | ✅ but no login possible                                                     |
| Telnet           | ✅ user `admin`, password `1234`, but has access to GponSLID and not GponCLI |
| Serial           | ✅                                                                           |
| Serial baud      | 115200                                                                      |
| Serial encoding  | 8-N-1                                                                       |
| Form Factor      | ONT                                                                         |

## List of software versions
- 3FE49717AOCK12 
- 3FE49717AOCK38

## List of partitions

| dev  | size     | erasesize | name     |
| ---- | -------- | --------- | -------- |
| mtd0 | 00040000 | 00001000  | "Boot"   |
| mtd1 | 00002000 | 00001000  | "Config" |
| mtd2 | 00002000 | 00001000  | "ImageA" |
| mtd3 | 0003c000 | 00001000  | "ImageB" |


## Boot log

```text
CIG Version: 3.09.08

U-Boot 2011.12.NA-svn145270 (Aug 18 2021 - 15:54:14)

Board: RTL9601D, CPU:112MHz, LX:200MHx, MEM:325MHz, Type:DDR2
DRAM: 32 MB
SPI-F: 204018/MMIO16-1/ModeC 1x16 MB (plr_flash_info @ 81c3bcac)
*** Warning - bad CRC, using default environment

--major = f2, minor = 1
--major = f2, minor = 1
*** !!! Check Result: EEPA and EEPB are all valid
Device care eqvid: 3FE49165AAAA, Init serial
Net:   LUNA GMAC
Warning: eth device name has a space!

swcore_init
**************************************
*                                    *
*  KEY -- Enter console terminal     *
*                                    *
**************************************
waiting for your select
do_jffs2_fsload offset 0x80400000 loadaddr=0xb4088000..
get loadbit 0,bootbit 0
Get current Image = ImageA..

--- jffs2_part_info: partition number 2 for device sflash0 (sflash.0)

Loading 'uImage' from  CRAMFS Partition 'imagea' to 0x80400000.

Root Filesystem crc check successfully!


PRODUCT:  sfu
SS  :  noss
DSP :  nodsp
WIFI:  nowifi
XDSL:  nodsl
Software version:  3FE49717AOCK38
## Booting kernel from Legacy Image at 80400000 ...
   Image Name:   Linux Kernel Image
   Created:      2022-08-29  14:48:12 UTC
   Image Type:   MIPS Linux Kernel Image (lzma compressed)
   Data Size:    776207 Bytes = 758 KB
   Load Address: 80000000
   Entry Point:  80000000
   Verifying Checksum ... OK
   Uncompressing Kernel Image ... OK

Starting kernel ...

Linux version 2.6.30.9-cig-sfu-1 (root@compute3) (gcc version 4.4.6 (Realtek RS]
RTL9602C PLL
CPU revision is: 0000dc02
Determined physical RAM map:
 memory: 016ff000 @ 00000000 (usable)
 memory: 006ff000 @ 01800000 (usable)
Zone PFN ranges:
  Normal   0x00000000 -> 0x00001eff
Movable zone start PFN for each node
early_node_map[2] active PFN ranges
    0: 0x00000000 -> 0x000016ff
    0: 0x00001800 -> 0x00001eff
Built 1 zonelists in Zone order, mobility grouping on.  Total pages: 7616
Kernel command line: console=ttyS0,115200  root=/dev/mtdblock2 mtdparts=sflash:1
root_dev_setup line 180 root: /dev/mtdblock2
icache: 64kB/32B, dcache: 32kB/32B, scache: 0kB/0B
NR_IRQS:128
PID hash table entries: 128 (order: 7, 512 bytes)
console [ttyS0] enabled
Dentry cache hash table entries: 4096 (order: 2, 16384 bytes)
Inode-cache hash table entries: 2048 (order: 1, 8192 bytes)
Memory: 28056k/30712k available (1664k kernel code, 2656k reserved, 489k data, )
Calibrating delay loop... 110.33 BogoMIPS (lpj=55168)
Mount-cache hash table entries: 512
IMEM section size = 0x998
net_namespace: 500 bytes
NET: Registered protocol family 16
bio: create slab <bio-0> at 0
NET: Registered protocol family 2
IP route cache hash table entries: 1024 (order: 0, 4096 bytes)
TCP established hash table entries: 1024 (order: 1, 8192 bytes)
TCP bind hash table entries: 1024 (order: 0, 4096 bytes)
TCP: Hash tables configured (established 1024 bind 1024)
TCP reno registered
NET: Registered protocol family 1
=================================
CONFIG_LUNA_SOC_GPIO: gpio_init()
=================================
Realtek GPIO Driver for Flash Reload Default
=================================
luna_capabilities_init
=================================
=================================
luna_wdt_init
=================================
[Kthread : watchdog ] init complete!
************ Watchdog Setting ****************
WDT_E=0, (1-enable, 0-disable)
LX(MHz)=200
WDT_CLK_SC=3
PH1_TO=17
PH2_TO=0
WDT_RESET_MODE=0
**********************************************
************ Watchdog Setting ****************
WDT_E=1, (1-enable, 0-disable)
LX(MHz)=200
WDT_CLK_SC=3
PH1_TO=17
PH2_TO=0
WDT_RESET_MODE=0
**********************************************
netlog: listening on port 4660
JFFS2 version 2.2. (NAND) © 2001-2006 Red Hat, Inc.
fuse init (API version 7.11)
msgmni has been set to 54
alg: No test for stdrng (krng)
io scheduler noop registered (default)
Serial: 8250/16550 driver, 1 ports, IRQ sharing disabled
serial8250: ttyS0 at MMIO 0x0 (irq = 49) is a 16550A
loop: module loaded
nbd: registered device at major 43
PPP generic driver version 2.4.2
NET: Registered protocol family 24
nf_conntrack version 0.5.0 (479 buckets, 1916 max)
ip_tables: (C) 2000-2006 Netfilter Core Team
TCP cubic registered
NET: Registered protocol family 17
physmap platform flash device: 0b000000 at 14000000
Luna SPI NOR FLASH G3 driver-204018/MMIO16-1 <5>master->name sflash
cmd: cmdlinepart
4 cmdlinepart partitions found on MTD device sflash
Creating 4 MTD partitions on "sflash":
0x000000000000-0x000000080000 : "Boot"
0x000000080000-0x000000200000 : "Config"
0x000000200000-0x000000900000 : "ImageA"
0x000000900000-0x000001000000 : "ImageB"
VFS: Mounted root (cramfs filesystem) readonly on device 31:2.
Freeing unused kernel memory: 92k freed

# num is 10,nothing need to do
/
ONT>Starting Application: 0x00002000, /bin/TimerMgr................Done.
Starting Application: 0x00001000, /bin/LogMgr................Done.
Mmr_trans_bosa_v40_probe() 1285 Vendor: SEMTECH, Part Number: 25L95, bosa ver =0
Mmr_Bob40_reset() 673, laser status:80
Starting Application: 0x00007000, /bin/MiscMgr................Done.
starting to upgrade boot
file[/bootimg/00f2_01_01] length=184320
Flash bootload versin is 3.09.08
Upgrading bootload versin is 3.09.08
Upgrading boot is old
Check base image file CRC ... cal_crc (2af075a1) ori_crc (2af075a1) Success
```


## Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the ONT’s shield like the below photo:
{% include image.html file="g-010g-r_serial_pinouts.jpg" alt="Nokia G-010G-R Ports" caption="Nokia G-010G-R Ports" %}

Please note that some models come without a pre-soldered pin header.
{% include image.html file="g-010g-r_headerless.jpg" alt="Nokia G-010G-R w/o pin header" caption="Nokia G-010G-R w/o pin header" %}

{% include_relative ont-nokia-use.md username="ONTUSER" %}

{% include_relative ont-nokia-useful-command.md %}


# SSH

The image contains dropbear.
```text
#ONT/system/shell>dropbear -V
Dropbear v2019.78
```

The SSH port (22) is blocked per default by iptables rules.
```text
#ONT/system/shell>iptables --list
Chain INPUT (policy ACCEPT)
target     prot opt source               destination
DROP       all  --  anywhere             anywhere           state INVALID
ACL        all  --  anywhere             anywhere

Chain FORWARD (policy DROP)
target     prot opt source               destination
ACCEPT     all  --  anywhere             anywhere
ACCEPT     all  --  anywhere             anywhere           state RELATED,ESTAB
DROP       all  --  anywhere             anywhere           state INVALID

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
ACCEPT     all  --  anywhere             anywhere           state RELATED,ESTAB
DROP       all  --  anywhere             anywhere           state INVALID

Chain ACL (1 references)
target     prot opt source               destination
DROP       tcp  --  anywhere             anywhere           tcp dpt:http
DROP       tcp  --  anywhere             anywhere           tcp dpt:telnet
DROP       tcp  --  anywhere             anywhere           tcp dpt:ssh
DROP       tcp  --  anywhere             anywhere           tcp dpt:ftp
RETURN     all  --  anywhere             anywhere

Chain INVALID (0 references)
target     prot opt source               destination
```

The corresponding rules can simply be deleted as the default policy allows any traffic.
```text
#ONT/system/shell>iptables -D ACL 1
```

Since the root user does not have a password set and dropbear disallows logins with empty passwords for security reasons, there is no login possible.
```text
#ONT/system/shell>cat /etc/passwd
root:x:0:0:root:/root:/bin/sh
bin:x:1:1:bin:/bin:/bin/false
daemon:x:2:2:daemon:/sbin:/bin/false
adm:x:3:4:adm:/var/adm:/bin/false
lp:x:4:7:lp:/var/spool/lpd:/bin/false
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/bin/false
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/bin/false
uucp:x:10:14:uucp:/var/spool/uucp:/bin/false
operator:x:11:0:operator:/root:/bin/false
games:x:12:100:games:/usr/games:/bin/false
gopher:x:13:30:gopher:/var/gopher:/bin/false
ftp:x:14:50:FTP User:/var/ftp:/bin/false
nobody:x:99:99:Nobody:/:/bin/false

#ONT/system/shell>cat /etc/shadow
root::10933:0:99999:7:::
```


# Miscellaneous Links
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser)  for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
- [ispreview.co.uk](https://www.ispreview.co.uk/index.php/2022/09/pictured-openreachs-future-2-5gbps-ont-for-fttp-broadband.html)
- [MIB file parser](https://github.com/nanomad/nokia-ont-mib-parser) for NOKIA's GPON ONTs (*helps you parsing the .mib file located in `/mnt/rwdir`*)
