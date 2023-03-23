---
title: GPON OMCI VLAN Table parser
has_children: false
description: Tool for parse the GPON OMCI VLAN Table (ME 171)
layout: default
---

<h1>VLAN TABLE PARSER</h1>
<form id="vlan-table-parser" novalidate>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="VLAN TABLE in HEX" name="vlan-table-hex" id="vlan-table-hex" required>
        <label for="vlan-table-hex">VLAN TABLE in HEX</label>
        <div class="invalid-feedback">
            Please provide a valid input text.
        </div>
    </div>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Decode!">
    </div>
    <div class="form-floating mb-3" id="to-place-table"></div>
</form>

<script type="text/javascript" src="/assets/js/omci-vlan.js"></script>
<script>          
    function fillVlanTable(table, vlanTableRule) {
        const tableNames = ["Filter outer priority",
                            "Filter outer VID",
                            "Filter outer TPID",
                            "Filter inner priority",
                            "Filter inner VID",
                            "Filter inner TPID",
                            "Filter ether type",
                            "Treatment tags to remove",
                            "Treatment outer priority",
                            "Treatment outer VID",
                            "Treatment outer TPID",
                            "Treatment inner priority",
                            "Treatment inner VID",
                            "Treatment inner TPID"];

    
        for (var j = 0; j < 14; j++) {
            var row = table.insertRow(j);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            
            cell1.innerHTML = tableNames[j];
            cell2.innerHTML = vlanTableRule[j];
        }
    }
    
    function makeVlanTables(formToPlaceTable, vlanTable) {
        for (const vlanRule of vlanTable) {
            var table = document.createElement('table');
            table.style.border = '1px solid black';
            fillVlanTable(table, vlanRule);
            formToPlaceTable.appendChild(table);
        }
    }
            
    var vlanTableForm = document.getElementById('vlan-table-parser');
    vlanTableForm.addEventListener('submit',(event) => {
        if (!vlanTableForm.checkValidity()) {
            event.preventDefault();
            [...vlanTableForm.elements].map(e => e.parentNode).forEach(e => e.classList.toggle('was-validated', true));
        } else {
            event.preventDefault();
            [...vlanTableForm.elements].map(e => e.parentNode).forEach(e => e.classList.toggle('was-validated', false));
            var fomrdata = new FormData(vlanTableForm);
            const hexString = fomrdata.get('vlan-table-hex');
            const vlanTable = vlanTableParse(hexString);
            const formToPlaceTable = document.getElementById('to-place-table');
            formToPlaceTable.innerHTML = '';
            makeVlanTables(formToPlaceTable, vlanTable);
        }
    });
</script>
