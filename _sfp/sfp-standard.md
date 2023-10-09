---
title: SFP standard and ONT
has_children: false
nav_order: 1
layout: default
---


The organisation that developed SFPs (MSA SFP) has always been very cautious about defining a hardened list of admissible signals for SFPs, their first standard only providing pinout, form-factor and dissipative capacity specifications. It is up to the manufacturer to decide which communication to use in the Tx and Rx pins[^sfpstandard]. 
After the SFP standard entered the market, in the early 2000s with Ethernet and Fibre Channel, the MSA SFP also started standardising signalling, starting with [^sfprate] and [^sfprate2] which define a list of admissible standard signalling limited to the capabilities of the current form factor SFP.
With the need to increase the heat dissipation characteristics of the modules (in order to increase speeds) and to allow some additions to the EEPROM, an additional standard, called SFP+[^sfpplusstandard],[^sfpplusmi],[^xenpak_xfp], was developed, which contains all the aforementioned improvements. The 16GFC, 20GFC signalling for Fibre Channel and the 10 Gbps and 2.5 signalling for Ethernet were also included in the updated [^sfprate] and [^sfprate2] standard. Some of these are also included in [^sfpplusstandard] locking the SFP+ standard to a tenth of signalling, all other signals should fall under the SFP standard[^sfpstandard], but they can use the extended SFP+ management interface[^sfpplusmi].

The Ethernet signals are all very similar, but there are some differences between Base-X and MII. The media-independent interface (MII) was defined in the IEEE 802.11u standard. It was originally defined as a standard interface to connect a Fast Ethernet MAC block (i.e. CPU, switch) to a PHY chip (i.e. twisted pair, fiber optic, etc.) in a standardised way. The main advantage is that MII can be used without redesigning or replacing the MAC hardware. Thus any MAC may be used with any PHY, independent of the network signal transmission media[^ethernet].

The main difference is the physical media over which the frames are: 
- *Base-X* is based on the Ethernet PHYsical Layer (layer 1) and this standard uses the 8B/10B coding (or other encodings as specified in the EEPROM), and *MII* is based on the Ethernet MAC Device (layer 2, the device that actually makes and receives Ethernet frames)[^ethernet].
- In *Base-X*, auto-negotiation is limited to flow-control (and duplex, which is not really used since it's always full-duplex), and in *MII*, auto-negotiation (AN) also allows the PHY to indicate to the MAC the post-PHY link speed. Even though the MAC-to-PHY SGMII link is always 1000Mbps, it supports 10, 100 and 1000Mbps past the PHY and the MAC needs to know this to space out the bits properly (e. g. if the external link is 100Mbps, each bit on the SGMII link is sent 10 times)[^ethernet].

MII can be used to connect a MAC to an external PHY using a pluggable connector, or directly to a PHY chip on the same PCB. In the first case it is also used in SFP connectors, for example to allow connections between two MAC blocks without passing through a PHY (i.e. passive DAC).
This technology, and in particular its evolutions such as RGMII[^rgmii], SGMII[^sgmii], QSGMII[^qsgmii], XGMII[^intel], USXGMII[^xilinx], is widely used as a communication bus over SFP, in addition to IEEE BaseX[^ethernet]. The 2.5G-SGMII or HSGMII[^altium] and 10G-SGMII or XSGMII[^aquantia] standards are specifics that increase the clock speed of the SGMII standard without redefining it.

RGMII, SGMII, 1000BaseX standards allow a speed of 1 Gbps, 2.5BaseX and HSGMII standards of 2.5 Gbps, the XGMII, XSGMII, USXGMII and 10GBaseT of 10 Gbps.

---
[^xenpak_xfp]: With the advent of higher speeds MSA has developed several new interfaces, such as XENPAK, X2, XPAK, XFP, but the newest standard is the transceiver is called SFP+. Based on the same form factor as SFP, it is smaller than its predecessors and has lower power than XFP. SFP+ has become the most popular socket on 10GbE systems because it shares a common physical form factor with legacy SFP modules, allowing higher port density than XFP and the reuse of existing designs for 24 or 48 ports in a 19-inch rack width blade.
[^sfpstandard]: *Specification for SFP (Small Formfactor Pluggable) Transceiver* INF-8074
[^sfprate]: *SFP Rate and Application Selection* SFF-8079
[^sfprate2]: *SFP (Small Formfactor Pluggable) Rate and Application Codes* SFF-8089
[^sfpplusmi]: *Management Interface for SFP+* SFF-8472
[^sfpplusstandard]: *Enhanced Small Form Factor Pluggable Module SFP+* SFF-8431
[^fibrechannel]: *FC-PH Fibre Channel Physical Interface* INCITS 230-1994
[^ethernet]: *Ethernet Specification* IEEE-802.3
[^rgmii]: *Reduced Gigabit Media Independent Interface (RGMII) standard* https://web.archive.org/web/20160303212629/http://www.hp.com/rnd/pdfs/RGMIIv1_3.pdf
[^qsgmii]: *CISCO EDCS-540123 QSGMII Specification* https://community.nxp.com/pwmxy87654/attachments/pwmxy87654/powerquicc/3546/1/qsgmii%20specification.pdf
[^sgmii]: *CISCO ENG-46158 Serial-GMII Specification* https://archive.org/details/sgmii/page/n5/mode/2up
[^altium]: Peterson Z. *Decoding Media Independent Interface (MII) in Ethernet Links*, Altium Limited https://resources.altium.com/p/decoding-media-independent-interface-mii-ethernet-links
[^continental]: Hopf D. *High-Speed Interfaces for High-Performance Computing*, Continental AG https://standards.ieee.org/wp-content/uploads/import/documents/other/eipatd-presentations/2020/D1-02-Hopf-HighSpeed-Interfaces-for-HighPerformance-Computing.pdf
[^intel]: *L- and H-Tile Transceiver PHY User Guide*, Intel https://www.intel.com/content/www/us/en/docs/programmable/683621/current/the-xgmii-interface-scheme-in-10gbase-r.html
[^10gbasecx4]: *Physical Coding Sublayer (PCS) and Physical Medium Attachment (PMA) sublayer, type 10GBASE-X* https://www.ieee802.org/3/ak/public/jan03/WPcls48_1_0.pdf
[^aquantia]: *AQR405 10GBASE-T Ethernet PHY Transceiver* https://www.verical.com/datasheet/aquantia-corp.-phy-aqr405-b1-eg-y-3825278.pdf
[^xilinx]: *USXGMII Ethernet Subsystem v1.2* https://www.xilinx.com/content/dam/xilinx/support/documents/ip_documentation/usxgmii/v1_2/pg251-usxgmii.pdf
