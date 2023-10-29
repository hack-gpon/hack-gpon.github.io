---
title: Quick Start
has_children: false
nav_order: 2
description:  
layout: default
---
{% include alert.html content="Playing with ONTs can cause your serial number/PLOAM password to be banned and faults to the optics, ONTs and OLTs. Always pay close attention to the calibration of the laser, under no circumstances should the calibration be changed." alert="Warning" icon="svg-warning" color="red" %}

The information on this page is taken from the GPON/EPON standard and information from the major vendors of GPON/EPON equipment, each individual item containing a verifiable citation in the standard. Feel free to cite this page as: `{{ page.title }}, Hack GPON. Available at: https://hack-gpon.org{{ page.url }}`.

# Fiber Optic Connectors

Numerous connectors, both standard and proprietary, are used in the field of telecommunications equipment, data lines, television and cable, and other industrial fields. 

{% include image.html file="quick-start/optic-fiber-connectors.jpg"  alt="Some of the most common connectors" caption="Some of the most common connectors" %}

The main connectors are:
- Bionic Connector
- Standard Connector (SC)
- Ferrule Core Connector (FC)
- ST Connector (ST)
- SMA Connector
- Lucent Connector (LC)
- Enterprise Systems Connection Connector (ESCON)
- Fiber Distributed Data Interface Connector (FDDI)
- Opti-Jack Connector
- LX-5 Connector
- Volition Connector
- MT-RJ Connector
- MU Connector
- MT Connector
- E2000 Connector

## Polishing of Fiber Optic Connectors

APC and UPC use different polishing methodologies of fiber optic ferrules, and they define types of fiber patch cable connectors. These determine the quality of the fiber optic lightwave transmission, mostly calculated in optical return loss and insertion loss[^wolon].

{% include image.html file="quick-start/apc-upc.jpg" alt="Picture of APC and UPC connections" caption="Picture of APC and UPC" %}

Angled physical connectors are used on the ONT's side to reduce back-reflections. In case RF signals (1550nm) are introduced, there will be two signals traveling in the downstream direction (1490nm + 1550nm); as RF systems are highly sensitive to reflections the APC connectors reduce the return loss value[^zyxel] and are preferred over UPC.

Next generation systems are planned to operate in wavelengths over 1500nm, making APC connectors on the ONT's side something that will be more commonplace in the future[^zyxel].

# PON Networks[^huawei]

- PON is a kind of passive optical network featuring point-to-multiple-point architecture;
- PON is short for Passive Optical Network;
- PON consists of Optical Line Terminal (OLT), Optical Network Unit (ONU) and Passive Optical Splitter.

- APON: ATM Passive Optical Networks;
- EPON: Ethernet Passive Optical Networks;
- GPON: Gigabit-capable Passive Optical Networks;
- XG(S)-GPON: 10 Gigabit-capable Passive Optical Networks[^standardxgpon];

EPON and GPON are complementary and compete against each other under some aspects. So in the following contents, we'd like to render the EPON and GPON comparison more clear[^fs].

## Why GPON?

- GPON is defined by ITU, International Telecomunication Union[^standardgpon].
- GPON supports Triple-play services, providing a competitive full-service solution[^huawei].
- GPON supports high-bandwidth transmission to break down the bandwidth bottleneck of the access over twisted pair cables, so as to satisfy the requirements of high-bandwidth services, such as IPTV and live TV broadcasts[^huawei].
- GPON supports long-reach (up to 20 km) service coverage to overcome the obstacle of the access technology over twisted pair cables and reduce the network nodes[^huawei].
- With complete standards and high technical requirements, GPON supports integrated services in a good way[^huawei].
- GPON is the choice of large carriers in the international market[^huawei].
- GPON is high broadband efficiency, around 92%[^huawei].
- GPON has integrated QoS handling that makes it better than EPON, because QoS on EPON is higher cost relative to GPON[^fs].
- GPON supports splitting up to 1:128, XG(S)-PON up to 1:256[^fs],[^standardxgpon].
- Security: the data transmitted to ONUs/ONTs is encrypted using the AES mechanism[^telecom].


