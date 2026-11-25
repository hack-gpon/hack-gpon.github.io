---
title: China firmware (right.com.cn)
has_children: false
parent: Lantiq SDK (OpenWrt)
badge: unverified
platform: OpenWrt (Lantiq FALC ON)
devices: ont-huawei-ma5671a:works, ont-nokia-g-010s-p:works, ont-nokia-g-010s-a:procedure
---

A modified firmware for the Lantiq FALC ON sticks, published by *wackejohn* on the Chinese forum right.com.cn since April 2022, originally based on the firmware adapted by *鲜牛奶* (Xianniunai) for the Chinese OLTs. It is still updated: the latest version is from 11 November 2026.

- [Forum thread on right.com.cn](https://www.right.com.cn/forum/forum.php?mod=viewthread&tid=8220173&extra=page%3D1&page=1)

The images are only distributed through the forum thread, without source code or public builds, so the firmware cannot be verified even if the recent versions are built from open source components (OpenWrt, the ma5671a overlay of the *web firmware*).

::: warning
The author warns that the compatibility with the OLTs cannot be guaranteed (authentication, IPTV, multicast, 2.5G), and that the 2026-11-11 version replaces the whole system, kernel and omcid, so it may have unknown bugs.
:::

# Compatibility

<FirmwareCompatibility />

Since the 2026-11-11 version the same image runs on the three sticks: the board is detected at boot (the G-010S-A also gets its optic parameters) and the hostname is set to `HUAWEI`, `Alcatel-Lucent` or `NOKIA`. The board can also be forced:

```sh
fw_setenv board_vendor nokia|huawei|alcatel
```

The [Nokia G-010S-A](/ont-nokia-g-010s-a) needs its flash layout converted to the SPS one before the first upgrade: the `falcon_upgrade.sh` script of the release does it, see below.

# List of software versions

The full changelog is in the forum thread, the main versions are:

| Version    | Changes |
| ---------- | ------- |
| 2026-11-11 | OpenWrt mainline (snapshot r38203), kernel 6.18.60, EROFS rootfs, GPON programs based on the ma5671a overlay (r678) of the *web firmware*; rewritten omcid (omci-utils-ng); one image for MA5671A, G-010S-P and G-010S-A; new web pages (MIB, flash, bootloader, connection status, PON log, SFP EEPROM); translations in Simplified Chinese, Malay, Portuguese and Russian |
| 2026-08-14 | Kernel rebuilt from the OpenWrt kernel and patches (3.10.108), boots with the TTL console disabled |
| 2026-07-14 | VLAN configuration triggered by hooking omcid (test version) |
| 2026-02-19 | Most of the rootfs moved to the OpenWrt 19.07 programs, JavaScript web pages, scripts rewritten in C |
| 2023-10-20 | New omcid and drivers (temperature alarms, VEIP, coprocessor fault recovery, fixes for Broadcom hosts) |
| 2022-04-06 | First release, based on the firmware of 鲜牛奶, built on OpenWrt 14.07 |

# Installing

The firmware has no JFFS2 partition, so the whole partition must be erased before writing it, e.g. with `mtd -e` when [flashing via SSH](/ont-huawei-ma5671a#flashing-a-new-rootfs-via-ssh): otherwise the configuration cannot be saved. After the first boot wait about a minute, until the overlay is rebuilt, before configuring it.

From the 19.07 based versions and from the original firmwares the image can be installed from the web UI. Before the first upgrade from an older firmware use `falcon_upgrade.sh` (its usage is in `falcon_upgrade.txt` in the release): it adjusts `max_kernel_size`, on the G-010S-A converts the flash layout and backs up the calibration, and with `--flash` writes the inactive image, verifies it and only then switches the boot image.

The upgrades always write the inactive image and switch to it only if the write succeeded; the output of the last upgrade is saved in `/etc/sysupgrade.log`.

::: danger Nokia G-010S-A
The `preboot` U-Boot variable must be cleared (`fw_setenv preboot`), otherwise the stick refuses to boot once the U-Boot environment changes.
:::

## Serial and U-Boot

From the notes of the author:

- The TTL pins are 2, 7 and 10 on the Huawei and Alcatel-Lucent sticks, 6, 3 and 10 on the Nokia one (on the Nokia, pin 3 has to be disconnected from GND).
- The original U-Boot of the three sticks can be stopped with `Ctrl+C` at power on. To enable the echo of the console, on the Huawei and Alcatel-Lucent sticks remove `gpio input 100` from `preboot` and set `asc0` to `0`; on the Nokia clear `preboot`, and set `asc0` back to `3` after flashing.
- Disabling the TTL console from the web UI disconnects the serial port also in the running system: keep it enabled if you may need to recover the stick via serial.

# Usage

The stick answers on `192.168.1.10`, with the OpenWrt `root` user and an empty password. The settings are in the GPON section of the web UI (ONU configuration, MIB, optic calibration, flash, bootloader, connection status, PON log).

VLAN translations use the `router:operator` format, with `u` for untagged and `@` for the priority. The multicast VLAN (`gpon.onu.mcast_vlan`) uses the same format: `43` translates all the multicast VLANs to 43, `43:40` also writes VLAN 40 in the multicast access control table.
