---
title: Flash Nokia G-010S-A firmware through Web Serial
has_children: false
parent: Nokia G-010S-A
---

# Nokia G-010S-A Web Serial firmware flash

This tool transfers a supported Nokia firmware image over UART using YMODEM. It writes the slot opposite the committed image and verifies the complete slot before changing any boot selection. It runs locally in your browser; the selected image and boot-settings backup are not uploaded to a server.

::: warning Hardware validation
This implementation has automated protocol and failure-path tests and was checked against firmware binaries and a matching public U-Boot image. End-to-end validation on physical G-010S-A hardware is still pending. Keep a complete backup and an available UART recovery connection before using it.
:::

## Before starting

1. Make a complete backup of your own module, including U-Boot, its environment and the configuration/identity partitions. The JSON settings download offered here is **not** a full-flash backup. MTD exports such as `linux`, `rootfs` and `rootfs_data` overlap; do not concatenate every exported MTD file into a flash image.
2. [Enable UART](/ont-nokia-g-010s-a#enabling-serial) while SSH or the web interface is still available. This tool requires `asc0=0`, a positive boot delay, a cleared `preboot`, and a working `FALCON =>` prompt. Receiving only the three BootROM lines is insufficient.
3. Use the [Nokia pinout](/ont-nokia-g-010s-a#serial), 3.3 V TTL signalling and stable module power. Close any terminal using the adapter. The transfer uses **115200 8-N-1**, with no baud-rate switching.
4. Select the supported image below, connect the adapter, then power-cycle the module when prompted. Review the automatically selected target slot and download the original boot settings before confirming the write.

## Supported image and bootloader

The initial supported image is `nokia-g010sa_new_busybox_kernel_19.07-squashfs.image`, the inspected 2026-08-14 Nokia build:

| Property | Value |
| --- | --- |
| File length | 4,456,683 bytes (`0x4400eb`) |
| SHA-256 | `5c0d6853645d72748cf844f9e64fc57c38924cc7938ef14a40a827015bbc1248` |
| Whole-file CRC32 | `cc6273fe` |
| U-Boot | `2015.04-lantiq-gpon-1.3.6.1 (Feb 07 2018 - 17:12:06)` with the inspected Nokia boot scripts |
| Flash | 16 MiB |

The filename does not establish compatibility. The complete-file SHA-256 must match a reviewed image, and the tool also checks the kernel header/data CRCs and root-filesystem bounds. The corresponding Huawei and Alcatel builds have the **same kernel and generic `SFP` image metadata**, but different root filesystems. They are rejected even if renamed. Full dumps, arbitrary partition backups and modified files are also rejected.

The boot configuration must match either the inspected legacy Nokia selector (`commit`) or that image's known upgraded selector (`committed_image`). Different layouts, custom boot scripts and pending trial boots are rejected. The saved `c_img` value is not used to guess the active slot.

<NokiaFirmware />

## What will be written

| Region | Offset | Length | Tool behaviour |
| --- | --- | --- | --- |
| U-Boot | `0x000000` | `0x040000` | Preserved |
| U-Boot environment | `0x040000` | `0x080000` | Saved only when selecting a trial or a new default |
| Image 0 | `0x0c0000` | `0x600000` | Written only if image 1 is committed |
| Image 1 | `0x6c0000` | `0x600000` | Written only if image 0 is committed |
| Configuration and identity | `0xcc0000`–`0xffffff` | `0x340000` | Preserved by the tool |

Before erasing anything, the receiver must report the exact file size and its RAM CRC32 must match. The selected 6 MiB slot is then erased completely, only the file's actual bytes are written, and the **whole slot** is read back and checked, including the unused tail which must remain erased. This avoids writing uninitialised RAM or retaining an old overlay after the firmware image.

The firmware's own first-boot behaviour can still change its configuration. Preserving these flash regions during transfer is not a guarantee that every previous setting will carry over to the new firmware.

## Choosing how to boot

- **Keep the current boot choice:** upload and verify the other slot. No environment variables are saved and no boot scripts are migrated.
- **Try the new image on the next boot:** apply the inspected boot-script migration, retain the previous image as the committed default, and schedule one trial of the new image. The selector returns the persistent default to the previous slot before starting the trial.
- **Use the new image as the default:** apply the same migration and commit the verified target slot. The previous firmware contents remain in the other slot.

The migration is part of the supplied Nokia image's `/lib/upgrade/common.sh`. It normally runs during Linux `sysupgrade`, **not automatically on first boot after a raw UART write**. It changes the selector to `committed_image` and resets `boot_fail` during each normal boot. The inspected loader otherwise increments this counter in `bootm` and can switch slots at its failure threshold. Clearing the counter just once does not replace the migration.

All proposed boot settings are read back before `saveenv`; the tool requires a fresh command-success marker from the save. It never automatically resets the module or starts the kernel. After success, **cold power-cycle** the module rather than issuing a warm `reset`: the selector also recognises warm-reset image requests in scratch registers. Allow about one minute for the first startup, then check UART, network access and your GPON configuration.

## Interrupted operations

Closing the dialog or pressing Stop prevents further commands. A command already sent to the device cannot be undone. An interruption during erase/write leaves the target slot uncertain; an interruption during `saveenv` leaves the saved boot state uncertain. Keep power connected until any flash operation finishes and inspect the console before rebooting. The result remains visible after the dialog is closed.

If an unknown layout, image or boot script is reported, collect the bootloader version and a sanitised environment report for review. Do not bypass the checks by renaming files or copying the Huawei erase/write commands.

## Technical references

The public comparison covered a complete 16 MiB Alcatel G-010S-P SPI dump, rooted Huawei firmware-partition dumps, and Nokia firmware partitions, bootloader binaries and environment transcripts. An independent complete Huawei or Nokia SPI dump was not validated. These artifacts corroborate the formats, flash layouts and boot scripts; they do not replace a physical flashing test.

The published Nokia 2018 bootloader is byte-for-byte identical to the supplied Nokia U-Boot partition. The inspected legacy `select_image` script also exactly matches wteiken's owner-uploaded environment, including whitespace. The separate [codekow environment transcript](https://github.com/codekow/G-010S-AP/blob/65c7b2a72de79b8450702bf6cd74240a48434955/convert/G-010S-A.env.txt) contains a different selector variant and is not the source of that exact match.

- [Nokia serial recovery and image-slot addresses](https://github.com/wteiken/G-010S-A/blob/980a6ca29de6eccf829324a6bb671eec1323cb36/unbricking.md)
- [Matching Nokia 2018 U-Boot partition](https://github.com/codekow/G-010S-AP/blob/65c7b2a72de79b8450702bf6cd74240a48434955/bootloader/1.3.6.1-2018.bin), SHA-256 `c6c461ede9f5d9f3fd8117452a0e9c97e01bb29be40a9e4a2df4e9d39216a837`
- [Primary owner environment and attachment](https://github.com/hwti/G-010S-A/issues/27#issuecomment-1324209958)
- [Alcatel G-010S-P full SPI dump](https://github.com/minhng99/alcatel_lucent-lantiq_falcon/blob/ea3bbb1bf23df3c5b0b2abc37cf371d35bbfd909/dump_alcatel_128s0.bin)
- [Huawei rooted firmware-partition images](https://github.com/Noltari/ma5671a-firmware/tree/22ec8c076081a5f506c565d95dc3af1602693f5e/huawei)
- [Nokia BGCB22 firmware-partition image](https://github.com/wteiken/G-010S-A/blob/980a6ca29de6eccf829324a6bb671eec1323cb36/firmwares/3FE46398BGCB22.bin)
- [Nokia firmware and upgrade behaviour](https://github.com/hwti/G-010S-A)
- [U-Boot 2015.04 YMODEM receiver](https://github.com/u-boot/u-boot/blob/v2015.04/common/xyzModem.c)
- [U-Boot 2015.04 serial load command](https://github.com/u-boot/u-boot/blob/v2015.04/common/cmd_load.c)
