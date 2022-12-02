---
title: Huawei Rooted Firmware for Huawei MA5671A
has_children: false
parent: Huawei MA5671A
layout: default
---

# General setting


{% include alert.html content="Unlike the other firmware in this firmware, the data must be modified in a base64-encoded file. To simplify this, you can use the following web application." alert="Info" icon="svg-info" color="blue" %}

## Web procedure


1. Get `sfp_a2_info` and paste into the form

<form id="huawei-rooted">
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="sfp_a2_info input" name="sfp-a2-info" id="sfp-a2-info"    >
        <label for="sfp-a2-info">sfp_a2_info input</label>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="GPON S/N" name="gpon-sn" id="gpon-sn" value="">
        <label for="gpon-sn">GPON S/N in format GPON12345678 or 47504F4E12345678, empty for not modify it</label>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="GPON Ploam Password" name="gpon-password" id="gpon-password" value="">
        <label for="gpon-password">GPON S/N in format 1234567890, 31323334353637383930 or 0x31323334353637383930, empty for not modify it</label>
    </div>
    <div class="form-floating mb-3">
        <input type="text" class="form-control" placeholder="MAC address" name="mac-addr" id="mac-addr" value="">
        <label for="mac-addr">MAC Address in format 48:57:02:da:be:ef, 48-57-02-da-be-ef or 485702dabeef, empty for not modify it</label>
    </div>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Calculate!">
    </div>
    <div class="form-floating mb-3">
        <input readonly class="form-control" type="text" id="result" placeholder="sfp_a2_info result">
        <label for="result">sfp_a2_info result</label>
    </div>
</form>
<script>
    var form = document.getElementById('huawei-rooted');
    form.addEventListener('submit',(event) => {
        event.preventDefault();
        var fomrdata = new FormData(form);
        var sfp_a2_info = fomrdata.get('sfp-a2-info');
        var sfp_a2_info_arr = sfp_a2_info.split('@');
        if(sfp_a2_info_arr.length > 10 && sfp_a2_info_arr[0] === 'begin-base64 644 sfp_a2_info ') {
            var gpon_sn = fomrdata.get('gpon-sn');
            if(gpon_sn.length == 12) {  
                var vendor_id = gpon_sn.substring(0, 4);
                var progressive = gpon_sn.substring(4);
                var vendor_id_hex = ([...vendor_id].map((elem, n) => Number(vendor_id.charCodeAt(n)).toString(16)).join(''));
                gpon_sn = vendor_id_hex+progressive;
            }
            if(gpon_sn.length == 16) {  
                var hex = base64ToHex(sfp_a2_info_arr[6]);
                hex = hex.substring(0,16) + gpon_sn + hex.substring(32);
                sfp_a2_info_arr[6] = hexToBase64(hex);
            }
            var gpon_password = fomrdata.get('gpon-password');
            if(gpon_password.length > 0) {
                if(gpon_password.length <= 10) {  
                    gpon_password = ([...gpon_password].map((elem, n) => Number(gpon_password.charCodeAt(n)).toString(16)).join(''));
                    gpon_password += '0'.repeat(20-gpon_password.length);
                }
                else if(gpon_password.length == 22 && gpon_password.substring(0,2) === '0x') {  
                    gpon_password = gpon_password.substring(3);
                }
                if(gpon_password.length == 20) {  
                    var hex = base64ToHex(sfp_a2_info_arr[5]);
                    hex = hex.substring(0,22) + gpon_password + hex.substring(42);
                    sfp_a2_info_arr[5] = hexToBase64(hex);
                }
            }
            var mac_addr = fomrdata.get('mac-addr');
            if(mac_addr.length == 17) {
                mac_addr = mac_addr.replace('-','');
                mac_addr = mac_addr.replace(':','');
            }
            if(mac_addr.length == 12) {
                var hex = base64ToHex(sfp_a2_info_arr[9]);
                hex = hex.substring(0,48) + mac_addr + hex.substring(61);
                sfp_a2_info_arr[9] = hexToBase64(hex);
            }
            document.getElementById('result').value =  sfp_a2_info_arr.join('@');       
        } else {
            document.getElementById('result').value = 'sfp_a2_info variable in wrong format!';
        }
    });
    function hexToBase64(hexStr) {
        return btoa([...hexStr].reduce((acc, _, i) => acc += !(i - 1 & 1) ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16)) : '', ''));
    }
    function base64ToHex(base64Value) {
        return [...atob(base64Value)].map(c=> c.charCodeAt(0).toString(16).padStart(2,0)).join('');
    }
</script>

{:style="counter-reset:none"}
2. Transfer modified file back into variable `sfp_a2_info`, replace `<output>` with the output of web form.

```shell
fw_setenv sfp_a2_info "<output>"
```

## Temporary file procedure

1. Save `sfp_a2_info` in into temporary file

```shell
fw_printenv sfp_a2_info | sed "s/^sfp_a2_info=//" > /tmp/sfp_a2.txt
```
And print a pretty version:
```shell
fw_printenv sfp_a2_info | sed "s/^sfp_a2_info=//" | tr '@' '\n'
```

2. Setting S/N

The S/N is stored on the 6th line, for sample `4857544311223344` (where `48575443` are hex encoding of `HWTC`) are stored:
```
AAAAAAAAAAJIV1RDESIzRP///////////////////wAAAAAAAAAAAAAAAAAA
00000000000000024857544311223344ffffffffffffffffffffffffffffff0000000000000000000000000000
```

The entire S/N, including the PON ID, is encoded first in hex and then in base64

3. Setting Ploam Password

The Ploam Password is stored on the 5th line, for sample (`1234567890`) are stored:
```
ffffffffffffffff00021437d77db7df7e37e77eb7ef7f37f77d00000000000000000000000000000000000000
//////////8AAhQ31323334353637383930AAAAAAAAAAAAAAAAAAAAAAAAA
```

The entire Ploam, is encoded first in hex and then in base64

4. Setting MAC Address

The Ploam Password is stored on the 9th line, for sample (`48:57:02:da:be:ef`) are stored:
```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASFcC2r7vAAAAAAAAAAAAAAAAAAAA
000000000000000000000000000000000000000000000000485702dabeef000000000000000000000000000000
```

5. Transfer modified file back into variable `sfp_a2_info`

```shell
fw_setenv sfp_a2_info $(cat /tmp/sfp_a2.txt)
```

## Review and testing

After reboot I check for new variables:

```shell
fw_printenv nPassword
fw_printenv gSerial
fw_printenv ethaddr
```

After reboot I check for new variables:

## Check registration status for O5 (successful)

```shell
onu ploamsg
```

# Disable dying gasp

```shell
fw_setenv nDyingGaspEnable 0 
```

# Miscellaneous Links

- [Edit sfp_a2_info file](https://forum.openwrt.org/t/support-ma5671a-sfp-gpon/48042/25)
