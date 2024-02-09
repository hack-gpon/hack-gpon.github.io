---
title: Free/Iliad
has_children: true
layout: default
---

# Free/Iliad network

Iliad's (Italy) PON network is delivered through two types of technology: GPON or EPON where available. The latter is not actually pure 10G-EPON but DPoE (DOCSIS Provisioning over EPON), confirmed by analyzing the physical layer signals.

Using a Xilinx Kintex 7 FPGA with an integrated logic analyzer, an optical module has been connected to the FPGA's transceiver. The transceiver synchronized successfully and the sync header sequence was the one expected for 10G-EPON: a FEC codeword is a sequence of 31 words. Those words have a sync header binary value of `10` or `01` repeated 27 times corresponding to the original message plus `00, 11, 11, 00` corresponding to the FEC parity information. Discarding the latter part and descrambling the remaining data, the packets have been retrieved.

As an example, a packet starts with `55 d5 55 1b 3c 07 5f` in hex, which corresponds to a DPoE (10G) preamble (actually it's missing one starting `0x55` byte but the CRC8 at the end is correct nonetheless).
