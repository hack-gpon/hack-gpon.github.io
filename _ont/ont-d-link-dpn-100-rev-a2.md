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
- [Ziza OP151s](/ont-ziza-op151s)
- [T&W TW2362H-CDEL](/ont-t-w-tw2362h-cdel)

# General Settings and Useful Commands

{% include alert.html content="all commands start from the twmanu shell." alert="Note"  icon="svg-info" color="blue" %}

## Changing the ONT's S/N
{% include alert.html content="the S/N is stored in the ASCII format." alert="Note"  icon="svg-info" color="blue" %}

```sh
manufactory
set sn ALCLf0f0f0f0
exit
hal
set sn ALCLf0f0f0f0
```

## Changing the ONT's PLOAM password

{% include alert.html content="the PLOAM is stored in the ASCII format." alert="Note"  icon="svg-info" color="blue" %}

This can be done easily via web ui. If you prefer to do it via the shell use:
```sh
manufactory
set password 1234567899
```

or in hex format without any 0x or separator:
```sh
manufactory
set password hex 31323334353637383939
```

## Show ONT info
```sh
show info
```

# Miscellaneous Links

- [Dlink DPN 100 Change of Serial Number and PLOAM Password](https://www.youtube.com/watch?v=5hpMPJCpUaQ)



