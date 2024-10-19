---
title: D-LINK DPN-100 Rev A2
has_children: false
layout: default
parent: D-LINK
---

# Hardware Specifications

|                  |                 |
| ---------------- | --------------- |
| Vendor/Brand     | D-LINK          |
| Model            | DPN-100 Rev A2  |
| Chipset          | Lantiq PEB98035 |
| ODM              | T&W             |
| ODM Product Code | TW2362H-CDEL    |
| Flash            | 8 MB            |
| RAM              | 64 MB           |
| System           |                 |
| HSGMII           |                 |
| Optics           |                 |
| IP address       |                 |
| Web Gui          |                 |
| SSH              |                 |
| Telnet           |                 |
| Serial           |                 |
| Form Factor      | miniONT SFP     |

{% include image.html file="dpn-100-rev-a2.jpg"  alt="DPN-100 Rev A2" caption="DPN-100 Rev A2" %}


Once you access the stick via ssh you will be presented with a second tier login. The credentials to access the dell shell are: username: `twmanu` , password: `twmanu`.


## Firmware is interchangeable with:

- [Zyxel PMG3000-D20B](/ont-zyxel-pmg3000-d20b)
- [Halny HL-GSFP](/ont-halny-hl-gsfp)
- [Zisa OP151s](/ont-zisa-op151s)
- [T&W TW2362H-CDEL](/ont-t-w-tw2362h-cdel)

# GPON/OMCI settings

{% include alert.html content="All commands start from the twmanu shell." alert="Note"  icon="svg-info" color="blue" %}

## Setting ONU GPON Serial Number
{% include alert.html content="The S/N is stored in the ASCII format." alert="Note"  icon="svg-info" color="blue" %}

```sh
manufactory
set sn ALCLf0f0f0f0
exit
hal
set sn ALCLf0f0f0f0
```

## Setting ONU GPON PLOAM password

{% include alert.html content="The PLOAM password is stored in the ASCII format." alert="Note"  icon="svg-info" color="blue" %}

This can be done easily via the web UI. If you prefer to do it via the shell use:
```sh
manufactory
set password 1234567899
```

or in hex format without any 0x or separator:
```sh
manufactory
set password hex 31323334353637383939
```

## Show ONU GPON info
```sh
show info
```

# Miscellaneous Links

- [Dlink DPN 100 Change of Serial Number and PLOAM Password](https://www.youtube.com/watch?v=5hpMPJCpUaQ)



