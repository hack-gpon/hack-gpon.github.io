---
title: ZTE F6005 
has_children: false
parent: ZTE
---

# Hardware Specifications

|                  |                                   |
| ---------------- | --------------------------------- |
| Vendor/Brand     | ZTE                               |
| Model            | F6005                             |
| ODM              | CIG                               |
| ODM Product Code | [G-97CP](/ont-cig-g-97cp)         |
| Chipset          | [Realtek RTL9601D](/chipset-realtek-rtl960x) |
| Flash            | 16MB                              |
| RAM              | 32MB                              |
| System           | Linux (Luna SDK 1.9.0)            |
| 2.5GBaseT        | Yes                               |
| Optics           | SC/APC                            |
| IP address       | 192.168.1.1                       |
| Web Gui          | ✅ user `admin`, password `admin` |
| SSH              | Not enabled in stock firmware     |
| Telnet           | Not enabled in stock firmware     |
| Serial           |                                   |
| Form Factor      | ONT                               |
 
<ImageFigure file="f6005_of.jpg" alt="F6005 Open Fiber" caption="F6005 with Open Fiber branding <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" />
<ImageFigure file="f6005_tim.jpg" alt="F6005 TIM" caption="F6005 with ZTE branding, like the ones used by TIM" />
<ImageFigure file="f6005_teardown.jpg" alt="F6005 teardown" caption="F6005 teardown" />

## Serial

The ONT has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface. To accept TX line commands, the GND of the TTL adapter should be attached to the ONT's shield:

<ImageFigure file="q-010g-t_ttl.jpg" alt="ZTE F6005 TTL" caption="ZTE F6005 TTL" />

::: warning Note
Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work.
:::

## List of software versions
- V6.0.10N14 (TIM)
- V6.0.10N20 (TIM)
- V6.0.10P2N02 (OpenFiber)
- V6.0.10P2N18 (OpenFiber)
- V6.0.10P2N19 (OpenFiber)
- V6.0.10P4N03 (Fiberhost)

<!--@partial: ./_partials/ont-nokia-use.md
disableEnablePassword: true
alertUsage: "The following commands need to be executed on GponCLI via a terminal (serial, telnet or SSH). The models currently distributed in Italy by TIM and OpenFiber have no way to enter GponCLI via serial, only via telnet after flashing a custom firmware."
-->

<!--@partial: ./_partials/ont-nokia-useful-command.md-->

# Advanced settings
## Unlock serial to flash another firmware

This ONT is the twin brother of [CIG G97-CP](/ont-cig-g-97cp), if you can find its bootloader (named `CIG_bu.en_V3.09.15`), you can easly repack the firmware and enable its serial port limited to bootloader. 
You need a 3.3V SPI programmer (like a modded CH341a) to read and write back the flash.

::: info Note
This was tested only on a TIM V6.0.10N20 firmware!
:::

After getting a full dump of your ONT, here is the procedure to replace the original bootloader with CIG's to enable the serial port:

Cut old bootloader:
```sh
dd if=flash_dump.bin of=no_boot_flash_dump.bin bs=1 skip=184064
```

Attach the new one:
```sh
cat CIG_bu.en_V3.09.15 no_boot_flash_dump.bin > mod-boot_flash_dump.bin
```

Now you can flash the file `mod-boot_flash_dump.bin` back to your SPI. 

After powering up the ONT, the serial port will print this message:

```sh
**************************************
*                                    *
*  KEY -- Enter console terminal     *
*                                    *
**************************************
```

To access full U-Boot a special escape sequence is needed. 

If Tera Term is used, create a simple MACRO file that contains this code:

`send $1B $1D $0F $0B`

Configure Tera Term with the correct serial parameters (refer to **Serial** paragraph), select the created MACRO file **BEFORE** powering up the ONT but **DON'T OPEN IT NOW**, power-up the ONT and when you see the above message, quickly open the macro to reach the U-Boot prompt:

```sh
9601D#
```

::: info Note
Note that this proceedure needs to be done each time you power-cycle the ONT
:::

