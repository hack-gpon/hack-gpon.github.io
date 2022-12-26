---
title: ASCII and Hex converter
has_children: false
nav_order: 1
description: Tool for converter ASCII and Hex
layout: default
---

<h1>ASCII To Hex</h1>
<form id="ascii-to-hex" novalidate>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="ASCII" name="ascii-to-hex" id="ascii-to-hex" required>
        <label for="ascii-to-hex">ASCII</label>
        <div class="invalid-feedback">
            Please provide a valid input text.
        </div>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="Glue" name="ascii-to-hex-glue" id="ascii-to-hex-glue" value=" ">
        <label for="ascii-to-hex-glue">Glue/Separator (empty for the format 0x0123456789ABCDE, ` ` for the format 0x01 0x23 0x45 0x67 0x89 0xAB 0xCD 0xEF)</label>
    </div>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Calculate!">
    </div>
    <div class="form-floating mb-3">
        <input readonly class="form-control" type="text" id="hex-result" placeholder="HEX Result">
        <label for="hex-result">HEX Result</label>
    </div>
</form>
<h1>Hex To ASCII</h1>
<form id="hex-to-ascii" novalidate>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="HEX" name="hex-to-ascii" id="hex-to-ascii" required>
        <label for="hex-to-ascii">HEX</label>
        <div class="invalid-feedback">
            Please provide a valid input text.
        </div>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="Separator" name="hex-to-ascii-separator" id="hex-to-ascii-separator" value=" ">
        <label for="hex-to-ascii-separator">Glue/Separator (empty for the format 0x0123456789ABCDEF, ` ` for the format 0x01 0x23 0x45 0x67 0x89 0xAB 0xCD 0xEF)</label>
    </div>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Calculate!">
    </div>
    <div class="form-floating mb-3">
        <input readonly class="form-control" type="text" id="ascii-result" placeholder="ASCII Result">
        <label for="ascii-result">ASCII Result</label>
    </div>
</form>
  
<script>

    function getChunks(s, i) {
        var a = [];
        do{ a.push(s.substring(0, i)) }  while( (s = s.substring(i)) != "" );
        return a;
    }

    var asciiToHexForm = document.getElementById('ascii-to-hex');
    asciiToHexForm.addEventListener('submit',(event) => {
        if (!asciiToHexForm.checkValidity()) {
            event.preventDefault();
        } else {
            event.preventDefault();
            var fomrdata = new FormData(asciiToHexForm);
            var str = fomrdata.get('ascii-to-hex');
            var glue = fomrdata.get('ascii-to-hex-glue');
            var prefixi = glue !== "" ? "0x" : "";
            var prefix = glue === "" ? "0x" : "";
            var hex = prefix + ([...str].map((elem, n) => prefixi+Number(str.charCodeAt(n)).toString(16)).join(glue));
            document.getElementById('hex-result').value = hex;
        }
        [...asciiToHexForm.elements].map(e => e.parentNode).forEach(e => e.classList.toggle('was-validated', true));
    });

    var hexToAsciiForm = document.getElementById('hex-to-ascii');
    hexToAsciiForm.addEventListener('submit',(event) => {
        if (!hexToAsciiForm.checkValidity()) {
            event.preventDefault();
        } else {
            event.preventDefault();
            var fomrdata = new FormData(hexToAsciiForm);
            var str = fomrdata.get('hex-to-ascii');
            var separator = fomrdata.get('hex-to-ascii-separator');
            var ascii = separator === "" ? getChunks(str.substring(2),2).map(el => String.fromCharCode(parseInt(el, 16))).join('') : str.split(separator).map(el => String.fromCharCode(Number(el))).join('');
            document.getElementById('ascii-result').value = ascii;
        }
        [...hexToAsciiForm.elements].map(e => e.parentNode).forEach(e => e.classList.toggle('was-validated', true));
        
    });
    
</script>
