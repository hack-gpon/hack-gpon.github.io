## Cooling and temperature monitoring

::: warning Hot surface
PRX126 sticks run hot. Temperatures above 60 °C are within specification, but over time they may reduce the lifespan of the stick: providing some airflow (or a heatsink/fan on the SFP+ cage) is recommended. The 8311 community has published several 3D-printable active cooling designs, e.g. [Printables 1392938](https://www.printables.com/model/1392938) and [Printables 1387322](https://www.printables.com/model/1387322).
:::

The temperature can be read from the host through the SFP DDM (Digital Diagnostic Monitoring):

| Host            | Command                                  |
| --------------- | ---------------------------------------- |
| Linux           | `ethtool -m <interface>`                 |
| FreeBSD/OPNsense/pfSense | `ifconfig -vvv <interface>`     |
| MikroTik RouterOS | `/interface ethernet monitor <sfpX>`   |

With the [8311 community firmware](https://github.com/djGrrr/8311-was-110-firmware-builder) 2.8.2 or later the metrics (CPU and optics temperatures, voltage, PLOAM state, Rx/Tx power, Tx bias) are also exported as JSON at `https://192.168.11.1/cgi-bin/luci/8311/metrics`, which can be used for example by a Home Assistant `rest` sensor.

Source: [pon.wiki: Active Cooling](https://pon.wiki/xgs-pon/ont/bfw-solutions/was-110/#active-cooling) ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)).
