## SFP Whitelist

- FRITZ!SFP AON (IEEE 802.3ah-2004 1000BASE-BX10, TX 1310 nm, RX 1480 to 1580 nm, LC/APC 8°, 10 km)[^aon]
- FRITZ!SFP AON TV Filter (IEEE 802.3ah-2004 1000BASE-BX10)
- FRITZ!SFP GPON (GPON ITU-T G.984.2/984.5, TX 1310 nm, RX 1490 nm, LC/UPC 8°, 20 km)
- FRITZ!SFP XGS-PON (XGS-PON ITU-T G.9807 TX 1270 nm, RX 1577 nm, è l’unico che usa un SC/UPC, 20 km)


# GPON/OMCI settings

## Setting ONU GPON Serial Number

It is possible to change the serial number ("Modem ID") by editing it in the http://fritz.box/support.lua, in the ASCII format (ZTEG012345678).
If the Fritz!OS Version is => 7.50 and the device is set up to be in Germany, the field "GPON PLOAM GPON serial number" is missing.

{% include image.html file="avm/avm_serial.jpg"  alt="Serial number form" caption="Serial number form" %}


## Setting ONU GPON PLOAM password

It is possible to change the GPON PLOAM passowrd by editing it in the logon data, in the ASCII format (PLOAM)

{% include image.html file="avm/avm_ploam.png"  alt="PLOAM Password form" caption="PLOAM Password form" %}

--
[^aon] [EWE AON Anschluss SFP Transceiver](https://www.glasfaserforum.de/forum/thread/984-ewe-aon-anschluss-sfp-transceiver/)
