---
title: FS Modded Firmware for Huawei MA5671A and FS.com GPON-ONU-34-20BI
has_children: false
parent: Huawei MA5671A
layout: default
---

{% include alert.html content="The following wiki is only compatible with version 5 or later!" alert="Note"  icon="svg-warning" color="red" %}

# Flashing the firmware

Flash the firmware image to image0 or image1 via [SSH](/ont-huawei-ma5671a/#flashing-a-new-rootfs-via-ssh) or via [TTL serial](/ont-huawei-ma5671a-ymodem) as usual.

After flashing, it is absolutely necessary to connect to the SFP via telnet using the IP 192.168.1.10:

```sh
telnet 192.168.1.10
```

Once connected via telnet to the SFP, execute the following commands. Then wait a few minutes until the end of the automatic procedure:

```sh
firstboot
reboot
```

Performing the procedure described above is necessary after each flash of this firmware, otherwise the SFP will not work!

# Login info

|                    |                                                |
| ------------------ | ---------------------------------------------- |
| Username           | root                                           |
| Password           | root                                           |
| IP address	     | 192.168.1.10                                   |
| Telnet    	     | Always available                               |
| TTL Serial 	     | Always available                               |
| SSH       	     | Only after the first configuration (firstboot) |
| Web       	     | NO                                             |

# GPON ONU status

## Getting the operational status of the ONU
```sh
onu ploam_state_get
```

## Getting optical laser status
```sh
otop -g s
```

## Getting information of the OLT vendor
```sh
omci_pipe.sh meg 131 0
```

## Querying a particular OMCI ME
```sh
omci_pipe.sh meg MIB_IDX ME_IN
```
Where `MIB_IDX` is the MIB ID and `ME_IN` is the ME instance number.

## Getting VLAN table rule
```sh
gtop -g "GPE VLAN rule"
```

## Getting GEM port status table
```sh
gtop -g e
```

## Getting/Setting Speed LAN Mode

To get the LAN Mode:

```sh
onu lan_port_status_get 0
```
The `link_status` variable tells the current speed:

| Value (for `sgmii_mode` and `link_status`) | Speed                              |
| ------------------------------------------ | ---------------------------------- |
| 3                                          | 1 Gbps / SGMII with auto-neg on    |
| 4                                          | 1 Gbps / SGMII with auto-neg off   |
| 5                                          | 2.5 Gbps / HSGMII with auto-neg on |

To change the default lan mode value you can use `fw_setenv sgmii_mode`. The firmware is already set to 2.5G auto-negotiation, you shouldn't touch it.

# GPON/OMCI settings

## Setting ONU GPON Serial Number
```sh
fw_setenv onu_serial "YOUR_SERIAL_ASCII"
```

## Setting ONU GPON PLOAM password
```sh
fw_setenv onu_ploam "YOUR_PLOAM_ASCII"
```

{% include alert.html content="If your ploam is in HEX convert it to ASCII, any non-printable characters write them in HEX with a slash in front, such as `\7F`. If the PLOAM is less than 10 bytes (one printable character counts as one byte, `\7F` also counts as one byte) add `\00` to the end to get to 10 bytes." alert="Note" icon="svg-info" color="blue" %}

## Setting ONU GPON LOID
```sh
fw_setenv onu_loid "YOUR_LOID"
```

## Setting ONU GPON LOID password
```sh
fw_setenv onu_loid_password "YOUR_LOID_PASSWORD"
```

## Setting OMCI vendor ID (ME 256)
```sh
fw_setenv omci_vendor_id "YOUR_VENDOR_ID"
```

## Setting OMCI equipment ID (ME 257)
```sh
fw_setenv omci_equip_id "YOUR_EQUIP_ID"
```

## Setting OMCI hardware version (ME 256)
```sh
fw_setenv omci_hw_ver "YOUR_HW_VER"
```

## Setting OMCI software version (ME 7)
```sh
fw_setenv image0_version "YOUR_SW_VERSION_0"
fw_setenv image1_version "YOUR_SW_VERSION_1"
```

# Advanced settings

{% include alert.html content="Changing these is normally not necessary and not changing them is a good idea" alert="Note"  icon="svg-warning" color="red" %}

## Setting custom OMCI MIB file

Copy the MIB file to /etc/mibs, then run this command:

```sh
fw_setenv mib_file_custom "YOUR_MIB_FILENAME"
```

## Setting management IP
```sh
fw_setenv ipaddr www.xxx.yyy.zzz
```

## Restore SFP to default config
```sh
firstboot
reboot
```

# SFP EEPROM settings

{% include alert.html content="Changing these is normally not necessary and not changing them is a good idea" alert="Note"  icon="svg-warning" color="red" %}

## Setting SFP vendor name
```sh
fw_setenv sfp_vendor_name "YOUR_SFP_VENDOR_NAME"
```

## Setting SFP part name
```sh
fw_setenv sfp_part_name "YOUR_SFP_PART_NAME"
```

## Setting SFP vendor revision
```sh
fw_setenv sfp_vendor_rev "YOUR_SFP_VENDOR_REV"
```

## Setting SFP part serial
```sh
fw_setenv sfp_part_serial "YOUR_SFP_PART_SERIAL"
```

## Setting SFP manufacturing date code
```sh
fw_setenv sfp_date_code "YOUR_SFP_DATE_CODE"
```

## Setting SFP vendor data
```sh
fw_setenv sfp_vendor_data "YOUR_SFP_VENDOR_DATA"
```

# List of firmwares and files
- [6BA1896SPLQA42_MODDED_ver5-1.img](https://mega.nz/file/5tNwFC5A#aXOlrZgLZ6sL81CKDOoBmXotLqDTJLQzpvokYU--bz0){: .btn } md5hash: c4f1bbe1695803d3d449f911f43d78ea
- [6BA1896SPLQA42_MODDED_ver4.img](https://mega.nz/file/Q4dFTBqQ#L8N7kPZtSJ7FtbtxRcnxNF-W3b9wDbCeJ82YgnK7moQ){: .btn } md5hash: 63b0cc790c0087a5a1197c89b502b002
- [6BA1896SPLQA42_MODDED_ver3.img](https://mega.nz/file/YkMwHSgR#7Sdk0LIBv3hLQJKQ4TBub4ABtwYyCAdP6Rl2C3RBztw){: .btn } md5hash: 90348ff0ccaad475cf14d9d0a056cf72
