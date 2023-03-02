---
title: Zyxel Router
has_children: false
alias: EX5601-T0
layout: default
---

# Hardware Specifications

|          | EX5601-T0              |
| -------- | ---------------------- |
| Vendor   | Zyxel                  |
| Model    | EX5601-T0              |
| SFP      | 1[^xor]                |
| Ethernet | 4 1GbE, 2 2.5GbE[^xor] |
| XGMII    | No                     |
| HSGMII   | ✅                     |
| SGMII    | ✅                     |
| Type     | Router                 |

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

# Miscellaneous Links

- [Rollback SFP Zyxel con il W3 HUB per risolvere il problema dell'upload cappato](https://forum.fibra.click/d/36541-rollback-sfp-zyxel-con-il-w3-hub-per-risolvere-il-problema-dellupload-cappato)


---

[^xor]: it is possible that the WAN Eth and WAN SFP ports are in XOR, i.e. either one or the other.