Now with the U-Boot prompt a custom firmware that enables TELNET can be flashed. 
Please note that if a **TIM** or **OpenFiber** base firmware is used, the TTL will be silent after kernel loading because it is disabled at kernel level.

Here is the procedure to flash a custom firmware on the ONT via the U-Boot console:

- Attach the ONT via ethernet cable to your PC and configure it to have IP **192.168.1.2**
- Launch TFTP server and place custom firmware inside its root folder renamed into `cramfs.img.crc`. Be sure that the file has this name, otherwise the upgrade procedure will stop immediately
- Run this command on U-Boot prompt:

```sh
9601D# upgdimage
start : 0x00200000 size :0x00700000
Using LUNA GMAC  device
TFTP from server 192.168.1.2; our IP address is 192.168.1.1
Filename 'cramfs.img.crc'.
Load address: 0x80400000
Loading: Got ARP REPLY, set server/gtwy eth addr (00:1c:c2:42:30:ac)
#################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         ###########################################################
done
Bytes transferred = 6582276 (647004 hex)
file size is 0x647004 from Env
RootFS CRAMFS size [0x647004] length [0x647004]
CRC32 for 80400000 ... 80a46fff ==> 382329fa
finish crc32, crc value is 0x382329fa
finish crc cmp!!!
ErasingStart: 0x200000 size:0x647004,alignment size:0x650000
Erasing 6619136 B from 00200000... 100% ~ 0084ffff/6619136 B
        [Done]
Writing 6619136 B from 80400000 to 00200000... 100% ~ 0084ffff/6619136 B
        [Done]
```

