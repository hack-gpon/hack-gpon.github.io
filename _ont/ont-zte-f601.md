---
title: ZTE F601 
has_children: false
layout: default
parent: ZTE
---

# Hardware Specifications

|              |                                                                                    |                                                                                    |             |                           |
| ------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------- | ------------------------- |
| Vendor/Brand | ZTE                                                                                | ZTE                                                                                | ZTE         | ZTE                       |
| Model        | F601v6                                                                             | F601v7                                                                             | F601v8      | F601v9                    |
| ODM          | ✅                                                                                 | ✅                                                                                 |             | ✅                        |
| CPU          | ZTE FA626TE                                                                        | ZTE ZX279125@A9                                                                    |             | ZX279127S                 |
| CPU Clock    | 266 MHz                                                                            | 600 MHz                                                                            |             |                           |
| Chipset      | ZTE FA626TE                                                                        | ZTE ZX279125@A9                                                                    |             |                           |
| Flash        | 16 MB (SPI Flash w25q128)                                                          | 16 MB (SPI Flash mx25l12805d)                                                      |             | ZX279127S                 |
| RAM          | 64 MB                                                                              | 32 MB                                                                              |             | 128 MB (ESMT M15T1G1664A) |
| System       |                                                                                    |                                                                                    |             |                           |
| 2.5GBaseT    | No                                                                                 | No                                                                                 | No          | No                        |
| Optics       | SC/APC or SC/UPC                                                                   | SC/APC                                                                             | SC/APC      | SC/APC                    |
| IP address   | 192.168.1.1                                                                        | 192.168.1.1                                                                        | 192.168.1.1 |                           |
| Web Gui      | ✅ user `admin`, password `admin` or user `user`, password `user`                  | ✅ user `admin`, password `admin` or user `user`, password `user`                  |             |                           |
| SSH          |                                                                                    |                                                                                    |             |                           |
| Telnet       | ✅ [^1]                                                                            | ✅ [^2]                                                                            |             |                           |
| Serial       | ✅                                                                                 | ✅                                                                                 |             |                           |
| Form Factor  | ONT                                                                                | ONT                                                                                | ONT         | ONT                       |

