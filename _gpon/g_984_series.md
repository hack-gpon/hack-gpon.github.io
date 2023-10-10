---
title: GPON G.984 Series
has_children: false
nav_order: 3
layout: default
---

The information on this page is taken from the GPON standard and information from the major vendors of GPON equipment, each individual item containing a verifiable citation in the standard. Feel free to cite this page as: `{{ page.title }}, Hack GPON. Available at: https://hack-gpon.org{{ page.url }}`.

| G.984.1                 | G.984.2                             | G.984.3                        | G.984.4                            | G.988 (ex G.Imp984.4)    |
| ----------------------- | ----------------------------------- | ------------------------------ | ---------------------------------- | ------------------------ |
| General Characteristics | Physical Media Dependant Layer      | Transmission Convergence Layer | ONT Management & Control Interface | OMCI Implementer's Guide |
| Architecture            | Bit Rate/coding                     | GTC Protocol                   | Reference model                    |                          |
| Distance/Reach          | Wavelength                          | GTC Framing                    | OMCI requirement                   |                          |
| Split Ratio             | Optical element specs and operation | ONU Activation                 | MIBs                               |                          |
| Protection              | Link budget (amendment)             | Security / FEC                 | OMCC                               |                          |
|                         |                                     | Alarms / Monitoring            |                                    |                          |
|                         |                                     | OMCI                           |                                    |                          |

# General Concepts[^zyxel]

- Bitrate: 1.2 Gbps Upstream; 2.4 Gbps Downstream.
- Physical Reach: Max physical distance between OLT and ONT.
- Differential Fiber Distance: Distance between closest and farthest ONT from OLT (max = 20km)

## Basic Performance Parameters[^cisco]

| Upstream (Rate - Gbps) | Downstream (Rate - Gbps) |
| ---------------------- | ------------------------ |
| 0.15552                | 1.24416                  |
| 0.62208                | 1.24416                  |
| 1.24416                | 1.24416                  |
| 0.15552                | 2.48832                  |
| 0.62208                | 2.48832                  |
| **1.24416**            | **2.48832**              |
| 2.48832                | 2.48832                  |

1.24416 Gbps up, 2.48832 Gbps down is the most supported speed combination at current time.

# GPON Terminology

{% include image.html file="quick-start/gpon-terminology.png" alt="Overview of GPON Terminology" caption="Overview of GPON Terminology" %}

## ONU Identifier (ONU-ID)[^zyxel]
* 8 bit identifier (0~255)
    * 0 .. 253 Assignable
    * 254 Reserved
    * 255 Broadcast/unassigned
* The OLT assigns an id to any ONU during the ONU's activation using the PLOAM channel.
* ONU-ID is unique across the PON and remains valid until the ONU is powered off, deactivated by the OLT or moves itself into an inactive state.

## Allocation Identifier (Alloc-ID)[^zyxel]
* Alloc-ID is a 12-bit identifier (0 .. 4095) that the OLT assigns to an ONU's traffic-bearing entity.
    * 0 .. 253 Default
    * 254 Broadcast
    * 255 Unassigned
    * 256 .. 4095 Assignable
* A Traffic-bearing entity can be represented either by a T-CONT or by the upstream OMCC.

## Transmission Containers (T-CONT)[^zyxel],[^broadbandforum]
A Transmission Container (T-CONT) is an ONU object representing a group of logical connections that appear as a single entity for the purpose of upstream bandwidth assignment on the PON.
* Bandwidth assignment and QoS control are performed in every T-CONT by fixed and dynamic methods.
* There are 5 types of T-CONT Traffic Descriptors:
    * Type 1: fixed bandwidth;
    * Type 2 and Type 3: guaranteed bandwidth;  
    * Type 4: best-effort;
    * Type 5: mixed type, involving all bandwidth types and bearing all services

| Type 1    | Type 2    | Type 3    | Type 4 | Type 5           |
| --------- | --------- | --------- | ------ | ---------------- |
| SIR       |           |           |        | SIR              |
|           | AIR       | AIR       |        | AIR              |
| PIR = SIR | PIR = AIR | PIR > AIR | PIR    | PIR >= SIR + AIR |

