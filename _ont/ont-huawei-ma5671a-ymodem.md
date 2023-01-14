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
                <input type="file" class="form-control" placeholder="Flash MTD" name="flash-mtd" id="flash-mtd" required>
                <label for="flash-mtd">Flash MTD</label>
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="baud-rate-oc" name="baud-rate-oc" disabled>
                <label class="form-check-label" for="baud-rate-oc">230400 baud rate, do not enable unless told to do so</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="image" id="image0" value="image0">
                <label class="form-check-label" for="image0">
                    Image 0
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="image" id="image1" value="image1">
                <label class="form-check-label" for="image1">
                    Image 1
                </label>
            </div>
            <div class="mb-3">
                <input type="submit" class="btn btn-primary" value="Flash!">
            </div>
            <progress id="flash-progress" value="0" max="100"></progress>
            <p id="flash-text-step"></p>
        </form>
    </div>
</div>

<button id="flash-start-button" class="btn btn-blue" data-jtd-toogle="modal" data-jtd-target="#flash-modal">Start flash!</button>
<script type="text/javascript" src="/assets/js/xymini.js"></script>
<script type="text/javascript" src="/assets/js/serialUtil.js"></script>
<script>
    const acontroller = new AbortController();
    const cs = acontroller.signal;
    let flashModal = document.getElementById("flash-modal");
    let flashForm = document.getElementById("flash-form");
    let flashProgress = document.getElementById("flash-progress");
    let flashTextStep = document.getElementById("flash-text-step");
    flashModal.addEventListener('modal-jtd-close', async function(event) {
        acontroller.abort();
    });
    flashModal.addEventListener('modal-jtd-open', async function(event) {
        flash({signal: cs});
    });
    function pause(message) {
        flashTextStep.textContent = message;
    }
    function loading(message) {
        flashTextStep.textContent = message;
    }
    function showError(message) {
        flashTextStep.textContent = message;
    }
    function showSuccess(message) {
        flashTextStep.textContent = message;
    }
    async function flash({ signal } = {}) {
        let port;
        try {
            port = await navigator.serial.requestPort();
        } catch (err) {
            showError(`Error: ${err.message}`);
            console.log(`Error: ${err.message}\n`);
            return;
        }
        if (!port) {
            showError('Error: port not open');
            console.log('Error: port not open\n');
            return;
        }
        flashForm.addEventListener('submit', async function(event) {
            [...flashForm.elements].map(function(e){return e.parentNode}).forEach(function(e){e.classList.toggle('was-validated', true)});
            if (!flashForm.checkValidity()) {
                event.preventDefault();
            } else {
                event.preventDefault();
                var fomrdata = new FormData(flashForm);
                var baudRate = fomrdata.get('baud-rate');
                var file = fomrdata.get('flash-mtd');
                var data = new Uint8Array(await file.arrayBuffer());
                console.log(data);
                [reader, writer, readableStreamClosed, writerStreamClosed] = openPortLineBreak(port, 115200); /* TODO ?*/
                if(fomrdata.has('baud-rate-oc')) {
                    /* TODO*/
                } else {
                    writer.write("loady 0x80800000");
                    sendXYMini(reader, writer, data, function(byte) {
                        flashProgress.value = byte/data.size;
                    });
                }
                closePortLineBreak(port, reader, writer, readableStreamClosed, writerStreamClosed); /* TODO ?*/
            }
        });
    };
</script>
