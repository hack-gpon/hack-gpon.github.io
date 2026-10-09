---
title: UFiber UF-Instant
has_children: false
parent: UFiber
---

# Hardware Specifications

|              |                   |
| ------------ | ----------------- |
| Vendor/Brand | UFiber            |
| Model        | UFiber UF-Instant |
| Chipset      | Realtek RTL9601CI |
| Flash        | 16 MB             |
| RAM          | 64 MB             |
| System       | Linux (Luna SDK)  |
| SFP interfaces | 1 Gbps only, no HSGMII |
| Optics       | SC/APC            |
| IP address   | 192.168.1.1       |
| Web Gui      | ✅ user `ubnt`, password `ubnt` |
| SSH          | ✅ user `ubnt`, password `ubnt`, disabled by default |
| Telnet       |                   |
| Serial       | ✅                |
| Form Factor  | miniONT SFP       |

## Firmware is interchangeable with:

::: info Info
The UFiber UF-Instant can be used as universal GPON stick with V2801F rootfs, but only with stock UF kernel (4.3.1/4.4.2): needed for Laser controller.
:::


- [VSOL V2801F](/ont-vsol-v2801f)
- [T&W TWC GPON657](/ont-t-w-twcgpon657)

## List of partitions

| dev  | size     | erasesize | name     |
| ---- | -------- | --------- | -------- |
| mtd0 | 00040000 | 00001000  | "boot"   |
| mtd1 | 00002000 | 00001000  | "env"    |
| mtd2 | 00002000 | 00001000  | "env2"   |
| mtd3 | 0003c000 | 00001000  | "config" |
| mtd4 | 00300000 | 00001000  | "k0"     |
| mtd5 | 004b0000 | 00001000  | "r0"     |
| mtd6 | 00300000 | 00001000  | "k1"     |
| mtd7 | 004b0000 | 00001000  | "r1"     |
| mtd8 | 00010000 | 00001000  | "hw"     |
| mtd9 | 00010000 | 00001000  | "sec"    |
| mtd10 | 00001000 | 00001000 | "Partition_010" |
| mtd11 | 00001000 | 00001000 | "Partition_011" |
| mtd12 | 00300000 | 00001000 | "linux"  |
| mtd13 | 004b0000 | 00001000 | "rootfs" |

This stick supports dual boot: `k0` and `r0` contain kernel and rootfs of the first image, `k1` and `r1` of the second one. A full flash dump (with `flash_all.xml`) is available in the [RTL960x repository](https://github.com/Anime4000/RTL960x/tree/main/Firmware/UF-Instant)[^rtl960x_uf]: SSH is disabled in the stock configuration and had to be enabled to make the dump.

```sh
ssh ubnt@192.168.1.1 'cat /dev/mtd0' > dev_mtd0
```

## Serial

The UART pads are, from the front (SC connector) to the back (SFP connector): GND, VCC, RX, TX[^rtl960x_uf]. On the RTL9601CI (76 pins) the UART is on the pins 12 (TX) and 13 (RX)[^rtl960x_uart].

# Know Bugs

VLAN swap issue (MEID 171), auto-sensing mode to switch between SGMII/HiSGMII

You should use the VID/VLAN shown by executing the command `omcicli mib get 84` via telnet to bring up PPPoE

The stock firmware supports only the PPTP, and only on the LAN 1: it does not support the VEIP nor the 4-port emulation[^rtl960x].


# Miscellaneous Links

- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [UF INstant Mod](https://github.com/stich86/UF-Instant-Mod)
- [SFP GPON ONU](https://github.com/zry98/SFP-GPON-ONU)
- [UFiber.Configurator](https://github.com/Unifi-Tools/UFiber.Configurator)

[^rtl960x]: *Hacking RTL960x*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x
[^rtl960x_uf]: *UF-Instant flash dump*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/tree/main/Firmware/UF-Instant
[^rtl960x_uart]: *UART*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/UART.md
