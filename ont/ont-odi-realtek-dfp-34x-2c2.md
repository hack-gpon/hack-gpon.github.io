---
title: ODI Realtek DFP-34X-2C2 
description: New model 2022 - v05
has_children: false
parent: HSGQ (formerly ODI)
---

# Hardware Specifications

|              |                                   |
| ------------ | --------------------------------- |
| Vendor/Brand | ODI                               |
| Model        | DFP-34X-2C2                       |
| Chipset      | Realtek RTL9601D                  |
| Flash        | 8 MB                              |
| RAM          | 64 MB                             |
| System       | Linux (Luna SDK 1.9)              |
| SFP interfaces | HSGMII                                  |
| Optics       | SC/UPC(DFP-34X-2C2), SC/APC(DFP-34X-2C3)|
| IP address   | 192.168.1.1                       |
| Web Gui      | ✅ user `admin`, password `admin` |
| SSH          | ✅ user `admin`, password `admin` |
| Telnet       |                                   |
| Serial       |                                   |
| Form Factor  | miniONT SFP                       |

::: info Note
SSH uses an outdated set of algorithms/ciphers, you can connect using the following command:
:::

```shell
ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 -oCiphers=+3des-cbc -o HostKeyAlgorithms=ssh-rsa admin@192.168.1.1
```

<ImageFigure file="realtek-dfp-34x-2c2.jpg" alt="ODI Realtek DFP-34X-C2C" caption="ODI Realtek DFP-34X-C2C" />


::: warning
The ODI DFP-34X-2C2 has been sold with two different chipsets with the same name: this page is about the Realtek RTL9601D one, the firmwares are not compatible with the [ZTE based one](/ont-odi-zte-dfp-34x-2c2).
:::

## Default credentials

Besides `admin`/`admin`, the firmware has some system users[^rtl960x_reset]: `adsl`/`realtek`, `user`/`user` (changed with `flash set USER_PASSWORD`) and `administrator`/`Stel$864` (changed with `flash set E8BDUSER_PASSWORD`).

## Default values

| Variable         | Value                   |
| ---------------- | ----------------------- |
| `GPON_SN`        | `XPON1234ABCD`          |
| `PON_VENDOR_ID`  | `HSGQ`                  |
| `GPON_ONU_MODEL` | `DFP-34X-2C2`           |
| `HW_HWVER`       | `V2.0`                  |
| `OMCI_SW_VER1`   | `V1.0-220923`           |
| `OMCI_SW_VER2`   | `V1.0-220304`           |
| `OMCC_VER`       | `128`                   |
| `OMCI_OLT_MODE`  | `0`                     |
| `OMCI_FAKE_OK`   | `1`                     |
| `OMCI_TM_OPT`    | `2`                     |
| `OMCI_CUSTOM_ME` | `65536`                 |
| `LAN_SDS_MODE`   | `3` (SGMII MAC)         |

