---
title: Huawei MA5671A original firmware
has_children: false
parent: Lantiq SDK (OpenWrt)
badge: stock
platform: Lantiq SDK (OpenWrt)
devices: ont-huawei-ma5671a:works
---

The original firmware of the [Huawei MA5671A](/ont-huawei-ma5671a). The images below are already rooted: if the [root procedure without tweezers](/ont-huawei-ma5671a-root-web) is used, the firmware on the stick corresponds to these images.

For the commands shared with the other Lantiq firmwares see [Lantiq SDK (OpenWrt)](/firmware-lantiq-openwrt).

# Compatibility

<FirmwareCompatibility />

# Files

- [Huawei Rooted MTD2](https://ma5671a.s3.nl-ams.scw.cloud/mA5671a_root_mtd2.img){.btn} md5hash: 3138d2dd06a32bb92bc63610fec6fcd6
- [Huawei Rooted MTD5](https://ma5671a.s3.nl-ams.scw.cloud/mA5671a_root_mtd5.img){.btn} md5hash: 0e4cfdc1b96be6581869b26b48789556

# Usage

## Minishell

This firmware version offers a minishell in addition to the normal sh shell. Commands offered by minishell are as follows:

::: details Huawei MA5671A minishell
<<< ../ont/serial_dump/ma5671a_minishell.txt
:::

## Root

For general use, minishell does not allow any modifications and [Web root procedure](/ont-huawei-ma5671a-root-web) is required.

# GPON/OMCI settings

::: info Info
In this firmware, unlike the other ones, all data must be modified in a base64-encoded file. To simplify this, you can use the following web application.
:::

## Web procedure

1. Get `fw_printenv sfp_a2_info` and paste into the form:

<LantiqEeprom type="eeprom-rooted-edit" />

::: danger Danger
Executing these commands requires familiarity with `vim`. If you are not in any way familiar with `vim`, follow these commands precisely.
:::

2. Copy the script's output to the clipboard 
3. Run the comman `vim /tmp/sfp_a2.txt` in the stick
4. Press the right mouse button in the terminal or `CTRL`+`V`
5. Press `ESC` command from keyboard
6. Type `:wq`
7. Run:

```shell
fw_setenv sfp_a2_info $(cat /tmp/sfp_a2.txt)
```

## Temporary file procedure

1. Save `sfp_a2_info` in a temporary file

```sh
fw_printenv sfp_a2_info | sed "s/^sfp_a2_info=//" > /tmp/sfp_a2.txt
```
And print a pretty version:
```sh
fw_printenv sfp_a2_info | sed "s/^sfp_a2_info=//" | tr '@' '\n'
```

2. Setting S/N

The S/N is stored on the 6th line, for example `4857544311223344` (where `48575443` is the HEX encoding of `HWTC`):
```
AAAAAAAAAAJIV1RDESIzRP///////////////////wAAAAAAAAAAAAAAAAAA
00000000000000024857544311223344ffffffffffffffffffffffffffffff0000000000000000000000000000
```

The entire S/N, including the PON ID, is first encoded in hexadecimal and then in base64

3. Setting PLOAM Password

The PLOAM Password is stored on the 5th line, for example (`1234567890`):
```
ffffffffffffffff00021437d77db7df7e37e77eb7ef7f37f77d00000000000000000000000000000000000000
//////////8AAhQ31323334353637383930AAAAAAAAAAAAAAAAAAAAAAAAA
```

The entire PLOAM, is first encoded in hexadecimal and then in base64

4. Setting MAC Address

The MAC Address is stored on the 9th line, for example (`48:57:02:da:be:ef`):
```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASFcC2r7vAAAAAAAAAAAAAAAAAAAA
000000000000000000000000000000000000000000000000485702dabeef000000000000000000000000000000
```

5. Transfer the modified file back into variable `sfp_a2_info`

```sh
fw_setenv sfp_a2_info $(cat /tmp/sfp_a2.txt)
```

## Reviewing and testing

After rebooting, check whether the new variables have been saved correctly:

```sh
fw_printenv nPassword
fw_printenv gSerial
fw_printenv ethaddr
```

## Speed LAN Mode

The firmware is already set to 2.5G auto-negotiation (`sgmii_mode` 5), you shouldn't touch it. See [Getting/Setting Speed LAN Mode](/firmware-lantiq-openwrt#getting-setting-speed-lan-mode).

# Advanced settings

## Disabling dying gasp

```sh
fw_setenv nDyingGaspEnable 0 
```

# Miscellaneous Links

- [Edit sfp_a2_info file](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042/25)
