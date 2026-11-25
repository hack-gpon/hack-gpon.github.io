---
title: TP-Link XZ000-G3
has_children: false
parent: TP-Link
---

# Hardware Specifications

|                 |                                                   |
| --------------- | ------------------------------------------------- |
| Vendor/Brand    | TP-Link                                           |
| Model           | XZ000-G3                                          |
| Chipset         | [EcoNet EN751221](/chipset-econet) (PON PHY EN7571) |
| CPU             | MIPS 34Kc, 700 MHz (4 threads)                    |
| Flash           | 4 MB SPI NOR (EON EN25QH32B)                      |
| RAM             | 64 MB DDR2 (60792 kB available)                   |
| System          | TCLinux (Linux 2.6.36, BusyBox 1.26.2)            |
| HSGMII          | No                                                |
| Ethernet        | 1x 1 Gbit/s                                       |
| Optics          | SC/APC                                            |
| IP address      | 192.168.1.1                                       |
| Web Gui         | ✅ username `admin`, password `admin`             |
| SSH             |                                                   |
| Telnet          | ✅ port 23, limited TP-Link CLI (`/usr/bin/cli`)  |
| Serial          | ✅                                                |
| Serial baud     | 115200                                            |
| Serial login    | `admin` / `1234`                                  |
| Form Factor     | ONT                                               |

<ImageFigure file="tp-link/xz000-g3-teardown.jpg" alt="TP-Link XZ000-G3 teardown" caption="TP-Link XZ000-G3: teardown (source: vantc.net)" />
<ImageFigure file="tp-link/xz000-g3-pcb-front.jpg" alt="TP-Link XZ000-G3 PCB front" caption="TP-Link XZ000-G3: PCB front, serial header TX/RX/GND/VCC on the top edge (source: vantc.net)" />
<ImageFigure file="tp-link/xz000-g3-pcb-back.jpg" alt="TP-Link XZ000-G3 PCB back" caption="TP-Link XZ000-G3: PCB back (source: vantc.net)" />

# Default GPON Identifiers

Values set by the firmware via OMCI at boot (from the boot log):

|                  |                                                  |
| ---------------- | ------------------------------------------------ |
| Vendor ID        | TPLG                                             |
| ONU-G Version    | V4.0                                             |
| Equipment ID     | TX-6610                                          |
| OMCC Version     | 134 (0x86)                                       |
| Software Version | `V3.1.4` (both images)                           |
| GPON SN          | `TPLG` + last 4 bytes of the LAN MAC address     |

If no valid serial number is stored in the `auth` / `hwinfo` flash areas, the firmware generates it automatically from the LAN MAC address (e.g. MAC `9C:A2:F4:3A:AD:DC` → SN `TPLGf43aaddc`).

## List of software versions

- `3.1.4 Build 220830 Rel.35191n` (HW version `2.0.0.1`, product ID `0x4685b102`)

# Serial

Connect a 3.3 V USB-TTL adapter to the `TX`, `RX` and `GND` pins of the header on the top edge of the PCB (leave `VCC` unconnected) and open the console at 115200 baud. The root console login is `admin` / `1234`.

<ImageFigure file="tp-link/xz000-g3-serial.jpg" alt="TP-Link XZ000-G3 serial connection" caption="TP-Link XZ000-G3: USB-TTL adapter connected to the serial header (source: vantc.net)" />

::: details TP-Link XZ000-G3 boot log
<<< ./serial_dump/tp-link-xz000-g3-bootlog.txt
:::

## Change the MAC address

From the serial shell the LAN MAC address (and therefore the auto-generated GPON SN) can be changed with:

```sh
macaddr <new_mac>
```

# Flash Layout

`cat /proc/mtd`

| dev  | size     | erasesize | name          | flash offset            |
| ---- | -------- | --------- | ------------- | ----------------------- |
| mtd0 | 00400000 | 00010000  | "flash"       | `0x000000` - `0x400000` |
| mtd1 | 00020000 | 00010000  | "tcboot"      | `0x000000` - `0x020000` |
| mtd2 | 00010000 | 00010000  | "romfile"     | `0x020000` - `0x030000` |
| mtd3 | 00010000 | 00010000  | "factoryinfo" | `0x030000` - `0x040000` |
| mtd4 | 00010000 | 00010000  | "loid"        | `0x040000` - `0x050000` |
| mtd5 | 00010000 | 00010000  | "hwinfo"      | `0x050000` - `0x060000` |
| mtd6 | 00010000 | 00010000  | "config"      | `0x060000` - `0x070000` |
| mtd7 | 00010000 | 00010000  | "iot"         | `0x070000` - `0x080000` |
| mtd8 | 00130000 | 00010000  | "kernelA"     | `0x080000` - `0x1b0000` |
| mtd9 | 00250000 | 00010000  | "rootfsA"     | `0x1b0000` - `0x400000` |

`mtd0` covers the whole flash. The LAN MAC address is stored in `factoryinfo` (offset `0x30000`). There is only one firmware slot (`kernelA`/`rootfsA`), even if OMCI reports two images.

## Firmware dump

The whole flash can be dumped from the serial shell and sent to a TFTP server on the PC:

```sh
cat /dev/mtd0 > /tmp/mtd0
tftp -p -l /tmp/mtd0 -r mtd0 192.168.1.5 # replace with the IP of your TFTP server
```

A dump of all the partitions is available on [vantechcorner/XZ000-G3](https://github.com/vantechcorner/XZ000-G3/tree/main/firmware-dump).

# Known Bugs

The ONT randomly crashes when a PPPoE connection by a connected router is established.

The GPON serial sometimes temporarily disappears after a crash, preventing the ONT from reaching the O5 operational status.

# References

- [All about the TP-Link XZ000-G3 GPON ONT — vantc.net](https://vantc.net/all-about-the-tp-link-xz000-g3-gpon-ont.html) (photos, boot log and flash layout)
- [vantechcorner/XZ000-G3 firmware dump](https://github.com/vantechcorner/XZ000-G3/tree/main/firmware-dump)
