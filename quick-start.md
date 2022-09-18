---
title: Quick Start
has_children: false
nav_order: 2
description:  
layout: default
---

{% include alert.html content="Playing with ONTs can cause your serial number/PLOAM password to be banned and faults to the optics, ONTs and OLTs. Always pay close attention to the calibration of the laser, under no circumstances should the calibration be changed." alert="Warning"  icon="svg-warning" color="red" %}

# Fiber Optic Connectors

Numerous connectors, both standard and proprietary, are used in the ﬁeld of telecommunication equipment, data lines, television and cable, and other industrial fields. 

{% include image.html file="quick-start\optic-fiber-connectors.jpg"  alt="Some of the common connector" caption="Some of the common connector" %}

The main connector are:
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

APC and UPC are different polishing of fiber optic ferrules, and are types of fiber patch cable connectors. Which determine the quality of the fiber optic lightwave transmission, mostly performed in optical return loss and insertion loss.

{% include image.html file="quick-start\apc-upc.jpg" alt="Picture of APC and UPC" caption="Picture of APC and UPC" %}

Angled physical connectors are used in the ONT side to reduce back reflections. In
case RF signal (1550nm) is introduced there will be two signals traveling in the
downstream direction (1490nm + 1550nm), since RF systems are highly sensitive to
reflections then the APC connectors reduce the return loss value.

Next generation systems are planned to operate in over 1500nm wavelengths,
converting APC connectors on the ONT side into planning to the future.



# PON Networks

- PON is a kind of passive optical network featuring one-to-multiple-point architecture;
- PON is short for Passive Optical Network;
- PON consists of Optical Line Terminal (OLT), Optical Network Unit (ONU) and
Passive Optical Splitter.

- APON: ATM Passive Optical Networks
- EPON: Ethernet Passive Optical Networks
- GPON: Gigabit-capable Passive Optical Networks
- XG(S)-GPON: 10 Gigabit-capable Passive Optical Networks

## Why GPON?

- GPON supports Triple - play service, providing competitive all-service solution.
- GPON supports high-bandwidth transmission to break down the bandwidth
bottleneck of the access over twisted pair cables, so as to satisfy the
requirements of high-bandwidth services, such as IPTV and live TV broadcasts.
- GPON supports the long-reach (up to 20 km) service coverage to overcome the
obstacle of the access technology over twisted pair cables and reduce the
network nodes.
- With complete standards and high technical requirements, GPON supports
integrated services in a good way.
GPON is the choice of large carriers in the international market.



# Wavelength

PON adopts Wavelength Division Multiplexing (WDM) technology, facilitating bi-direction communication over a single fiber.

To separate upstream/downstream signals of multiple users over a single fibre, PON adopts two multiplexing mechanism:
- In downstream direction, data packets are transmitted in a broadcast manner;
- In upstream direction, data packets are transmitted in a TDMA manner.

{% include image.html file="quick-start\optical-fiber-transmission-windows.svg"  alt="Fiber Optic Operation Wavelength and Window" caption="Fiber Optic Operation Wavelength and Window" %}

In GPON and 1/1-EPON:
- Upstream 1310 nm (1260 nm-1360 nm)
- Downstream 1490 nm (1480 nm-1500 nm)
- RF-Overlay 1550 nm (1550 nm-1560 nm)

In 10/1-EPON:
- Upstream 1310 nm (1260 nm-1360 nm)
- Downstream 1577.5 nm (1575 nm-1580 nm)
- RF-Overlay 1550 nm (1550 nm-1560 nm)

In XG(S)-GPON and 10/10-EPON:
- Upstream 1270 nm (1260 nm-1280 nm)
- Downstream 1577.5 nm (1575 nm-1580 nm) 
- RF-Overlay 1550 nm (1550 nm-1560 nm)

# Power Budget 

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

# G.984 Series

| G.984.1                 | G.984.2                             | G.984.3                        | G.984.4                            |
| ----------------------- | ----------------------------------- | ------------------------------ | ---------------------------------- |
| General Characteristics | Physical Media Dependant Layer      | Transmission Convergence Layer | ONT Management & Control Interface |
| Architecture            | Bit Rate/coding                     | GTC Protocol                   | Reference model                    |
| Distance/Reach          | Wavelength                          | GTC Framing                    | OMCI requirement                   |
| Split Ratio             | Optical element specs and operation | ONU Activation                 | MIBs                               |
| Protection              | Link budget (amendment)             | Security / FEC                 | OMCC                               |
|                         |                                     | Alarms / Monitoring            |                                    |
|                         |                                     | OMCI                           |                                    |

