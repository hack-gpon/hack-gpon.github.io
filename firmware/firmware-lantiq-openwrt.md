---
title: Lantiq SDK (OpenWrt)
has_children: true
---

This page collects the commands shared by the firmwares built on the Lantiq FALC ON SDK with OpenWrt (Lantiq FALC ON PEB98035 chipset), e.g. on the [Huawei MA5671A](/ont-huawei-ma5671a), the [Nokia G-010S-P](/ont-nokia-g-010s-p) and the [FS.com GPON ONU Stick with MAC](/ont-fs-com-gpon-onu-stick-with-mac).

::: warning
These commands do not apply to the firmwares built on other systems (e.g. eCos) or on other SDKs, even if they run on the same chipset. Every firmware also has its own commands and settings: check the page of the firmware.
:::

Dasan H650SFP and DpOptics D23446 are also reported to share the same hardware, this is not verified.

The procedures that depend on the bootloader and on the flash (backup, flashing, switching the active image, serial recovery) are in the device pages, e.g. [Huawei MA5671A](/ont-huawei-ma5671a#advanced-settings).

# GPON ONU status

## Getting the operational status of the ONU

```sh
onu ploam_state_get
```

The short form of the command is `onu ploamsg`.

## Querying a particular OMCI ME

```sh
omci_pipe.sh meg MIB_IDX ME_IN
```

Where `MIB_IDX` is the MIB ID and `ME_IN` is the ME instance number.

## Getting/Setting Speed LAN Mode

To get the LAN Mode:

```sh
onu lan_port_status_get 0
```

The short form of the command is `onu lanpsg 0`. The `link_status` variable tells the current speed:

| Value (for `sgmii_mode` and `link_status`) | Speed                              |
| ------------------------------------------ | ---------------------------------- |
| 3                                          | 1 Gbps / SGMII with auto-neg on    |
| 4                                          | 1 Gbps / SGMII with auto-neg off   |
| 5                                          | 2.5 Gbps / HSGMII with auto-neg on |

The default LAN mode is set with the `sgmii_mode` U-Boot variable, e.g. 2.5 Gbps / HSGMII with auto-neg on:

```sh
fw_setenv sgmii_mode 5
```

To go back to the default of the firmware:

```sh
fw_setenv sgmii_mode
```

# U-Boot environment

The settings of these firmwares are mostly stored in the U-Boot environment. To print all the variables, or a single one:

```sh
fw_printenv
fw_printenv VARIABLE
```

To set or delete a variable:

```sh
fw_setenv VARIABLE VALUE
fw_setenv VARIABLE
```

The names of the variables (serial number, PLOAM password, LOID, OMCI identity...) depend on the firmware.

# Nokia G-010S-A

The firmwares that run on the [Nokia G-010S-P](/ont-nokia-g-010s-p) and on the [Huawei MA5671A](/ont-huawei-ma5671a) also run on the [Nokia G-010S-A](/ont-nokia-g-010s-a), provided its MTD layout has been changed beforehand to match the new one. For the full procedure, see this post on [lafibre.info](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/msg870551/#msg870551).

::: warning
Like the G-010S-P, the G-010S-A has a physical EEPROM: a firmware that does not support it may not work correctly.
:::
