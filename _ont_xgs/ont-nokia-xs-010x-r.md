---
title: Nokia XS-010X-R
has_children: false
layout: default
parent: Nokia
---

# Hardware Specifications

|                  |                                                                                  |
| ---------------- | -------------------------------------------------------------------------------- |
| Vendor           | Nokia                                                                            |
| Model            | XS-010X-R                                                                        |
| ODM              | unknow (CIG?)                                                                    |
| ODM Product Code | XG-99YF                                                                          |
| Chipset          | Cortina CA8271NI                                                                 |
| Manufacter       | unknow (CIG?)                                                                    |
| Flash            | 128MB (MX35LF1GE4AB, but there are also Models with 25NO1GVZEIR)                 |
| RAM              | 256MB                                                                            |
| System           | Custom Cortina Linux (Saturn SDK) based on Kernel 4.14(.172.saturn2-sfu-r2.2.1.3)|
| 10GBaseT         | Yes                                                                              |
| Optics           | SC/APC                                                                           |
| IP address       | 192.168.100.1                                                                    |
| Web Gui          | ✅ Port 80 user: `admin`, password: `1234`                                       |
| SSH              | ✅ (but filtered)                                                                |
| Telnet           | ✅ Port 23 user: `admin`, password: `1234`                                       |
| Serial           | ✅                                                                               |
| Serial baud      | 115200                                                                           |
| Serial encoding  | 8-N-1                                                                            |
| Form Factor      | ONT                                                                              |


# External/Internal Photo

The physical construction is very similar to XS-010X-Q.

However it seems the fiber is much shorter and on some models there is no heat-spreader foil covering the SOC (CA8271NI).

On the "-R", the UART port is filled with solder and must be cleaned first, before pinheaders for UART can be mounted.


## Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface: it's on the top left of the board, when the Ethernet\Power\Optical ports are facing down. TX, RX and ground pads need to be connected to a USB2TTL adapter supporting 3V3 logic. (So far this is similar to XS-010X-Q)

However after u-boot booting the kernel, there is no further interaction possible.

Since devicetree and cmdline seem okay (and unchanged compared to XS-010X-Q), most likely the UART is disabled within the kernel binary...


{% include image.html file="ont-nokia_xs-010x-q_ttl.jpg" alt="Nokia XS-010X-Q TTL Pads" caption="Nokia XS-010X-Q TTL Pads" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note"  icon="svg-warning" color="yellow" %}

## List of software versions
- 3TN00669AOCK15 (deutsche Glasfaser)
- 3NT00669AOCK50


## List of partitions

All data is retrieved by flash dumps. The system uses the NAND-chips hardware ECC and makes no individual use of 64byte OOB per page.

All offsets are related to logical blocks (without ECC OOB): 128KiB block with 64pages each 2KiB.

| dev   |  offset   |  size   | erasesize | name            |
| ----- | --------- | ------- | --------- | --------------- |
| mtd0  | 0x0000000 |   4 MiB | 00020000  | "ssb"           |
| mtd1  | 0x0400000 |   1 MiB | 00020000  | "uboot-env0"    |
| mtd2  | 0x0500000 |   1 MiB | 00020000  | "uboot-env1"    |
| mtd3  | 0x0600000 |   1 MiB | 00020000  | "dtb0"          |
| mtd4  | 0x0700000 |   6 MiB | 00020000  | "kernel0"       |
| mtd5  | 0x0D00000 |  40 MiB | 00020000  | "rootfs0" (ubi) |
| mtd6  | 0x3500000 |   1 MiB | 00020000  | "dtb1"          |
| mtd7  | 0x3600000 |   6 MiB | 00020000  | "kernel1"       |
| mtd8  | 0x3C00000 |  40 MiB | 00020000  | "rootfs1" (ubi) |
| mtd9  | 0x6400000 |  20 MiB | 00020000  | "userdata"(ubi) |
| ????  | 0x7800000 |   1 MiB | 00020000  | "mfginfo0"      |
| ????  | 0x7900000 |   1 MiB | 00020000  | "mfginfo1"      |

This ONT supports dual boot. 

`kernel0` and `rootfs0` respectively contain the kernel and firmware of the first image, `kernel1` and `rootfs1` the kernel and firmware of the second one.

`mfginfo0` and `mfginfo1` (in the first 256bytes) contain the MAC-addresses and the serial (at offset 0x68). The last 4 byte seem to be a UNKNOWN checksum.<br>
The third 256 byte block (offsets 0x7800200 and 0x7900200) contains the user configurable PON-ID. Here the 4byte checksum at the end is CRC-32/BZIP2 in BIG-endian (Polynom: 0x04C11DB7).

<b> I really would be interested what the checksum is / how the checksum of the first block is calculated. </b><br>
Even the relevant kernel modules "ca_ne.ko" (authored by Aaron ans Raymond Tseng) claims to be GPL - the cortina team didn't respond to my mails asking for source code / details.

{% include_relative ont-nokia-use.md %}

{% include_relative ont-nokia-useful-command.md %}


## Enable Telnet Full Shell

The Nokia XS-010X-R seems to only allow access to telnet via `admin`\\`1234` - `ONTUSER` is deactivated.<br>
After loggin in as "admin". the telnetd hands over to "/usr/bin/GponSLID".

<em>(However within the custom telnetd binary ("/usr/bin/telnetd") there are some hints of hidden credentials: "CATS2388" and "CRAFTSPERSON". For now I don't know more about it.)</em>

With the possiblility to unsolder and clone the NAND (I wrote my own C-Tool using spidev) it might be possible to modify the `rootfs0`.<br>
<b>This could be a practical way to enable full telnet by replacing "/usr/bin/GponSLID" with "/usr/bin/GponCLI" - or even better "/bin/sh"...</b>
