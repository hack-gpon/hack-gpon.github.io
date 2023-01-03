---
title: SFP standard and ONT
has_children: false
nav_order: 9
layout: default
---

# Overview of SFP standards

Since the SFP and SFP+ standards only define the form-factor, pinout and management interface, it is up to the manufacturer to decide which communication to use in the Tx and Rx pins[^sfpstandard], and more communication standards could be used, in the early 2000s Ethernet and Fibre Channel were used on the same SFP slots ([^fibrechannel],[^ethernet]) in [^sfprate] are listed a vendor-specific list of supported applications in module memory, like bit rate and standrd.
As part of the increased standardisation of IEEE standards, the media-independent interface (MMI) was defined in the IEEE 802.11u standard. MMI was originally defined as a standard interface to connect a Fast Ethernet (i.e., 100 Mbit/s) media access control (MAC) block to a PHY chip. Being media independent means that different types of PHY devices for connecting to different media (i.e. twisted pair, fiber optic, etc.) can be used without redesigning or replacing the MAC hardware. Thus any MAC may be used with any PHY, independent of the network signal transmission media[^ethernet].
The MII can be used to connect a MAC to an external PHY using a pluggable connector, or directly to a PHY chip on the same PCB, this technology, and in particular its evolutions such as RGMII[^rgmii], SGMII[^sgmii], HSGMII, QSGMII[^qsgmii], XGMII, XSGMII is widely used as a communication bus over SFP, and is the current standard replacing IEEE BaseX[^ethernet].

RGMII, SGMII, GBaseX standards allow a speed of 1/1 Gbps, 2.5BaseX and HSGMII standards of 2.5/2.5 Gbps, the XGMII, XSGMII and 10GBaseT of 10/10 Gbps.

# SFP with PON MAC and w/o PON MAC

PON technology unlike Ethernet are not P2P technologies but are one-to-many, and there are two device types: ONU (Optical Network Unit)/ONT (Optical Network Terminal) and OLT (Optical Line Terminal), both devices can be in SFP format[^tibit].

The OLT provides an integrated access box for Passive Optical Networks. OLTs are typically chassis with one or more line cards inside, and on each line card there is one or more PON transceiver, usually in SFP format. Each line card is connected to a secondary switch provides line card aggregation to the Ethernet uplinks. OLTs are often a mixture of Layer 2 and Layer 3 switching with traffic shaping on a per-customer, per-service basis[^tibit].

The communication within the SFP PON transceiver is neither MMI nor Ethernet, but rather it is a PON RAW communication (also referred to as SFP w/o PON MAC) and all the PON management part is left to the card lines, this is done for four reasons:
- *size*: the size of an OLT w/o PON MAC is very similar to that of anMMI nor Ethernet transceiver, and the size of an OLT with the integrated PON MAC part far exceeds that of the SFP format
- *dissipative heating capacity*: the dissipative heating capacity of an OLT with PON MAC is higher than a normal transceiver, such as a 1 or 10 Gbps Ethernet link.
- *duplication*: there is a double `MAC` → `MMI` conversion (`MMI` → `MAC` → `PHY` → `MAC` → `OLT CPU`)
- *repairability*: since lasers often have a shorter lifetime than other ICs, it is good to be able to change only the tranreciver

Despite this, there is a vendor that sells OLT SFP with PON MAC[^tibit]. The following pictures show an OLT SFP with PON MAC part and a transreciver without PON MAC. It is interesting to watch as it is much longer and requires an additional heatsink.

{% include image.html file="ont-wo-mac/tibit.png" alt="PON OLT with MAC" caption="PON OLT with MAC" %}
{% include image.html file="ont-wo-mac/huawei.png" alt="PON transceiver for OLT w/o MAC" caption="PON transceiver for OLT w/o MAC" %}

Similarly, the same argument can be made for OLT SFPs, especially in 10E-PON and XGS-PON there are really a lot of transreceivers w/o PON MAC and few ONTs with PON MAC. In this case the reasons are similar to the previous ones. It is also evident that ONTs w/o PON MAC require a PON MAC part within the SFP cage that supports the relevant communication.

The following pictures show some operating diagrams of some ONT with PON MAC and ONT w/o PON MAC[^SFPP-XGS-ONU-MAC-ASC-I-C],[^SFPP-XGS-ONU-N1-I-C],[^MSOG22-xD6C-xxT1].

{% include image.html file="ont-wo-mac/onu-with-mac.jpg" alt="Physical scheme of an ONT with MAC PON" caption="Physical scheme of an ONT with MAC PON" %}
{% include image.html file="ont-wo-mac/onu-with-mac-block.jpg" alt="Block scheme of an ONT with MAC PON" caption="Block scheme of an ONT with MAC PON" %}
{% include image.html file="ont-wo-mac/onu-wo-mac.jpg" alt="Physical scheme of an ONT w/o MAC PON" caption="Physical scheme of an ONT w/o MAC PON" %}
{% include image.html file="ont-wo-mac/onu-wo-mac-block.jpg" alt="Block scheme of an ONT w/o MAC PON" caption="Block scheme of an ONT w/o MAC PON" %}

# Why are there no ONT w/o MAC on Hack GPON?

For utility reasons all SFPs w/o PON MAC and their cage SPF with PON MAC are not illustrated on Hack GPON as they are not moddable like ONT with MAC (they require 2 inter-compatible devices). 

In particular, the SFP of AVM Fritz!Box 5530/5590 belongs in this category, and that the above-mentioned devices are not compatible with any SFP using MMI/Ethernet/Fibre Channel, while for example the FreeBox or IliadBox supports both ONT w/o PON MAC and some SFP with MAC.

---

[^sfpstandard]: *Specification for SFP (Small Formfactor Pluggable) Transceiver* INF-8074, 
[^fibrechannel]: *FC-PH Fibre Channel Physical Interface* INCITS 230-1994
[^ethernet]: *Ethernet Specification* IEEE-802.3
[^sfprate]: *SFP (Small Formfactor Pluggable) Rate and Application Codes* SFF-8089
[^rgmii]: *Reduced Gigabit Media Independent Interface (RGMII) standard* https://web.archive.org/web/20160303212629/http://www.hp.com/rnd/pdfs/RGMIIv1_3.pdf
[^qsgmii]: *QSGMII Specification* https://community.nxp.com/pwmxy87654/attachments/pwmxy87654/powerquicc/3546/1/qsgmii%20specification.pdf
[^sgmii]: *CISCO ENG-46158 Serial-GMII Specification* https://archive.org/details/sgmii/page/n5/mode/2up
[^tibit]: *ONT Tibit MicroPlug Modules: Architecture* https://tibitcom.com/architecture/
[^SFPP-XGS-ONU-MAC-ASC-I-C]: *ProLabs SFPP-XGS-ONU-MAC-ASC-I-C* https://s3-us-west-2.amazonaws.com/configurator.computer/55/files/99138/218/SFPP-XGS-ONU-MAC-ASC-I-C/SFPP-XGS-ONU-MAC-ASC-I-C_Datasheets_EN.pdf
[^SFPP-XGS-ONU-N1-I-C]: *ProLabs SFPP-XGS-ONU-N1-I-C* https://www.prolabs.com/product/SFPP-XGS-ONU-N1-I-C
[^MSOG22-xD6C-xxT1]: *Mentech MSOG22-xD6C-xxT1* https://www.mnc-optical.com/upload/goods/20201109/202011090724113094.pdf