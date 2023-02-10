---
title: Lantiq Print EEPROM
has_children: false
layout: default
---

1. Get `sfp_a0_low_128` or `sfp_a2_info` and paste into the form


<div id="app">
    <vue-lantiq-eeprom type='eeprom-print'></vue-lantiq-eeprom>
</div>
<script src="https://unpkg.com/vue@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/vue3-sfc-loader"></script>
<script src="/assets/js/vue-eeprom.js"></script>

{% include alert.html content="For more information, see the SFF-8472 Rev 10.2 specification." alert="Info" icon="svg-info" color="blue" %}