::: info Note
Please note that some OLTs (like TIM's Alcatel OLTs in Italy) need to have software image 0 or 1 set as active. So in this case, these commands will have to be executed twice to flash the image on both slots:
:::


**ImageA**:

```sh
set activeimage imagea
saveenv
``` 

And flash image with the `upgdimage`.

**ImageB**:

```sh
set activeimage imageb
saveenv
``` 

And flash image with the `upgdimage`.

This way both slots will have the same firmware version and will avoid any swap by the OLT.

After these steps, power-cycle ONT and login via Telnet with `root\admin` credentials. From this moment you can simply spoof your ONT with the usual commands.

## Change PLOAM password from the web UI

On some software versions, Password and Update Password fields are disabled and hidden even when using the admin account. They sometimes can be re-enabled via the browser's developer console by editing the HTML code and setting:

- CSS display property to show (from none)
- HTML `disabled=true` attribute to `enabled=true`

<ImageFigure file="f6005/f6005_of_change_ploam.png" alt="F6005 procedure for changing the PLOAM password" caption="F6005 procedure for changing the PLOAM password" />

This has been tested on the following firmware versions:
- V6.0.10P2N19 (OpenFiber)

## Enable SSH shell

Requires prior access via UART console or Telnet.

After a reboot, SSH will be permantly enabled with the username `root` and a password generated from the serial number, same as [CIG G97-CP](/ont-cig-g-97cp#login-and-enable).

```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>
#ONT/system/misc>ssh_en set 2 
---ATECMDRESULT--- OK
#ONT/system/misc>ssh_en get
ssh_en: 02
---ATECMDRESULT--- OK
```

This has been tested on the following firmware versions:
- V6.0.10N20 (TIM)
- V6.0.10P4N03 (Fiberhost)

# Known Bugs

The buffer size of the hardware is suboptimal: because of this the ONT is unable to work at full speed during uploads if the server is geographically and/or latency-wise far. There are no known problems if there is only one subscriber on the GPON tree. 

In versions V6.0.10N14 and V6.0.10P2N02 this problem is felt more than with newer firmware as in the new versions (V6.0.10N20, V6.0.10P2N18, V6.0.10P2N19), an attempt is made to avoid buffer filling by means of pause frames. Not all routers support pause frames and some may still suffer from problems with the latest updates.

In version V6.0.10P2N18, problems were found in download speeds with 1 Gbps links.

# Open Firmware (OpenWrt)

The ZTE F6005 can run OpenWrt via the [alphaonex86/openwrt](https://github.com/alphaonex86/openwrt) fork, which already supports the RTL9601D SoC (HSGQ X100DG) and the RTL9602C family (HSGQ X111W, VSOL V2801RGW) with a full GPON ONU port on kernel 6.18.

## Why OpenWrt over ODI-OSS

- The F6005 is a CIG/ZTE design, not an ODI board — OpenWrt's luna target fits better than the ODI-OSS tree
- RTL9601D already supported: same SoC and 32 MB RAM as the X100DG, 91% code reuse
- RTL8226B-VB 2.5GBase-T PHY: the RTL8226 mainline kernel patches are already backported, and `luna_eth.c` handles similar RTL8221B with HiSGMII
- Self-managed optics pattern: the V2801RGW board already implements `realtek,optics-self-managed` for internal BOSA — the F6005 uses the same approach
- Complete OMCI stack with panel declaration via DT
- No WiFi needed — 32 MB RAM is sufficient for a wired-only ONT

## Board support files

Three files provide the complete board definition (no driver changes needed — everything is DT-driven):

| File | Description |
| ---- | ----------- |
| `rtl9601d_f6005.dts` | Board device tree: 32 MB DDR2 with PON pool holes, CIG 16 MB dual-bank flash layout, self-managed optics, 256-entry NIC RX ring |
| `rtl9601d_f6005-omci-uni.dtsi` | OMCI panel overlay: single Ethernet UNI, HGU type (based on X100DG stock MIB) |
| `taroko.mk` (zte_f6005 device) | Image profile: kernel 2240K + rootfs 4800K inside Image A (7 MB), Image B preserved for stock recovery |

### Flash layout (inside 16 MB SPI-NOR)

| Partition | Offset | Size | Description |
| --------- | ------ | ---- | ----------- |
| boot | 0x000000 | 192K | CIG bootloader (CIG_bu.en_V3.09.15) |
| env | 0x030000 | 64K | U-Boot environment (`activeimage` selects bank) |
| config | 0x040000 | ~1.75M | Factory data: GPON SN, MAC address |
| k0 | 0x200000 | 2240K | OpenWrt kernel (Image A area) |
| r0 | 0x430000 | 4800K | OpenWrt rootfs + rootfs_data |
| crashlog | 0x8E0000 | 128K | Kernel crash log (mtdoops) |
| imageb | 0x900000 | 7M | Stock Image B (recovery, read-only) |

### Bring-up procedure

Initial bring-up uses TFTP + bootm (no flash write):

1. Access U-Boot via serial console (CIG bootloader escape sequence: `$1B $1D $0F $0B`)
2. Set up TFTP: PC at 192.168.1.2, ONT at 192.168.1.1
3. Load uImage via TFTP and boot from RAM:
```
9601D# tftpboot 0x80400000 openwrt-realtek-luna-taroko-zte_f6005-initramfs-kernel.bin
9601D# bootm 0x80400000
```

For persistent flash install, the CIG bootloader expects cramfs at the active image offset — a cramfs wrapper is needed (not yet implemented).

### TODO items (require hardware measurement)

- **GPIO pads for pon-optics**: read the stock firmware's `device_api` gpio_pads to get `realtek,gpio-pads` values. Without them the PON analog front end may not initialise correctly and the ONU will not range.
- **WAN MAC offset**: verify from this board's stock `nas0_0` MAC address (X100DG uses +1, V2801RGW uses +5)
- **LED indices**: read `pon-led`, `los-led`, `port-leds` from the stock firmware's LED init (current values are from the X100DG and are likely wrong)
- **Memory map**: verify PON pool base addresses (MSTBASE_DS/US) from the F6005's own live registers
- **OMCI panel**: capture a gpon-oracle from a stock F6005 at O5 and run `omci_panel.py` to get the board's own OMCI MIB (CIG's panel may differ from X100DG's)

