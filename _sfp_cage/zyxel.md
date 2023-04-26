---
title: Zyxel EX5601-T0 Router
has_children: false
alias: EX5601-T0
layout: default
---

# Hardware Specifications

|          | EX5601-T0                                          |
| -------- | ---------------------------------------------------|
| Vendor   | Zyxel                                              |
| Model    | EX5601-T0                                          |
| Soc      | MT7986a (filogic 830)                              |
| Ram      | 1G                                                 |
| SFP      | 1 HSGMII capable sfp port [^xor]                   |
| Ethernet | 3 1GbE, 1 2.5GbE lan port, 1 2,5Gbe wan port[^xor] |
| XGMII    | No                                                 |
| HSGMII   | ✅                                                |
| SGMII    | ✅                                                |
| Type     | Router                                             |

# Partition Table

| dev  | size     | erasesize | name          |
| ---- | -------- | --------- | ------------- |
| mtd0 | 20000000 | 00040000  | "spi0.1"      |
| mtd1 | 00100000 | 00040000  | "BL2"         |
| mtd2 | 00080000 | 00040000  | "u-boot-env"  |
| mtd3 | 00200000 | 00040000  | "Factory"     |
| mtd4 | 001c0000 | 00040000  | "FIP"         |
| mtd5 | 00040000 | 00040000  | "zloader"     |
| mtd6 | 04000000 | 00040000  | "ubi"         |
| mtd7 | 04000000 | 00040000  | "ubi2"        |
| mtd8 | 15a80000 | 00040000  | "zyubi"       |

This router has 2 slots for firmware flashing, ubi and ubi2

To check from which partition we are booting you can issue the following command:
```sh
cat /proc/cmdline
```
The result will be something like the following:
```
console=ttyS0,115200n1 loglevel=8 earlycon=uart8250,mmio32,0x11002000 rootubi=ubi
```
If rootubi=ubi it means that we are booting the image on partition mtd6

If rootubi=ubi2 it means that we are booting the image on partition mtd7

{% include alert.html content="When you flash a new firmware via the web interface the router will automatically write the new firmware in the inactive partition, hence if the firmware upgrade is successfull it will automatically swap the boot partition at next reboot. If everything is ok you don't have to manually swap partitions" alert="Info" icon="svg-info" color="blue" %}

# Flashing a no-brand firmware or firmware downgrade.

1. access via ssh to the router with admin user (admin password is printed on the back of the router)
2. Disable firmware version and modelcheck by running the following commands
```
zycli fwidcheck off
zycli modelcheck off
```
3. You can close the ssh console, do not reboot the router
4. Open the router web interface and in the maintenance/firmware upgrade section select the "Restore Default Settings After Firmware Upgrade" option.
5. Select choose file to select the firmware file you want to upload and click Upload.
6. The router will automatically reboot and should get back up on 192.168.1.1

# FW No-Brand Version V5.70(ACDZ.0)C0 compiled from Zyxel provided OpenSource package.
The following is a firmware compiled starting from Zyxel provided OpenSource package under GPL license.

- [source GPL package V5.70(ACDZ.0)C0](https://github.com/ErnyTech/zyxel-ex5601t0)


--- Use at your own risk!!!! ---

- [Firmware image No-Brand Version V5.70(ACDZ.0)C0](https://mega.nz/file/7FZlWTzQ#F8Q_whoW4h1ETRUAzHe4PXIiK6TVj7uay_OtZxfmR6k)

--- Use at your own risk!!!! ---

The firmware contains the following modifications too:

1. Added start-up script to reset and enable root access via ssh with password "passwd". Do not try to reset the root password because that will last until next reboot.
2. the /bin path contains sfp_wan.sh_wind and check_sfp_link.sh_wind scripts which are very similar to the standard sfp_wan.sh and check_sfp_link.sh scripts. If everything works with the original ones do not swap them. If you wan to allow 2.5gbit hsgmii with afm0003 and ma5671a you need to swap and enable the "_wind" scripts.

# Miscellaneous Links

- [Rollback SFP Zyxel con il W3 HUB per risolvere il problema dell'upload cappato](https://forum.fibra.click/d/36541-rollback-sfp-zyxel-con-il-w3-hub-per-risolvere-il-problema-dellupload-cappato)


---

[^xor]: the WAN Eth and WAN SFP ports are in XOR, i.e. either one or the other.
