---
title: GPON Auth
has_children: false
nav_order: 4
description: ONU Online Status
---


# GPON Status: Ox
The process for an ONU to go online unconfigured involves five states:

- **O1 Initial:** the OLT sends a message to the ONU to start the ONU, and the ONU enters the standby state;
- **O2 Standby:** After receiving the message, the ONU extracts the delimiter value, power level, and pre-allocated compensation delay from the message, and adjusts its configurations accordingly to support subsequent information exchange.
- **O3 Serial number:** The OLT sends a serial number (SN) request to the ONU. The ONU sends its SN to the OLT. After receiving the SN of the ONU, the OLT allocates a temporary ONU ID to the ONU.
- **O4 Ranging:** The OLT sends a ranging request to the ONU. After receiving the ranging request from the OLT, the ONU responds with a message carrying its SN and ONU ID. The OLT calculates the compensation delay and sends it to the ONU in a message. After receiving the message, the ONU sets the compensation delay accordingly.
- **O5 Operation:** The OLT sends a password request to the ONU. The ONU returns a password to the OLT. 
- **O6 Intermittent LODS state.**
- **O7 Emergency Stop state.**

The password is not configured on the OLT. If the automatic discovery function is enabled on the PON port of the OLT, the OLT reports an ONU auto-discovery alarm to the CLI or NMS. The ONU goes online normally only after being confirmed.

```mermaid
graph TD
    O1[O1 Initial state] -->|Downstream Synchronization attained| O2[O2-03 Standby-Serial number]
    O2 -->|Assign ONU-ID Ploam and Equalization delay assigned| O4[O4 Ranging State]
    O4 -->|Ranging Time PLOAM and Equalization delay assigned| O5[O5 Operation]
    O5 & O4 &  O2 --->|Loss of downstream syncronizzation| O6[O6 Intermittent LODS state]
    O2 ---->|Disable S/N Request| O7[O7 Emergency stop state]
    O2 -->|Broadcast deactivate ONU-ID Request| O1
    O4 --->|TO1 time expires| O2
    O4 & O5 ---->|Disable S/N Request| O7
    O7 ---->|Enable S/N Request| O1
    O6 ---->|TO2 timer expires| O1
    O6 -->|Downstream Synchronization restored| O5
    O5 & O4 ---->|Deactive ONU-ID Request| O1
```
