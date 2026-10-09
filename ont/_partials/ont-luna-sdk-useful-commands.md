# Useful files and binaries

## Useful files
- `/var/config/lastgood.xml` - Contains the user portion of the configuration
{% if include.lastgoodHs %}
- `/var/config/lastgood-hs.xml` - Contains the "hardware" configuration (which _should not_ be changed)
{% endif %}
- `/tmp/omcilog` - OMCI messages logs (must be enabeled, see below)

## Useful binaries
- `{{ include.flash }}` - Used to manipulate the config files in a somewhat safe manner
- `xmlconfig` - Used for low-level manipulation of the XML config files. Called by `{{ include.flash }}`
- `nv` - Used to manipulate nvram storage, including persistent config entries via `nv setenv`/`nv getenv`
- `omcicli` - Used to interact with the running OMCI daemon
- `omci_app` - The OMCI daemon
- `diag` - Used to run low-level diagnostics commands on the stick

# GPON ONU status

## Getting the operational status of the ONU

```sh
diag gpon get onu-state
```

## Querying a particular OMCI ME
```sh
# omcicli mib get MIB_IDX
```

The list of the MEs is in [GPON MIB](/mib), and the most useful ones to check the provisioning received from the OLT are in [Most useful MEs to check the provisioning](/mib#most-useful-mes-to-check-the-provisioning).

To dump all the MEs at once[^rtl960x_omci]:

```sh
for ME in 2 5 6 7 11 24 45 47 49 50 52 78 79 83 84 89 130 131 133 134 136 137 148 157 158 171 240 244 245 248 249 250 253 255 256 257 262 263 264 266 267 268 272 273 274 277 278 280 281 284 287 296 298 307 308 309 310 311 312 321 322 329 330 334 340 341 65282 65294 65408 65527 65528 65529 65530 65531; do echo "MIB: $ME"; omcicli mib get $ME; done
```

To dump the most useful MEs at once:

```sh
for ME in 6 7 11 84 131 171 256 257 262 263 264 277 309 329; do echo "MIB: $ME"; omcicli mib get $ME; done
```

## Getting the GEM ports and the flows

```sh
# diag gpon show us-flow
============================================================
    GPON ONU MAC U/S Flow Status
Flow ID | GEM Port | Type | TCont
      0 |      263 |  ETH |     0
      1 |      264 |  ETH |     1
     64 |        2 | OMCI |    16
============================================================
# diag gpon show ds-flow
```

## Getting the VLANs bridged by the stick

The L2 table shows the learned MAC addresses with their VLAN (`Vid`): if the internet traffic arrives untagged on the router, this is a way to find which VLAN is used on the PON side[^rtl960x_diag].

```sh
# diag l2-table get entry address valid
```

On the RTL9601D (e.g. ODI DFP-34X-2C2) the `valid` parameter is not available, the table has to be read entry by entry:

```sh
i=0
while [ $i -lt 2047 ]; do
    diag l2-table get entry address $i | grep -q "LUT" && diag l2-table get entry address $i
    i=$((i+1))
done
```

## Getting the port status and the bandwidth limits

```sh
# diag port get status port all
Port Status Speed    Duplex TX_FC RX_FC
---- ------ -----    ------ ----- -----
0    Up     1000M    Full   Dis   Dis
2    Up     1000M    Full   Dis   Dis
# diag bandwidth get egress port all
# diag bandwidth get ingress port all
```


{% if include.speedLan %}

## Getting/Setting Speed LAN Mode
{% assign customSpeedLanAlert = include.customSpeedLanAlert | default: "Before editing the speed make sure your hardware supports it." %}
::: info Note
{{ customSpeedLanAlert }}
:::

To change the link mode use this command:

```sh
# {{ include.flash }} get LAN_SDS_MODE
LAN_SDS_MODE=0
# {{ include.flash }} set LAN_SDS_MODE 1
```

| Value | `cat /proc/kmsg`                     | Mode     | Behavior                    |
| ----- | ------------------------------------ | -------- | --------------------------- |{% if include.speedLan contains '0' %}
| 0     | `<4>change mode to 0(GE/FE PHY)`     | `TP`     | 1GbaseT/100baseT            |{% endif %}{% if include.speedLan contains '1' %}
| 1     | `<4>change mode to 1(Fiber 1G)`      | `FIBER`  | 1GbaseX with auto-neg on    |{% endif %}{% if include.speedLan contains '2' %}
| 2     | `<4>change mode to 2(SGMII PHY)`     | `TP MII` | 1Gb PHY                     |{% endif %}{% if include.speedLan contains '3' %}
| 3     | `<4>change mode to 3(SGMII MAC)`     | `MII`    | 1Gb MAC                     |{% endif %}{% if include.speedLan contains '4' %}
| 4     | `<4>change mode to 4(HiSGMII PHY)`   | `TP MII` | 2.5Gb PHY                   |{% endif %}{% if include.speedLan contains '5' %}
| 5     | `<4>change mode to 5(HiSGMII MAC)`   | `MII`    | 2.5Gb MAC                   |{% endif %}{% if include.speedLan contains '6' %}
| 6     | `<4>change mode to 6(2500BaseX)`     | `FIBER`  | 2500baseX with auto-neg on  |{% endif %}{% if include.speedLan contains '7' %}
| 7     | `<4>change mode to 7(SGMII Force)`   | `TP`     | 1GbaseT with auto-neg off   |{% endif %}{% if include.speedLan contains '8' %}
| 8     | `<4>change mode to 8(HISGMII Force)` | `TP`     | 2500baseT with auto-neg off |{% endif %}

{% if include.speedLanDefault %}
The default value on this stick is `{{ include.speedLanDefault }}`.
{% endif %}

{% if include.speedLan contains '6' %}
The 2.5G modes are `4` (HiSGMII PHY), `5` (HiSGMII MAC) and `6` (2500BASE-X): most of the hosts that support 2.5G work with the mode `6` and the port forced to 2500BASE-X, see the [SFP standard](/sfp-standard) page and the [2.5G compatibility list](https://github.com/Anime4000/RTL960x/blob/main/Docs/2.5Gb.md)[^rtl960x_25g].
{% endif %}

::: warning
A `LAN_SDS_MODE` not supported by the host makes the stick unreachable: the only way to restore it is the serial console.
:::

{% endif %}

# GPON/OMCI settings

## Getting/Setting ONU GPON Serial Number
```sh
# {{ include.flash }} get GPON_SN
GPON_SN=TMBB00000000
# {{ include.flash }} set GPON_SN TMBB0A1B2C3D
```

## Getting/Setting ONU GPON PLOAM password
{% if include.ploam == 'asciiAndHex' %}

::: info Note
The PLOAM password can be saved in either ASCII or HEX format, without any 0x or separators
:::

```sh
# {{ include.flash }} get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# {{ include.flash }} set GPON_PLOAM_PASSWD AAAAAAAAAA
# {{ include.flash }} set GPON_PLOAM_PASSWD 41414141414141414141
```

{% elsif include.ploam == 'hex' %}

::: info Note
The PLOAM password is stored in HEX format, without any 0x or separators
:::

{% if include.rtl960x %}
From the firmware `220304` onwards only the HEX format is accepted via telnet/SSH (`GPON_PLOAM_FORMAT` set to `0`): use the Web GUI to enter it in ASCII[^rtl960x_setup].
{% endif %}

```sh
# {{ include.flash }} get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=41414141414141414141
# {{ include.flash }} set GPON_PLOAM_PASSWD 41414141414141414141
```
{% elsif include.ploam == 'ascii' %}

::: info Info
The PLOAM password is stored in ASCII format
:::

```sh
# {{ include.flash }} get GPON_PLOAM_PASSWD
GPON_PLOAM_PASSWD=AAAAAAAAAA
# {{ include.flash }} set GPON_PLOAM_PASSWD AAAAAAAAAA
```
{% endif %}

## Getting/Setting OMCI software version (ME 7)

{% if include.customSwVersionAlert %}

{% assign customSwVersionAlert = include.customSwVersionAlert %}
::: info Note
{{ customSwVersionAlert }}
:::

{% endif %}

{% if include.flashSwVersion %}
```sh
# {{ include.flash }} get OMCI_SW_VER1
OMCI_SW_VER1=YOURFIRSTSWVER
# {{ include.flash }} set OMCI_SW_VER1 YOURFIRSTSWVER
# {{ include.flash }} get OMCI_SW_VER2
OMCI_SW_VER1=YOURSECONDSWVER
# {{ include.flash }} set OMCI_SW_VER2 YOURSECONDSWVER
```
{% else %}
```sh
# nv setenv sw_custom_version0 YOURFIRSTSWVER
# nv setenv sw_custom_version1 YOURSECONDSWVER
```
{% endif %}

## Getting/Setting OMCI hardware version (ME 256)

{% if include.customHwVersionAlert %}

{% assign customHwVersionAlert = include.customHwVersionAlert %}
::: info Note
{{ customHwVersionAlert }}
:::

{% endif %}

```sh
# {{ include.flash }} get HW_HWVER
HW_HWVER=V2.0
# {{ include.flash }} set HW_HWVER MYHWVERSION
```

## Getting/Setting OMCI vendor ID (ME 256)

{% if include.customVendorAlert %}

{% assign customVendorAlert = include.customVendorAlert %}
::: info Note
{{ customVendorAlert }}
:::

{% endif %}

```sh
# {{ include.flash }} get PON_VENDOR_ID  
PON_VENDOR_ID=ZTEG
# {{ include.flash }} set PON_VENDOR_ID HWTC
```

## Getting/Setting OMCI equipment ID (ME 257)

{% if include.customEquipAlert %}

{% assign customEquipAlert = include.customEquipAlert %}
::: info Note
{{ customEquipAlert }}
:::

{% endif %}

```sh
# {{ include.flash }} get GPON_ONU_MODEL
GPON_ONU_MODEL=DFP-34X-2C2
# {{ include.flash }} set GPON_ONU_MODEL DFP-34X-XXX
```

## Getting/Setting OMCI OLT Mode and Fake OMCI

Configure how ONT Stick handle OMCI from OLT:

```sh
# {{ include.flash }} get OMCI_OLT_MODE
OMCI_OLT_MODE=1
# {{ include.flash }} set OMCI_OLT_MODE 2
```

| Value | Note            | OMCI Information                                                                                       |
| ----- | --------------- | ------------------------------------------------------------------------------------------------------ |
| 0     | Default Mode    | Stock setting, some values cannot be changed                                                           |
| 1     | Huawei OLT Mode | Huawei MA5671a                                                                                         |
| 2     | ZTE OLT Mode    | ZTE                                                                                                    |
| 3     | Customized Mode | Custom Software/Hardware Version, OMCC, etc...                                                         |{% if include.omciOLT21 %}
| 21    | Owerflow Mode   | Custom Software/Hardware Version, OMCC, etc... (this is a hack and causes sigsegv of `/bin/checkomci`) |{% endif %}

Some vendors/wholesale providers/ISPs have explicit LAN Port Number provisioning or proprietary OMCI that the stick cannot understand, this will make the stick reply OK to whatever the OLT sends it via OMCI. 

`0` = Disable, `1` = Enable, Default is 0

```sh
# {{ include.flash }} get OMCI_FAKE_OK
OMCI_FAKE_OK=0
# {{ include.flash }} set OMCI_FAKE_OK 1
```

{% if include.rtl960x %}
## Getting/Setting the OMCC version

The OMCC version (ME 257) advertised to the OLT, e.g. `128` (`0x80`) or `160` (`0xA0`):

```sh
# {{ include.flash }} get OMCC_VER
OMCC_VER=128
# {{ include.flash }} set OMCC_VER 160
```

## Getting/Setting the OMCI traffic management option

How the OLT manages the upstream bandwidth (ME 256 `Traffic management option`): if the upload speed is lower than expected, try the other values[^rtl960x_slow].

```sh
# {{ include.flash }} get OMCI_TM_OPT
OMCI_TM_OPT=2
# {{ include.flash }} set OMCI_TM_OPT 0
```

| Value | Mode                         |
| ----- | ---------------------------- |
| 0     | Priority controlled          |
| 1     | Rate controlled              |
| 2     | Priority and rate controlled |

## Getting/Setting the VEIP slot ID

Some OLTs expect the VEIP (ME 329) with the same Entity ID of the original ONT, usually `0x0e01`. The slot ID is the most significant byte of the Entity ID (`0x0e` = `14`), and it is applied only if the bit `0x100` (`cf_apply_customized_veip_slot_id`) of `OMCI_CUSTOM_ME` is set: the default value on the SFU firmwares is `65536` (`0x10000`), so it must be set to `65792` (`0x10100`)[^rtl960x_veip].

```sh
# {{ include.flash }} set OMCI_VEIP_SLOT_ID 14
# {{ include.flash }} set OMCI_CUSTOM_ME 65792
```

The other feature bits of `OMCI_CUSTOM_ME` have been documented by [@rajkosto](https://gist.github.com/rajkosto/79034a1f7b3de3f40edf50ffbd8396b0).

## Getting/Setting the other identity values

Some OLTs (mostly the ones that accept any ONU, e.g. Fiberhome and Calix) also check other values of the original ONT[^rtl960x_setup]:

| Variable               | Description                                                    | Example                        |
| ---------------------- | -------------------------------------------------------------- | ------------------------------ |
| `OUI`                  | Organizationally Unique Identifier of the original MAC address | `875773`                       |
| `HW_SERIAL_NO`         | Hardware serial number (not the GPON serial number)            | `UONHUWH12341234123`           |
| `ELAN_MAC_ADDR`        | MAC address of the stick, required by EPON                     | `781735000000`                 |
| `HW_CWMP_MANUFACTURER` | TR-069 manufacturer                                            | `Huawei Technologies Co., Ltd` |
| `HW_CWMP_PRODUCTCLASS` | TR-069 product class                                           | `HG8240H`                      |
| `LOID`, `LOID_PASSWD`  | Logical ONU ID and password, used by EPON and some GPON ISPs   |                                |

```sh
# {{ include.flash }} set OUI 875773
# {{ include.flash }} set HW_CWMP_MANUFACTURER 'Huawei Technologies Co., Ltd'
```

{% if include.macKey == 'odi' %}
::: warning
Changing `ELAN_MAC_ADDR` requires a new `MAC_KEY`, see [MAC key](/ont-odi-realtek-dfp-34x-2c2#mac-key).
:::
{% elsif include.macKey == 'vsol' %}
::: warning
Changing `ELAN_MAC_ADDR` or `HW_HWVER` requires a new `VS_AUTH_KEY`, see [VS_AUTH_KEY](/ont-vsol-v2801f#vs-auth-key).
:::
{% endif %}

## Getting/Setting the PON mode, device type and VLAN mode

| Variable         | Values                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `PON_MODE`       | `1` GPON (default), `2` EPON, `3` Ethernet (the PON side works as an Ethernet fiber transceiver)    |
| `DEVICE_TYPE`    | `0` bridge, `1` router, `2` hybrid                                                                  |
| `VLAN_CFG_TYPE`  | `0` auto (from OMCI), `1` manual (uses `VLAN_MANU_MODE`)                                             |
| `VLAN_MANU_MODE` | `0` transparent, `1` tagging (Q-in-Q, the outer tag is removed), `2` remote access, `3` special case |

Every `{{ include.flash }} set` requires a reboot to be applied[^rtl960x_flash].
{% endif %}

# Advanced settings

## Setting management IP

```sh
# {{ include.flash }} get LAN_IP_ADDR
LAN_IP_ADDR=192.168.2.1
# {{ include.flash }} set LAN_IP_ADDR 192.168.1.1
```

## Getting/Setting the L2 Bridge MTU
::: info Note
Settings given via diag are not permanent after reboot
:::

Getting/Setting the MTU of the L2 bridge
```sh
# diag switch get max-pkt-len port all 
Port Speed 
---------- 
0 1538 
2 2031 
# diag switch set max-pkt-len port all length 2000
```

## Checking the currently active image
```sh
# nv getenv sw_active
sw_active=1
# nv getenv sw_version0
sw_version0=V1_7_8_210412
# nv getenv sw_version1
sw_version1=V1_7_8_210412
```

## Booting to a different image

The firmware upgrade always writes the inactive image, so it is possible to go back to the previous firmware[^rtl960x_fw]:

```sh
# nv setenv sw_commit 0|1
# nv setenv sw_active 0|1
# reboot
```
{% if include.rtl960x %}

## Factory reset

::: danger
Make a backup of the `env`, `env2` and `config` partitions (see this [guide](https://github.com/Anime4000/RTL960x/discussions/28)) and write down `ELAN_MAC_ADDR` and the license key ({% if include.macKey == 'vsol' %}`VS_AUTH_KEY`{% else %}`MAC_KEY`{% endif %}) before the reset: after it the stick uses the default MAC address, and a wrong key prevents the authentication to the OLT.
:::

The configuration is stored in the `config` partition (`/dev/mtd3`), erasing it restores the default settings[^rtl960x_reset]:

```sh
# flash_eraseall /dev/mtd3
# reboot
```

If the stick reboots in a loop, the [reset-config-partition.sh](https://github.com/Anime4000/RTL960x/blob/main/Tools/reset/reset-config-partition.sh) script keeps trying until it can erase the partition via SSH.
{% endif %}

# Modifying the firmware

::: danger Warning
A wrong rootfs makes the image unbootable: always flash the **inactive** image, so that the stick can still boot the other one, and keep a backup of all the partitions.
:::

## Transferring files from/to the stick

Run `md5sum` on the source and on the destination to make sure that the file has not been corrupted.

Via SSH, from the stick to the PC and vice versa:

```sh
ssh admin@{{ include.ip | default: "192.168.1.1" }} "cat /dev/mtd5" > mtd5.bin
cat rootfs.new | ssh admin@{{ include.ip | default: "192.168.1.1" }} "cat > /tmp/rootfs.new"
```

Via TFTP (a TFTP server must be running on the PC):

```sh
# tftp <PC IP>
tftp> get rootfs.new
tftp> put <filename> <directory>
tftp> q
```

Via netcat (`nc` on the stick does not exit at the end of the transfer: stop it with `CTRL+C`)[^rtl960x_mod]:

```sh
# on the stick
nc -l -p 12345 > /tmp/rootfs.new
# on the PC
nc {{ include.ip | default: "192.168.1.1" }} 12345 < rootfs.new
```

::: info Info
On Windows run the commands from `cmd` (not PowerShell) and replace `cat` with `type`.
:::

## Extracting and repacking the rootfs

The rootfs is a SquashFS (LZMA) image: on the stick it is in `r0` (`/dev/mtd5`) for the image 0 and in `r1` (`/dev/mtd7`) for the image 1, while the kernel is in `k0` (`/dev/mtd4`) and `k1` (`/dev/mtd6`).

::: danger Warning
Run both commands as root, otherwise the rootfs image might be damaged.
:::

```sh
# unsquashfs mtd5.bin
# mksquashfs squashfs-root rootfs.new -b 131072 -comp lzma -no-recovery
```

The [RTL960x emulator](https://github.com/Anime4000/RTL960x/tree/main/Tools/emulator) runs the extracted firmware in QEMU (`qemu-user-static`) to modify and test it before flashing it: any file in its `custom` folder is copied over `squashfs-root` when leaving the chroot, and the custom startup scripts go in `/etc/init.d/rc35`.

## Flashing a new rootfs

Check which image is running (`nv getenv sw_active`): flash `mtd6`/`mtd7` if the image 0 is running, `mtd4`/`mtd5` if the image 1 is running. The following commands flash a new rootfs to the image 1 and boot it:

```sh
# flash_eraseall /dev/mtd7
# cat /tmp/rootfs.new > /dev/mtd7
# nv setenv sw_version1 NEW_SOFTWARE_VERSION
# nv setenv sw_commit 1
# reboot
```

If `cat` fails with `cat: write error: Invalid Argument`, write the image to the block device instead:

```sh
# flash_eraseall /dev/mtd7
# cat /tmp/rootfs.new > /dev/mtdblock7
```

## Repacking a firmware upgrade file

The firmware upgrade files of the ODM firmwares (e.g. V-SOL, T&W, ODI) are a `tar` containing the kernel (`uImage`), the `rootfs`, the `fwu.sh` upgrade script, the `fwu_ver` version file and the `md5.txt` checksums: after replacing the rootfs, update the checksums and repack it, then upload it from the Web GUI firmware upgrade page[^rtl960x_mod]:

```sh
tar -xf firmware.tar
mv rootfs.new rootfs
md5sum fwu.sh rootfs uImage fwu_ver > md5.txt
tar -cvf ../firmware-mod.tar *
```

The [Firmware_Mod](https://github.com/Anime4000/RTL960x/tree/main/Firmware_Mod) folder of the RTL960x repository contains the community patches for the ODI DFP-34X-2C2, V-SOL V2801F and T&W TWCGPON657 (Bootstrap Web GUI, VLAN, speed and software version fixes).

[^rtl960x_omci]: *OMCI MIB*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/OMCI_CLI.md
[^rtl960x_diag]: *Diag*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/DIAG.md
[^rtl960x_fw]: *Firmware Partition*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/fw_part.md
[^rtl960x_mod]: *Modify firmware*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/Modify_Firmware.md
{% if include.speedLan contains '6' %}[^rtl960x_25g]: *2.5Gb Compatibility*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/2.5Gb.md
{% endif %}{% if include.rtl960x %}[^rtl960x_setup]: *RTL960x SFP xPON ONU Configuration Guide*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/StickSetup.md
[^rtl960x_flash]: *`flash get`, `flash set`*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/FLASH_GETSET_INFO.md
[^rtl960x_slow]: *Slow Upload Speed*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/SlowUploadSpeed.md
[^rtl960x_veip]: *`OMCI_VEIP_SLOT_ID`*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/VEIP.md
[^rtl960x_reset]: *Factory Reset*, Anime4000/RTL960x https://github.com/Anime4000/RTL960x/blob/main/Docs/factory_reset.md
{% endif %}
