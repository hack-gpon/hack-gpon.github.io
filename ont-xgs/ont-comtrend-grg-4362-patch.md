---
title: OMCI unlock patch
has_children: false
parent: Comtrend GRG-4362
---

## Premade patch for CTN-1.0.8b16
This patch is for /bin/startup from firmware CTN-1.0.8b16 with MD5 `a5d76a686ebb6683e25d2e11d004a707`

```diff
< 00005a30: 1f00 0071 8002 0054 0000 00b0 0120 3b91  ...q...T..... ;.
< 00005a40: e0fa 8052 1bf4 ff97 0000 00b0 0120 3b91  ...R......... ;.
< 00005a50: 00fb 8052 17f4 ff97 0000 00b0 0120 3b91  ...R......... ;.
< 00005a60: 80fb 8052 13f4 ff97 0000 00b0 0120 3b91  ...R......... ;.
< 00005a70: e0fb 8052 0ff4 ff97 0100 8052 4000 8052  ...R.......R@..R
< 00005a80: b0f4 ff97 02fd ff97 1f00 0071 cb17 0054  ...........q...T
---
> 00005a30: 1f00 0071 8002 0054 1f20 03d5 1f20 03d5  ...q...T. ... ..
> 00005a40: 1f20 03d5 1f20 03d5 1f20 03d5 1f20 03d5  . ... ... ... ..
> 00005a50: 1f20 03d5 1f20 03d5 1f20 03d5 1f20 03d5  . ... ... ... ..
> 00005a60: 1f20 03d5 1f20 03d5 1f20 03d5 1f20 03d5  . ... ... ... ..
> 00005a70: 1f20 03d5 1f20 03d5 1f20 03d5 1f20 03d5  . ... ... ... ..
> 00005a80: 1f20 03d5 02fd ff97 1f00 0071 cb17 0054  . .........q...T
```

Resulting patched file should have MD5 of `e58fb01c2952e2dc053e8fa8638e45f7`

## Mannual patch for other versions

To patch other versions of startup, locate function that prints "startELan fail, plz check!" and delete the calls to mib_set with NOPs (0xd503201f)

<ImageFigure file="grg-4362/mib_patch.jpg" alt="Patch ASM" caption="Patch ASM" />