* For TR-156 and TR-167, each T-CONT represents a traffic class
* Each ONU is assigned at least one Alloc-ID which is equal to that ONU's ONU-ID and may be assigned additional Alloc-IDs per the OLT's discretion.
    * Typically have 4 T-CONTs, supporting 4 traffic classes, plus an extra one for OMCI
* The default Alloc-ID is used to carry the upstream PLOAM and OMCC traffic and may carry user data traffic.
* The OLT schedules upstream traffic across all ONUs according to the priority and weight assigned to each T-CONT, and their buffer occupancy. Other bandwidth assignment mechanisms are available, for example fixed bandwidth, assured bandwidth, and nonassured bandwidth[^broadbandforum].


## Dynamic Bandwidth Allocation (DBA)

{% include image.html file="quick-start/pon_dba.jpg" alt="PON DBA Abstraction" caption="PON DBA Abstraction" %}


Dynamic Bandwidth Allocation (DBA) is a technique by which traffic bandwidth in a shared telecommunications medium can be allocated on demand and fairly between different users of that bandwidth. It is performed on the upstream traffic[^zyxel].

With DBA, the OLT assesses the bandwidth needs of the ONUs in real time and allocates upstream PON capacity accordingly[^broadbandforum].

DBA basic model supports[^zyxel]:
- Fixed bandwidth (highest priority)
- Assured bandwidth
- Non-assured bandwidth
- Best-effort bandwidth (lowest priority)

{% include image.html file="quick-start/bda-pratical.jpg" alt="Bandwidth Assignment practical example" caption="Bandwidth Assignment practical example" %}

## GPON transmission basics[^cisco]

Key Terms:
- Physical layer overhead upstream (PLOu) - Upstream physical layer overhead.
- Physical layer OAM upstream (PLOAMu) - PLOAM messages of upstream data. Think of this as a message-based operation and management channel between the OLT and ONU/ONTs. 
- Power level sequence upstream (PLSu) - Upstream power level sequence 
- Dynamic bandwidth report upstream (DBRu) - Upstream dynamic bandwidth report
Payload - User data 
- PCBd - Physical Control Block downstream
- OMCC - Optical Network Unit Management and Control Channel
- OMCI - Optical Network Unit Management and Control Interface

### GPON Encapsulation

GPON uses two layers of encapsulation:

1. TDM and Ethernet frames are wrapped into GTC Encapsulation Method (GEM) frames, which have a GFP-like format (derived from Generic Frame Procedure ITU G.7401). 
The main purpose of the GEM frame is to provide a frame-oriented service, as an alternative to ATM, in order to efficiently accommodate Ethernet and TDM frames. With GEM, all traffic is mapped across the GPON network using a variant of SONET/SDH GFP. GEM natively supports transportation of voice, video, and data without an added ATM or IP encapsulation layer[^medium],[^fs].
2. ATM and GEM frames are both encapsulated into GTC frames that are finally transported over the PON[^medium],[^fs].

ITU-T G.984 defines GEM as the only data transport scheme for GPON. Bandwidth allocation in GPON grants individual transmission opportunities to the ONU's traffic-bearing entities on the timescale of a single GTC frame[^zyxel].

As shown in the image, the difference between a downstream and upstream frame. 

{% include image.html file="quick-start/gtc-layer-framing.png" alt="Downstream and Upstream GTC frame" caption="Downstream and Upstream GTC frame" %}

### Downstream[^zyxel],[^broadbandforum],[^cisco]

{% include image.html file="quick-start/gpon-downstream.jpg" alt="GPON Downstream" caption="GPON Downstream" %}

A downstream GPON frame has a fixed length of 125 μs and is 38880 bytes long which corresponds to the downstream data rate of 2.48832 Gbps, comprised of two components: physical control block downstream (PCBd) and payload.

{% include image.html file="quick-start/gtc-layer-frame.png" alt="GTC Layer framing" caption="GTC Layer framing" %}

The PCBd length range depends on the number of allocation structures per frame. 

The OLT broadcasts PCBd to all ONU/ONTs. The ONU/ONTs receive the PCBd and performs operations based on the information received. GPON use Broadcast downstream data transmission with AES (Advanced Encryption Standard) to ensure secure delivery to destination:
- Traffic multiplexing is centralized.
- GEM Port-ID is the key to identify the GEM frames that belong to different downstream logical connections.
- Only frames with the appropriate Port-IDs are allowed through to the GEM client function.
- Each ONU filters the downstream GEM frame based on their GEM Port-ID and processes only the GEM frames that belong to that ONU.