The defaults of the other ONTs that can be useful to clone are in the [configuration table](https://github.com/Anime4000/RTL960x/blob/main/Docs/FlashSetTable.md) and in the [list of stock ONUs](https://github.com/Anime4000/RTL960x/blob/main/Docs/Stock_ONU.md) of the RTL960x repository.

## List of software versions
- V1.0-221209 (hybrid, HSGQ)
- V1.0-220923 (by @lanseyujie, also modded by @stich86)
- V1.0-220916 (hybrid by @lanseyujie)
- V1.0-220817
- V1.0-220530 (hybrid by @stich86)
- V1.0-220414 (vlan working)
- V1.0-220304
- V1.0-210702

## List of firmwares and files
- [Firmware repository by Anime4000](https://github.com/Anime4000/RTL960x/tree/main/Firmware/DFP-34X-2C2)

The firmwares are either SFU (bridge only) or HGU/IGD (the stick reports itself as a router to the OLT, and can also be used as a router)[^rtl960x_odi_fw]:

| Firmware                         | Type | 4-port emulation | Notes                                                                                                         |
| -------------------------------- | ---- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `M110_sfp_ODI_210702.tar`        | HGU  | ❌               | `DEVICE_TYPE` is `1` (router) by default                                                                      |
| `M110_sfp_ODI_220304.tar`        | SFU  | ✅               | Introduces the `MAC_KEY`                                                                                      |
| `M114_sfp_ODI_Vlan_220414.tar`   | SFU  | ✅               |                                                                                                               |
| `M114_sfp_ODI_hybrid_220527.tar` | HGU  | ❌               |                                                                                                               |
| `M110_sfp_ODI_220817.tar`        | SFU  | ✅               | Includes the `fix_speed.sh`, `fix_sw_ver.sh` and `fix_vlan_tag.sh` scripts                                    |
| `M114_sfp_ODI_hybrid_220916.tar` | HGU  | ❌               | Provided by [@lanseyujie](https://github.com/Anime4000/RTL960x/issues/24#issuecomment-1297975439)             |
| `M110_sfp_ODI_220923.tar`        | SFU  | ✅               | Provided by [@lanseyujie](https://github.com/Anime4000/RTL960x/issues/24#issuecomment-1297975439)             |
| `M114_sfp_ODI_hybrid_221209.tar` | HGU  | ❌               | HSGQ, provided by [@physx2494](https://github.com/Anime4000/RTL960x/discussions/148#discussioncomment-5802985) |

The recommended versions are `M114_sfp_ODI_hybrid_220527.tar` or `M114_sfp_ODI_hybrid_220916.tar`, as these have working VLAN translation. Use an SFU firmware if the original ONT is a bridge, an HGU firmware if the original ONT is a router (some OLTs, e.g. PLDT, loop between `O2` and `O5` with a SFU firmware)[^rtl960x_isp].

::: warning
Switching between a SFU and an HGU firmware requires a [factory reset](#factory-reset), and then a new [MAC key](#mac-key) for the MAC address.
:::

### Fix scripts of the 220817 firmware

| Script            | Description                                                                 | Activation                                                     |
| ----------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `fix_speed.sh`    | Fixes the slow upload with the 2.5G modes (`LAN_SDS_MODE` `4`, `5` or `6`)    | `echo 1 > /etc/config/fix_speed`                               |
| `fix_sw_ver.sh`   | Applies the custom software version (`sw_custom_version0`/`1`)               | `OMCI_OLT_MODE` set to `3`                                     |
| `fix_vlan_tag.sh` | VLAN tag fix by @inyourgroove                                               | `echo 1 > /etc/config/fix_vlan`                                |

The sources of the scripts are in the [Firmware_Mod](https://github.com/Anime4000/RTL960x/tree/main/Firmware_Mod/DFP-34X-2C2/etc/scripts) folder. The community is working on the *Nijika* firmware, with a Bootstrap Web GUI that also shows the ME 84 and ME 171 received from the OLT and allows to change the VLAN forwarding operation.

## MAC key

From the firmware `V1.0-220304` onwards, changing `ELAN_MAC_ADDR` requires a matching `MAC_KEY`, the MD5 of `hsgq1.9a` followed by the MAC address in uppercase[^rtl960x_setup]:

```sh
echo -n "hsgq1.9aFFFFFF000000" | md5sum
46f4ea2e3f18ba3bc1f2671b5f7e1f62  -
flash set ELAN_MAC_ADDR FFFFFF000000
flash set MAC_KEY 46f4ea2e3f18ba3bc1f2671b5f7e1f62
```

A key generator by @rajkosto is available [here](https://gist.github.com/rajkosto/29c513b96ea6262d2fb1f965a52ce16f).

## List of partitions
 
| dev   | size     | erasesize | name            |
| ----- | -------- | --------- | --------------- |
| mtd0  | 00040000 | 00001000  | "boot"          |
| mtd1  | 00002000 | 00001000  | "env"           |
| mtd2  | 00002000 | 00001000  | "env2"          |
| mtd3  | 0003c000 | 00001000  | "config"        |
| mtd4  | 0014c000 | 00001000  | "k0"            |
| mtd5  | 00274000 | 00001000  | "r0"            |
| mtd6  | 0014c000 | 00001000  | "k1"            |
| mtd7  | 00274000 | 00001000  | "r1"            |
| mtd8  | 00001000 | 00001000  | "Partition_008" |
| mtd9  | 00001000 | 00001000  | "Partition_009" |
| mtd10 | 00001000 | 00001000  | "Partition_010" |
| mtd11 | 00001000 | 00001000  | "Partition_011" |
| mtd12 | 0014c000 | 00001000  | "linux"         |
| mtd13 | 00274000 | 00001000  | "rootfs"        |

This stick supports dual boot. 

`k0` and `r0` respectively contain kernel and firmware of the first image, while `k1` and `r1` contain kernel and firmware of the second one.

## Serial

The stick has a TTL 3.3v UART console (configured as 115200 8-N-1) that can be accessed from the top surface: it's near the SFP header. TX, RX and ground pads need to be connected to a USB2TTL adapter supporting 3V3 logic.

<ImageFigure file="ont-odi-realtek-dfp-34x-2c2/ttl.jpg" alt="DFP-34X-2C2 TTL Connection" caption="DFP-34X-2C2 TTL Connection" />
<ImageFigure file="ont-odi-realtek-dfp-34x-2c2/ttl-2.jpg" alt="DFP-34X-2C2 TTL Pin" caption="DFP-34X-2C2 TTL Pin" />

::: warning Note
Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work.
:::

On the RTL9601D (88 pins) the UART is on the pins 15 (TX) and 16 (RX)[^rtl960x_uart]. To power the stick outside of the host use an SFP breakout board or an SFP connector without cage: the USB TTL adapter can't power it.

<!--@partial: ./_partials/ont-luna-sdk-useful-commands.md
flash: "flash"
ploam: "hex"
customSwVersionAlert: "This needs either `OMCI_OLT_MODE` to be set to 3 and firmware version 220530 or 220923 as modded by @stich86 or, if you don't want to replace the installed firmware, set `OMCI_OLT_MODE` value to `21`. This will force the stick to use your own settings from the XML file, but this is a hack and causes sigsegv of `/bin/checkomci`."
speedLan: "1234567"
speedLanDefault: "3"
omciOLT21: "true"
rtl960x: true
macKey: "odi"
-->

# Known Bugs

- Auto-sensing mode to switch between SGMII/HiSGMII
- Slow upload with the 2.5G modes on some OLTs, mostly when the original ONT is also Realtek based: try another [`OMCI_TM_OPT`](#getting-setting-the-omci-traffic-management-option), the `fix_speed.sh` script or remove the bandwidth limits at runtime[^rtl960x_slow]:
  ```sh
  diag port set auto-nego port all ability asy-flow-control
  diag bandwidth set egress port all rate 4194296
  diag bandwidth set ingress port all rate 4194296
  ```
- With a 2.5G link the host can send more than the ~1.24 Gbps of the GPON upstream, causing drops and bufferbloat: limit the egress on the host, see [MikroTik](/mikrotik#gpon-upstream-flooding)

# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [RTL960x stick setup guide](https://github.com/Anime4000/RTL960x/blob/main/Docs/StickSetup.md)
- [English ODI configuration guide by @rajkosto](https://gist.github.com/rajkosto/b684b7bb2697baa342cd2601ed5717d2)
- [Making it work on the Intel 82599ES](https://omaera.org/wlog/tech/odi_sfp)
- [Asenheim firmware repository](https://cloud.asenheim.org/s/tqGTgBDSZgoKFyg) - alternative firmware collection for ODI/HSGQ, Alcatel/Nokia and Huawei modules
- [Ditch ONU, use GPON SFP on Business Grade Router, Mikrotik/Ubiquiti/pfSense (Home Networking)](https://forum.lowyat.net/topic/4925452)
- [Orange France at 2 Gbps with a MikroTik CCR2004](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/)
- [Pururin Collective forum](https://pururin.moe/viewtopic.php?t=7)
- [For the old model ODI ZTE DFP-34G-C2C](/ont-odi-zte-dfp-34g-2c2)

[^rtl960x_odi_fw]: *ODI DFP-34X-2C2 firmware*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/tree/main/Firmware/DFP-34X-2C2
[^rtl960x_isp]: *ISP specific configuration*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/ISP_specific_configuration.md
[^rtl960x_uart]: *UART*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/UART.md