## Why EPON?
- EPON is defined by IEEE 802.3 standard, ratified as 802.3ah-2004 for 1.25 Gbps (1.0 Gbps prior to 8B/10B coding) and IEEE 802.3av standard for 10Gbps (10G-EPON)[^standard1epon],[^standard10epon].
- 1/1-EPON supports splitting up to 1:32, 10/*-EPON up to 1:128[^fs],[^standard10epon].
- In EPON, both downstream and upstream line rates are 1.25 Gbps, but due to the 8B/10B line encoding, the bit rate for data transmission is 1 Gbps[^medium].
- The use of EPON allows carriers to eliminate complex and expensive ATM and Sonet elements and to simplify their networks, thereby lowering costs to subscribers. Currently, GPON equipment costs are approximately 1.5 to 2 times higher than an EPON[^medium],[^fs].

## Layering model 

Layering model and the associated management services are all mapped over Ethernet (directly or via IP). 

- GPON supports the encapsulation of other protocols besides Ethernet, such as ATM[^cisco],[^huawei],[^fs].
- XG(S)-PON removes the support of ATM encapsulation[^telecom].
- GPON uses two layers of encapsulation. First, TDM and Ethernet frames are wrapped into GTC Encapsulation Method (GEM) frames, which have a GFP-like format (derived from Generic Frame Procedure ITU G.7401). Secondly, ATM and GEM frames are both encapsulated into GTC frames that are finally transported over the PON[^medium],[^fs].
- The main purpose of GEM frames is to provide a frame-oriented service, as an alternative to ATM, in order to efficiently accommodate Ethernet and TDM frames. With GEM, all traffic is mapped across the GPON network using a variant of SONET/SDH GFP. GEM supports a native transport of voice, video, and data without an added ATM or IP encapsulation layer. That's why GPON supports downstream rates as high as 2.5 Gbps and upstream rates from 155 Mbps to 2.5 Gbps. It is much faster than EPON[^medium]. 
- However, EPON clearly offers a much simpler and more straightforward solution than GPON. The support of ATM and the double encapsulation of GPON serve no real benefit over a pure Ethernet transport scheme[^medium].
- In EPON, Ethernet frames are carried in their native format over the PON, which greatly simplifies the layering model and the associated management. EPON employs a single layer that uses IP (Internet Protocol) to carry data, voice, and video[^medium],[^fs].

{% include image.html file="epon_gpon.jpg"  alt="EPON vs GPON Layers" caption="EPON vs GPON Layer" %}

## Comunication between ONTs and OLT[^fs]

- EPON utilizes IEEE 802.3ah OAM messages for provisioning, fault isolation and performance monitoring in conjunction with SNMP (Simple Network Management Protocol) sets and gets through IETF (Internet Engineering Task Force) and MIBs (Management Information Bases). Additional control messages are MPCP GATEs/REPORTs for bandwidth granting.
- In GPON there are three different types of control messages: OMCI (ONT Management and Control Interface), OAM, and PLOAM (Physical Layer OAM). Their roles are shown in the table below.

| Control channel | Format          | Used for                                                                                                           |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ |
| OMCI            | Ethernet or ATM | Provisioning of ONT service defining layers above the GTC                                                          |
| Embedded OAM    | Header overhead | BW granting, encryption key switching, and DBA                                                                     |
| PLOAM           | ATM             | Auto discovery and all other PMD and GTC management info. PLOAM messages are directed to ONTs or FF for broadcasts |


## Wavelength[^huaweimultiplexing]

PON adopts Wavelength Division Multiplexing (WDM) technology, facilitating bidirectional communication over a single fiber.

To separate upstream/downstream signals of multiple users over a single fiber, PON adopts two multiplexing mechanism:
- In downstream direction, data packets are transmitted in a broadcast manner;
- In upstream direction, data packets are transmitted using TDMA.

{% include image.html file="quick-start/optical-fiber-transmission-windows.svg"  alt="Fiber Optic Operation Wavelength and Window" caption="Fiber Optic Operation Wavelength and Window" %}


|            | GPON                      | 1/1-EPON                  | XG(S)-GPON                  | 10/1-EPON                   | 10/10-EPON                  |
| ---------- | ------------------------- | ------------------------- | --------------------------- | --------------------------- | --------------------------- |
| Upstream   | 1310 nm (1260 nm-1360 nm) | 1310 nm (1260 nm-1360 nm) | 1270 nm (1260 nm-1280 nm)   | 1310 nm (1260 nm-1360 nm)   | 1270 nm (1260 nm-1280 nm)   |
| Downstream | 1490 nm (1480 nm-1500 nm) | 1490 nm (1480 nm-1500 nm) | 1577.5 nm (1575 nm-1580 nm) | 1577.5 nm (1575 nm-1580 nm) | 1577.5 nm (1575 nm-1580 nm) |
| RF-Overlay | 1550 nm (1550 nm-1560 nm) | 1550 nm (1550 nm-1560 nm) | 1550 nm (1550 nm-1560 nm)   | 1550 nm (1550 nm-1560 nm)   | 1550 nm (1550 nm-1560 nm)   |

# Power Budget[^zyxel],[^cisco]

- Splitter attenuation

| Splitter Type | Attenuation |
| ------------- | ----------- |
| 1:2           | ≤ 3.5 dB    |
| 1:4           | ≤ 7.0 dB    |
| 1:8           | ≤ 10.5 dB   |
| 1:16          | ≤ 14.0 dB   |
| 1:32          | ≤ 17.5 dB   |
| 1:64          | ≤ 20.5 dB   |
| 1:128         | ≤ 24.0 dB   |

- Loop attenuation: ≤ 0.5 dB (Per Km)

- Connector attenuation: ≤ 0.3 dB (Per Connector)

# Classes for laser[^cisco]

|              | Class A | Class B | Class B+ | Class C |
| ------------ | ------- | ------- | -------- | ------- |
| Minimum loss | 5 dB    | 10 dB   | 13 dB    | 15 dB   |
| Maximun loss | 20 dB   | 25 dB   | 28 dB    | 30 dB   |

The requirements of a particular class may be more stringent for one system type than for another.

<hr>

[^standardgpon]: *G.984.1: Gigabit-capable passive optical networks (GPON): General characteristics* https://www.itu.int/rec/T-REC-G.984.1
[^standardxgpon]: *G.987.1: 10-Gigabit-capable passive optical networks (XG-PON): General requirements* https://www.itu.int/rec/T-REC-G.987.1
[^standard1epon]: *IEEE 802.3ah-2004: IEEE Standard for Information technology-- Local and metropolitan area networks-- Part 3: CSMA/CD Access Method and Physical Layer Specifications Amendment: Media Access Control Parameters, Physical Layers, and Management Parameters for Subscriber Access Networks* https://standards.ieee.org/ieee/802.3ah/3179/
[^standard10epon]: *IEEE 802.3av-2009: IEEE Standard for Information technology-- Local and metropolitan area networks-- Specific requirements-- Part 3: CSMA/CD Access Method and Physical Layer Specifications Amendment 1: Physical Layer Specifications and Management Parameters for 10 Gb/s Passive Optical Networks* https://standards.ieee.org/ieee/802.3av/4060/
[^fs]: *Comparison of EPON and GPON* https://community.fs.com/blog/comparison-of-epon-and-gpon.html
[^zyxel]: *GPON E2E Fundamentals*, Zyxel 2018
[^huawei]: *GPON Fundamentals*, Huawei 2010  http://jm.telecoms.free.fr/QCM_Fibre/GPON-Fundamentals_Huawei.pdf
[^broadbandforum]: *GPON in FTTx Broadband Deployments*, Broadband Forum 2010 https://www.broadband-forum.org/download/MR-246.pdf
[^wolon]: *Fiber SFP Module Compatibility with APC, UPC, PC* https://www.wolonte.com/news.asp?id=599
[^cisco]: *Understand GPON Technology* https://www.cisco.com/c/en/us/support/docs/switches/catalyst-pon-series/216230-understand-gpon-technology.html
[^medium]: *HTFuture: EPON vs GPON Standard* https://medium.com/@ivyhtfuture/epon-vs-gpon-standard-b8ec20c55bb3
[^telecom]: *Fifty Years of Fixed Optical Networks Evolution: A Survey of Architectural and Technological Developments in a Layered Approach* https://doi.org/10.3390/telecom3040035
[^huaweimultiplexing]: *GPON Principle---Data Multiplexing* https://forum.huawei.com/enterprise/en/gpon-principle-data-multiplexing/thread/458243-100181

