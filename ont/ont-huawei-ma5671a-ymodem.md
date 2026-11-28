---
title: Root Procedure for Huawei MA5671A (flash firmware)
has_children: false
parent: Huawei MA5671A
---

This procedure flashes the firmware on the stick via serial. Some of the firmwares that can be flashed are listed on the [Huawei MA5671A page](/ont-huawei-ma5671a).

::: warning Nokia G-010S-A uses a different flash layout
For G-010S-A, use the dedicated [Nokia Web Serial firmware flasher](/ont-nokia-g-010s-a-ymodem). The Huawei procedure's second slot starts at `0x800000` and extends to the end of flash; those addresses overlap Nokia's configuration and identity partitions. Selecting a Nokia image does not change this procedure's flash layout.
:::

<YmodemLantiq model-name="Huawei MA5671A" />
