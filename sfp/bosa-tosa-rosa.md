---
title: BOSA, TOSA and ROSA: the conversion from optical to electrical
---













In optical-electrical conversions, special components called TOSA (Transmitter Optical Sub Assembly) and ROSA (Receiver Optical Sub Assembly) are used to convert the signal.
They are responsible for translating the optical signal into a corresponding electrical signal and viceversa, which inputs or outputs symbols corresponding to the optical values. These values, which we refer to as unprocessed or RAW values for simplicity, are not standard signals and must be converted into standard signals[^huawei].

TOSA and ROSA are essential components in the uni-directional transceivers which transmit on one fiber optic strand and receive on the other fiber optic strand. 

<ImageFigure file="ont-wo-mac/rosa.png" alt="ROSA" caption="ROSA" />
<ImageFigure file="ont-wo-mac/tosa.png" alt="TOSA" caption="TOSA" />

In order to ensure bi-directional communication, it is also possible to use a TOSA and a ROSA, or a BOSA which is a combination of a TOSA, a ROSA and additionally a WDM filter. The WDM filter split the wavelengths into two separate wavelengths[^huawei].

<ImageFigure file="ont-wo-mac/bidi.jpg" alt="Bi-Directional comunication obtain through a TOSA and a ROSA" caption="Bi-Directional comunication obtain through a TOSA and a ROSA" />
<ImageFigure file="ont-wo-mac/bosa.jpg" alt="BOSA" caption="BOSA" />

---

[^huawei]: *What is inside a SFP transceiver?* https://forum.huawei.com/enterprise/en/what-is-inside-a-sfp-transceiver/thread/782827-861