PCBd consists of the GTC header and BWmap:
- GTC Header - Used for frame delimitation, synchronization, and forward error correction (FEC).
- BWmap - Field notifies very ONU of upstream bandwidth allocation. Specifies the start and end upstream time slots for the T-CONTs of each ONU. This ensures that all ONUs send data based on the time slots specified by the OLT to prevent data conflict.

{% include image.html file="quick-start/downstream-multiplexing.png" alt="Downstream multiplexing (shaded GEM port indicates multicast)" caption="Downstream multiplexing (shaded GEM port indicates multicast)" %}

1. The OLT sends Ethernet frames from Uplink ports to the GPON service processing module based on configured rules to the PON ports.
2. The GPON service processing module then encapsulates the Ethernet frames into GEM port data packets for downstream transmission. 
3. GPON transmission convergence (GTC) frames that contain GEM PDUs are broadcast to all ONT/ONUs connected to the GPON port.
4. The ONT/ONU filters the received data based on the GEM port ID contained in the GEM PDU header and only retains data significant to the GEM ports on this ONT/ONU.
5. The ONT decapsulates the data and sends the Ethernet frames to the end users via service ports.

### Upstream[^zyxel],[^broadbandforum],[^cisco]

{% include image.html file="quick-start/gpon-upstream.jpg" alt="GPON Upstream" caption="GPON Upstream" %}

In the Upstream channel, GEM traffic is carried over one or more T-CONTs. The OLT receives the transmission associated with the T-CONT and the frames are forwarded to the GEM TC adapter and then the GEM client.

- Use Time Division Multiple Access (TDMA) for upstream data transmission w/o AES encryption.
    * Distance between the OLT and ONT/ONU is measured (Ranging):
        * The OLT starts the process on an ONU when the ONU first registers with the OLT and obtains round trip delay (RTD) of the ONU. Based on the RTD, other key components are identified:
        * Calculation of the physical reach of that specific ONU, as this OLT requires a proper equalization delay (EqD) for each ONU based on physical reach.
        * RTC and EqD synchronize data frames sent by all ONUs.
    * Time slots are allocated based on distance. In order to prevent data conflict (collisions), the OLT must be able to precisely measure the distance between itself and each ONU to provide a proper time slot to facilitate data upstream. This allows the ONUs to send data at specified time slots, to prevent issues upstream. This process is achieved through a technique called ranging. 
    * The ONT/ONU sends traffic upstream based on the granted time slot.
- Dynamic Bandwidth Allocation (DBA) enables the OLT to monitor in real-time, congestion, bandwidth usage, and configuration.
- Traffic multiplexing is distributed.
- The OLT grants upstream bandwidth allocation.
- The ONU traffic-bearing entities are identified by their Allocations IDs.
- Alloc-IDs are multiplexed in time as specified by the bandwidth-map (provided by the OLT in the downstream frame).
- Within its bandwidth allocation, the ONU uses the GEM Port-IF as key to identify upstream GEM frames.
- Each upstream frame contains the content carried by one or more T-CONTs.
- All ONUs connected to a GPON port share the upstream bandwidth.
- All ONUs send their data upstream at their own time slots based on bandwidth map (BWmap) requirements. 
- Each ONU reports the status of data to be sent to the OLT by use of upstream frames. OLT uses DBA to allocate upstream time slots to ONUs and sends updates in each frame.
- Burst Technology: Upstream packet flow is achieved via bursts, with each ONU/ONT responsible for data transmission within its allocated time slots. When an ONU/ONT is not within its time slot, the device disables transmission of its optical transceiver to prevent other ONU/ONT impact. 


{% include image.html file="quick-start/upstream-multiplexing.png" alt="Upstream multiplexing" caption="Upstream multiplexing" %}

1. ONT/ONUs send Ethernet frames to GEM ports based on configured rules that map service ports and GEM ports.
2. GEM ports encapsulate the Ethernet frames into GEM PDUs and add these PDUs to T-CONT queues based on rules that map GEM ports and T-CONT queues.
3. T-CONT queues use time slots based on DBA, then transmit upstream GEM PDUs to the OLT.
4. OLT decapsulates the GEM PDU, the original Ethernet frame is now seen.
5. OLT sends the Ethernet frames from a specified uplink port based on rules that map service ports and uplink ports. 

