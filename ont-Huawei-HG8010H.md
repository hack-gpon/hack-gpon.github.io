---
title: Huawei HG8010H 
has_children: false
parent: ONT
---

# Hardware Specifications

|             |                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------- |
| Vendor      | Huawei                                                                                         |
| Model       | HG8010H                                                                                        |
| Chipset     | Hisilicon                                                                                      |
| Flash       |                                                                                                |
| RAM         |                                                                                                |
| System      |                                                                                                |
| HSGMII      | No                                                                                             |
| Optics      | SC/APC and SC/UPC                                                                              |
| IP address  | 192.168.100.1                                                                                  |
| Web Gui     | ✅ user `root`, password `admin` or `adminHW` and user `telecomadmin`, password `admintelecom` |
| Telnet      | After Enabling user `root`, password `admin` or `adminHW`                                      |
| SSH         |                                                                                                |
| Form Factor | ONT                                                                                            |


{% include image.html file="HG8010H.jpg"  alt="HG8010H" caption="HG8010H: Horizontal PON port (left, middle); vertical PON port (right)" %}
{% include image.html file="HG8010Hvorr.jpg"  alt="HG8010Hv3/4/5" caption="Bottom of the HG8010Hv3/4/5" %}
{% include image.html file="HG8010Hv6.jpg"  alt="HG8010Hv6" caption="Bottom of the HG8010Hv6" %}

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
- V3R013C10S112
- V3R015C10S106
- V3R016C10S003 (V300R016C10SPC003B010)
- V3R017C00S100
- V3R017C10S201
- V5R020C10S020 (V500R020C10SPC020B014 - V500R020C10SPC020A2011020049)
- V5R020C10S024 (V500R020C10SPC024B001)
- V5R020C10S025 (V500R020C10SPC025B002)
- V5R020C10S115 (V500R020C10SPC115B270)

## List of partitions
## List of firmwares and files
## List of useful commands

**All results need to be converted from Hex to Ascii**
- Get OLT information:

```
WAP>omcicmd mib show meid 131 instid 0

  -------------------------------------------------------
  Me(OLT-G), instance(0x0), instance size is 54
  -------------------------------------------------------
  Att1, AttSize = 0x4, AttContent: 48575443
  Att2, AttSize = 0x14, AttContent: 00000000 00000000 00000000 00000000 00000000
  Att3, AttSize = 0xe, AttContent: 31300000 00000000 00000000 0000
  Att4, AttSize = 0xe, AttContent: 00000000 00000000 00000000 0000
  -------------------------------------------------------

success!
```
*0x48575443* → *HWTC* (Huawei)

- Get SW Version 0 and 1:

```
WAP>omcicmd mib show meid 7 instid 0

  -------------------------------------------------------
  Me(Software Image), instance(0x0), instance size is 19
  -------------------------------------------------------
  Att1, AttSize = 0xe, AttContent: 56355230 32304331 30533131 3500
  Att2, AttSize = 0x1, AttContent: 00
  Att3, AttSize = 0x1, AttContent: 00
  Att4, AttSize = 0x1, AttContent: 01
  -------------------------------------------------------

success!
WAP>omcicmd mib show meid 7 instid 1

  -------------------------------------------------------
  Me(Software Image), instance(0x1), instance size is 19
  -------------------------------------------------------
  Att1, AttSize = 0xe, AttContent: 56355230 32304331 30533131 3500
  Att2, AttSize = 0x1, AttContent: 01
  Att3, AttSize = 0x1, AttContent: 01
  Att4, AttSize = 0x1, AttContent: 01
  -------------------------------------------------------

success!
```
*0x56355230 32304331 30533131 3500* → *V5R020C10S115*

- Get ONT Vendor ID and HW Version:

```
WAP>omcicmd mib show meid 256 instid 0

  -------------------------------------------------------
  Me(ONT-G), instance(0x0), instance size is 73
  -------------------------------------------------------
  Att1, AttSize = 0x4, AttContent: 48575443
  Att2, AttSize = 0xe, AttContent: 32343046 2e410000 00000000 0000
  Att3, AttSize = 0x8, AttContent: 2a2a2a2a 2a2a2a2a
  Att4, AttSize = 0x1, AttContent: 00
  Att5, AttSize = 0x1, AttContent: 00
  Att6, AttSize = 0x1, AttContent: 00
  Att7, AttSize = 0x1, AttContent: 00
  Att8, AttSize = 0x1, AttContent: 00
  Att9, AttSize = 0x1, AttContent: 00
  Att10, AttSize = 0x18, AttContent: 2a2a2a2a 2a2a2a2a 2a2a2a2a 2a2a2a2a 2a2a2a2a 2a2a2a2a
  Att11, AttSize = 0xc, AttContent: 2a2a2a2a 2a2a2a2a 2a2a2a2a
  Att12, AttSize = 0x1, AttContent: 00
  Att13, AttSize = 0x2, AttContent: 0001
  -------------------------------------------------------

success!
```

*0x48575443* → *HWTC*
*0x32343046 2e41* → *240F.A*

- Get ONT Equipment ID:

```
WAP>omcicmd mib show meid 257 instid 0

  -------------------------------------------------------
  Me(ONT2-G), instance(0x0), instance size is 44
  -------------------------------------------------------
  Att1, AttSize = 0x14, AttContent: 48473830 31304876 36000000 00000000 00000000
  Att2, AttSize = 0x1, AttContent: b0
  Att3, AttSize = 0x2, AttContent: 0240
  Att4, AttSize = 0x1, AttContent: 01
  Att5, AttSize = 0x1, AttContent: 01
  Att6, AttSize = 0x2, AttContent: 0040
  Att7, AttSize = 0x1, AttContent: 02
  Att8, AttSize = 0x1, AttContent: 01
  Att9, AttSize = 0x2, AttContent: 0020
  Att10, AttSize = 0x4, AttContent: 00000000
  Att11, AttSize = 0x2, AttContent: 007d
  Att12, AttSize = 0x1, AttContent: 00
  Att13, AttSize = 0x2, AttContent: 0018
  Att14, AttSize = 0x2, AttContent: 0001
  -------------------------------------------------------

success!
```

*0x48473830 31304876 36* → *HG8010Hv6*

# Known Bugs
# Miscellaneous Links

- [Exploring the Huawei HG8010H GPON ONT](https://www.linux.it/~md/text/gpon-sha2017.pdf)
- [Unlock HG8010Hv3 softmode](https://lafibre.info/orange-installation/unlock-hg8010gv3-softmode/)
- [Notes on a Huawei HG810H (N.B. SSL error)](https://umbriel.fr/blog/Notes_on_a_Huawei_HG8010H.html)


# Theardown and other photos

## v1-2

{% include image.html file="HG8010H_Teardown_1.jpg"  alt="HG8010Hv1/2 Teardown" caption="HG8010Hv1/2: Teardown" %}
{% include image.html file="HG8010H_Teardown_2.jpg"  alt="HG8010Hv1/2 Teardown" caption="HG8010Hv1/2: Teardown" %}

## v6

{% include image.html file="HG8010H_Teardown_1_v6.jpg"  alt="HG8010Hv6 Teardown" caption="HG8010Hv6: Teardown" %}
{% include image.html file="HG8010H_Teardown_2_v6.jpg"  alt="HG8010Hv6 Teardown" caption="HG8010Hv6: Teardown" %}


