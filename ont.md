---
title: ONT
has_children: true
nav_order: 2
description: Resources to access and modify ONTs

---


# Major Chipset

There are currently 2 main GPON chipsets vendor:

- Realtek
    * RTL9601B  
    * RTL9601C1/RTL9601CI (HSGMII)
    * RTL9601D (HSGMII)
- Lantiq
    * PEB98035 (HSGMII)
    * PEB98036

## Realtek

HSGMII chipsets are relatively recent, dating from 2020, and are used in many ONTs. Realtek offers an official SDK, Luna SDK, which offers very good performance in queue management, bitterly not used by all devices based on these chipsets.

## Lantiq

The lantiq company no longer exists, it was bought out by intel and intel made a splash, at the time lantiq was at the forefront on the GPON and xDSL chipset side.
The GPON part of Lantiq ended up in `/dev/null`, the XGS-PON part ended up in MaxLinear and the whole Wi-Fi part ended up in Intel.

The last produced batches of these SFPs date back to 2020/2021. All OEMs are currently migrating to Realtek.

{% include warning.html content="Playing with ONTs can cause: serial/ploam ban, optics breakage and ONT/OLT breakage. Always pay close attention to the calibration of the laser, under no circumstances should the calibration be changed." %}

{% include success.html content="You can also collaborate on the content of this site, on each page you will find a button to edit on GitHub." %}
