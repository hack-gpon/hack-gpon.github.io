---
title: ZTE F6645P 
has_children: false
layout: default
parent: ZTE
---

# Hardware Specifications

|              |                               |
| ------------ | ----------------------------- |
| Vendor/Brand | ZTE                           |
| Model        | F6645P                        |
| ODM          | ✅                            |
| CPU          | ZTE                           |
| CPU Clock    | 266 MHz                       |
| Chipset      | ZTE                           |
| Flash        | 130 MB Kioxia TC58BVG0S3HTAI0 |
| RAM          | 315 MB                        |
| System       |                               |
| 2.5GBaseT    | Yes                           |
| Optics       | SC/APC or SC/UPC              |
| IP address   | 192.168.1.1                   |
| Web Gui      | Random password               |
| SSH          |                               |
| Telnet       | ✅ [^1]                       |
| Serial       | Only RX                       |
| Form Factor  | ONT                           |

## List of partitions 

| dev  | size     | erasesize | name             |
| ---- | -------- | --------- | ---------------- |
| mtd0 | 08000000 | 00020000  | "whole flash"    |
| mtd1 | 00200000 | 00020000  | "u-boot"         |
| mtd2 | 00400000 | 00020000  | "others"         |
| mtd3 | 00400000 | 00020000  | "parameter tags" |
| mtd4 | 00400000 | 00020000  | "wlan"           |
| mtd5 | 00800000 | 00020000  | "usercfg"        |
| mtd6 | 00400000 | 00020000  | "Plugin"         |
| mtd7 | 02a00000 | 00020000  | "kernel1"        |
| mtd8 | 02a00000 | 00020000  | "kernel2"        |
| mtd9 | 029e0000 | 00020000  | "rootfs"         |



This ONT supports dual boot, as visible from the presence of `kernel0` and `kernel1`, which contain the rootfs.
The boot images can be swapped with the following command:

```sh
upgradetest switchver X
```

Where `X` can be `0/1`, based on the image you want to boot from.


You can also clone the currently running image into the other slot using this command:

```sh
syn_version
```

# Use

## Enable Telnet
{% include alert.html content="This is an external script ([ZTE Telnet enabler](https://github.com/douniwan5788/zte_modem_tools)), use at your own risk! Credentials don't survive at reboot!" alert="Note"  icon="svg-info" color="blue" %}

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

To see omcidebug messages on telnet, execute this command (just the first time of each connection):

```sh
redir printf
```

# GPON ONU status

## Getting the operational status of the ONU

To check the connection status, use the following command:
```
gpontest -gstate
```
`[gpontest] gpon state is [O5]` for O5 state

## Getting  OLT vendor information

```sh
sendcmd 132 omcidebug showmedata 131
```

This command will print the following output:

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

This command will print the following output:

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

{% include alert.html content="Both S/N and VID have to be changed. 2176 is for the VID (first 4 letters of the S/N) and 2177 is for the last 8 digits of the S/N" alert="Note"  icon="svg-info" color="blue" %}
```sh
setmac 1 2176 ZTEG
setmac 1 2177 AABBCCDD
```

## Setting ONU GPON PLOAM password

{% include alert.html content="The PLOAM password is stored in the ASCII format." alert="Note"  icon="svg-info" color="blue" %}
This can be done easily via the web UI. To do it via the shell use:
```sh
setmac 1 2181 1234567890
setmac 1 2178 1234567890
```


# Miscellaneous Links

- [ZTE Telnet enabled](https://github.com/douniwan5788/zte_modem_tools)

---

[^2]: Credentials are randomly generated by zte_factroymode.py, they are not persistent and will change at reboot.