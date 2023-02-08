---
title: SFP standard and ONT
has_children: false
nav_order: 1
layout: default
---


The organisation that developed SFPs (MSA SFP) has always been very cautious about defining a hardened list of admissible signals for SFPs, their first standard only providing pinout, form-factor and dissipative capacity specifications. It is up to the manufacturer to decide which communication to use in the Tx and Rx pins[^sfpstandard]. 
After the SFP standard entered the market, in the early 2000s Ethernet and Fibre Channel, the MSA SFP also started to standardise signalling, starting with [^sfprate] and [^sfprate2] which define a list of admissible standard signalling limited to the capabilities of the current form factor SFP.
With the need to increase the heat dissipation characteristics of the modules (in order to increase speeds) and to allow some additions to the EEPROM, an additional standard, called SFP+[^sfpplusstandard],[^sfpplusmi], was developed, which contains all the aforementioned improvements. The 16GFC, 20GFC signalling for Fibre Channel and the 10 Gbps and 2.5 signalling for Ethernet were also included in the updated [^sfprate] and [^sfprate2] standard. Some of these are also included in [^sfpplusstandard] locking the SFP+ standard to a tenth of signalling, all other signals should fall under the SFP standard[^sfpstandard], but they can use the extended SFP+ management interface[^sfpplusmi].

The Ethernet signals are all very similar, but there are some differences between BaseX and MMI. The media-independent interface (MMI) was defined in the IEEE 802.11u standard, was originally defined as a standard interface to connect a Fast Ethernet MAC block (i.e. CPU, switch) to a PHY chip (i.e. twisted pair, fiber optic, etc.) in a standardised way. The main advantage is that the MMI can be used without redesigning or replacing the MAC hardware. Thus any MAC may be used with any PHY, independent of the network signal transmission media[^ethernet].
The MII can be used to connect a MAC to an external PHY using a pluggable connector, or directly to a PHY chip on the same PCB. In the first case it is also used in SFP connectors, for example to allow connections between two MAC blocks without passing through a PHY (i.e. passive DAC).
This technology, and in particular its evolutions such as RGMII[^rgmii], SGMII[^sgmii], HSGMII, QSGMII[^qsgmii], XGMII, XSGMII, is widely used as a communication bus over SFP, and is the current standard replacing IEEE BaseX[^ethernet].

RGMII, SGMII, GBaseX standards allow a speed of 1 Gbps, 2.5BaseX and HSGMII standards of 2.5 Gbps, the XGMII, XSGMII and 10GBaseT of 10 Gbps.


---

[^sfpstandard]: *Specification for SFP (Small Formfactor Pluggable) Transceiver* INF-8074
[^sfprate]: *SFP Rate and Application Selection* SFF-8079
[^sfprate2]: *SFP (Small Formfactor Pluggable) Rate and Application Codes* SFF-8089
[^sfpplusmi]: *Management Interface for SFP+* SFF-8472
[^sfpplusstandard]: *Enhanced Small Form Factor Pluggable Module SFP+* SFF-8431
[^fibrechannel]: *FC-PH Fibre Channel Physical Interface* INCITS 230-1994
[^ethernet]: *Ethernet Specification* IEEE-802.3
[^rgmii]: *Reduced Gigabit Media Independent Interface (RGMII) standard* https://web.archive.org/web/20160303212629/http://www.hp.com/rnd/pdfs/RGMIIv1_3.pdf
[^qsgmii]: *QSGMII Specification* https://community.nxp.com/pwmxy87654/attachments/pwmxy87654/powerquicc/3546/1/qsgmii%20specification.pdf
[^sgmii]: *CISCO ENG-46158 Serial-GMII Specification* https://archive.org/details/sgmii/page/n5/mode/2up