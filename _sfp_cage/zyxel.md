---
title: Zyxel Router
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
| SFP      | 1 HSGMII capable sfp port[^xor]                    |
| Ethernet | 3 1GbE, 1 2.5GbE LAN port, 1 2.5GbE WAN port[^xor] |
| XGMII    | No                                                 |
| HSGMII   | ✅                                                |
| SGMII    | ✅                                                |
| Type     | Router                                             |

# Zyxel EX5601-T0
## List of partitions

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

This router supports dual boot, and has two partitions for the firmware, `ubi` and `ubi2`

To check the current active partition you can use the following command:
```sh
cat /proc/cmdline
```
The result will be something like the following:
```
console=ttyS0,115200n1 loglevel=8 earlycon=uart8250,mmio32,0x11002000 rootubi=ubi
```
If `rootubi=ubi` it means that the active partition is `mtd6`

If `rootubi=ubi2` it means that the active partition is `mtd7`

{% include alert.html content="When you flash a new firmware via the web interface the router will automatically write the new firmware in the inactive partition, hence if the firmware upgrade is successfull it will automatically swap the boot partition at next reboot. If everything is ok you don't have to manually swap partitions" alert="Info" icon="svg-info" color="blue" %}

# Flashing a firmware or firmware downgrade

{% include alert.html content="The following procedure is provided as-is and if anything goes wrong you will likely need to open the router case and attach a USB serial adapter to the router to recover it.
This community is not responsible of any damage you cause by following these procedures." alert="Warning" icon="svg-warning" color="red" %}

1. access via ssh to the router with admin user (admin password is printed on the back of the router)
2. Disable firmware version check and model check by running the following commands
```
zycli fwidcheck off
zycli modelcheck off
```
3. You can close the ssh console, do not reboot the router
4. Open the router web interface and in the maintenance/firmware upgrade section select the "Restore Default Settings After Firmware Upgrade" option.
5. Select choose file to select the firmware file you want to upload and click Upload.
6. The router will automatically reboot and should get back up on 192.168.1.1

# Firmware Version V5.70(ACDZ.0)C0 no-brand

Here is a no-brand firmware compiled starting from Zyxel provided OpenSource package under GPL license (link at the bottom of this page) plus the following modifications that you can track on the following repo:
https://github.com/pameruoso/zyxel-ex5601t0

1. Added start-up script to reset and enable root access via ssh.
The script reads the device serial number and resets the root password with that. Do not try to reset the root password because that will last until next reboot.
2. the `/bin` path contains `sfp_wan.sh_wind` and `check_sfp_link.sh_wind` scripts which are very similar to the standard `sfp_wan.sh` and `check_sfp_link.sh` scripts. If everything works with the original ones do not swap them. If you want to allow 2.5gbit HSGMII with AFM0003 sfp stick you need to swap and enable the `_wind` scripts.
3. Additional packages installed: `mtr`, `htop`, `openvpn`, `wireguard`.

{% include alert.html content="The openvpn and wireguard functionalities will not be directly usable in the Zyxel web interface, they are not supported. If you want to setup a vpn with openvpn or wireguard you must know how to use the command-line and do your own setup" alert="Info" icon="svg-info" color="blue" %}

{% include alert.html content="Do not try to install packages directly from the internet with opkg update/install, the default repositories are not working and most likely if you edit them you'll end up breaking the partition overlay" alert="Warning" icon="svg-warning" color="red" %}

- [Firmware Version V5.70(ACDZ.0)C0_no-brand_pa_0.1](https://mega.nz/file/OJxBCKqR#z31OiJwY6_iaDtj_yrOTrx1oKnFEdnm4Rh0pi3wRtoE)



# Miscellaneous Links

- [Zyxel source GPL package V5.70(ACDZ.0)C0](https://github.com/ErnyTech/zyxel-ex5601t0)

- [Rollback SFP Zyxel con il W3 HUB per risolvere il problema dell'upload cappato](https://forum.fibra.click/d/36541-rollback-sfp-zyxel-con-il-w3-hub-per-risolvere-il-problema-dellupload-cappato)


---

[^xor]: the WAN Eth and WAN SFP ports are in XOR, i.e. either one or the other.