## General Concepts

- Bit Rate: 1.2Gbit/s Upstream; 2.4Gbit/s Downstream.
- Physical Reach: Max physical distance between OLT and ONT.
- Differential Fiber Distance: Distance between closest and farthest ONT from OLT (max = 20km.)

### GPON Terminology
- ONU Identifier (ONU-ID)
    * 8 bit identifier (0~255)
        * 0 .. 253 Assignable
        * 254 Reserved
        * 255 Broadcast/unassigned
    * OLT assigns to an ONU during the ONU's activation using the PLOAM channel.
    * ONU-ID is unique across the PON and remains valid until the ONU is powered off,
    deactivated by the OLT or moves itself into an inactive state.
- Allocation Identifier (Alloc-ID).
    * Alloc-ID is a 12-bit identifier (0 .. 4095) that the OLT assigns to an ONU’s traffic-bearing entity.
        * 0 .. 253 Default
        * 254 Broadcast
        * 255 Unassigned
        * 256 .. 4095 Assignable
    * A Traffic-bearing entity can be represented either by a T-CONT or by the upstream OMCC.
        * A Transmission Container (T-CONT) is an ONU object representing a group of logical connections that appear as a single entity for the purpose of upstream bandwidth assignment on the PON.
        * Bandwidth assignment and QoS control are performed in every T-CONT by fixed and dynamic methods.
        * There are 5 types of T-CONT Traffic Descriptors:
            *  Type 1: fixed bandwidth type.
            *  Type 2 and Type 3: guaranteed bandwidth types.  
            *  Type 4: best-effort type.
            *  Type 5: mixed type, involving all bandwidth types and bearing all services
    * Each ONU is assigned at least one Alloc-ID which is equal to that ONU's ONU-ID and may be assigned additional Alloc-IDs per the OLT's discretion.
    * Default Alloc-ID is used to carry the upstream PLOAM and OMCC traffic and may carry user data traffic.
- Transmission Containers (TCONT).
- Dynamic Bandwidth Allocation (DBA).

{% include image.html file="quick-start\gpon-terminology.png" alt="GPON Terminology" caption="GPON Terminology" %}

{% include image.html file="quick-start\gtc-layer-frame.png" alt="GTC Layer framing" caption="GTC Layer framing" %}

{% include image.html file="quick-start\gtc-layer-frame.png" alt="Downstream GTC frame" caption="Downstream GTC frame" %}

{% include image.html file="quick-start\gpon-downstream.jpg" alt="GPON Downstream" caption="GPON Downstream" %}

GPON use Broadcast downstream data transmission with AES (Advanced Encryption
Standard) to ensure secure delivery to destination:
- Traffic multiplexing is centralized.
- GEM Port-ID is the key to identify the GEM frames that belong to different downstream logical connections.
- Each ONU filters the downstream GEM frame based on their GEM Port-ID and processes only the GEM frames that belong to that ONU.
- Shaded GEM ports on the figure indicate multicast.

{% include image.html file="quick-start\downstream-multiplexing.png" alt="Downstream multiplexing (shaded GEM port indicates multicast)" caption="Downstream multiplexing (shaded GEM port indicates multicast)" %}

- Downstream, the GEM frames are carried in the GTC payload and arrive at all the ONUs. The ONU framing sublayer extracts the frames, and the GEM TC adapter filters the frames based on their GEM Port-ID. Only frames with the appropriate Port-IDs are allowed through to the GEM client function.
- Upstream, the GEM traffic is carried over one or more T-CONTs. The OLT receives the transmission associated with the T-CONT and the frames are forwarded to the GEM TC adapter and then the GEM client.

{% include image.html file="quick-start\uplane.png" alt="The U-plane protocol stack and identification by Port-ID" caption="The U-plane protocol stack and identification by Port-ID" %}

{% include image.html file="quick-start\gpon-upstream.jpg" alt="GPON Upstream" caption="GPON Upstream" %}
- Use Time Division Multiple Access (TDMA) for upstream data transmission with AES
encryption.
- Dynamic Bandwidth Allocation (DBA).
- Traffic multiplexing is distributed.
- The OLT grants the upstream bandwidth allocation.
- The ONU traffic-bearing entities are identified by their Allocations IDs.
- The alloc-IDs are multiplexed in time as specified by the bandwidth-map (given by the OLT in the downstream frame).
- Within the bandwidth allocation, the ONU uses the GEM Port-IF as key to identify upstream GEM frames

{% include image.html file="quick-start\upstream-multiplexing.png" alt="Upstream multiplexing" caption="Upstream multiplexing" %}


