# General Settings and Useful Commands

## Change IP address
```sh
# /etc/scripts/flash get LAN_IP_ADDR
LAN_IP_ADDR=192.168.2.1
# /etc/scripts/flash set LAN_IP_ADDR 192.168.1.1
 ```

## Getting/Setting the ONT's S/N
```sh
# /etc/scripts/flash get GPON_SN
GPON_SN=LEOX00000000
# /etc/scripts/flash set GPON_SN TMBB0A1B2C3D
```

## Getting/Setting the ONT's PLOAM password

{% include alert.html content="The PLOAM password is stored in ASCII format" alert="Info" icon="svg-info" color="blue" %}

```sh
# /etc/scripts/flash get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# /etc/scripts/flash set GPON_PLOAM_PASSWD AAAAAAAAAA
```