{% include image.html file="f601_v6_1.jpg" alt="F601 v6" caption="F601 v6" %}
{% include image.html file="f601_v7.jpg" alt="F601 v7" caption="A wall made out of broken F601 v7" %}
{% include image.html file="f601v9/front.jpg" alt="F601 v9" caption="F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}

## List of software versions
### HW V6.0 
- V6.0.10P6T1 (OpenFiber) 
- V6.0.10P6T4 (OpenFiber)
- V6.0.10P6N7 (OpenFiber)
- V6.0.10N40 (TIM Italy)
- V6.0.10P3T1 (Generic)
- V6.0.10P1T26 (Generic)

### HW V7.0
- V7.0.10P6N7 (OpenFiber)
- V7.0.10P6T4 (Generic)

### HW V9.0
- V9.0.10P2N1 (OpenFiber)

## List of partitions 

### HW V6.0 and V7.0

| dev  | size     | erasesize | name             |
| ---- | -------- | --------- | ---------------- |
| mtd0 | 01000000 | 00010000  | "whole flash"    |
| mtd1 | 00080000 | 00010000  | "uboot"          |
| mtd2 | 00700000 | 00010000  | "kernel0"        |
| mtd3 | 00700000 | 00010000  | "kernel1"        |
| mtd4 | 00010000 | 00010000  | "others"         |
| mtd5 | 00010000 | 00010000  | "parameter tags" |
| mtd6 | 00160000 | 00010000  | "usercfg"        |


This ONT supports dual boot, as visible from the presence of `kernel0` and `kernel1`, which contain the rootfs.
The boot image can be swapped with the following command:

```sh
upgradetest switchver X
```

Where `X` can be `0/1` based on the image you want to boot.


You can also clone currently running image into other slot using this command:

```sh
syn_version
```

# Use
{% include alert.html content="Commands have been tested on V6/V7 HW rev on TIM and OF firmware" alert="Note"  icon="svg-info" color="blue" %}

## Enable Telnet
{% include alert.html content="This is an external script ([ZTE Telnet enabled](https://github.com/douniwan5788/zte_modem_tools)), so use at your own risk! Credential doesn't survive at reboot!" alert="Note"  icon="svg-info" color="blue" %}

{% include alert.html content="For Italian users, it only works on versions V6.0.10N40 (TIM) and V6.0.10P6N7 (OpenFiber)" alert="Note"  icon="svg-info" color="blue" %}

```sh
python3 zte_factroymode.py --user admin --pass admin --ip 192.168.1.1 --port 80 telnet open
```

You should get this output and credentials to login over telnet:

```sh
trying  user:"admin" pass:"admin"
reset facTelnetSteps:
reset OK!

facStep 1:
OK!

facStep 2:
OK!

facStep 3:
OK!

facStep 4:
OK!

facStep 5:
OK!

done
Username: 2W3iqFVt
Password: Eqb8X8Qt
```

## Enable console redirection

To see omcidebug messages on Telnet you need to perform this command (just first time of each connection):

```sh
redir printf
```

# GPON ONU status

## Get the operational status of the ONU

To see the connection state use the following command:
```
gpontest -gstate
```
`[gpontest] gpon state is [O5]` for O5 state

## Get information of the OLT vendor

```sh
sendcmd 132 omcidebug showmedata 131
```

This command will print out the result like this one:

```sh
##################################
MIB INFO:
         ME CLASS: 131
         DB NAME: olt_g, DBHandle: 32
##################################

<-----MeID[ 0x0000,0 ], Addr[ 0x19a2b1]----->
         Vendorid:48 57 54 43
      EquipmentID:00 00 00 00 00 00 00 00 00 00
                    00 00 00 00 00 00 00 00 00 00
          Version:31 30 00 00 00 00 00 00 00 00
                    00 00 00 00
        TimeofDay:00 00 00 00 00 00 00 00 00 00
                    00 00 00 00
---------------------------------------------------------------------
```

## Querying a particular OMCI ME

```sh
sendcmd 132 omcidebug showmedata ID_MIB (eg. 7 for Firmware version)
```

This command will print out the result like this one:

```sh

##################################
MIB INFO:
         ME CLASS: 7
         DB NAME: soft_image, DBHandle: 14
##################################

<-----MeID[ 0x0000,0 ], Addr[ 0x19a011]----->
          Version:V6.0.10N41
     Is committed:01
        Is active:01
         Is valid:01

<-----MeID[ 0x0001,1 ], Addr[ 0x19a031]----->
          Version:V6.0.10N39
     Is committed:00
        Is active:00
         Is valid:01
---------------------------------------------------------------------
```

# GPON/OMCI settings

## Setting ONU GPON Serial Number

{% include alert.html content="You have to change S/N and the VID. 2176 is for the VID (first 4 letters of the S/N) and 2177 is for the last 8 digits" alert="Note"  icon="svg-info" color="blue" %}
```sh
setmac 1 2176 ZTEG
setmac 1 2177 AABBCCDD
```

## Setting ONU GPON PLOAM password

{% include alert.html content="The PLOAM password is stored in the ASCII format." alert="Note"  icon="svg-info" color="blue" %}
This can be done easily via web ui. If you prefer to do it via the shell use:
```sh
setmac 1 2181 1234567890
setmac 1 2178 1234567890
```

## Change ONU HW\SW Version and Permanent TELNET 

{% include alert.html content="The only way to change HW\SWVer on this ONT is to modify the firmware, so do it at your own risk" alert="Note"  icon="svg-info" color="blue" %}
{% include alert.html content="This procedure was only tested on TIM V6.0.10N40 and OF V6.0.10P6N7 firmwares" alert="Note"  icon="svg-info" color="blue" %}

Needed tools:

- Linux VM or WSL with Python >3.3
- [ZTE Telnet enabled](https://github.com/douniwan5788/zte_modem_tools)
- [ZTE Firmware Mod Script](http://github.com/hack-gpon/ZTE-firmware-mod)
- TFTP server

Download the script `ZTE_Firmware_Mod_v1.py` and place in the same folder where you have the `kernel0` or `kernel1` mtd dump taken from step `**Backup ONT Paritions for HW\SW Version Mod**`.

Run the script with the following parameters, you can use `-h` for help. In this example we are just replace firmware version with `V6.0.10N40`. You can put your own version here, maximium 15 characters, this parameter is mandatory:

If you have create partition dump with different name, please put the correct name instead of `kernel0`

```sh
python3 ZTE_Firmware_Mod_v1.py kernel0 V6.0.10N40 fw_mod.bin
```

The script will output the following messages, ending with instruction on how to install the created patched firmware:

```sh
---------------------------------------
This script is currently working only for ZTE F601v6 shipped with TIM (V6.0.10N40) or OpenFiber (V6.0.10P6N7) firmware
All other versions were not tested, USE IT AT YOUR OWN RISK!
Before proceed make sure to have a GOOD BACKUP of all your ONT partitions.
Please refer to Hack-GPON Wiki for how-to: https://hack-gpon.github.io/ont-zte-f601/
---------------------------------------
To proceed please enter 'y', otherwise 'n' to exit: y

---------------------------------------
Step 1: Patching zImage and fix uImage Header..
------: Done in 4.846 secs
Step 2: Add back ZTE Header and Firmware Version..
------: Old FW version V6.0.10N39
------: New FW version V6.0.10N40
------: Done in 0.008 secs
Step 3: Write firmware file..
------: Done in 0.003 secs

---------------------------------------
How to flash:

Copy firmware file fw_mod.bin into your TFTP server and flash is using this procedure on the ONT over telnet:

cd /var/tmp
tftp -l fw.bin -r fw_mod.bin 192.168.1.100 -g
fw_flashing -d 0 -r 0 -c 1 -f fw.bin

After you get prompt back, erase old configurations:

rm /userconfig/cfg/*.xml

Create dummy files for HW\SWVer spoofing:
!!! CHANGE IT BASED ON YOUR ORIGINAL ONT !!!
echo V6.0 > /userconfig/cfg/hwver
echo V6.0.10N40 > /userconfig/cfg/swver

Then run these commands to switch software bank and reboot the ONT:

upgradetest switchver
reboot
---------------------------------------
Good luck!
```

**Two last steps!**

If you are swapping from TIM to OpenFiber Firmware, or viceversa, before reboot the ONT you have to run these two command based on the firmware version:

From **OpenFiber V6.0.10P6N7** to **TIM V6.0.10N40**: `upgradetest sfactoryconf 97`

From **TIM V6.0.10N40** to **OpenFiber V6.0.10P6N7**: `upgradetest sfactoryconf 116`

After the ONT is reboot and you can access again, you can enable TELNET on each reboot, to do this, run again `zte_factroymode.py` to open new session to it. When you are in, execute these commands:

```sh
sendcmd 1 DB set TelnetCfg 0 TS_Enable 1
sendcmd 1 DB set TelnetCfg 0 Lan_Enable 1
sendcmd 1 DB set TelnetCfg 0 TS_UName root
sendcmd 1 DB set TelnetCfg 0 TS_UPwd root
sendcmd 1 DB addr FWSC 0
sendcmd 1 DB set FWSC 0 ViewName IGD.FWSc.FWSC1
sendcmd 1 DB set FWSC 0 Enable 1
sendcmd 1 DB set FWSC 0 INCName LAN
sendcmd 1 DB set FWSC 0 INCViewName IGD.LD1
sendcmd 1 DB set FWSC 0 Servise 8
sendcmd 1 DB set FWSC 0 FilterTarget 1
sendcmd 1 DB saveasy
```

Reboot the ONT and TELNET will be already opened and you can logon with `root\root` credentials.

**Just for OpenFiber firmware**

In case you want add new admin instead of using embedded credentials, before rebooting the ONT run these commands:

```sh
sendcmd 1 DB set DevAuthInfo 5 Enable 1
sendcmd 1 DB set DevAuthInfo 5 User superadmin
sendcmd 1 DB set DevAuthInfo 5 Pass superadmin
sendcmd 1 DB set DevAuthInfo 5 Level 0
sendcmd 1 DB set DevAuthInfo 5 AppID 1
sendcmd 1 DB saveasy
```
Reboot the ONT and you can logon on the WebUI using `superadmin\superadmin` credentials with full unlocked menus.

# Advanced settings

## Backup ONT Paritions for HW\SW Version Mod

This step is suggested if you want to replace firmware on your ONT to spoof HW and SW version:

Needed tools:

- Linux VM or WSL with Python >3.3
- [ZTE Telnet enabled](https://github.com/douniwan5788/zte_modem_tools)
- [ZTE_Firmware_Mod](http://tbd)
- TFTP server

First step is to login over telnet with `zte_factroymode.py` then execute ALL this command for a full backup:

**Go to `/tmp` folder to create tmp files**

```sh
cd /tmp
```

**Dump mtd1 (uboot+config)**

```sh
 cat /dev/mtd1 > uboot_config
```

Copy the dumped firmware via TFTP to you VM or Windows machine with this commnad:

```sh
tftp -l uboot_config -r uboot_config -p 192.168.1.X (where X is the IP of your PC)
```

Delete dump

```sh
 rm uboot_config
```

**Dump mtd2 (kernel0)**

```sh
 cat /dev/mtd2 > kernel0
```

Copy the dumped firmware via TFTP to you VM or Windows machine with this commnad:

```sh
tftp -l kernel0 -r kernel0 -p 192.168.1.X (where X is the IP of your PC)
```

Delete dump

```sh
 rm kernel0
```

**Dump mtd3 (kernel1)**

```sh
 cat /dev/mtd3 > kernel1
```

Copy the dumped firmware via TFTP to you VM or Windows machine with this commnad:

```sh
tftp -l kernel1 -r kernel1 -p 192.168.1.X (where X is the IP of your PC)
```

Delete dump

```sh
 rm kernel1
```

**Dump mtd4 (others)**

```sh
 cat /dev/mtd4 > others
```

Copy the dumped firmware via TFTP to you VM or Windows machine with this commnad:

```sh
tftp -l others -r others -p 192.168.1.X (where X is the IP of your PC)
```

Delete dump

```sh
 rm others
```

**Dump mtd5 (param_tags)**

```sh
 cat /dev/mtd5 > param_tags
```

Copy the dumped firmware via TFTP to you VM or Windows machine with this commnad:

```sh
tftp -l param_tags -r param_tags -p 192.168.1.X (where X is the IP of your PC)
```

Delete dump

```sh
 rm param_tags
```

**Dump mtd6 (usercfg)**

```sh
 cat /dev/mtd6 > usercfg
```

Copy the dumped firmware via TFTP to you VM or Windows machine with this commnad:

```sh
tftp -l usercfg -r usercfg -p 192.168.1.X (where X is the IP of your PC)
```

Delete dump

```sh
 rm usercfg
```

## Change region code

{% include alert.html content="Looks like TIM and OF firmwares work only with their stock factory conf, so 97 or 116, otherwise no PPPoE" alert="Note"  icon="svg-info" color="blue" %}

ZTE has create various region code that loads default valuse based on local ISP, this configuration can be changed using this command:

```sh
upgradetest sfactoryconf X
```

Where X is the number of supported regioncode into file `/etc/init.d/regioncode`, here is an example from TIM `V6.0.10N40` firmware:

```sh
# cat /etc/init.d/regioncode
2:Lithuania
15:Portugal
17:TelMex
19:Turkey
32:JazzTel
38:Czechia
54:Viettel
59:SeteTec
63:Ais
88:GerNetCologne
97:ItalyTI
104:IndiaRJIO
110:IndiaGTPL
112:BrazilTIM
115:ItalyOpenFiber
116:ItalyTescali
118:PolandINEA
139:MultiLaser
198:Manufacture
```

# Random notes
- F601v6/v7 read the software version exposed thru gpon_omci deamon from each kernel partition's header, so only way to spoof this parameter is to change the version in the header and recalculate CRC, otherwise bootloader refuse to load image
- F601v6 from TIM line use HWVer `VDF`, this can be changed back to `V6.0` issuing this command on telnet session: `setmac 1 32770 3`
- The F601v7 is mounted 'upside down' to save on waveguides, the LEDs would be on the bottom of the PCB, so it would have to be turned upside down to make it cooler...
- The F601v6 turns on and runs even with 9V input
- The F601v7 turns on and runs even with 5V input

# Miscellaneous Links

- [ZTE config.bin decoder](https://github.com/mkst/zte-config-utility)
- [Usource GPON ONU STICK](https://www.usourcetech.com/web/userfiles/download/GPONSTICKSFPCLASSB-2B_Rev01.pdf)
- [GPON module Dfp-34g-2c2 sfp](https://forum.openwrt.org/t/gpon-module-dfp-34g-2c2-sfp/51641)
- [ZTE Telnet enabled](https://github.com/douniwan5788/zte_modem_tools)

# Theardown and other photos

## HW V6.0

{% include image.html file="f601_v6_2.jpg"  alt="Bottom of the F601 v6" caption="Bottom of the F601 v6 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v6_teardown_1.jpg"  alt="Teardown of the F601 v6" caption="Teardown of the F601 v6  <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v6_teardown_2.jpg"  alt="Teardown of the F601 v6" caption="Teardown of the F601 v6 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v6_teardown_3.jpg"  alt="Teardown of the F601 v6" caption="Teardown of the F601 v6 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}

## HW V7.0

{% include image.html file="f601_v7_1.jpg"  alt="Bottom of the F601 v7" caption="Bottom of the F601 v6 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown.jpg"  alt="Bottom of the F601 v7" caption="Teardown of the F601 v7 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown_1.jpg"  alt="Teardown of the F601 v7" caption="Teardown of the F601 v7  <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown_2.jpg"  alt="Teardown of the F601 v7" caption="Teardown of the F601 v7 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown_3.jpg"  alt="Teardown of the F601 v7" caption="Teardown of the F601 v7 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}
{% include image.html file="f601_v7_teardown_4.jpg"  alt="Teardown of the F601 v7" caption="Teardown of the F601 v7 <a href='https://forum.fibra.click/u/LATIITAY'>@LATIITAY</a>" %}

## HW V9.0

{% include image.html file="f601v9/front.jpg"  alt="Front of the F601 v9" caption="Bottom of the F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f601v9/back.jpg"  alt="Bottom of the F601 v9" caption="Bottom of the F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f601v9/teardown-1.jpg"  alt="Teardown of the F601 v9" caption="Teardown of the F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f601v9/teardown-2.jpg"  alt="Teardown of the F601 v9" caption="Teardown of the F601 v9  <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}
{% include image.html file="f601v9/teardown-3.jpg"  alt="Teardown of the F601 v9" caption="Teardown of the F601 v9 <a href='https://forum.fibra.click/u/mirko991'>@mirko991</a>" %}

---

[^1]: If you flash a modified firmware (only HWVer V6.0 at the moment), you can permanent enable TELNET to avoid run each time the `zte_factory.py` script.
[^2]: Credentials are random generated by zte_factroymode.py, don't survive at reboot