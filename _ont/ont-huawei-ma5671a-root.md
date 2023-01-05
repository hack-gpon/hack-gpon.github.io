---
title: List of Root Procedure for Huawei MA5671A
description: For documentation purposes only. This page contains the history of root procedures for the Huawei MA5671A stick. 
has_children: false
parent: Huawei MA5671A
layout: default
nav_exclude: true
search_exclude: true
---

{% include alert.html content="It is strongly recommended that you only ever use the latest version ([Web root procedure](/ont-huawei-ma5671a-root-web)).
" alert="Info" icon="svg-info" color="blue" %}

# Root Procedure for Huawei MA5671A (V3 - Web serial)

Can be accessed via the link [Web root procedure](/ont-huawei-ma5671a-root-web)

# Root Procedure for Huawei MA5671A (V2 - Python)

{% include alert.html content="This version remains for documentation purposes only. Please use the latest procedure: [Web root procedure](/ont-huawei-ma5671a-root-web)" alert="Important" icon="svg-warning" color="red" %}

{% include alert.html content="It is strongly recommended that you only ever use the latest version ([Web root procedure](/ont-huawei-ma5671a-root-web)).
" alert="Info" icon="svg-info" color="blue" %}

1. Take the SFP molex and four coloured cables and solder them to the molex according to the following diagram:

| USB TTL (UART) Adapter | wire colour in picture | SFP 20pins Molex connector |
| ---------------------- | ---------------------- | -------------------------- |
| 3.3V                   | red                    | pin #15 and #16            |
| TX                     | orange                 | pin #2                     |
| RX                     | yellow                 | pin #7                     |
| GND                    | green                  | pin #14                    |

{% include alert.html content="Use the GND wire as an ON/OFF switch, otherwise there will be a slight delay before data is displayed on the console (putty/TeraTerm)." alert="Important" icon="svg-warning" color="yellow" %}

{% include alert.html content="Try PIN 10 or other GND PINs if the connection doesn't work with PIN 14." alert="Note" icon="svg-warning" color="yellow" %}

{% include alert.html content="Some USB TTL adapters label TX and RX pins the other way around: try to swap them if the connection doesn't work." alert="Note" icon="svg-warning" color="yellow" %}

{:style="counter-reset:none"}
1. Install python and `pyserial` with `pip`
```shell
pip install pyserial
```
1. Make the connections as shown to a TTL adapter except for GND (which should remain detached as it is used as a switch)

{% include image.html file="ma5671a-root-1.jpg" alt="Example of how the sfp-ttl connection should look like" caption="Example of how the sfp-ttl connection should look like" %}
{% include image.html file="new-root-procedure/board-molex-arduino.jpg" alt="Example of how the sfp-ttl connection should look like with a custom board" caption="Example of how the sfp-ttl connection should look like with a custom board" %}
{% include image.html file="ma5671a-root-2.jpg" alt="SFP Molex" caption="SFP Molex" %}

{:style="counter-reset:none"}
1. Open Tera Term (or other serial terminal emulators), find the correct serial port of the TTL adapter, change the port on the script on line 7 instead of `COM8`.
1. After this, run the following python script and connect the GND pin:

```py
import sys
import time

import serial.tools

try:
    ser = serial.Serial("COM8", 115200, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE, bytesize=serial.EIGHTBITS)
    print('[+] Use serial port device:', ser.name)
    print('[+] Waiting for trigger characters...')
    while True:
        try:
            recv = ser.readline().decode()
        except Exception as x:
            print("Decode errore", x)
            continue
        if recv.startswith('U-Boot'):
            print('[+] Received! transfer enable command...')
            print('[+] Transfer command sequence 1')
            t_end = time.time() + 3
            while time.time() < t_end:
                ser.write(chr(3).encode())
            time.sleep(1)
            print('[+] Transfer command sequence 2')
            ser.write('setenv bootdelay 3\n'.encode())
            time.sleep(1)
            print('[+] Transfer command sequence 3')
            ser.write('setenv asc0 0\n'.encode())
            time.sleep(1)
            print('[+] Transfer command sequence 4')
            ser.write(
                'gpio set 3;gpio input 2;gpio input 105;gpio input 106;gpio input 107;gpio input 108"\n'.encode())
            time.sleep(1)
            print('[+] Transfer command sequence 5')
            ser.write('saveenv\n'.encode())
            time.sleep(3)
            print('[+] Transfer command sequence 6')
            ser.write('reset\n'.encode())
            print('[+] Enable command transfer complete! rebooting...')
            break
        else:
            print(recv)
except Exception as e:
    try:
        print('[!] Error:', e)
        sys.exit(1)
    finally:
        e = None
        del e

except (KeyboardInterrupt, SystemExit):
    ser.close()
    sys.exit(1)
```
{% include alert.html content="Originally, this other string was used for the `setenv preboot`: `gpio input 105;gpio input 106;gpio input 107;gpio input 108;gpio set 3;gpio set 109;gpio set 110;gpio clear 423;gpio clear 422;gpio clear 325;gpio clear 402;gpio clear 424`" alert="Info" icon="svg-info" color="blue" %}

{:style="counter-reset:none"}
1. Reboot the stick
1. Open Tera Term (or other serial terminal emulators), after it has loaded press `enter` to activate the console

{% include image.html file="new-root-procedure/press-enter.jpg" alt="Press enter to activate the console" caption="Press enter to activate the console" %}

{:style="counter-reset:none"}
1. With `sed` change the default shell from `/opt/lantiq/bin/minishell` to `/bin/ash` by editing the file `/etc/passwd`:

```shell
sed -i  "s|/opt/lantiq/bin/minishell|/bin/ash|g" /etc/passwd
```
{% include alert.html content="Do not use `vim`!" alert="Important" icon="svg-warning" color="red" %}

{% include alert.html content="Be aware that kernel panics happen often! If a kernel panic happens wait for the reboot and quickly try again." alert="Important" icon="svg-warning" color="yellow" %}


```shell
[   34.612000] Kernel panic - not syncing: Fatal exception in interrupt
[   34.612000] Rebooting in 3 seconds..
```

{% include alert.html content="The cause of these kernel panics could be insufficient supply of power." alert="Info" icon="svg-info" color="blue" %}

{:style="counter-reset:none"}
1. After this is done, reboot the stick, after connecting it to the router via an ethernet mediaconverter or directly plug it in an SFP port, with the port's IP set to whatever IP of the 192.168.1.0/24 subnet (the stick has the IP 192.168.1.10)

{% include alert.html content="If your subnet is 192.168.1.0/24 make sure you have no ip conflicts." alert="Note" icon="svg-warning" color="yellow" %}

{% include alert.html content="Make sure to disable SFP TX fault detection, otherwise the RX loss will prevent you from connecting to the mini SFP ONT at this point. Don't simply attach the fiber cable to work around this issue as the OLT may ban you." alert="Note" icon="svg-warning" color="yellow" %}

{:style="counter-reset:none"}
1. Run the terminal and login to the stick with ssh

```shell
ssh root@192.168.1.10
```

The password is `admin123`.

{% include alert.html content="If you use a modern OpenSSH version (e.g. >= 8.8) you will have to enable some deprecated algorithms: `ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 -oHostKeyAlgorithms=+ssh-dss [...]`" alert="Info" icon="svg-info" color="blue" %}

# Root Procedure for Huawei MA5671A (V1 - Tweezers)

{% include alert.html content="This version remains for documentation purposes only. Please use the latest procedure: [Web root procedure](/ont-huawei-ma5671a-root-web)" alert="Important" icon="svg-warning" color="red" %}

{% include alert.html content="This procedure requires the physical disassembly of the stick, and the use of tweezers that can burn the stick, it is highly recommended not to use it." alert="Important" icon="svg-warning" color="red" %}

1. take the SFP molex and the 4 coloured cables and solder them to the molex according to the following diagram:

| USB TTL (UART) Adapter | wire colour in picture | SFP 20pins Molex connector |
| ---------------------- | ---------------------- | -------------------------- |
| 3.3V                   | red                    | pin #15 and #16            |
| TX                     | orange                 | pin #2                     |
| RX                     | yellow                 | pin #7                     |
| GND                    | green                  | pin #10                    |

{% include alert.html content="Use GND wire as ON/OFF switch, otherwise there will be a slight delay before data is displayed on the console (putty/TeraTerm)." alert="Important" icon="svg-warning" color="yellow" %}

{% include image.html file="ma5671a-root-1.jpg" alt="Example of how the sfp-ttl connection should look like" caption="Example of how the sfp-ttl connection should look like" %}
{% include image.html file="ma5671a-root-2.jpg" alt="Molex SFP" caption="Molex SFP" %}

{:style="counter-reset:none"}
1. Disassemble the stick by releasing the metal tabs that hold the cover in place. There are two tabs, one on each side, inside these holes:

{% include image.html file="ma5671a-root-4.jpg" alt="Metal tabs that hold the cover in place" caption="Metal tabs that hold the cover in place" %}

{:style="counter-reset:none"}
1. Once you have removed the metal casing, you are left with the half-naked stick (note that the release mechanism also comes off easily and then you don't know how to put it back together, so take a photo and memorise the positioning well).

1. Before shorting the stick, connect the previously soldered cables and molex to the USB serial (photo immediately below) and to the stick (the molex, of course) and check that the jumper on the usb key is set to 3.3V

{% include image.html file="ma5671a-root-8.jpg" alt="TTL" caption="TTL" %}

{:style="counter-reset:none"}
1. The disassembled stick will appear as in the photo, in which I have highlighted in red the 2 pins to be shorted. Here they use wire, but a pair of tweezers is sufficient (I used those, in fact). Be careful not to make any other contacts by possibly covering everything else with electrical tape.

{% include image.html file="ma5671a-root-4.jpg" alt="tweezers" caption="tweezers" %}
{% include image.html file="ma5671a-root-6.jpg" alt="tweezers" caption="tweezers" %}
{% include image.html file="ma5671a-root-5.jpg" alt="tweezers and eletrical tape" caption="tweezers and eletrical tape" %}
{% include image.html file="ma5671a-root-6.jpg" alt="tweezers" caption="tweezers" %}

{:style="counter-reset:none"}
1. For the moment connect all cables to the usb key except the green (ground) or red (voltage), otherwise the stick will boot before you can do the following (N.B. for those who bought the uart above RX and TX are reversed). Open and configure Teratem for serial connection (select the correct com port, speed 115.200, english language, otherwise in japainise you can't read anything understandable) insert the key in the PC (I take it for granted that it has already been installed, drivers and all), short the 2 pins seen above and keeping the short connected the missing coloured cable

1. If you have done everything correctly, you should see something similar to the picture below (if nothing happens, you have obviously done something wrong with cables, molexes, soldering irons, etc., so you will have to start from the beginning again and work out which step you did wrong):

{% include image.html file="ma5671a-root-9.png" alt="serial shell" caption="serial shell" %}

{:style="counter-reset:none"}
1. Remove the short (tweezers or whatever you used), then type 7 and enter. You should see this:

{% include image.html file="ma5671a-root-10.png" alt="serial shell 2" caption="serial shell 2" %}

{:style="counter-reset:none"}
1. From the Teraterm menu `FILE` → `TRANSFER` → `XMODEM` → `SEND` → `[1224abort.bin]` (which is the third of the files downloaded earlier):

{% include image.html file="ma5671a-root-11.png" alt="1224abort.bin" caption="1224abort.bin" %}

{:style="counter-reset:none"}
1. As soon as the file transfer is complete, you have 2 seconds to press `CTRL+C`, if you have not done so, you can return to the step 6. Otherwise, you should see:

{% include image.html file="ma5671a-root-12.png" alt="falcon shell" caption="falcon shell" %}

{:style="counter-reset:none"}
1. To permanently unlock the bootloader, without having to repeat the previous steps, you must give the following commands:
```
FALCON => setenv bootdelay 5
FALCON => setenv asc0 0
FALCON => setenv preboot "gpio set 3;gpio input 100;gpio input 105;gpio input 106;gpio input 107;gpio input 108"
FALCON => saveenv
```

{% include alert.html content="Originally, this other string was used for the `setenv preboot`: `gpio input 105;gpio input 106;gpio input 107;gpio input 108;gpio set 3;gpio set 109;gpio set 110;gpio clear 423;gpio clear 422;gpio clear 325;gpio clear 402;gpio clear 424`" alert="Info" icon="svg-info" color="blue" %}

{% include alert.html content="Instead of the nexts points, it is recommended to boot and run the `sed` command documented in V2" alert="Warning" icon="svg-warning" color="red" %}

{:style="counter-reset:none"}
1. If you have done everything correctly you can reboot the stick (actually if you are convinced that everything is ok you could also close it again), disconnecting and reconnecting one of the 2 cables from before (ground or voltage), then again from the terminal you will have 5 seconds to lock the bootloader by doing a simple CTRL+C. Now upload the firmware image of the first mtd2 partition to the stick with the command
```
FALCON => loadb 0x80800000
```
At this point it will appear:

{% include image.html file="ma5671a-root-13.jpg" alt="shell requiring `mtd2` upload" caption="shell requiring `mtd2` upload" %}

{:style="counter-reset:none"}
1. From the teratem menu do `FILE` → `TRANSFER` → `KERMIT` → `SEND` → `[mtd2.bin]`.
It will start uploading the file at a speed of about 3-4 KBps. Now you will have to wait more than half an hour for the upload to complete.

1. Once finished, the image loaded on the stick must also be saved to the corresponding system partition (the first of the 2) with the commands
```
FALCON => sf probe 0
FALCON => sf erase C0000 740000
FALCON => sf write 80800000 C0000 740000
```

1. check that the stick is configured to boot from partition 0 (yes I know mtd2 goes on 0 and mtd5 goes on 1, complain to Laniq) with the command
```
FALCON => printenv committed_image
```
1. If it is 0, fine, otherwise configure partition 0 with the commands, and check if are 0.
```
FALCON => setenv committed_image 0
FALCON => saveenv
FALCON => printenv committed_image
```

# Miscellaneous Links
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
- [Support MA5671A SFP GPON](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042)
- [La fibre Orange à 2Gbps, sur un routeur MikroTik 10Gbps CCR2004, via un ONT SFP+](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/msg832904/#msg832904)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)
