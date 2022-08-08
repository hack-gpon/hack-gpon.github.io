---
title: Theoretical maximum speed calculator
has_children: false
nav_order: 4
description: Tool for calculating maximum speeds

---


<h1>Ethernet calculator</h1>
<form id="eth-speed-mtu">
    <div class="form-floating mb-3">
        <input type="number" class="form-control" placeholder="MTU L2" name="mtu" id="mtu" value="1500" min="1000" max="10000">
        <label for="mtu">MTU L2 (no overhead for PPPoE/MAP, only Ethernet PPPoE)</label>
    </div>
    <div class="form-floating mb-3">
        <div class="mb-3">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" id="ip4" name="ip" value="4" checked>
                <label class="form-check-label" for="ip4">IPv4</label> 
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" id="ip6" name="ip" value="6">
                <label class="form-check-label" for="ip6">IPv6</label>
            </div>
        </div>
    </div>
    <select class="form-select mb-3"  placeholder="IPv4 L2 protocol" name="ipv4protocol" id="ipv4protocol">
        <option  disabled selected>Select a Protocol</option>
        <option value="ipoe">IPoE</option>
        <option value="pppoe">PPPoE</option>
        <option value="map-t">MAP-T</option>
        <option value="map-e">MAP-E/4in6</option>
    </select>
    <select class="form-select mb-3"  placeholder="IPv6 L2 protocol" name="ipv6protocol" id="ipv6protocol" disabled>
        <option disabled selected>Select a Protocol</option>
        <option value="ipoe">IPoE</option>
        <option value="pppoe">PPPoE</option>
    </select>
    <select class="form-select mb-3"  placeholder="Speed" name="speed">
        <option  disabled selected>Select a link speed</option>
        <option value="10">10 Mbps</option>
        <option value="100">100 Mbps</option>
        <option value="200">200 Mbps</option>
        <option value="500">500 Mbps</option>
        <option value="1000">1 Gbps</option>
        <option value="2500">2.5 Gbps</option>
        <option value="5000">5 Gbps</option>
        <option value="10000">10 Gbps</option>
    </select>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Calculate!">
    </div>
    <div class="form-floating mb-3">
        <input readonly class="form-control" type="number" id="maxSpeed" placeholder="Theoretical maximum speed">
        <label for="maxSpeed">Theoretical maximum speed (Mbps)</label>
    </div>
    <div class="form-floating mb-3">
        <input readonly class="form-control" type="number" id="overhead" placeholder="Ethernet overhead (%)">
        <label for="overhead">Ethernet overhead (%)</label>
    </div>

</form>
<h1>Gpon calculator</h1>
<form id="gpon-speed-mtu">
    <div class="form-floating mb-3">
        <input step="1" type="number" class="form-control" placeholder="ONT number" name="gpon-ont" id="gpon-ont" value="10" min="1" max="128" required>
        <label for="gpon-ont">ONT number</label>
    </div>
    <div class="form-floating mb-3">
        <input step="1" type="number" class="form-control" placeholder="GEM frame number" name="gpon-gem" id="gpon-gem" value="26" min="1" max="40" required>
        <label for="gpon-gem">GEM frame number</label>
    </div>
    <div class="mb-3">
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="gpon-ip4" name="gpon-ip" value="4" checked>
            <label class="form-check-label" for="gpon-ip4">IPv4</label> 
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="gpon-ip6" name="gpon-ip" value="6">
            <label class="form-check-label" for="gpon-ip6">IPv6</label> 
        </div>
    </div>
    <select class="form-select mb-3"  placeholder="IPv4 L2 protocol" name="gpon-ipv4protocol" id="gpon-ipv4protocol" required>
        <option  disabled selected>Select a Protocol</option>
        <option value="ipoe">IPoE</option>
        <option value="pppoe">PPPoE</option>
        <option value="map-t">MAP-T</option>
        <option value="map-e">MAP-E/4in6</option>
    </select>
    <select class="form-select mb-3"  placeholder="IPv6 L2 protocol" name="gpon-ipv6protocol" id="gpon-ipv6protocol" disabled required>
        <option disabled selected>Select a Protocol</option>
        <option value="ipoe">IPoE</option>
        <option value="pppoe">PPPoE</option>
    </select>
    <div class="mb-3">
        <input type="submit" class="btn btn-primary" value="Calculate!">
    </div>
    <div class="form-floating mb-3">
        <input  type="number" class="form-control" placeholder="GPON Average Ethernet Frame Size (Byte)" name="gpon-average-packet-size" id="gpon-average-packet-size" readonly>
        <label for="gpon-average-packet-size">GPON Average Ethernet Frame Size (Byte) must be inside 1000-1500</label>
    </div>
    <div class="form-floating mb-3">
        <input  type="number" class="form-control" placeholder="Theoretical maximum speed (Gbps)" name="gpon-maxSpeed" id="gpon-maxSpeed" readonly>
        <label for="gpon-maxSpeed">Theoretical maximum speed (Mbps)</label>
    </div>
    <div class="form-floating mb-3">
        <input  type="number" class="form-control" placeholder="GPON overhead (%)" name="gpon-overhead" id="gpon-overhead" readonly>
        <label for="gpon-overhead">GPON overhead (%)</label>
    </div>