## Protocol stack for the C/M-plane[^standardgpon] 

The control and management plane in the GTC system consists of three parts: embedded OAM,
PLOAM and OMCI. The embedded OAM and PLOAM channels manage the functions of the PMD
and the GTC layers. The OMCI provides a uniform system for managing higher (service-defining)
layers.

{% include image.html file="quick-start/uplane.png" alt="The U-plane protocol stack and identification by Port-ID" caption="The U-plane protocol stack and identification by Port-ID" %}

## Configuration Methods[^zyxel]

Several methods are available for the installation and activation of the ONU.
– Method A: Match serial number and password.
– Method C: Match PLOAM password or serial number.
– Method C-autolock: Match serial number.
– Method D: Volatile auto provision by template.
– Method E: Non-volatile auto provision by template.

If the ONU is not legal, the ONU registration activation will fail, see [GPON Auth](/gpon-auth) for the ONU States.

## Protocol Stacks[^cisco],[^fs]

The GPON protocol has its own stack, just Ethernet or IP.

{% include image.html file="gpon.jpg" alt="PON DBA Abstraction" caption="PON DBA Abstraction" %}

### Ethernet over GEM[^standardgpon]

The Ethernet frames are carried directly in the GEM frame payload. The preamble and start frame delimiter (SFD) bytes are discarded prior to GEM encapsulation. Each Ethernet frame shall be mapped to a single GEM frame (as shown in Figure) or multiple GEM frames, in which case the fragmentation rules apply.

{% include image.html file="quick-start/gem_frame.jpg" alt="Frame structure for Ethernet mapping into GEM frame" caption="Frame structure for Ethernet mapping into GEM frame" %}

Resolves Ethernet frames and directly maps the data of Ethernet frames into the GEM payload. GEM frames automatically encapsulate header information.

1:1 alignment between an Ethernet Frame and GEM Frame. 

## OMCI[^cisco]

- ONU Management and Control Interface (OMCI) messages are used to discover ONT/ONUs for management and control.
- These specialized messages are sent over dedicated GEM ports established between an OLT and an ONT/ONU.
- The OMCI protocol allows an OLT to:
   * Establish and release connections with the ONT.
   * Manage the UNIs on the ONT.
   * Request configuration information and performance statistics.
   * Autonomously alert events, such as a link failure.
- Key Points:
   * Protocol runs over a GEM connection between the OLT and ONT.
   * GEM connection is established while the ONT initializes.
   * Protocol operation is asynchronous - OLT controller functions as a primary, ONT controller as secondary. 

### Management Information Base (MIB) and Management entities (ME's)[^arsat]

MIBs (Management Information Base) formed by Management Entities (MEs) are used to fully describe the ONU configuration, status and several other actions.

OMCI constitutes the protocol which supports the set of actions performed over an ONU to create, delete and more on those MEs

- A Managed Entity (ME) is composed of attributes, actions and notifications defining its characteristics.
- Managed Entity (ME Class Value)
    - Purpose of the entity
    - Autonomously instantiated by the ONU or explicitly created by the OLT
    - Relationship(s) with other managed entities
- Attributes: Attribute Definition
    - ME id: provides a unique number for each instance of this managed entity.
    - List of attributes: Attribute Number within ME determined by the order in which attributes are listed
- Actions: operations that may be performed on the entity (Create/Get/Set/Test, etc.)
- Notifications (Alarm, AVC, TCA, Test Result)
- There can be multiple instances of any Managed Entity: each instance has the same attributes, actions and notifications even though the values of the attributes may be different from one another.

### VEIP and PPTP[^huaweiveip],[^cdatatec]

According to the application, ONU can be divided into six types, namely SFU (Single Family Unit) ONU, HGU (Home Gateway Unit) ONU, MDU (Multi-Dwelling Unit) ONU, SBU (Single Business Unit) ONU, MTU (Multi-Tenant Unit) ONU and CBU (Cellular Backhaul Unit) ONU. However, only SFU (Single Family Unit) ONU and HGU (Home Gateway Unit) ONU are used by the end-users in practical applications.

