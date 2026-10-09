---
title: V-SOL V2801F
has_children: false
parent: V-SOL
---

# Hardware Specifications

|              |                                       |
| ------------ | ------------------------------------- |
| Vendor/Brand | V-SOL                                 |
| Model        | V2801F                                |
| Chipset      | Realtek RTL9601CI                     |
| Flash        | 8 MB                                  |
| RAM          | 64 MB                                 |
| System       | Linux (Luna SDK)                      |
| SFP interfaces | 1 Gbps only, no HSGMII                |
| Optics       | SC/APC                                |
| IP address   |                                       |
| Web Gui      | ✅ user `admin`, password `stdONU101` |
| SSH          | ✅ user `admin`, password `stdONU101` |
| Telnet       |                                       |
| Serial       |                                       |
| Form Factor  | miniONT SFP                           |

## Firmware is interchangeable with:

- [T&W TWC GPON657](/ont-t-w-twcgpon657)
- [UFiber UF-Instant](/ont-ufiber-uf-instant) 

It supports both VEIP and PPTP, and it is the only RTL9601CI stick that emulates all the 4 LAN ports of the original ONT (4-port emulation), which is required by the ISPs that provision the internet on a specific LAN port[^rtl960x].

## List of software versions
- V1.9.0-240614 (community build, modern WebGUI, 2.5GbE)
- V1.9.0-201104
- V1.9.0-200827
- V1.9.0-200825
- V1.9.0-200417
- V1.9.0-200410
- V1.9.0-200323
- V1.9.0-191015

## List of firmwares and files

- [Firmware repository by Anime4000](https://github.com/Anime4000/RTL960x/tree/main/Firmware/V2801F)

The recommended version is `V2801F_V1.9.0-240614.tar` because it has a modern WebGUI, 2.5GbE support, patched `runlansds.sh`, `tftpd` and more. Before upgrading to it set `LAN_SDS_MODE` to `1`[^rtl960x_v2801f_fw]:

```sh
# flash set LAN_SDS_MODE 1
```

## VS_AUTH_KEY

The V2801F checks a license key, `VS_AUTH_KEY`, generated from `ELAN_MAC_ADDR` and `HW_HWVER`: if it does not match, the stick reboots in a loop. A new key must be generated every time the MAC address or the hardware version are changed[^rtl960x_key]:

```sh
VsAuthKeyGen.exe <mac_address> [HW_HWVER]
VsAuthKeyGen.exe 000000111111 168D.A
9E7E54597511D721D3A2932B048C0494
```

The `VsAuthKeyGen.exe` key generator is available [here](https://drive.google.com/drive/folders/19kkrr8aHL1I5W_Poq_Y8Zd5hCpYU6H1Q). Some pre-generated keys:

| `ELAN_MAC_ADDR` | `HW_HWVER`     | `VS_AUTH_KEY`                      |
| --------------- | -------------- | ---------------------------------- |
| `000000ABCDEF`  | `RTL960x`      | `A73BF734A3348731274ACCADCF9E1E2A` |
| `00C2C6012345`  | `RTL960x`      | `B905D1A8C43571BA70A66C1B59BE2A86` |
| `6CEFC6000000`  | `RTL960x`      | `00CF646955CCBDB88AB3B68922DB810F` |
| `781735D35DA0`  | `3FE48153CBAA` | `4DFD2ADED74CFC990DFE675EF527D815` |
| `043389FE8F59`  | `BF9.A`        | `4FF78A9422FCBC797A0A3061186F20B7` |
| `D0C65BE047E8`  | `168D.A`       | `F2A45DE3ADFD73916F09D9FAB84CEAE0` |

```sh
# flash set ELAN_MAC_ADDR 043389FE8F59
# flash set HW_HWVER BF9.A
# flash set VS_AUTH_KEY 4FF78A9422FCBC797A0A3061186F20B7
# reboot
```

### Stopping the reboot loop

With a wrong key there are only a few seconds to log in via telnet before the reboot (an [AutoIt script](https://github.com/Anime4000/RTL960x/blob/main/Tools/force-telnet/quick_telnet-login.au3) can do it automatically). The loop stops by switching the stick to Ethernet mode[^rtl960x_reboot]:

```sh
# echo 3 > /proc/fiber_mode
```

Then fix `VS_AUTH_KEY` (or update the firmware). In Ethernet mode the telnet access is lost: unplug the fiber to get it back. `flash set PON_MODE 3` does the same persistently, set it back to `1` (GPON) at the end.

<!--@partial: ./_partials/ont-luna-sdk-useful-commands.md
flash: "flash"
ploam: "ascii"
speedLan: "123456"
speedLanDefault: "1"
customSpeedLanAlert: "Please use recommended version `V2801F_V1.9.0-240614.tar`. It is not guaranteed that any value for `LAN_SDS_MODE` other than `1` will work with other firmware versions. Before editing the sync speed make sure your hardware supports it."
rtl960x: true
macKey: "vsol"
-->

# Known Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

You should use the VID/VLAN shown by executing the command `omcicli mib get 84` via telnet to bring up PPPoE

With the stock firmwares the stick works as a 1000BASE-X fiber transceiver (`LAN_SDS_MODE` `1`), which is not supported by some hosts: on MikroTik the SFP port settings must match, and some models (RB4011, RB5009) have issues and may require to reinsert the stick[^rtl960x_twc].

# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [RTL960x stick setup guide](https://github.com/Anime4000/RTL960x/blob/main/Docs/StickSetup.md)
- [V2801F Firmware_Mod (Bootstrap WebGUI)](https://github.com/Anime4000/RTL960x/tree/main/Firmware_Mod/V2801F)
- [SFP GPON ONU](https://github.com/zry98/SFP-GPON-ONU)
- [forum lowyat](https://forum.lowyat.net/topic/4925452/+460)

[^rtl960x]: *Hacking RTL960x*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x
[^rtl960x_v2801f_fw]: *V2801F firmware*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/tree/main/Firmware/V2801F
[^rtl960x_key]: *`VS_AUTH_KEY`*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/VS_AUTH_KEY.md
[^rtl960x_reboot]: *V2801F Auto Reboot Fix*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/V2801F.md
[^rtl960x_twc]: *TWCGPON657*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/TWCGPON657.md
