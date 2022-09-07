---
title: Root Procedure for Huawei MA5671A
has_children: false
parent: Huawei MA5671A
layout: default
---

1. take the SFP molex and the 4 coloured cables and solder them to the molex according to the following diagram:

| USB TTL(UART) Adapter | wire colour in picture | SFP 20pins Molex connector |
| --------------------- | ---------------------- | -------------------------- |
| 3.3V                  | red                    | pin #15 and #16            |
| TX                    | orange                 | pin #2                     |
| RX                    | yellow                 | pin #7                     |
| GND                   | green                  | pin #10                    |

{% include alert.html content="Use GND wire as ON/OFF switch, otherwise there will be a slight delay before data is displayed on the console (putty/TeraTerm)." alert="Important"  icon="svg-warning" color="yellow" %}

0. Install python and `pyserial` with `pip`
```shell
pip install pyserial
```
1. make the connections as shown to a TTL adapter except for GND (which remains detached and is used as a switch)


{% include image.html file="ma5671a-root-1.jpg"  alt="Example of how the sfp-ttl connection should look like" caption="Example of how the sfp-ttl connection should look like" %}
{% include image.html file="new-root-procedure\board-molex-arduino.jpg"  alt="Example of how the sfp-ttl connection should look like with a custom board" caption="Example of how the sfp-ttl connection should look like with a custom board" %}
{% include image.html file="ma5671a-root-2.jpg"  alt="Molex SFP" caption="Molex SFP" %}

{:style="counter-reset:none"}
2. run this programme and only then connect the GND pin

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

4. Reboot the stick, after load press `enter` to activate the console

{% include image.html file="new-root-procedure\press-enter.jpg"  alt="Press enter for activate the console" caption="Press enter for activate the console" %}


{% include alert.html content="It is possible that there are still linux kernel init outputs, in which case press enter until they are finished (under no circumstances should vim be started if such scripts are sent to stdout), if you do not press `enter` often enough there may be a kernel panic and a stick reboot." alert="Important"  icon="svg-warning" color="yellow" %}

{% include image.html file="new-root-procedure\code-after-enter-shell.jpg"  alt="Linux kernel init output after enter in console" caption="Linux kernel init output after enter in console" %}

5. With `vim` change the default shell from `minishell` to `ash`:

```shell
vim /etc/passwd
```
{% include alert.html content="Be careful not to mess with `vim`." alert="Important"  icon="svg-warning" color="red" %}

- Remove `/opt/lantiq/bin/minishell` with `delete` key
- Press `i` key and type `/bin/ash`
- Press `esc` key and type `!wq`.


6. Reboot it this time connected to the router with cage or mediaconverter, with the port set to an IP on the 192.168.1.0/24 subnet (the stick has the IP 192.168.1.10)

{% include alert.html content="If your subnet is 192.168.1.0/24 make sure you have no ip conflicts." alert="Note"  icon="svg-warning" color="yellow" %}

7. Run the terminal and login to the stick with ssh

{% include alert.html content="SSH uses an outdated set of algorithm/ciphers, you can connect using the following command:" alert="Note"  icon="svg-info" color="blue" %}

```shell
ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 -oCiphers=+3des-cbc root@192.168.1.10
```

9. Make a backup of all partitions, an easy way is:
- On the stick run:
```shell
cat /proc/mtd
```
- For each mtdX run, on computer shell:
```shell
nc -l -p 1234 > mtdX.bin
```
And in the lantiq shell:
```
cat /dev/mtdX | nc 192.168.1.11 1234
```
10. upload the mtd5 image in  `/tmp` whit the command 
```
scp mtd5.bin root@192.168.1.10:/tmp/
```
then write the mtd5 file it into the second partition (the 1) with the command:
```
mtd -e image1 write mtd5.bin image1
```
11. change the `committed` variabile with
```
setenv committed_image 1
saveenv
printenv committed_image
```
12. upload the mtd1 image in  `/tmp` whit the command 
```
scp mtd2.bin root@192.168.1.10:/tmp/
```
then write the mtd2 file it into the second partition (the 0) with the command:
```
mtd -e image1 write mtd2.bin image1
```

{% include alert.html content="You could also have done it as a serial, but from here it is much quicker
" alert="Info"  icon="svg-info" color="blue" %}

# Miscellaneous Links
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
- [Support MA5671A SFP GPON](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042)
- [La fibre Orange à 2Gbps, sur un routeur MikroTik 10Gbps CCR2004, via un ONT SFP+](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/msg832904/#msg832904)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)

