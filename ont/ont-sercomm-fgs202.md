---
title: Sercomm FGS202
---













# Hardware Specifications

|              |                                   |
| ------------ | --------------------------------- |
| Vendor/Brand | Sercomm                           |
| Model        | FGS202                            |
| Chipset      | Lantiq PEB98036                   |
| Flash        | 8 MB                              |
| RAM          | 32 MB                             |
| System       | eCos                              |
| HSGMII       | Yes                               |
| Optics       | SC/APC                            |
| IP address   | 169.254.199.139                   |
| Web Gui      | No                                |
| SSH          | No                                |
| Telnet       | ✅ user `admin`, password `admin` |
| Serial       | No                                |
| Form Factor  | miniONT SFP                       |


<ImageFigure file="fgs202.jpg" alt="Sercomm FGS202" caption="Sercomm FGS202" />
<ImageFigure file="fgs202_teardown.jpg" alt="Sercomm FGS202 teardown" caption="Sercomm FGS202 teardown" />

## Telnet Access

The stick has telnet available only on the PON side, the only way to access it is by using an OLT.

## List of software versions
- SCOMFGS202305 (TIM Italy)
- SCOMFGS202304 (TIM Italy)

# GPON ONU status

## Getting the operational status of the ONU

```sh
# show gpon

PON STATUS      :O5
LOS Times       :0
Connect Time    :0 day 2 hour 29 min
TX POWER        :2.97mW 4.73dBm
RX POWER        :35.29uW -14.46dBm
T-CONT
tcont_idx       alloc_id        reg_egress_port pre_egress_port
0               256             0               127
8               0               127             63
GEM TOTAL COUNT
gem_port_id     gem_port_index  tx_frames       tx_bytes        rx_frames       rx_ bytes
0               255             408             19584           365             17520
145             1               44087           15072176        0               0
4095            0               0               0               83591           20759980
```

## Querying a particular OMCI ME
```sh
# show me [cla_id][ins_id]
# show me 7
Class ID    = 7 (Software image)
Instance ID = 0
Upload      = yes
Alarms      = -
-------------------------------------------------------------------------------
 0 Version                      14b STR  R------P---
   0x53 0x43 0x4f 0x4d 0x46 0x47 0x53 0x32 0x30 0x32 0x33 0x30 0x34 0x00
   SCOMFGS202304\x00
-------------------------------------------------------------------------------
 1 Is committed                  1b UINT R----------
   0x00 (0)
-------------------------------------------------------------------------------
 2 Is active                     1b UINT R----------
   0x00 (0)
-------------------------------------------------------------------------------
 3 Is valid                      1b UINT R----------
   0x01 (1)
-------------------------------------------------------------------------------
Class ID    = 7 (Software image)
Instance ID = 1
Upload      = yes
Alarms      = -
-------------------------------------------------------------------------------
 0 Version                      14b STR  R------P---
   0x53 0x43 0x4f 0x4d 0x46 0x47 0x53 0x32 0x30 0x32 0x33 0x30 0x35 0x00
   SCOMFGS202305\x00
-------------------------------------------------------------------------------
 1 Is committed                  1b UINT R----------
   0x01 (1)
-------------------------------------------------------------------------------
 2 Is active                     1b UINT R----------
   0x01 (1)
-------------------------------------------------------------------------------
 3 Is valid                      1b UINT R----------
   0x01 (1)
-------------------------------------------------------------------------------
```

# GPON/OMCI settings

## Setting ONU GPON PLOAM password

```sh
# set gpon_password PASSWORD
Set command exectue successfully.
```

# Advanced settings

## Showing live OMCI messages

```sh
# show omci
1970-01-01 02:34:53 ploam us: onu id - 0 / rei
ploam us|00 08 00 00 00 00 9b 00 00 00 00 00
1970-01-01 02:34:53 ploam ds: onu id - 255 / UpstreamOverhead
ploam ds|ff 01 20 00 00 aa ab 59 83 20 00 00
1970-01-01 02:34:53 ploam ds: onu id - 255 / UpstreamOverhead
```

# Hardware Modding

- Pin 7 GND → VCC [Fibra.Click - FAQ: 2.5Gbps su singolo dispositivo su Tim, Vodafone, Fastweb/JustSpeed](https://forum.fibra.click/d/27574-faq-25gbps-su-singolo-dispositivo-su-timvodafonefastwebjustspeed/18)
- Only for Ubiquiti [OpenWRT Forum - Support for GPON SFP](https://forum.openwrt.org/t/support-for-gpon-sfp-fgs202/42641/47)

# Miscellaneous Links

- [Support for GPON SFP FGS202](https://forum.openwrt.org/t/support-for-gpon-sfp-fgs202/42641/60)
- [SerComm FGS202](https://wikidevi.wi-cat.ru/SerComm_FGS202)




