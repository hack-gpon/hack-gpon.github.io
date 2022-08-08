---
title: Huawei HG8010H 
has_children: false
parent: ONT
---

# Hardware Specifications

|             |                                                 |
| ----------- | ----------------------------------------------- |
| Vendor      | Huawei                                          |
| Model       | HG8010H                                         |
| Chipset     | Realtek                                         |
| Flash       |                                                 |
| RAM         |                                                 |
| System      |                                                 |
| HSGMII      | No                                              |
| Optics      | SC/APC and SC/UPC                               |
| IP address  | 192.168.100.1                                   |
| Web Gui     | ✅ user `root`, password `admin` or `adminHW` and user `telecomadmin`, password `admintelecom` |
| Telnet      | After Enabling user `root`, password `admin` or `adminHW`                                 |
| SSH         |                                                 |
| Form Factor | ONT                                             |


{% include image.html file="HG8010H.jpg"  alt="HG8010H" caption="HG8010H: Horizontal PON port (left, middle); vertical PON port (right)" %}
{% include image.html file="HG8010Hvorr.jpg"  alt="HG8010Hv3/4/5" caption="Bottom of the HG8010Hv3/4/5" %}
{% include image.html file="HG8010Hv6.jpg"  alt="HG8010Hv6" caption="Bottom of the HG8010Hv6" %}
{% include image.html file="HG8010H_Teardown_1.jpg"  alt="HG8010Hv1/2 Teardown" caption="HG8010Hv1/2: Teardown" %}
{% include image.html file="HG8010H_Teardown_2.jpg"  alt="HG8010Hv1/2 Teardown" caption="HG8010Hv1/2: Teardown" %}
{% include image.html file="HG8010H_Teardown_1_v6.jpg"  alt="HG8010Hv6 Teardown" caption="HG8010Hv6: Teardown" %}
{% include image.html file="HG8010H_Teardown_2_v6.jpg"  alt="HG8010Hv6 Teardown" caption="HG8010Hv6: Teardown" %}

## Enabling telnet

We need access to a specific shell and in order to get it we have to enable telnet. On the unit, the telnet server accepts connections but doesn't read any input, nor does it send anything.

To enable telnet we’ll use one of the web interface’s feature: the configuration backup and restore page. The configuration can be downloaded as XML, an XML file that contains a lot more options than the web interface and a couple of them can be modified to enable telnet access: under the `X_HW_CLITelnetAccess` node, set the `Access` attribute to `1` and in `AclServices`, `TELNETLanEnable` should also be set to `1`. I had to set both but your mileage may vary. 

It is possible that in more recent versions this won't work/has been fixed.

Now that this is done, the modified configuration file can be uploaded via the web interface, the ONT will restart and telnet should be accessible on port 23.

## Hardware revisions
- v1: Horizontal PON port 
- v2: Horizontal PON port 
- v3: Vertical PON port
- v4: Vertical PON port
- v5: Vertical PON port
- v6: Vertical PON port

## List of software versions

- HWTCA31610003
- V3R016C10S003 (V300R016C10SPC003B010)
- V5R020C10S020 (V500R020C10SPC020A2011020049)
- V5R020C10S024 (V500R020C10SPC024B001)
- V5R020C10S020 (V500R020C10SPC020B014)

## List of partitions
## List of firmwares and files
# Known Bugs
# Miscellaneous Links

- [Exploring the Huawei HG8010H GPON ONT](https://www.linux.it/~md/text/gpon-sha2017.pdf)
- [Unlock HG8010Hv3 softmode](https://lafibre.info/orange-installation/unlock-hg8010gv3-softmode/)
- [Notes on a Huawei HG810H (N.B. SSL error)](https://umbriel.fr/blog/Notes_on_a_Huawei_HG8010H.html)


