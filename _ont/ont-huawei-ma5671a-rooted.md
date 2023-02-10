---
title: Huawei Rooted Firmware for Huawei MA5671A
has_children: false
parent: Huawei MA5671A
layout: default
---

# General Settings and Useful Commands

{% include alert.html content="In this firmware, unlike the other ones, the data must be modified in a base64-encoded file. To simplify this, you can use the following web application." alert="Info" icon="svg-info" color="blue" %}

## Web procedure


1. Get `fw_printenv sfp_a2_info` and paste into the form

<div id="app">
    <vue-lantiq-eeprom type='eeprom-rooted-edit'></vue-lantiq-eeprom>
</div>
<script src="https://unpkg.com/vue@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/vue3-sfc-loader"></script>
<script src="/assets/js/vue-eeprom.js"></script>

{% include alert.html content="Executing these commands requires a minimum of familiarity with `vim`. If you do not know `vim`, follow the commands precisely." alert="Danger" icon="svg-warning" color="red" %}

{:style="counter-reset:none"}
1. Copy the script's output to the clipboard 
1. Run the comman `vim /tmp/sfp_a2.txt` in the stick
1. Press the right mouse button in the terminal or `CTRL`+`V`
1. Press `ESC` command from keyboard
1. Type `:wq`
1. Run:

```shell
fw_setenv sfp_a2_info ($cat /tmp/sfp_a2.txt)
```

## Temporary file procedure

1. Save `sfp_a2_info` in a temporary file

```shell
fw_printenv sfp_a2_info | sed "s/^sfp_a2_info=//" > /tmp/sfp_a2.txt
```
And print a pretty version:
```shell
fw_printenv sfp_a2_info | sed "s/^sfp_a2_info=//" | tr '@' '\n'
```

2. Setting S/N

The S/N is stored on the 6th line, for example `4857544311223344` (where `48575443` is the HEX encoding of `HWTC`):
```
AAAAAAAAAAJIV1RDESIzRP///////////////////wAAAAAAAAAAAAAAAAAA
00000000000000024857544311223344ffffffffffffffffffffffffffffff0000000000000000000000000000
```

The entire S/N, including the PON ID, is encoded first in hexadecimal and then in base64

3. Setting PLOAM Password

The PLOAM Password is stored on the 5th line, for example (`1234567890`):
```
ffffffffffffffff00021437d77db7df7e37e77eb7ef7f37f77d00000000000000000000000000000000000000
//////////8AAhQ31323334353637383930AAAAAAAAAAAAAAAAAAAAAAAAA
```

The entire PLOAM, is encoded first in hexadecimal and then in base64

4. Setting MAC Address

The MAC Address is stored on the 9th line, for example (`48:57:02:da:be:ef`):
```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASFcC2r7vAAAAAAAAAAAAAAAAAAAA
000000000000000000000000000000000000000000000000485702dabeef000000000000000000000000000000
```

5. Transfer the modified file back into variable `sfp_a2_info`

```shell
fw_setenv sfp_a2_info $(cat /tmp/sfp_a2.txt)
```

## Reviewing and testing

After rebooting, check whether the new variables have been saved correctly:

```shell
fw_printenv nPassword
fw_printenv gSerial
fw_printenv ethaddr
```

## Checking whether the connection with the OLT was successful (O5 state)

```shell
onu ploamsg
```

# Disabling dying gasp

```shell
fw_setenv nDyingGaspEnable 0 
```

# Miscellaneous Links

- [Edit sfp_a2_info file](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042/25)
