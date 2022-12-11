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
        <div class="modal-body" style="display:flex">
            <div class="animated" id="root-step-1"  style="width:50%" >
                <p>Step 1</p>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                    <circle class="path circle" fill="none" stroke="currentColor" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                    <circle class="fill circle" fill="none" stroke="currentColor" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                    <polyline class="path check success" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                    <line class="path line error" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                    <line class="path line error" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                    <line class="path line pause" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                    <line class="path line pause" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                </svg>
                <p id="root-text-step-1"></p>
            </div>
            <div class="animated" id="root-step-2" style="width:50%"  >
                <p>Step 2</p>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                    <circle class="path circle" fill="none" stroke="currentColor" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                    <circle class="fill circle" fill="none" stroke="currentColor" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                    <polyline class="path check success" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                    <line class="path line error" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                    <line class="path line error" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                    <line class="path line pause" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="49.4" y1="37.9" x2="49.4" y2="92.3"/>
                    <line class="path line pause" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="80.8" y1="38" x2="80.8" y2="92.2"/>
                </svg>
                <p id="root-text-step-2"></p>
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
    let rootStep = [document.getElementById('root-step-1'),document.getElementById('root-step-2')];
    let rootStepText = [document.getElementById('root-text-step-1'), document.getElementById('root-text-step-2')];
    rootModal.addEventListener('modal-close', async function(event) {
        console.log("abort");
        acontroller.abort();
    });
    rootModal.addEventListener('modal-open', async function(event) {
        console.log("start");
        root({signal: cs});
    });
    function pause(message, i) {
        rootStep[i].classList.add('pause');
        rootStep[i].classList.remove('complete');
        rootStep[i].classList.remove('loading');
        rootStep[i].classList.remove('error');
        rootStep[i].classList.remove('success');
        rootStepText[i].textContent = message;
    }
    function loading(message, i) {
        rootStep[i].classList.remove('pause');
        rootStep[i].classList.remove('complete');
        rootStep[i].classList.add('loading');
        rootStep[i].classList.remove('error');
        rootStep[i].classList.remove('success');
        rootStepText[i].textContent = message;
    }
    function showError(message, i) {
        rootStep[i].classList.remove('pause');
        rootStep[i].classList.add('complete');
        rootStep[i].classList.remove('success');
        setTimeout(() => { 
            rootStep[i].classList.remove('loading');
            rootStep[i].classList.remove('complete');
            rootStep[i].classList.add('error');
            rootStepText[i].textContent = message;
        }, 1000);
    }
    function showSuccess(message, i) {
        rootStep[i].classList.remove('pause');
        rootStep[i].classList.add('complete');
        rootStep[i].classList.remove('error');
        rootStepText[i].textContent = message;
        setTimeout(() => { 
            rootStep[i].classList.remove('loading');
            rootStep[i].classList.remove('complete');
            rootStep[i].classList.add('success');
            rootStepText[i].textContent = message;
        }, 1000);
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function waitUbootStop(writer, reader) {
        const interval = setInterval(function() {
            writer.write(String.fromCharCode(3));
        }, 10);

        while (true) {
            const { value, done } = await reader.read();

            if (value.startsWith('U-Boot')) {
                loading("Root in progress: Trigger characters received. DO NOT TOUCH THE HUAWEI MA5671A UNTIL THE PROCEDURE IS COMPLETED!",0);
                await delay(5000);
                clearInterval(interval);
                break;
            }
        }
    }
    async function checkUbootUnlocked(reader) {
        while (true) {
            try {
                const { value, done } = await Promise.race([
                    reader.read(),
                    new Promise((_, reject) => setTimeout(reject, 2000, new Error("timeout")))
                ]);

                if (value.startsWith('Press SPACE to delay and Ctrl-C to abort autoboot')) {
                    return true;
                }
            } catch (err) {
                return false;
            }
        }
    }
    async function waitShell(writer, reader) {
        while (true) {
            const { value, done } = await reader.read();

            if (value.startsWith('procd: - init complete')) {
                await delay(10000);
                break;
            }
        }

        const interval = setInterval(function() {
            writer.write(String.fromCharCode(10));
        }, 10);

        while (true) {
            const { value, done } = await reader.read();

            if (value.includes('OpenWrt')) {
                loading("Root in progress: Trigger characters received. Waiting for boot to end...",1);
                await delay(10000);
                clearInterval(interval);
                break;
            }
        }
    }
    async function root({ signal } = {}) {
        textarea.value = "";
        loading("Waiting for the user to choose the port",0);
        pause("",1);
        let port;
        try {
            port = await navigator.serial.requestPort();
        } catch (err) {
            showError(`Error: ${err.message}`,0);
            console.log(`Error: ${err.message}\n`);
            return;
        }
        if (!port) {
            showError('Error: port not open',0);
            console.log('Error: port not open\n');
            return;
        }
        textarea.value += '[+] Use serial port device\n';
        textarea.value += '[+] Waiting for trigger characters...\n';
        loading("Please disconnect the Huawei MA5671A from the SFP adapter if it is currently plugged in!",0);
        try {
            await port.open({ baudRate: 115200 });
        } catch (err) {
            showError(`Error: ${err.message}`,0);
            console.log(`Error: ${err.message}\n`);
            return;
        }
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer())).getReader();
        const textEncoderStream = new TextEncoderStream();
        const writerStreamClosed = textEncoderStream.readable.pipeTo(port.writable);
        const writer = textEncoderStream.writable.getWriter();
        try {
            await delay(10000);
            loading("Now you need to insert the Huawei MA5671A into the SFP adapter, if the procedure does not go ahead, check the connections and then remove and reconnect the Huawei MA5671A again",0);
            while(true) {
                await waitUbootStop(writer, reader);
                const ubootUnlocked = await checkUbootUnlocked(reader);

                if (ubootUnlocked == true) {
                    break;
                }

                loading("Root in progress: Set U-Boot bootdelay to 5...",0);
                writer.write('setenv bootdelay 5\n');
                await delay(1000);
                loading("Root in progress: Enable ASC serial...",0);
                writer.write('setenv asc0 0\n');
                await delay(1000);
                loading("Root in progress: Set GPIO to unlock serial...",0);
                writer.write('setenv preboot "gpio set 3;gpio input 2;gpio input 105;gpio input 106;gpio input 107;gpio input 108"\n');
                await delay(1000);
                loading("Root in progress: Save changes...",0);
                writer.write('saveenv\n');
                await delay(1000);
                loading("Root in progress: Rebooting...",0);
                writer.write('reset\n');
                await delay(1000);
            }

            loading("Root in progress: Rebooting...",0);
            writer.write('reset\n');
            await delay(1000);
            showSuccess("Oh Yeah! Step completed.",0);
        } catch (err) {
            showError(`Error: ${err.message}`,0);
            console.log(`Error: ${err.message}\n`);
            return;
        }

        try {
            loading("Waiting for reboot",1);
            await waitShell(writer, reader);
            loading("Root in progress: Enable full Linux shell...",1);
            writer.write('sed -i  "s|/opt/lantiq/bin/minishell|/bin/ash|g" /etc/passwd\n');
            await delay(1000);
            showSuccess("Oh Yeah! Step completed.",1);
        } catch (err) {
            showError(`Error: ${err.message}`,1);
            console.log(`Error: ${err.message}\n`);
            return;
        }

        reader.releaseLock();
        writer.releaseLock();
    }
</script>
