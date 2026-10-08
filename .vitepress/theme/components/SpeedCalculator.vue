<script setup lang="ts">
import { reactive, ref } from 'vue'

const overheadIpv4: Record<string, number> = { ipoe: 20, pppoe: 28, 'map-t': 40, 'map-e': 60 }
const overheadIpv6: Record<string, number> = { ipoe: 40, pppoe: 48 }
const overheadTcp = 20
const overheadEth = 14
const overheadFcs = 4

/* Ethernet calculator */
const overheadGap: Record<string, number> = {
  '10': 5.875,
  '100': 12,
  '200': 8,
  '500': 8,
  '1000': 8,
  '2500': 5,
  '5000': 5,
  '10000': 5
}
const preamble = 8

const eth = reactive({ mtu: 1500, ip: '4', ipv4protocol: '', ipv6protocol: '', speed: '' })
const ethResult = reactive({ maxSpeed: '', overhead: '' })
const ethValidated = ref(false)

function calculateEth(event: Event) {
  ethValidated.value = true
  if (!(event.target as HTMLFormElement).checkValidity()) return
  const overheadIp = eth.ip === '4' ? overheadIpv4[eth.ipv4protocol] : overheadIpv6[eth.ipv6protocol]
  const mss = eth.mtu - overheadIp
  const overhead = overheadTcp + overheadEth + overheadFcs + overheadGap[eth.speed] + preamble + overheadIp
  ethResult.overhead = ((1 - mss / (overhead + mss)) * 100).toFixed(2)
  ethResult.maxSpeed = ((mss / (overhead + mss)) * Number(eth.speed)).toFixed(2)
}

/* XG(S)-PON/GPON calculator */
const gpon = reactive({ ont: 10, speed: '2488.32', ip: '4', ipv4protocol: '', ipv6protocol: '' })
const gponResult = reactive({ gem: '', averagePacketSize: '', maxSpeed: '', overhead: '' })
const gponValidated = ref(false)

function calculateGpon(event: Event) {
  gponValidated.value = true
  if (!(event.target as HTMLFormElement).checkValidity()) return
  const gtc = 38880
  const overheadGem = 5
  const overheadPcbd = 30 + 8 * gpon.ont
  const overheadIp = gpon.ip === '4' ? overheadIpv4[gpon.ipv4protocol] : overheadIpv6[gpon.ipv6protocol]
  const overheadFrameEth = overheadTcp + overheadEth + overheadFcs + overheadIp
  let gem = 0
  let overheadGtc = 0
  let payload = 0
  for (gem = 0; gem < 40; gem++) {
    overheadGtc = overheadGem + gem * (overheadPcbd + overheadFrameEth)
    payload = gtc - overheadGtc
    if (payload / gem < 1500) break
  }
  gponResult.gem = String(gem)
  gponResult.averagePacketSize = (payload / gem).toFixed(2)
  gponResult.overhead = ((1 - payload / (payload + overheadGtc)) * 100).toFixed(2)
  gponResult.maxSpeed = ((payload / gtc) * Number(gpon.speed)).toFixed(2)
}
</script>

<template>
  <h2>Ethernet calculator</h2>
  <form class="hg-form" :class="{ validated: ethValidated }" novalidate @submit.prevent="calculateEth">
    <label>
      <span>MTU L2 (no overhead for PPPoE/MAP, only Ethernet PPPoE)</span>
      <input v-model.number="eth.mtu" type="number" min="1000" max="10000" required />
    </label>
    <div class="radio-group">
      <label><input v-model="eth.ip" type="radio" value="4" /> IPv4</label>
      <label><input v-model="eth.ip" type="radio" value="6" /> IPv6</label>
    </div>
    <label v-if="eth.ip === '4'">
      <span>IPv4 L2 protocol</span>
      <select v-model="eth.ipv4protocol" required>
        <option value="" disabled>Select a Protocol</option>
        <option value="ipoe">IPoE</option>
        <option value="pppoe">PPPoE</option>
        <option value="map-t">MAP-T</option>
        <option value="map-e">MAP-E/4in6</option>
      </select>
    </label>
    <label v-else>
      <span>IPv6 L2 protocol</span>
      <select v-model="eth.ipv6protocol" required>
        <option value="" disabled>Select a Protocol</option>
        <option value="ipoe">IPoE</option>
        <option value="pppoe">PPPoE</option>
      </select>
    </label>
    <label>
      <span>Link speed</span>
      <select v-model="eth.speed" required>
        <option value="" disabled>Select a link speed</option>
        <option value="10">10 Mbps</option>
        <option value="100">100 Mbps</option>
        <option value="200">200 Mbps</option>
        <option value="500">500 Mbps</option>
        <option value="1000">1 Gbps</option>
        <option value="2500">2.5 Gbps</option>
        <option value="5000">5 Gbps</option>
        <option value="10000">10 Gbps</option>
      </select>
    </label>
    <div class="actions">
      <button type="submit" class="btn btn-primary">Calculate!</button>
    </div>
    <label>
      <span>Theoretical maximum speed (Mbps)</span>
      <input :value="ethResult.maxSpeed" type="text" readonly />
    </label>
    <label>
      <span>Ethernet overhead (%)</span>
      <input :value="ethResult.overhead" type="text" readonly />
    </label>
  </form>

  <h2>XG(S)-PON/GPON calculator</h2>
  <form class="hg-form" :class="{ validated: gponValidated }" novalidate @submit.prevent="calculateGpon">
    <label>
      <span>ONT number</span>
      <input v-model.number="gpon.ont" type="number" step="1" min="1" max="128" required />
    </label>
    <label>
      <span>GPON speed</span>
      <select v-model="gpon.speed" required>
        <option value="2488.32">GPON</option>
        <option value="9953.28">XG(S)-PON/GPON</option>
      </select>
    </label>
    <div class="radio-group">
      <label><input v-model="gpon.ip" type="radio" value="4" /> IPv4</label>
      <label><input v-model="gpon.ip" type="radio" value="6" /> IPv6</label>
    </div>
    <label v-if="gpon.ip === '4'">
      <span>IPv4 L2 protocol</span>
      <select v-model="gpon.ipv4protocol" required>
        <option value="" disabled>Select a Protocol</option>
        <option value="ipoe">IPoE</option>
        <option value="pppoe">PPPoE</option>
        <option value="map-t">MAP-T</option>
        <option value="map-e">MAP-E/4in6</option>
      </select>
    </label>
    <label v-else>
      <span>IPv6 L2 protocol</span>
      <select v-model="gpon.ipv6protocol" required>
        <option value="" disabled>Select a Protocol</option>
        <option value="ipoe">IPoE</option>
        <option value="pppoe">PPPoE</option>
      </select>
    </label>
    <div class="actions">
      <button type="submit" class="btn btn-primary">Calculate!</button>
    </div>
    <label>
      <span>GEM frame number</span>
      <input :value="gponResult.gem" type="text" readonly />
    </label>
    <label>
      <span>GPON Average Ethernet Frame Size (Byte)</span>
      <input :value="gponResult.averagePacketSize" type="text" readonly />
    </label>
    <label>
      <span>Theoretical maximum speed (Mbps)</span>
      <input :value="gponResult.maxSpeed" type="text" readonly />
    </label>
    <label>
      <span>GPON overhead (%)</span>
      <input :value="gponResult.overhead" type="text" readonly />
    </label>
  </form>
</template>
