---
title: Root Huawei MA5671A
has_children: false
parent: Huawei MA5671A
layout: default
---

1. take the SFP molex and the 4 coloured cables and solder them to the molex according to the following diagram:

```
USB TTL(UART) Adapter ------- SFP 20pins Molex connector
3.3V ---red ------------------pin #15 and #16
TX -----orange ---------------pin #2
RX -----yellow ---------------pin #7
GND ----green --------------- pin #10
```

{% include alert.html content="Use GND wire as ON/OFF switch, otherwise there will be a slight delay before data is displayed on the console (putty/TeraTerm)." alert="Important"  icon="svg-warning" color="yellow" %}

{% include image.html file="ma5671a-root-1.jpg"  alt="Example of how the sfp-ttl connection should look like" caption="Example of how the sfp-ttl connection should look like" %}
{% include image.html file="ma5671a-root-2.jpg"  alt="Molex SFP" caption="Molex SFP" %}

2. Disassemble the stick by releasing the metal tabs that hold the cover in place. There are two tabs, one on each side, inside these holes:

{% include image.html file="ma5671a-root-4.jpg"  alt="Metal tabs that hold the cover in place" caption="Metal tabs that hold the cover in place" %}

3. Once you have removed the metal casing, you are left with the half-naked stick (note that the release mechanism also comes off easily and then you don't know how to put it back together, so take a photo and memorise the positioning well).

4. Before shorting the stick, connect the previously soldered cables and molex to the USB serial (photo immediately below) and to the stick (the molex, of course) and check that the jumper on the usb key is set to 3.3V

{% include image.html file="ma5671a-root-8.jpg"  alt="TTL" caption="TTL" %}

5. The disassembled stick will appear as in the photo, in which I have highlighted in red the 2 pins to be shorted. Here they use wire, but a pair of tweezers is sufficient (I used those, in fact). Be careful not to make any other contacts by possibly covering everything else with electrical tape.

{% include image.html file="ma5671a-root-4.jpg"  alt="tweezers" caption="tweezers" %}
{% include image.html file="ma5671a-root-6.jpg"  alt="tweezers" caption="tweezers" %}
{% include image.html file="ma5671a-root-5.jpg"  alt="tweezers and eletrical tape" caption="tweezers and eletrical tape" %}
{% include image.html file="ma5671a-root-6.jpg"  alt="tweezers" caption="tweezers" %}

6. for the moment connect all cables to the usb key except the green (ground) or red (voltage), otherwise the stick will boot before you can do the following (N.B. for those who bought the uart above RX and TX are reversed). Open and configure Teratem for serial connection (select the correct com port, speed 115.200, english language, otherwise in japainise you can't read anything understandable) insert the key in the PC (I take it for granted that it has already been installed, drivers and all), short the 2 pins seen above and keeping the short connected the missing coloured cable

7. if you have done everything correctly, you should see something similar to the picture below (if nothing happens, you have obviously done something wrong with cables, molexes, soldering irons, etc., so you will have to start from the beginning again and work out which step you did wrong):

{% include image.html file="ma5671a-root-9.png"  alt="serial shell" caption="serial shell" %}

8. Remove the short (tweezers or whatever you used), then type 7 and enter. You should see this:

{% include image.html file="ma5671a-root-10.png"  alt="serial shell 2" caption="serial shell 2" %}

9. from the Teraterm menu `FILE` → `TRANSFER` → `XMODEM` → `SEND` → `[1224abort.bin]` (which is the third of the files downloaded earlier):

{% include image.html file="ma5671a-root-11.png"  alt="1224abort.bin" caption="1224abort.bin" %}

10. as soon as the file transfer is complete, you have 2 seconds to press `CTRL+C`, if you have not done so, you can return to the step 6. Otherwise, you should see:

{% include image.html file="ma5671a-root-12.png"  alt="falcon shell" caption="falcon shell" %}

11. To permanently unlock the bootloader, without having to repeat the previous steps, you must give the following commands:
```
FALCON => setenv bootdelay 5
FALCON => setenv asc 0
FALCON => setenv preboot "gpio input 105;gpio input 106;gpio input 107;gpio input 108;gpio set 3;gpio set 109;gpio set 110;gpio clear 423;gpio clear 422;gpio clear 325;gpio clear 402;gpio clear 424"
FALCON => saveenv
```

12. if you have done everything correctly you can reboot the stick (actually if you are convinced that everything is ok you could also close it again), disconnecting and reconnecting one of the 2 cables from before (ground or voltage), then again from the terminal you will have 5 seconds to lock the bootloader by doing a simple CTRL+C. Now upload the firmware image of the first mtd2 partition to the stick with the command
```
FALCON => loadb 0x80800000
```
At this point it will appear:

{% include image.html file="ma5671a-root-13.jpg"  alt="shell requiring mt2 upload" caption="shell requiring mt2 upload" %}

13. From the teratem menu do `FILE` → `TRANSFER` → `KERMIT` → `SEND` → `[mtd2.bin]`.
It will start uploading the file at a speed of about 3-4 KBbs. Now you will have to wait more than half an hour for the upload to complete.

14. Once finished, the image loaded on the stick must also be saved to the corresponding system partition (the first of the 2) with the commands
```
FALCON => sf probe 0
FALCON => sf erase C0000 740000
FALCON => sf write 80800000 C0000 740000
```

15. check that the stick is configured to boot from partition 0 (yes I know mtd2 goes on 0 and mtd5 goes on 1, complain to Laniq) with the command
```
FALCON => printenv committed_image
```
16. if it is 0, fine, otherwise configure partition 0 with the commands, and check if are 0.
```
FALCON => setenv committed_image 0
FALCON => saveenv
FALCON => printenv committed_image
```
17. Reboot it this time connected to the router with cage or mediaconverter, with the port set to an IP on the 192.168.1.0/24 subnet (the stick has the IP 192.168.1.10)

18. log in via the web, it makes you configure the password when you first log in with a root user. These credentials are the same as those used in ssh

19. set the password access the sitck in SCP, upload the mtd5 image in  `/tmp` whit the command 
```
scp mtd5.bin root@192.168.1.10:/tmp/
```
then write it into the second partition (the 1) with the command:
```
mtd -e image1 write mtd5.bin image1
```

{% include alert.html content="You could also have done it as a serial, but from here it is much quicker
" alert="Info"  icon="svg-info" color="blue" %}

# Miscellaneous Links
- [Come avere i 2.5 Gbps su un unico dispositivo senza il Fastgate](https://forum.fibra.click/d/17836-come-avere-i-25-gbps-su-un-unico-dispositivo-senza-il-fastgate)
- [Support MA5671A SFP GPON](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042)
- [La fibre Orange à 2Gbps, sur un routeur MikroTik 10Gbps CCR2004, via un ONT SFP+](https://lafibre.info/remplacer-livebox/guide-de-connexion-fibre-directement-sur-un-routeur-voire-meme-en-2gbps/msg832904/#msg832904)
- [Bypassing the HH3K up to 2.5Gbps using a BCM57810S NIC](https://www.dslreports.com/forum/r32230041-Internet-Bypassing-the-HH3K-up-to-2-5Gbps-using-a-BCM57810S-NIC)

