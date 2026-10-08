---
title: Extracting and repacking the rootfs
has_children: false
parent: KAON PM1191
---

::: danger Warning
Make sure you run all commands as root, otherwise you might get a damaged rootfs image
:::

## Unpacking SquashFS from UBI volume

```sh
# ubireader_extract_images rootfs1.img
# cp ubifs-root/X/squashfs_ubi/img-X_vol-squashfs_ubi.ubifs .
# as root...
unsquashfs -d rootfs_extracted/ img-X_vol-squashfs_ubi.ubifs
```

## Repacking SquashFS
```sh
rm -v new_squashfs.img
mksquashfs rootfs_extracted/ new_squashfs.img -comp xz -b 131072 -always-use-fragments -no-recovery -noappend
```

## Repacking UBI volume

Firstly create ubinize.cfg with volume settings:

```ini
[squashfs_ubi]
mode=ubi
image=new_squashfs.img
vol_id=0
vol_type=static
vol_name=squashfs_ubi
vol_alignment=1
```

Re-build volume:

```sh
rm -v new_rootfs1.ubi
ubinize -o new_rootfs1.ubi -p 131072 -m 2048 -s 2048 ubinize.cfg
```

## Writing to flash

Pay attention to what Image is active, inactive rootfs will be named `rootfs1` inside /proc/mtd.

For safety only flash one slot at once to make recovery faster avoiding need for U-Boot Ymodem upload.

# Documented modifications to rootfs

## Enable WEB UI
On builds not ending with `_eng` file `/sbin/httpd` was deleted to disable WEBUI, copying it from `_eng` build will restore its function.

## Disable TR-069
UCI configuration for TR-069 is saved inside `/etc/config/easycwmp`, deleteing ACS url will disable easycwmp process starting from its init script.

## Installing full busybox
Precompiled busybox binary with all its features can be found [here](https://github.com/YuukiJapanTech/CA8271x/tree/main/mod/busybox-full).

Place the full version into /bin/busybox-full or overlayfs and only create symlinks for tools you need.

Do not replace the old busybox binary, device uses mtd-utils version of ubi* commands and busybox implementation is incompatible if you replace them.

