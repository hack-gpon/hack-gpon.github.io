---
title: Root Procedure for Huawei MA5671A (V3)
has_children: false
parent: Huawei MA5671A
layout: default
---

# Root the stick

Connect the SFP adapter to the TTL adapter according to the following diagram:

| USB TTL (UART) Adapter | wire colour in picture | SFP 20pins Molex connector |
| ---------------------- | ---------------------- | -------------------------- |
| 3.3V                   | red                    | 3.3 (pin #15 and #16)       |
| TX                     | green                  | RX (pin #2)                |
| RX                     | blue                   | TX (pin #7)                |
| GND                    | black                  | GND (pin #14)              |

{% include image.html file="web-root-procedure/ttl-sfp.jpg" alt="Example of how the molex SFP - TTL connection should look like" caption="Example of how the molex SFP - TTL connection should look like" %}

{% include image.html file="web-root-procedure/sfp-sfp.jpg" alt="Example of how the SFP - molex SFP connection should look like" caption="Example of how the SFP - molex SFP connection should look like" %}

{% include alert.html content="Try PIN 10 or other GND PINs if the connection doesn't work with PIN 14." alert="Note" icon="svg-warning" color="yellow" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note" icon="svg-warning" color="yellow" %}

Connect the TTL adapter to the computer, once done press the following button. A window will open that will execute the root.

{: .text-center .fs-6 }
<button id="start-button" class="btn btn-blue" data-jtd-toogle="modal" data-jtd-target="#root-modal" disabled>Start root!</button>

<div id="browser-error" style="display:none">{% include alert.html content="This browser is not compatible with the web-root procedure. See the <a href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility'>Browser compatibility</a>" alert="Note"  icon="svg-warning" color="red" %}</div>
<noscript>
{% include alert.html content="Your browser does not support JavaScript!" alert="Note"  icon="svg-warning" color="red" %}
</noscript>


# Connect to the stick via SSH

After this is done, reboot the stick, after connecting it to the router via an ethernet mediaconverter or directly plug it in an SFP port, with the port's IP set to whatever IP of the `192.168.1.0/24` subnet (the stick has the IP `192.168.1.10`)

{% include alert.html content="If your subnet is `192.168.1.0/24` make sure you have no ip conflicts." alert="Note" icon="svg-warning" color="yellow" %}

{% include alert.html content="On some SFP host devices you might not be able to connect to the stick if there's no optical signal (RX loss), in that case you need to connect the fiber to make changes on the stick" alert="Note" icon="svg-warning" color="yellow" %}

Run the terminal and login to the stick with ssh

```shell
ssh root@192.168.1.10
```

The password is `admin123`.

{% include alert.html content="If you use a modern OpenSSH version (e.g. >= 8.8) you will have to enable some deprecated algorithms: `ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 -oHostKeyAlgorithms=+ssh-dss root@192.168.1.10`" alert="Info" icon="svg-info" color="blue" %}

# TX Fault / Serial

The stick stays in a perpetual "TX Fault" state since the same SFP pin is used for both serial and TX Fault signaling, if that causes you issues (normally it shouldn't) you can issue the commands below to disable it. Note that it will disable both the TX Fault signal and Serial on the stick after boot.

```sh
fw_setenv asc0 1
fw_setenv preboot "gpio set 3;gpio input 100;gpio input 105;gpio input 106;gpio input 107;gpio input 108"
```

In case you need to re-enable it issue the following commands from the bootloader (FALCON)

```sh
FALCON => setenv asc0 0
FALCON => saveenv
```

<div class="modal" data-jtd-modal="root-modal" data-jtd-modal-backdrop="static" id="root-modal">
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
                    <polyline class="path check success" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                    <line class="path line error" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                    <line class="path line error" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                    <line class="path line pause" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="49.4" y1="37.9" x2="49.4" y2="92.3"/>
                    <line class="path line pause" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="80.8" y1="38" x2="80.8" y2="92.2"/>
                </svg>
                <p id="root-text-step-2"></p>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="/assets/js/serialUtil.js"></script>
<script type="text/javascript" src="/assets/js/rootLantiq.js"></script>
<script>
    if ('serial' in navigator) {
        document.getElementById('start-button').disabled = false;
    } else {
        document.getElementById('browser-error').style.display = 'block';
    }
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
    let rootStep = [document.getElementById('root-step-1'),document.getElementById('root-step-2')];
    let rootStepText = [document.getElementById('root-text-step-1'), document.getElementById('root-text-step-2')];
    rootModal.addEventListener('modal-jtd-close', async function(event) {
        acontroller.abort();
    });
    rootModal.addEventListener('modal-jtd-open', async function(event) {
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
        rootStep[i].classList.remove('complete');
        rootStep[i].classList.remove('success');
        rootStep[i].classList.remove('loading');
        rootStep[i].classList.add('error');
        rootStepText[i].textContent = message;
    }
    function showSuccess(message, i) {
        rootStep[i].classList.remove('pause');
        rootStep[i].classList.remove('error');
        rootStep[i].classList.remove('loading');
        rootStep[i].classList.remove('complete');
        rootStep[i].classList.add('success');
        rootStepText[i].textContent = message;
    }
    async function root({ signal } = {}) {
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

        let result = await lantiqRootUboot(port, "Huawei MA5671A",
            (msg) => {
                loading(msg, 0);
            },
            (err) => {
                showError(err, 0);
                console.log(err);
            }
        );

        if (result) {
            showSuccess("Congratulations! Step completed.", 0);
        } else {
            return;
        }

        result = await unlockHuaweiShell(port,
            (msg) => {
                loading(msg, 1);
            },
            (err) => {
                showError(err, 1);
                console.log(err);
            }
        );

        if (result) {
            showSuccess("Congratulations! Step completed.", 1);
        }
    }
</script>

# Miscellaneous Links
- [List of root procedure for Huawei MA5671A](/ont-huawei-ma5671a-root)
