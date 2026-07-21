---
title: Flash firmware for Nokia G-010S-P (with root)
has_children: false
parent: Nokia G-010S-P
layout: default
---

This procedure flashes the firmware in the stick via serial. You have to get firmware to flash, some are listed on the [Huawei MA5671A page](/ont-huawei-ma5671a).

{: .text-center .fs-6 }
<button id="flash-start-button" class="btn btn-blue" data-jtd-toggle="modal" data-jtd-target="#flash-modal">Start flash!</button>

<div id="flash-browser-error" style="display:none">{% include alert.html content="This browser is not compatible with the web-root procedure. See the <a href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility'>Browser compatibility</a>" alert="Note"  icon="svg-warning" color="red" %}</div>
<noscript>
{% include alert.html content="Your browser does not support JavaScript!" alert="Note"  icon="svg-warning" color="red" %}
</noscript>

{% include ymodem_lantiq.html modelName="Nokia G-010S-P" %}
