# General Settings and Useful Commands

## Getting/Setting the ONT's S/N
```sh
# {{ include.flash }} get GPON_SN
GPON_SN=TMBB00000000
# {{ include.flash }} set GPON_SN TMBB0A1B2C3D
```

## Getting/Setting the ONT's PLOAM password
{% if include.ploam == 'hex' %}

{% include alert.html content="The PLOAM password is stored in HEX format, without any 0x or separators" alert="Note"  icon="svg-info" color="blue" %}

```sh
# {{ include.flash }} get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=41414141414141414141
# {{ include.flash }} set GPON_PLOAM_PASSWD 41414141414141414141
```
{% elsif include.ploam == 'ascii' %}

{% include alert.html content="The PLOAM password is stored in ASCII format" alert="Info" icon="svg-info" color="blue" %}

```sh
# {{ include.flash }} get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# {{ include.flash }} set GPON_PLOAM_PASSWD AAAAAAAAAA
```
{% endif %}

## Checking the currently active image
```sh
# nv getenv sw_active
sw_active=1
# nv getenv sw_version0
sw_version0=V1_7_8_210412
# nv getenv sw_version1
sw_version1=V1_7_8_210412
```

## Booting to a different image
```sh
# nv setenv sw_commit 0|1
# reboot
```

## Querying a particular OMCI ME
```sh
# omcicli mib get MIB_IDX
```