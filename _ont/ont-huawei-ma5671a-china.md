---
title: right.com.cn Firmware for Huawei MA5671A
has_children: false
layout: default
parent: Huawei MA5671A
---

# General setting

{% include alert.html content="Be careful, use this firmware only if you have performance problems with all other firmware." alert="Info" icon="svg-info" color="blue" %}

{% include alert.html content="Do not use translator on the browser, use a translation app on the phone through virtual reality." alert="Danger" icon="svg-warning" color="red" %}

1. Flash on the 0 partition

2. Run via ssh

```sh
jffs2reset
```

3. Reboot

4. Fill in the data from left to right and from top to bottom, with save & apply on every page

5. Reboot

6. Edit the incorrect data and make save and apply from pending changes

7. Reboot