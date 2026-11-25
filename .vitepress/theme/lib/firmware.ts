/** Client side data of the firmware badges and compatibility statuses (see `.vitepress/pages.ts`). */
import type { Chipset, CompatibilityStatus, Firmware, FirmwareBadge } from '../../pages'

export type { Chipset, CompatibilityStatus, Firmware, FirmwareBadge }

export const badgeInfo: Record<FirmwareBadge, { label: string; description: string }> = {
  'foss-verified': {
    label: 'Open source, verified build',
    description: 'Free and open source, built by a public CI, released with SHA-256 checksums, build provenance and SBOM'
  },
  foss: {
    label: 'Open source',
    description: 'Free and open source, but the public CI, the checksums, the build provenance or the SBOM are missing'
  },
  maintainers: {
    label: 'Hack GPON maintainers',
    description: 'Closed source firmware modified by the Hack GPON maintainers'
  },
  contributors: {
    label: 'Community contributors',
    description: 'Closed source firmware modified by a Hack GPON or OpenPON contributor'
  },
  stock: {
    label: 'Original firmware',
    description: 'Firmware of the vendor, at most rooted, without functional changes'
  },
  unverified: {
    label: 'Not guaranteed',
    description: 'Firmware of unknown origin: no source code and nobody who answers for it'
  }
}

export const statusInfo: Record<CompatibilityStatus, string> = {
  works: 'Works',
  procedure: 'Works after a procedure',
  reported: 'Reported working',
  untested: 'Possible, not tested',
  broken: 'Does not work'
}
