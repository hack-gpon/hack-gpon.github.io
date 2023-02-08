---
title: Huawei Rooted Firmware for Huawei MA5671A
has_children: false
parent: Huawei MA5671A
layout: default
---

# General Settings and Useful Commands

{% include alert.html content="In this firmware, unlike the other ones, the data must be modified in a base64-encoded file. To simplify this, you can use the following web application." alert="Info" icon="svg-info" color="blue" %}

## Web procedure


1. Get `fw_printenv sfp_a2_info` and paste into the form

<form id="huawei-rooted">
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="sfp_a2_info input" name="sfp-a2-info" id="sfp-a2-info"    >
        <label for="sfp-a2-info">sfp_a2_info input</label>
    </div>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Show!" data-js="show">
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="GPON S/N" name="gpon-serial" id="gpon-serial" value="" pattern="([A-Z]{4}[0-9A-Za-z]{8})|([0-9A-F]{8}[0-9A-Za-z]{8})">
        <label for="gpon-serial">GPON S/N in format GPON12345678 or 47504F4E12345678, empty for not modify it</label>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="GPON Ploam Password" name="gpon-ploam" id="gpon-ploam" value="">
        <label for="gpon-ploam">GPON Ploam in format 1234567890, 31323334353637383930, empty for not modify it</label>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="GPON LoID User" name="gpon-loid" id="gpon-loid" value="">
        <label for="gpon-loid">GPON LoID User in hex format 0123456789ABCDEF, empty for not modify it</label>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="GPON LoPW Password" name="gpon-lopw" id="gpon-lopw" value="">
        <label for="gpon-lopw">GPON LoPW Passwrd in hex format 0123456789ABCDEF, empty for not modify it</label>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="GPON Ploam/LoID Switch" name="gpon-loid-ploam-switch" id="gpon-loid-ploam-switch" value="">
        <label for="gpon-loid-ploam-switch">GPON Ploam/LoID Switch</label>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="MAC address" name="mac-addr" id="mac-addr" value="" pattern="[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}[:-]?[0-9A-Fa-f]{2}">
        <label for="mac-addr">MAC Address in format 48:57:02:da:be:ef, 48-57-02-da-be-ef or 485702dabeef, empty for not modify it</label>
    </div>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Calculate!" data-js="calculate">
    </div>
    <div class="form-floating mb-3">
        <input readonly class="form-control" type="text" id="result" placeholder="sfp_a2_info result">
        <label for="result">sfp_a2_info result</label>
    </div>
</form>
<script>    var theeeprom;

    var form = document.getElementById('huawei-rooted');
    form.addEventListener('submit',(event) => {
        event.preventDefault();
        var fomrdata = new FormData(form);
        var sfp_a2_info = fomrdata.get('sfp-a2-info');
        var sfp_a2_info_arr = sfp_a2_info.split('@');
        var sfp_a2_info_0 = sfp_a2_info_arr.shift();
        var sfp_a2_info_last = sfp_a2_info_arr.slice(-2);
        var sfp_a2_decode = sfp_a2_info_arr.map(it => base64ToHex(it)).join('');
        theeeprom = new eeprom1(sfp_a2_decode);
        if(event.submitter.getAttribute('data-js') === "show") {
            object = {
                'gpon-serial': theeeprom.serial.serial,
                'gpon-ploam': theeeprom.ploam?.ploam,
                'gpon-loid': theeeprom.loid?.hex,
                'gpon-lpwd': theeeprom.lopw.hex,
                'gpon-loid-ploam-switch': theeeprom.loidPloamSwitch,
                'mac': theeeprom.macAddress.prettier()
            };
            populateForm(form, object);
        } else {
            theeeprom.serial = new gponSerial(fomrdata.get('gpon-serial'));
            theeeprom.loidPloamSwitch = fomrdata.get('gpon-loid-ploam-switch');
            theeeprom.ploam = new gponPloam(fomrdata.get('gpon-ploam'));
            theeeprom.loid = new gponHexItem(fomrdata.get('gpon-loid'));
            theeeprom.lopw = new gponHexItem(fomrdata.get('gpon-lopw'));
            var sfp_a2_new = (theeeprom.hex.match(/.{1,90}/g) ?? []).map(it => hexToBase64(it));
            sfp_a2_new.unshift(sfp_a2_info_0);
            sfp_a2_new.push(...sfp_a2_info_last);
            document.getElementById('result').value =  sfp_a2_new.join('@'); 
        }
        
    });
</script>

{:style="counter-reset:none"}
{% include alert.html content="Executing these commands requires a minimum of familiarity with `vim`. If you do not know `vim`, follow the commands precisely." alert="Danger"  icon="svg-warning" color="red" %}


1. Copy the script's output to the clipboard 
1. Run the comman `vim /tmp/sfp_a2.txt` in the stick
1. Press the right mouse button in the terminal or `CTRL`+`V`
1. Press `ESC` command from keyboard
1. Type `:wq`
1. Run:

```shell
fw_setenv sfp_a2_info ($cat /tmp/sfp_a2.txt)
```

## Temporary file procedure

1. Save `sfp_a2_info` in a temporary file

```shell
fw_printenv sfp_a2_info | sed "s/^sfp_a2_info=//" > /tmp/sfp_a2.txt
```
And print a pretty version:
```shell
fw_printenv sfp_a2_info | sed "s/^sfp_a2_info=//" | tr '@' '\n'
```

2. Setting S/N

The S/N is stored on the 6th line, for example `4857544311223344` (where `48575443` is the HEX encoding of `HWTC`):
```
AAAAAAAAAAJIV1RDESIzRP///////////////////wAAAAAAAAAAAAAAAAAA
00000000000000024857544311223344ffffffffffffffffffffffffffffff0000000000000000000000000000
```

The entire S/N, including the PON ID, is encoded first in hexadecimal and then in base64

3. Setting PLOAM Password

The PLOAM Password is stored on the 5th line, for example (`1234567890`):
```
ffffffffffffffff00021437d77db7df7e37e77eb7ef7f37f77d00000000000000000000000000000000000000
//////////8AAhQ31323334353637383930AAAAAAAAAAAAAAAAAAAAAAAAA
```

The entire PLOAM, is encoded first in hexadecimal and then in base64

4. Setting MAC Address

The MAC Address is stored on the 9th line, for example (`48:57:02:da:be:ef`):
```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASFcC2r7vAAAAAAAAAAAAAAAAAAAA
000000000000000000000000000000000000000000000000485702dabeef000000000000000000000000000000
```

5. Transfer the modified file back into variable `sfp_a2_info`

```shell
fw_setenv sfp_a2_info $(cat /tmp/sfp_a2.txt)
```

## Reviewing and testing

After rebooting, check whether the new variables have been saved correctly:

```shell
fw_printenv nPassword
fw_printenv gSerial
fw_printenv ethaddr
```

## Checking whether the connection with the OLT was successful (O5 state)

```shell
onu ploamsg
```

# Disabling dying gasp

```shell
fw_setenv nDyingGaspEnable 0 
```

# Miscellaneous Links

- [Edit sfp_a2_info file](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042/25)
