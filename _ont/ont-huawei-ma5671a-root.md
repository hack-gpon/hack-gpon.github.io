---
title: Root Procedure for Huawei MA5671A
has_children: false
parent: Huawei MA5671A
layout: default
---

1. Take the SFP molex and the 4 coloured cables and solder them to the molex according to the following diagram:

| USB TTL(UART) Adapter | wire colour in picture | SFP 20pins Molex connector |
| --------------------- | ---------------------- | -------------------------- |
| 3.3V                  | red                    | pin #15 and #16            |
| TX                    | orange                 | pin #2                     |
| RX                    | yellow                 | pin #7                     |
| GND                   | green                  | pin #10                    |

{% include alert.html content="Use GND wire as ON/OFF switch, otherwise there will be a slight delay before data is displayed on the console (putty/TeraTerm)." alert="Important"  icon="svg-warning" color="yellow" %}

{:style="counter-reset:none"}
2. Install python and `pyserial` with `pip`
```shell
pip install pyserial
```
3. Make the connections as shown to a TTL adapter except for GND (which remains detached and is used as a switch)

{% include image.html file="ma5671a-root-1.jpg"  alt="Example of how the sfp-ttl connection should look like" caption="Example of how the sfp-ttl connection should look like" %}
{% include image.html file="new-root-procedure\board-molex-arduino.jpg"  alt="Example of how the sfp-ttl connection should look like with a custom board" caption="Example of how the sfp-ttl connection should look like with a custom board" %}
{% include image.html file="ma5671a-root-2.jpg"  alt="Molex SFP" caption="Molex SFP" %}

{:style="counter-reset:none"}
4. Open Tera Term (or other serial terminal emulator), find the correct serial port of the TTL adapter, change the port on the script on line 7 instead of `COM8`.
5. After this, run the following python script and connect the GND pin:

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
                'setenv preboot "gpio input 105;gpio input 106;gpio input 107;gpio input 108;gpio set 3;gpio set 109;gpio set 110;gpio clear 423;gpio clear 422;gpio clear 325;gpio clear 402;gpio clear 424"\n'.encode())
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

{:style="counter-reset:none"}
6. Reboot the stick
7. Open Tera Term (or other serial terminal emulator), after load press `enter` to activate the console

{% include image.html file="new-root-procedure\press-enter.jpg"  alt="Press enter for activate the console" caption="Press enter for activate the console" %}

{:style="counter-reset:none"}
8. With `sed` change the default shell from `/opt/lantiq/bin/minishell` to `/bin/ash` the file `/etc/passwd`:

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
9. Reboot it this time connected to the router with cage or mediaconverter, with the port set to an IP on the 192.168.1.0/24 subnet (the stick has the IP 192.168.1.10)

{% include alert.html content="If your subnet is 192.168.1.0/24 make sure you have no ip conflicts." alert="Note"  icon="svg-warning" color="yellow" %}

{:style="counter-reset:none"}
10. Run the terminal and login to the stick with ssh

```shell
ssh root@192.168.1.10
```

The password is `admin123`.

{% include alert.html content="If you use OpenSSH >= 8.8 you will have to enable some deprecated algorithms: ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 -oHostKeyAlgorithms=+ssh-dss [...]" alert="Info"  icon="svg-info" color="blue" %}

{:style="counter-reset:none"}
11. Make a backup of all partitions, an easy way is:
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
12. upload the mtd5 image in  `/tmp` whit the command 
```
scp mtd5.bin root@192.168.1.10:/tmp/
```

{% include alert.html content="If you use OpenSSH >= 8.8 you will have to use the legacy protocol and enable some deprecated algorithms: scp -O -oKexAlgorithms=+diffie-hellman-group1-sha1 -oHostKeyAlgorithms=+ssh-dss [...]" alert="Info"  icon="svg-info" color="blue" %}

then write the mtd5 file it into the second partition (the 1) with the command:
```
mtd -e image1 write mtd5.bin image1
```
13. change the `committed` variabile with
```
fw_setenv committed_image 1
fw_printenv committed_image
```
{% include alert.html content="You could also have done it as a serial, but from here it is much quicker with SSH" alert="Info"  icon="svg-info" color="blue" %}

# Miscellaneous Links
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
- [Support MA5671A SFP GPON](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042)
- [La fibre Orange à 2Gbps, sur un routeur MikroTik 10Gbps CCR2004, via un ONT SFP+](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/msg832904/#msg832904)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)

