# GPON ONU status

## Get the operational status of the ONU
```sh
#ONT>traffic
#ONT/system>pon
#ONT/system/pon>show link

 ----------------- LINK STATE -----------------
 Link State:              ACTIVE
 Operation State Machine: OPERATION (O5)
 ----------------- STATE  END -----------------
```

## Querying a particular OMCI ME

```sh
#ONT>system
#ONT/system>mib
#ONT/system/mib>show 256
Table Ontg, Ont-g, total 1 instances

EntityID                  = 0x0000
VID                       = "ALCL"
Version                   = AA BB CC DD EE FF 11 22 33 44 55 66 00 00
SerialNum                 = AA BB CC DD EE FF 11 22
TraffMgtOpt               = 0
AtmCCOpt                  = 0
BatteryBack               = 1
AdminState                = 0
OpState                   = 0
OnuSurvivalTime           = 0
Loid                      = ""
Password                  = ""
AuthState                 = 0
OntState                  = 1
```

# GPON/OMCI settings

## Committing changes to the OMCI MIB tables for GPON operation
```sh
#ONT>system
#ONT/system>mib
#ONT/system/mib>reset
```

## Getting/Setting ONU GPON Serial Number
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>eqsn set "ALCL00000001"
---ATECMDRESULT--- OK
#ONT/system/misc>eqsn get
eqsn: ALCL00000001
---ATECMDRESULT--- OK
```

## Getting/Setting PLOAM
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>pon_passwd set "123456789"
---ATECMDRESULT--- OK
#ONT/system/misc>pon_passwd get
pon_passwd: 31323334353637383900
---ATECMDRESULT--- OK
#ONT/system/misc>register_id set "123456789"
---ATECMDRESULT--- OK
#ONT/system/misc>register_id get
pon_passwd: 31323334353637383900
---ATECMDRESULT--- OK
```

## Setting OMCI software version (ME 7)
The following must be typed from the standard linux shell:
```sh
# echo SWVER=3FE49337AOCK80 > /mnt/rwdir/sys.cfg
```

## Getting/Setting OMCI hardware version (ME 256)
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>eqvid get
eqvid: 3FE45458ABAA06
hex_eqvid: 0x3346453435343538414241413036
---ATECMDRESULT--- OK
#ONT/system/misc>eqvid set "YOUR_CUSTOM_VID"
```

## Getting/Setting OMCI vendor ID (ME 256)
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>vendor get
vendor: ALCL
---ATECMDRESULT--- OK
#ONT/system/misc>vendor set "ALCL"
---ATECMDRESULT--- OK
```

## Getting/Setting OMCI equipment ID (ME 257)
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>eqid set "YOUR_CUSTOM_EQUID"
---ATECMDRESULT--- OK
#ONT/system/misc>eqid get
eqid: YOUR_CUSTOM_EQUID
hex_eqid: 0x594F55525F435553544F4D5F4551554944000000000000
---ATECMDRESULT--- OK
```

# Advanced settings

## Setting management IP
```sh
#ONT>system
#ONT/system>misc
#ONT/system/misc>admin_ip get
admin_ip: 192.168.100.1
---ATECMDRESULT--- OK
#ONT/system/misc>admin_ip set 192.168.1.1
#ONT/system/misc>admin_mask get
admin_mask: 255.255.255.0
---ATECMDRESULT--- OK
#ONT/system/misc>admin_mask set 255.255.255.0
```
