---
title: odi-oss
has_children: false
badge: foss-verified
platform: Realtek RTL9601D (mainline Linux)
source: https://github.com/AndreZiviani/odi-oss
devices: ont-odi-realtek-dfp-34x-2c2:works
---

[odi-oss](https://github.com/AndreZiviani/odi-oss), by [@AndreZiviani](https://github.com/AndreZiviani), is an open replacement for the stock firmware of the Realtek based ODI sticks, built from source rather than repacked: a mainline Linux 6.18 kernel, its own switch and GPON MAC drivers, its own OMCI daemon and web UI, and no proprietary code. It was written with AI assistance and validated on real hardware.

# Compatibility

<FirmwareCompatibility />

It is tested on the [ODI Realtek DFP-34X-2C2](/ont-odi-realtek-dfp-34x-2c2) hardware v06. Users report it working on the DFP-34X-2C3, the Luleey LL-XS2510 and the HSGQ XPON stick (hardware v08).

::: warning
It is not compatible with the [ZTE based DFP-34X-2C2](/ont-odi-zte-dfp-34x-2c2).
:::

# Releases

The images are built by the public CI of the repository. Every [release](https://github.com/AndreZiviani/odi-oss/releases) comes with the `SHA256SUMS` file, the corresponding sources, a CycloneDX SBOM and the GitHub build attestations, so an image can be checked before flashing it:

```sh
sha256sum -c --ignore-missing SHA256SUMS
gh attestation verify IMAGE -R AndreZiviani/odi-oss
```

# Installing

The firmware is flashed from the stock firmware into the inactive image and boots on trial first, so a boot that fails goes back to the stock image.

::: danger
Back up the flash and follow the [install guide](https://github.com/AndreZiviani/odi-oss#install-from-the-stock-firmware) before flashing. The `config` partition, shared with the stock firmware, holds the GPON serial number, the PLOAM password and the MAC address and cannot be rebuilt.
:::

# Usage

The stick answers on the management address stored in the `config` partition: `192.168.1.1/24` is the stock default and the one used when no valid address is stored. The web UI is on port 80, SSH on port 22 and the metrics exporter on port 9100.

The settings and the commands are documented in the [repository](https://github.com/AndreZiviani/odi-oss).