</form>
  
<script>
    var form = document.getElementById('eth-speed-mtu');
    var radioIp = document.getElementsByName('ip');
    [...radioIp].forEach(el =>  {el.addEventListener('change', (event) => {
            var ip = document.querySelector('input[name="ip"]:checked').value;
            document.getElementById('ipv4protocol').disabled = (ip === '6');
            document.getElementById('ipv6protocol').disabled = (ip === '4');
            
        });
    });
    form.addEventListener('submit',(event) => {

        var formdata = new FormData(form);
        event.preventDefault();
        var overheadipv4 = {
            "ipoe" : 20,
            "pppoe" : 28,
            "map-t" : 40,
            "map-e" : 60,
        };
        var overheadipv6 = {
            "ipoe" : 40,
            "pppoe" : 48,
        };
        var overheadtcp = 20;
        var overheadeth = 14;
        var overheadfcs = 4;
        var overheadgap = {
            '10' : 5.875,
            '100' : 12,
            '200' : 8,
            '500' : 8,
            '1000' : 8,
            '2500' : 5,
            '5000' : 5,
            '10000' : 5,
        };
        var preamble = 8;
        var cip = formdata.get('ip');
        var coverheadip = formdata.get('ip') === '4' ? overheadipv4[formdata.get('ipv4protocol')] : overheadipv6[formdata.get('ipv6protocol')];
        var mtu = formdata.get('mtu');
        var mss = mtu - coverheadip;
        var overhead = overheadtcp + overheadeth + overheadfcs + overheadgap[formdata.get('speed')] + preamble + coverheadip;
        document.getElementById('overhead').value = overhead/mss  * 100;
        var th =  mss /(overhead + mss);
        
        document.getElementById('maxSpeed').value = th * formdata.get('speed');

    });
    var formgpon = document.getElementById('gpon-speed-mtu');
    var radioIp = document.getElementsByName('gpon-ip');
    [...radioIp].forEach(el =>  {el.addEventListener('change', (event) => {
            var ip = document.querySelector('input[name="gpon-ip"]:checked').value;
            document.getElementById('gpon-ipv4protocol').disabled = (ip === '6');
            document.getElementById('gpon-ipv6protocol').disabled = (ip === '4');
            
        });
    });
    formgpon.addEventListener('submit',(event) => {

        var formdata = new FormData(formgpon);
        event.preventDefault();
        var gtc = 38880;
        var overheadgem = 5;
        var overheadpcbd = 30 + 8*formdata.get('gpon-ont');
        var overheadipv4 = {
            "ipoe" : 20,
            "pppoe" : 28,
            "map-t" : 40,
            "map-e" : 60,
        };
        var overheadipv6 = {
            "ipoe" : 40,
            "pppoe" : 48,
        };
        var overheadtcp = 20;
        var overheadeth = 14;
        var overheadfcs = 4;
        var cip = formdata.get('gpon-ip');
        var coverheadip = formdata.get('gpon-ip') === '4' ? overheadipv4[formdata.get('gpon-ipv4protocol')] : overheadipv6[formdata.get('gpon-ipv6protocol')];
        var overheadframeeth = overheadtcp + overheadeth + overheadfcs + coverheadip;
        var overheadgtc = overheadgem + formdata.get('gpon-gem') * (overheadpcbd+overheadframeeth); 
        var payload = gtc - overheadgtc;
        document.getElementById('gpon-average-packet-size').value = payload/formdata.get('gpon-gem');


        document.getElementById('gpon-overhead').value = overheadgtc/payload  * 100;
        var th =  payload /gtc;
        
        document.getElementById('gpon-maxSpeed').value = th * 2.48832;

    });
</script>
