---
title: Root Procedure for Huawei MA5671A (flash firmware)
has_children: false
parent: Huawei MA5671A
layout: default
---

<div class="modal" data-jtd-modal="flash-modal" data-jtd-modal-backdrop="static" id="flash-modal">
    <div class="modal-content">
        <div class="modal-header">
        <span class="close">&times;</span>
        <h2>Flash firmware</h2>
        </div>
        <form id="flash-form" class="p-4" novalidate>
            <div class="form-floating mb-3">
                <select class="form-control" placeholder="Baud rate" name="baud-rate" id="baud-rate">
                    <option value="115200" default selected>Default (115200)</option>
                    <option value="921600">Overclock (921600)</option>
                </select>
                <label for="baud-rate">Baud rate</label>
            </div>
            <div class="form-floating mb-3">
                <input type="file" class="form-control" placeholder="Flash MTD" name="flash-mtd" id="flash-mtd" required>
                <label for="flash-mtd">Flash MTD</label>
            </div>
            <div class="mb-3">
                <input type="submit" class="btn btn-primary" value="Flash!">
            </div>
            <progress id="flash-progress" value="32" max="100"> 32% </progress>
        </form>
    </div>
</div>

<button id="flash-start-button" class="btn btn-blue" data-jtd-toogle="modal" data-jtd-target="#flash-modal">Start flash!</button>

<script type="text/javascript" src="/assets/js/serialUtil.js"></script>
<script>
    const acontroller = new AbortController();
    const cs = acontroller.signal;
    let flashModal = document.getElementById("flash-modal");
    let flashForm = document.getElementById("flash-form");
    let flashProgress = document.getElementById("flash-progress");

    flashForm.addEventListener('submit', async function(event) {
        if (!flashForm.checkValidity()) {
            event.preventDefault();
        } else {
            event.preventDefault();

            flashProgress.value = 55;

            var fomrdata = new FormData(flashForm);
            var baudRate = fomrdata.get('baud-rate');
            var file = fomrdata.get('flash-mtd');
            console.log(file);
        }
        [...flashForm.elements].map(e => e.parentNode).forEach(e => e.classList.toggle('was-validated', true));
    });
</script>
