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

## Querying a particular OMCI ME
```sh
# omcicli mib get MIB_IDX
```