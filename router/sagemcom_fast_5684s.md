---
title: Sagemcom F@st 5684S
has_children: false
alias: TIM Sagemcom 10 Gb
parent: Sagemcom
---

# Hardware Specifications

|              |                                                                         |
| ------------ | ----------------------------------------------------------------------- |
| Vendor/Brand | Sagemcom                                                                |
| Model        | F@st 5684S (F5684S_v1, F5684S_v2)                                       |
| ODM          | ✅                                                                      |
| CPU          | 4x ARMv8 (Broadcom)                                                     |
| CPU Clock    |                                                                         |
| Chipset      | Broadcom                                                                |
| Flash        |                                                                         |
| RAM          |                                                                         |
| System       | Linux 4.1.52 (Broadcom SDK 5.02L.07)                                    |
| Ethernet     | 4x 1GbE LAN, 1x 10GbE (LAN or WAN for an external ONT)                  |
| SFP          | 1x SFP+ (XGS-PON stick Sagemcom CS50001)                                |
| Wi-Fi        | Wi-Fi 6 (802.11ax) 2.4 GHz and 5 GHz, 4x4                               |
| USB          | 2x USB (1x USB 3.0)                                                     |
| Phone        | 2x FXS (Phone1, Phone2)                                                 |
| IP address   |                                                                         |
| Web Gui      | ✅ user `admin`                                                         |
| SSH          | ✅ (see [Enable SSH](#enable-ssh))                                       |
| Telnet       |                                                                         |
| Serial       |                                                                         |
| Form Factor  | CPE with SFP                                                            |

The F@st 5684S is the modem of the TIM FTTH offers up to 10 Gbps (TIM Sagemcom 10 Gb). The XGS-PON line is terminated by the Sagemcom CS50001 SFP+ stick installed in the SFP+ cage of the modem; on the 2.5 Gbps lines TIM can install an external ONT connected to the 10GbE port.

::: info Note
The CS50001 stick does not bring up the connection with the OLT by itself when used on other hardware (e.g. MikroTik): it is recognized and shows its parameters, but it needs the configuration of the modem.
:::

## List of software versions

- AGGHX_1.2.0 (GUI 5.92.3)
- AGGHX_1.3.3

# Usage

## Enable SSH

The web interface of the Sagemcom F@st modems exposes the `$.xmo` JavaScript object, which reads and writes the internal data model. From the browser developer console of the logged in web interface, the remote accesses of the internal user can be enabled from the LAN:

```js
var x = $.xmo;
x.init();
x.login("internal", "");
$.xmo.setValuesTree("ACCESS_ENABLE_ALL","Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses/RemoteAccess[@uid='1']/LANRestriction");
```

The same data model is used by the other F@st modems, see the [F@st 5655v2](/router/sagemcom_fast_5655v2) for the full procedure.

## Updating the firmware

To force the update: back up the settings and keep the reset button pressed for about 30 seconds.

# Known Bugs

- The DNS servers cannot be changed (the manual settings go back to automatic).
- The port forwarding rules are applied only after a reboot.
- Random Wi-Fi shutdown (disabling Band Steering reduces it) and full freezes that require a power cycle.

# Miscellaneous Links

- [TIM - Sagemcom 10 Gb guides](https://www.tim.it/assistenza/assistenza-tecnica/guide-manuali/sagemcom-10gb)
- [TIM - Sagemcom 10 Gb Quick Guide](https://www.tim.it/content/dam/flytoco-areapubblica-aemfe/tim_it/pdf/assistenza-tecnica/guide-manuali/tim-sagemcom-10gb/qg-sagemcom-10gb.pdf)
- [HWUpgrade forum](https://www.hwupgrade.it/forum/archive/index.php/t-2970213.html)
- [OpenWrt forum: OpenWrt for Sagemcom F@5684](https://forum.openwrt.org/t/openwrt-for-sagemcom-f-5684/143254)
