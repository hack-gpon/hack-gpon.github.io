---
title: Firmware
has_children: false
nav_order: 1
---

The firmware pages document the software that runs on the ONTs, separately from the device pages, which document the hardware (specifications, serial, partitions, EEPROM, root and recovery procedures). A firmware that runs on more than one device has its own page here, with the list of the devices it runs on: the device pages list their firmwares automatically.

# Badges

Every firmware has one badge, the best one whose requirements it meets. The badges are listed from the best to the worst: an open source firmware is always preferred to a closed source one, whoever modified it.

| Badge | Requirements |
| ----- | ------------ |
| <FirmwareBadge type="foss-verified" /> | Free and open source (OSI license), with public source code; built by a public CI that produces the released images; every release has SHA-256 checksums, build provenance (e.g. signed attestations) and an SBOM (SPDX or CycloneDX); no default backdoor credentials; proprietary blobs absent or declared |
| <FirmwareBadge type="foss" /> | Free and open source (OSI license), with public source code, but one of the requirements above (public CI, checksums, build provenance, SBOM) is missing |
| <FirmwareBadge type="maintainers" /> | Closed source firmware modified and maintained by the Hack GPON maintainers |
| <FirmwareBadge type="contributors" /> | Closed source firmware modified by a known contributor of Hack GPON or [OpenPON](https://openpon.org/) |
| <FirmwareBadge type="stock" /> | Original firmware of the vendor, at most rooted, without functional changes |
| <FirmwareBadge type="unverified" /> | Firmware of unknown origin: no source code and nobody who answers for it |

The badge is assigned when the firmware page is reviewed. The checksums of the files listed in the firmware pages are SHA-256.

The badges are SVG images, they can also be used in the README of a firmware:

```md
[![hack-gpon: open source · verified](https://hack-gpon.org/badges/foss-verified.svg)](https://hack-gpon.org/firmware/#badges)
```

# Compatibility

The firmware pages list the devices the firmware runs on, with one of these statuses:

| Status                  | Meaning                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| Works                   | Documented as working on the device                                  |
| Works after a procedure | Works only after a procedure described in the firmware page          |
| Reported working        | Single report, not confirmed                                         |
| Possible, not tested    | Technically possible (e.g. after a procedure), but nobody tried it yet |
| Does not work           | Known not to work on the device, with the reason in the firmware page |

# List of firmwares

<FirmwareIndex />

# Adding a firmware

Create a page in the `firmware` folder with the badge, the source code (for the open source firmwares) and the devices in the front matter:

```yaml
---
title: Example firmware
badge: foss
platform: Lantiq SDK (OpenWrt)
source: https://github.com/example/firmware
devices: ont-huawei-ma5671a:works, ont-nokia-g-010s-p:reported
---
```

The device pages show the firmware with the `<FirmwareList />` component.
