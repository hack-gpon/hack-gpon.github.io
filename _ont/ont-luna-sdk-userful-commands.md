# General Settings and Useful Commands

## Useful files
- `/var/config/lastgood.xml` - Contains the user portion of the configuration
{% if include.lastgoodHs %}
- `/var/config/lastgood-hs.xml` - Contains the "hardware" configuration (which _should not_ be changed)
{% endif %}
- `/tmp/omcilog` - OMCI messages logs (must be enabeled, see below)

## Useful binaries
- `{{ include.flash }}` - Used to manipulate the config files in a somewhat safe manner
- `xmlconfig` - Used for low-level manipulation of the XML config files. Called by `{{ include.flash }}`
- `nv` - Used to manipulate nvram storage, including persistent config entries via `nv setenv`/`nv getenv`
- `omcicli` - Used to interact with the running OMCI daemon
- `omci_app` - The OMCI daemon
- `diag` - Used to run low-level diagnostics commands on the stick


## Getting/Setting the ONT's S/N
```sh
# {{ include.flash }} get GPON_SN
GPON_SN=TMBB00000000
# {{ include.flash }} set GPON_SN TMBB0A1B2C3D
```

## Getting/Setting the ONT's PLOAM password
{% if include.ploam == 'asciiAndHex' %}

{% include alert.html content="The ploam can be saved in either ASCII or HEX format, without any 0x or separators" alert="Note" icon="svg-info" color="blue" %}

```sh
# {{ include.flash }} get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# {{ include.flash }} set GPON_PLOAM_PASSWD AAAAAAAAAA
# {{ include.flash }} set GPON_PLOAM_PASSWD 41414141414141414141
```

{% elsif include.ploam == 'hex' %}

{% include alert.html content="The PLOAM password is stored in HEX format, without any 0x or separators" alert="Note" icon="svg-info" color="blue" %}

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

## Getting/Setting the ONT Vendor ID

{% include alert.html content="This may need the OMCI_OLT_MODE value to be set to 3 to work" alert="Note" icon="svg-info" color="blue" %}

```sh
# flash get PON_VENDOR_ID  
PON_VENDOR_ID=ZTEG
# flash set PON_VENDOR_ID HWTC
```

## Getting/Settng the ONT Custom software version
{% assign customSwVersionAlert = include.customSwVersionAlert | default: "This needs the OMCI_OLT_MODE value to be set to 3" %}
{% include alert.html content=customSwVersionAlert alert="Note" icon="svg-info" color="blue" %}

```sh
# nv setenv sw_custom_version0 YOURFIRSTSWVER
# nv setenv sw_custom_version1 YOURSECONDSWVER
```

## Getting/Setting a custom HW Version
{% include alert.html content="This may need the OMCI_OLT_MODE value to be set to 3 to work" alert="Note" icon="svg-info" color="blue" %}

```sh
# {{ include.flash }} get HW_HWVER
HW_HWVER=V2.0
# {{ include.flash }} set HW_HWVER MYHWVERSION
```

## Getting/Setting a custom ONT Equipment ID
{% include alert.html content="This may need the OMCI_OLT_MODE value to be set to 3 to work" alert="Note" icon="svg-info" color="blue" %}

```sh
# {{ include.flash }} get GPON_ONU_MODEL
GPON_ONU_MODEL=DFP-34X-2C2
# {{ include.flash }} set GPON_ONU_MODEL DFP-34X-XXX
```

## Getting/Setting OMCI OLT Mode and Fake OMCI

Configure how ONT Stick handle OMCI from OLT:

```sh
# {{ include.flash }} get OMCI_OLT_MODE
OMCI_OLT_MODE=1
# {{ include.flash }} set OMCI_OLT_MODE 2
```

| Value | Note            | OMCI Information                               |
| ----- | --------------- | ---------------------------------------------- |
| 0     | Default Mode    | Stock, some value are cannot be change         |
| 1     | Huawei OLT Mode | Huawei MA5671a                                 |
| 2     | ZTE OLT Mode    | ZTE                                            |
| 3     | Customized Mode | Custom Software/Hardware Version, OMCC, etc... |

Some Fiber Vendor/Wholesale/ISP have explicit LAN Port Number provisioning or proprietary OMCI that ONT Stick cant not understand, this will make ONT Stick reply OK whatever OMCI OLT throw at. 

`0` = Disable, `1` = Enable, Default is 0

```sh
# {{ include.flash }} get OMCI_FAKE_OK
OMCI_FAKE_OK=0
# {{ include.flash }} set OMCI_FAKE_OK 1
```
{% if include.speedLan %}

## Getting/Setting Speed LAN Mode
{% assign customSpeedLanAlert = include.customSpeedLanAlert | default: "Before editing the speed make sure your hardware supports it." %}
{% include alert.html content=customSpeedLanAlert alert="Note" icon="svg-info" color="blue" %}

To change the link mode use this command:

```sh
# {{ include.flash }} get LAN_SDS_MODE
LAN_SDS_MODE=0
# {{ include.flash }} set LAN_SDS_MODE 1
```

| Value | `cat /proc/kmsg`                     | Mode     | Behavior                    |
| ----- | ------------------------------------ | -------- | --------------------------- |{% if include.speedLan contains '0' %}
| 0     | `<4>change mode to 0(GE/FE PHY)`     | `TP`     | 1GbaseT/100baseT            |{% endif %}{% if include.speedLan contains '1' %}
| 1     | `<4>change mode to 1(Fiber 1G)`      | `FIBER`  | 1GbaseX with auto-neg on    |{% endif %}{% if include.speedLan contains '2' %}
| 2     | `<4>change mode to 2(SGMII PHY)`     | `TP MII` | 1Gb PHY                     |{% endif %}{% if include.speedLan contains '3' %}
| 3     | `<4>change mode to 3(SGMII MAC)`     | `MII`    | 1Gb MAC                     |{% endif %}{% if include.speedLan contains '4' %}
| 4     | `<4>change mode to 4(HiSGMII PHY)`   | `TP MII` | 2.5Gb PHY                   |{% endif %}{% if include.speedLan contains '5' %}
| 5     | `<4>change mode to 5(HiSGMII MAC)`   | `MII`    | 2.5Gb MAC                   |{% endif %}{% if include.speedLan contains '6' %}
| 6     | `<4>change mode to 6(2500BaseX)`     | `FIBER`  | 2500baseX with auto-neg on  |{% endif %}{% if include.speedLan contains '7' %}
| 7     | `<4>change mode to 7(SGMII Force)`   | `TP`     | 1GbaseT with auto-neg off   |{% endif %}{% if include.speedLan contains '8' %}
| 8     | `<4>change mode to 8(HISGMII Force)` | `TP`     | 2500baseT with auto-neg off |{% endif %}

{% endif %}

## Change IP address

```sh
# {{ flash }} get LAN_IP_ADDR
LAN_IP_ADDR=192.168.2.1
# {{ flash }} set LAN_IP_ADDR 192.168.1.1
```

## Checking whether the connection with the OLT was successful (O5 state)

```sh
diag gpon get onu-state
```

## Querying a particular OMCI ME
```sh
# omcicli mib get MIB_IDX
```

## Getting/Setting the L2 Bridge MTU
{% include alert.html content="Settings given via diag are not permanent after reboot" alert="Note" icon="svg-info" color="blue" %}

Getting/Setting the MTU of the L2 bridge
```sh
# diag switch get max-pkt-len port all 
Port Speed 
---------- 
0 1538 
2 2031 
# diag switch set max-pkt-len port all length 2000
```