---
title: Ethtool Print EEPROM
has_children: false
layout: default
---

1. Get `ethtool -m` or `ethtool -e` and paste into the form

<div id="app">
    <vue-lantiq-eeprom type='eeprom-ethtool'></vue-lantiq-eeprom>
</div>
<script src="https://unpkg.com/vue@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/vue3-sfc-loader"></script>
<script src="/assets/js/vue-eeprom.js"></script>