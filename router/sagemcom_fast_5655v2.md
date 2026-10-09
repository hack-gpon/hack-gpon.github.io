---
title: Sagemcom F@st 5655v2
has_children: false
parent: Sagemcom
---

# Hardware Specifications

|              |                                       |
| ------------ | ------------------------------------- |
| Vendor/Brand | Sagemcom                              |
| Model        | F@st 5655v2                           |
| ODM          | ✅                                    |
| CPU          |                                       |
| CPU Clock    |                                       |
| Chipset      |                                       |
| Flash        |                                       |
| RAM          |                                       |
| System       |                                       |
| Optics       | GPON                                  |
| IP address   | 192.168.1.1                           |
| Web Gui      | ✅ user `1234`, password `1234`       |
| SSH          | ✅ user `1234` (see [Enable SSH and Telnet](#enable-ssh-and-telnet)), `su` password `root` |
| Telnet       | ✅ (see [Enable SSH and Telnet](#enable-ssh-and-telnet)) |
| Serial       |                                       |
| Form Factor  | CPE with ONT                          |

The F@st 5655v2 is the GPON modem of the Spanish ISPs MásMóvil, Pepephone and Yoigo.

# Usage

## Enable SSH and Telnet

1. Log in to the web interface (`http://192.168.1.1`, user `1234`, password `1234`).
2. Open the developer console of the browser and run the commands one by one: they enable SSH (port 22) and Telnet (port 23) for the user with `uid` 3.

```js
$.xmo.getValuesTree("Device");
$.xmo.getValuesTree("Device/UserAccounts/Users");
$.xmo.getValuesTree("Device/UserAccounts/Users/User[@uid='3']");
$.xmo.getValuesTree("Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses");
$.xmo.getValuesTree("Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses/RemoteAccess[@uid='3']/Enabled");
$.xmo.getValuesTree("Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses/RemoteAccess[@uid='4']/Enabled");
$.xmo.setValuesTree("ACCESS_ENABLE_ALL", "Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses/RemoteAccess[@uid='3']/LANRestriction");
$.xmo.setValuesTree("ACCESS_ENABLE_ALL", "Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses/RemoteAccess[@uid='4']/LANRestriction");
$.xmo.setValuesTree(22, "Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses/RemoteAccess[@uid='3']/Port");
$.xmo.setValuesTree(23, "Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses/RemoteAccess[@uid='4']/Port");
$.xmo.setValuesTree(true, "Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses/RemoteAccess[@uid='3']/Enabled");
$.xmo.setValuesTree(true, "Device/UserAccounts/Users/User[@uid='3']/RemoteAccesses/RemoteAccess[@uid='4']/Enabled");
```

3. Reboot the modem from the maintenance page.
4. Connect with `ssh 1234@192.168.1.1` and run `su` (password `root`).

::: info Note
If a command returns `null` or the SSH connection times out, retry with the fiber disconnected.
:::

# GPON/OMCI settings

## Getting ONU GPON PLOAM password

```sh
cat /opt/filesystem2/data/optical_conf.txt
```

Alternatively, copy the configuration on a USB stick and search the `RegId` tag (the PLOAM password, in hex) in `cfg.xml`:

```sh
cp /tmp/cfg.xml /mnt/sda1
```

The mount point can also be `/mnt/sda`. The same file also contains the SIP credentials of the VoIP line. The PLOAM password can be converted from hex to ASCII with the [ASCII/HEX converter](/ascii-hex).

# Miscellaneous Links

- [Naseros: GPON and SIP key of the Sagemcom F@st 5655v2](https://naseros.com/2020/07/14/como-extraer-clave-gpon-y-sip-del-sagemcom-fast-5655v2-de-masmovil-pepephone-y-yoigo/)
- [Sagemcom F@st 5684S](/router/sagemcom_fast_5684s)
