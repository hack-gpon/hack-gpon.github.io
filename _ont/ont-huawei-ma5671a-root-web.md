---
title: Root Huawei MA5671A Web App
has_children: false
parent: Huawei MA5671A
layout: default
nav_exclude: true
search_exclude: true
---

<h1>Root Huawei MA5671A Web App</h1>
<button id="start-button" class="btn" data-toogle="modal" data-target="#root-modal">Start root!</button>
<div class="modal" data-modal="root-modal" data-modal-backdrop="static" id="root-modal">
    <div class="modal-content">
        <div class="modal-header">
        <span class="close">&times;</span>
        <h2>Root status</h2>
        </div>
        <div class="modal-body">
            <div class="loader animated" id="root-loader" style="display: none">
                <div class="loader-bar"></div>
            </div>
            <p id="root-loader-text"></p>
            <div class="success animated" id="root-success-tick" style="display: none">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                    <circle class="path circle" fill="none" stroke="currentColor" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                    <polyline class="path check" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                </svg>
                <p id="root-success-text"></p>
            </div>
            <div class="error animated" id="root-error-tick" style="display: none">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                    <circle class="path circle" fill="none" stroke="currentColor" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                    <line class="path line" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                    <line class="path line" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                </svg>
                <p id="root-error-text"></p>
            </div>
        <textarea class="form-control" id="root-status" readonly style="resize: none; display: none">
        </textarea>
        </div>
    </div>
</div>
<script>
    const acontroller = new AbortController();
    const cs = acontroller.signal;
    class LineBreakTransformer {
        constructor() { 
            this.chunks = "";
        }
        transform(chunk, controller) {
            this.chunks += chunk;
            const lines = this.chunks.split("\n");
            this.chunks = lines.pop();
            lines.forEach((line) => controller.enqueue(line));
        }
        flush(controller) {
            controller.enqueue(this.chunks);
        }
    }
    let rootModal = document.getElementById("root-modal");
    let textarea = document.getElementById('root-status');
    let rootLoader = document.getElementById('root-loader');
    let rootLoaderText = document.getElementById('root-loader-text');
    let rootSuccessTick = document.getElementById('root-success-tick');
    let rootErrorTick = document.getElementById('root-error-tick');
    let rootSuccessText = document.getElementById('root-success-text');
    let rootErrorText = document.getElementById('root-error-text');
    rootModal.addEventListener('modal-close', async function(event) {
        console.log("abort");
        acontroller.abort();
    });
    rootModal.addEventListener('modal-open', async function(event) {
        console.log("start");
        root({signal: cs});
    });
    function showError(message) {
        rootLoaderText.style.display = "none";
        rootLoader.style.display = "none";
        rootSuccessTick.style.display = "none";
        rootErrorTick.style.display = "block";
        rootErrorText.textContent = message;
    }
    function showSuccess(message) {
        rootLoader.style.display = "none";
        rootErrorTick.style.display = "block";
        rootSuccessTick.style.display = "none";
        rootSuccessText.textContent = message;
    }
    async function root({ signal } = {}) {
        textarea.value = "";
        rootLoader.style.display = "none";
        rootErrorText.textContent = "";
        rootSuccessText.textContent = "";
        rootErrorTick.style.display = "none";
        rootSuccessTick.style.display = "none";
        rootLoaderText.textContent = "Waiting for the user to choose the port";
        rootLoaderText.style.display = "block";
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
        textarea.value += '[+] Use serial port device\n';
        textarea.value += '[+] Waiting for trigger characters...\n';
        rootLoader.style.display = "block";
        rootLoaderText.textContent = "Root in progress: Use serial port device. Waiting for trigger characters...";
        try {
            await port.open({ baudRate: 115200 });
        } catch (err) {
            showError(`Error: ${err.message}`);
            console.log(`Error: ${err.message}\n`);
            return;
        }
        for(let i = 0; i <1000; i++) {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer())).getReader();            
            const textEncoder = new TextEncoderStream();
            const writerStreamClosed = textEncoder.readable.pipeTo(port.writable);
            const writer = textEncoder.writable.getWriter();
            const interval = setInterval(function(){ 
                for(let k=0; k<1000;k++)
                    writer.write(String.fromCharCode(3)); 
            }, 0);
            try {
                while (true) {
                    console.log('await step 1');
                    const { value, done } = await reader.read();
                    if (value.startsWith('U-Boot')) {
                        rootLoaderText.textContent = "Root in progress: Trigger characters received. Transfer enable command...";
                        textarea.value += '[+] Received! Transfer enable command...\n';
                        await delay(10000);
                        clearInterval(interval);
                        rootLoaderText.textContent = "Root in progress: Transfer command sequence 2...";
                        textarea.value += '[+] Transfer command sequence 2\n';
                        writer.write(textEncoder.encode('setenv bootdelay 3\n'));
                        await delay(1000);
                        rootLoaderText.textContent = "Root in progress: Transfer command sequence 3...";
                        textarea.value += '[+] Transfer command sequence 3\n';
                        writer.write(textEncoder.encode('setenv asc0 0\n'));
                        await delay(1000);
                        rootLoaderText.textContent = "Root in progress: Transfer command sequence 4...";
                        textarea.value += '[+] Transfer command sequence 4\n';
                        writer.write(textEncoder.encode(
                            'setenv preboot "gpio set 3;gpio input 2;gpio input 105;gpio input 106;gpio input 107;gpio input 108"\n'));
                        await delay(1000);
                        rootLoaderText.textContent = "Root in progress: Transfer command sequence 5...";
                        textarea.value += '[+] Transfer command sequence 5\n';
                        writer.write(textEncoder.encode('saveenv\n'));
                        await delay(1000);
                        rootLoaderText.textContent = "Root in progress: Transfer command sequence 6...";
                        textarea.value += '[+] Transfer command sequence 6\n';
                        writer.write(textEncoder.encode('reset\n'));
                        rootLoaderText.textContent = "Root in progress: Enable command transfer complete! rebooting...";
                        textarea.value += '[+] Enable command transfer complete! rebooting...\n';
                        showSuccess("Oh Yeah! Step 1/2 completed.");
                        break;
                    }
                }
            } catch (err) {
                showError(`Error: ${err.message}`);
                console.log(`Error: ${err.message}\n`);
            } 
            const interval2 = setInterval(function(){ 
                for(let k=0; k<1000;k++)
                    writer.write(String.fromCharCode(10)); 
            }, 0);
            try {
                while (true) {
                    console.log('await step 1');
                    const { value, done } = await reader.read();
                    if (value.startsWith('OpenWrt')) {
                        rootLoaderText.textContent = "Root in progress: Trigger characters received. Transfer enable command...";
                        textarea.value += '[+] Received! Transfer enable command...\n';
                        clearInterval(interval2);
                        rootLoaderText.textContent = "Root in progress: Transfer command sequence 7...";
                        textarea.value += '[+] Transfer command sequence 7\n';
                        writer.write(textEncoder.encode('sed -i  "s|/opt/lantiq/bin/minishell|/bin/ash|g" /etc/passwd\n'));
                        rootLoaderText.style.display = "none";
                        showSuccess("Oh Yeah! Step 2/2 completed.");
                        break;
                    } else if(value.includes("Kernel panic")) {
                        throw new Error('Kernel panic. The cause of these kernel panics could be insufficient power supply.');
                        break;
                    }
                }
            } catch (err) {
                showError(`Error: ${err.message}`);
                console.log(`Error: ${err.message}\n`);
            }
            reader.releaseLock();
            writer.releaseLock();
        }
    }
</script>