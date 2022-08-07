---
title: ONT
has_children: true
nav_order: 2
description: Resources to access and modify ONTs

---

resources to access and modify ONTs
{: .fs-6 .fw-300 }

{% include warning.html content="Playing with ONTs can cause: serial/ploam ban, optics breakage and ONT/OLT breakage. Always pay close attention to the calibration of the laser, under no circumstances should the calibration be changed." %}


{% include info.html content="The material and information contained on this website is for general information purposes only. You should not rely upon the material or information on the website as a basis for making any business, legal or any other decisions. Whilst we endeavour to keep the information up to date and correct, hack-gpon.github.io makes no representations or warranties of any kind, express or implied about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services or related graphics contained on the website for any purpose. Any reliance you place on such material is therefore strictly at your own risk. We do not take responsibility for broken, bricked, unusable or become doorstops. To the extent not prohibited by law, in no circumstances shall hack-gpon.github.io be liable to you or any other third parties for any loss or damage (including, without limitation, damage for loss of business or loss of profits) arising directly or indirectly from your use of or inability to use, this site or any of the material contained in it." %}

{% include danger.html content="Certain links in this website will lead to websites which are not under the control of hack-gpon.github.io. When you activate these you will leave the hack-gpon.github.io website. hack-gpon.github.io has no control over and accepts no liability in respect of materials, products or services available on any website which is not under the control of hack-gpon.github.io." %}

{% include warning.html content="This site is maintained and updated by a community of ONT and SFP stick enthusiasts, and therefore in no way replaces or replaces official vendor and provider guides. Use of this content is at your own risk." %}

{% include success.html content="You can also collaborate on the content of this site, on each page you will find a button to edit on GitHub." %}


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