HGU ONU takes the Virtual Ethernet Interface Point (VEIP) as an OMCI administrative domain and a non-OMCI administrative domain (like TR-069). At the switchover point of the data plane, the ME can be managed only through the OMCI and is visible to the non-OMCI management domain, but not manageable. Similarly, all UNI-side modules under the VEIP are invisible to and cannot be managed by the OMCI. They are visible and manageable only to the non-OMCI management domain. In addition, each ONU should have only one VEIP.

When the ONU uploads MIBs, the ONU reports only the mandatory MEs and supported optional MEs. It does not report the MEs related to LOID authentication, performance monitoring and T-CONT MEs of the OMCC channel.

The ONU should be used according to the device type and report either VEIP or PPTP during MIB upload. The SFU only uses and reports PPTP. VEIP should not be used. HGUs can only use and report VEIPs. PPTP should not be used. The OLT determines the ONU type based on the ONU Type attribute in ME:ONU Capability. Only one VEIP is allowed in each HGU. ONUs will report VEIP or PPTP (Physical Path Termination Point) when MIB is uploaded according to the type of the device, while HGUs can only use and report VEIP rather than PPTP. The OLT will judge the type of each ONU device according to the ONU type attribute in ONU capability.

{% include image.html file="quick-start/veip.jpg" alt="Service Process of HGU ONU" caption="Service Process of HGU ONU" %}


SFU ONUs only support the OMCI management domain. PPTP is what SFU uses and reports, while VEIP is not available. The processing mode of OMCI configured data flow is different from that of RG flow. For OMCI data flow, there is a one-to-one mapping between the GEM port on the WAN side and the UNI port on the LAN side. All data packets can pass through without MAC address learning or forwarding. Wireless interfaces are not allowed in OMCI.

SFU ONUs are designed for a single family unit with broadband access terminal function without a more complex home gateway function from the perspective of application and ONU capacity. SFU ONUs, mainly used in FTTH scenarios, typically have 1 or 4 Ethernet interfaces and are available for Ethernet / IP services, optional VoIP services (built-in IAD), or CATV services.

SFU ONUs work under bridging mode (layer 2 of ISO model), support multiple VLAN functions, and their Ethernet port can be configured and managed by the OLT through OMCI / OAM. Combined with a home gateway, SFU ONUs are good at providing strong service capability.

<hr>

[^standardgpon]: *G.984.3: Gigabit-capable passive optical networks (GPON): Transmission convergence layer specification* https://www.itu.int/rec/T-REC-G.984.3
[^fs]: *Comparison of EPON and GPON* https://community.fs.com/blog/comparison-of-epon-and-gpon.html
[^zyxel]: *GPON E2E Fundamentals*, Zyxel 2018
[^huawei]: *GPON Fundamentals*, Huawei 2010 http://jm.telecoms.free.fr/QCM_Fibre/GPON-Fundamentals_Huawei.pdf
[^broadbandforum]: *GPON in FTTx Broadband Deployments*, Broadband Forum 2010 https://www.broadband-forum.org/download/MR-246.pdf
[^wolon]: *Fiber SFP Module Compatibility with APC, UPC, PC* https://www.wolonte.com/news.asp?id=599
[^cisco]: *Understand GPON Technology* https://www.cisco.com/c/en/us/support/docs/switches/catalyst-pon-series/216230-understand-gpon-technology.html
[^medium]: *HTFuture: EPON vs GPON Standard* https://medium.com/@ivyhtfuture/epon-vs-gpon-standard-b8ec20c55bb3
[^telecom]: *Fifty Years of Fixed Optical Networks Evolution: A Survey of Architectural and Technological Developments in a Layered Approach* https://doi.org/10.3390/telecom3040035
[^huaweimultiplexing]: *GPON Principle---Data Multiplexing* https://forum.huawei.com/enterprise/en/gpon-principle-data-multiplexing/thread/458243-100181
[^huaweiveip]: *VEIP knowledge* https://forum.huawei.com/enterprise/en/veip-knowledge/thread/771975-100181
[^cdatatec]: *Differences between HGU ONU and SFU ONU* https://cdatatec.com/differences-hgu-onu-sfu-onu/
[^arsat]: *Gpon: Tecnology*, ARSAT

