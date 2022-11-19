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
        <textarea class="form-control" id="root-status" readonly style="resize: none;">
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
    rootModal.addEventListener('modal-close', async function(event) {
        acontroller.abort();
    });
    rootModal.addEventListener('modal-open', async function(event) {
        root({signal: cs});
    });
    async function root({ signal } = {}) {
        textarea.value = "";
        let port;
        try {
            port = await navigator.serial.requestPort();
        } catch (err) {
            textarea.value += `Error: ${err.message}\n`;
            console.log(`Error: ${err.message}\n`);
            return;
        }
        if (!port) {
            return;
        }
        textarea.value += '[+] Use serial port device\n';
        textarea.value += '[+] Waiting for trigger characters...\n';
        try {
            await port.open({ baudRate: 115200 });
        } catch (err) {
            textarea.value += `Error: ${err.message}\n`;
            console.log(`Error: ${err.message}\n`);
            return;
        }
        for(let i = 0; i <1000; i++) {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer())).getReader();            
            const textEncoder = new TextEncoder();
            const writerStreamClosed = textEncoder.readable.pipeTo(port.writable);
            const writer = textEncoder.writable;
            const interval = setInterval(function(){ 
                for(int k=0; k<1000;k++)
                    writer.write(textEncoder.encode(String.fromCharCode(3))); 
            }, 0);
            try {
                while (true) {
                    console.log('await');
                    const { value, done } = await reader.read();
                    if (value.startsWith('U-Boot')) {
                        textarea.value += '[+] Received! transfer enable command...\n';
                        await delay(10000);
                        clearInterval(interval);
                        textarea.value += '[+] Transfer command sequence 2\n';
                        writer.write(textEncoder.encode('setenv bootdelay 3\n'));
                        await delay(1000);
                        textarea.value += '[+] Transfer command sequence 3\n';
                        writer.write(textEncoder.encode('setenv asc0 0\n'));
                        await delay(1000);
                        textarea.value += '[+] Transfer command sequence 4\n';
                        writer.write(textEncoder.encode(
                            'setenv preboot "gpio input 105;gpio input 106;gpio input 107;gpio input 108;gpio set 3;gpio set 109;gpio set 110;gpio clear 423;gpio clear 422;gpio clear 325;gpio clear 402;gpio clear 424"\n'));
                        await delay(1000);
                        textarea.value += '[+] Transfer command sequence 5\n';
                        writer.write(textEncoder.encode('saveenv\n'));
                        await delay(1000);
                        textarea.value += '[+] Transfer command sequence 6\n';
                        writer.write(textEncoder.encode('reset\n'));
                        textarea.value += '[+] Enable command transfer complete! rebooting...\n';
                        break;
                    }
                }
            } catch (err) {
                textarea.value += `Error: ${err.message}\n`;
                console.log(`Error: ${err.message}\n`);
            } finally {
                reader.releaseLock();
                writer.releaseLock();
            }
        }
    }
</script>


{:style="counter-reset:none"}
5. Reboot the stick
6. Open Tera Term (or other serial terminal emulator), after load press `enter` to activate the console

{% include image.html file="new-root-procedure\press-enter.jpg"  alt="Press enter for activate the console" caption="Press enter for activate the console" %}

{:style="counter-reset:none"}
7. With `sed` change the default shell from `/opt/lantiq/bin/minishell` to `/bin/ash` the file `/etc/passwd`:

```shell
sed -i  "s|/opt/lantiq/bin/minishell|/bin/ash|g" /etc/passwd
```
{% include alert.html content="Do not use `vim`!" alert="Important" icon="svg-warning" color="red" %}

{% include alert.html content="Take attention to kernel panics, they happen often! Be quick, if a kernel panic happens wait for the reboot and try again." alert="Important"  icon="svg-warning" color="yellow" %}


```shell
[   34.612000] Kernel panic - not syncing: Fatal exception in interrupt
[   34.612000] Rebooting in 3 seconds..
```

{% include alert.html content="The cause of these kernel panics could be insufficient power supply." alert="Info"  icon="svg-info" color="blue" %}

{:style="counter-reset:none"}
8. Reboot it this time connected to the router with cage or mediaconverter, with the port set to an IP on the 192.168.1.0/24 subnet (the stick has the IP 192.168.1.10)

{% include alert.html content="If your subnet is 192.168.1.0/24 make sure you have no ip conflicts." alert="Note"  icon="svg-warning" color="yellow" %}

{:style="counter-reset:none"}
9. Run the terminal and login to the stick with ssh

```shell
ssh root@192.168.1.10
```

The password is `admin123`.

{:style="counter-reset:none"}
10. Make a backup of all partitions, an easy way is:
- On the stick run:
```shell
cat /proc/mtd
```
- For each mtdX run, on computer shell:
```shell
nc -l -p 1234 > mtdX.bin
```
And in the lantiq shell:
```shell
cat /dev/mtdX | nc 192.168.1.11 1234
```

{% include alert.html content="Replace 192.168.1.11 with you machine IP's address" alert="Info" icon="svg-info" color="blue" %}

{:style="counter-reset:none"}
11. upload the mtd5 image in  `/tmp` whit the command 
```
scp mtd5.bin root@192.168.1.10:/tmp/
```
then write the mtd5 file it into the second partition (the 1) with the command:
```
mtd -e image1 write mtd5.bin image1
```
12. change the `committed` variabile with
```
fw_setenv committed_image 1
fw_printenv committed_image
```
13. upload the mtd2 image in `/tmp` whit the command 
```
scp mtd2.bin root@192.168.1.10:/tmp/
```
then write the mtd2 file it into the second partition (the 0) with the command:
```
mtd -e image0 write mtd2.bin image0
```
{% include alert.html content="You could also have done it as a serial, but from here it is much quicker with SSH" alert="Info"  icon="svg-info" color="blue" %}

# Miscellaneous Links
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
- [Support MA5671A SFP GPON](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042)
- [La fibre Orange à 2Gbps, sur un routeur MikroTik 10Gbps CCR2004, via un ONT SFP+](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/msg832904/#msg832904)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)

