---
title: T&W TWC GPON657
has_children: false
parent: T&W
---

# Hardware Specifications

|                  |                                    |
| ---------------- | ---------------------------------- |
| Vendor/Brand     | T&W                                |
| Model            | TWC GPON657                        |
| ODM              | ✅                                 |
| Chipset          | Realtek RTL9601CI                  |
| Flash            | 16 MB                              |
| RAM              | 64 MB                              |
| System           | Linux (Luna SDK)                   |
| SFP interfaces   | HSGMII                             |
| Optics           | SC/APC                             |
| IP address       |                                    |
| Web Gui          | ✅ user `admin`, password `system` |
| SSH              | ✅ user `admin`, password `system` |
| Telnet           |                                    |
| Serial           |                                    |
| Form Factor      | miniONT SFP                        |

## Firmware is interchangeable with:

- [VSOL V2801F](/ont-vsol-v2801f)
- [UFiber UF-Instant](/ont-ufiber-uf-instant) 

## Enabling telnet

Telnet must be enabled from the Web GUI before the configuration[^rtl960x_setup]:

| State   | URL                                      |
| ------- | ---------------------------------------- |
| Enable  | `http://192.168.1.1/bd/telnet_open.asp`  |
| Disable | `http://192.168.1.1/bd/telnet_close.asp` |

## List of firmwares and files

- [Firmware repository by Anime4000](https://github.com/Anime4000/RTL960x/tree/main/Firmware/TWCGPON657)

| Firmware                          | Notes                                     |
| --------------------------------- | ----------------------------------------- |
| `C00R657V00B12_20191121.tar`      | Stock `B12`                               |
| `C00R657V00B13_20191024.tar`      | Stock `B13`                               |
| `C00R657V00B13_20191205.tar`      | Stock `B13`                               |
| `C00R657V00B13_20200507.tar`      | Stock `B13`                               |
| `C00R657V00B15_20201222.tar`      | Stock `B15`                               |
| `C00R657V2801F_V1.9.0-220404.tar` | V2801F firmware for the TWCGPON657        |
| `TWCGPON657_V1.9.0-240204.tar`    | V2801F firmware for the TWCGPON657, 4-port emulation |

The recommended version is `TWCGPON657_V1.9.0-240204.tar` (or `C00R657V2801F_V1.9.0-220404.tar`), the V2801F firmware for the T&W TWC GPON657: it supports both VEIP and PPTP, and the `240204` also the 4-port emulation.

## Flashing the V2801F firmware

The V2801F firmware checks the `VS_AUTH_KEY` license key, which does not exist on the stock firmware: without a valid key the stick reboots in a loop, see [V-SOL V2801F](/ont-vsol-v2801f#vs-auth-key)[^rtl960x_twc].

1. If the stock firmware is newer than `B13`, downgrade it to `B13` or older;
2. Via telnet, set the stick to 1000BASE-X and to the Ethernet mode, which prevents the reboot loop:
   ```sh
   # flash set LAN_SDS_MODE 1
   # flash set PON_MODE 3
   ```
3. Upload the V2801F firmware from the Web GUI and wait;
4. Set a MAC address, hardware version and key that match:
   ```sh
   # flash set ELAN_MAC_ADDR 6CEFC6000000
   # flash set HW_HWVER RTL960x
   # flash set VS_AUTH_KEY 00CF646955CCBDB88AB3B68922DB810F
   ```
5. Set `PON_MODE` back to `1` (GPON) or `2` (EPON) and reboot.

<!--@partial: ./_partials/ont-luna-sdk-useful-commands.md
flash: "flash"
ploam: "ascii"
speedLan: "123456"
speedLanDefault: "2"
customSpeedLanAlert: "Please use recommended version `TWCGPON657_V1.9.0-240204.tar`. It is not guaranteed that any value for `LAN_SDS_MODE` other than `1` will work with other firmware versions. Before editing the sync speed settings make sure your hardware supports it."
rtl960x: true
macKey: "vsol"
-->

# Known Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

You should use the VID/VLAN shown by executing the command `omcicli mib get 84` via telnet to bring up PPPoE


# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [RTL960x stick setup guide](https://github.com/Anime4000/RTL960x/blob/main/Docs/StickSetup.md)
- [forum lowyat](https://forum.lowyat.net/topic/4925452/+460)

[^rtl960x_twc]: *TWCGPON657 firmware*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/tree/main/Firmware/TWCGPON657

