---
title: Molex ONT
has_children: false
nav_order: 3
layout: default
---

{% include alert.html content="Independent link — the contributor has no affiliation with the seller and earns no commission. hack-gpon accepts no liability for any transaction." alert="Warning"  icon="svg-warning" color="red" %}

In some sticks, such as those based on Lantiq chipsets, the serial interface is exposed in the upper pins of the ONT, in order to read them there are two possibilities:
- the use of an SFP molex ([farnell](https://it.farnell.com/en-IT/molex/74441-0001/connector-sfp-rcpt-20pos-smt/dp/2112385)) to which four wires are to be soldered and the other pins removed. This makes the adapter compatible with a single serial combination.
- the use of a board to which the SFP molex is soldered, exposing the main SFP pins.
- a ready-made breakout board that already exposes all 20 SFP pins on 2.54 mm headers, if you'd rather not solder an SMD Molex connector yourself (see below).

{% include image.html file="ma5671a-root-1.jpg"  alt="Example of how the SFP-TTL adapter is to be connected" caption="Example of how the SFP-TTL adapter is to be connected" %}

{% include image.html file="new-root-procedure/board-molex-arduino.jpg"  alt="Example of how the SFP-TTL adapter is to be used with a custom board" caption="Example of how the SFP-TTL adapter is to be used with a custom board" %}

If you want to make your own board, here are some ideas:

{% include image.html file="board-dupont/top.svg"  alt="Example of an SFP-TTL custom board" caption="Example of an SFP-TTL custom board" %}
{% include image.html file="board-dupont/bottom.svg"  alt="Example of an SFP-TTL custom board" caption="Example of an SFP-TTL custom board" %}

the components to be soldered are instead:
- 1x MOLEX SFP (like Molex-744410001 [lcsc](https://www.lcsc.com/product-detail/Card-Edge-Connectors_MOLEX-744410001_C277615.html), [farnell](https://it.farnell.com/en-IT/molex/74441-0001/connector-sfp-rcpt-20pos-smt/dp/2112385))
- 2x pinout 2x10 (like [MINTRON MTP125-1210S1](https://www.lcsc.com/product-detail/Pin-Header-Female-Header_MINTRON-MTP125-1210S1_C358699.html))

## Prebuilt board (no soldering)

{% include alert.html content="Independent link — the contributor has no affiliation with the seller and earns no commission. hack-gpon accepts no liability for any transaction." alert="Warning"  icon="svg-warning" color="red" %}


If you'd rather not solder an SMD Molex connector, a prebuilt and tested board is also available. It exposes all 20 SFP pins on 2.54 mm headers with RX/TX silkscreen, so you slot the module in and connect your USB-TTL adapter — no soldering required.

![Prebuilt SFP-to-TTL adapter (v1.2), all 20 pins broken out to 2.54 mm headers](https://tvi.al/content/images/size/w960/2025/12/sfp-to-ttl-v1.2.png)

[SFP-to-TTL Adapter](https://tvi.al/sfp-to-ttl-adapter/) — ships worldwide.
