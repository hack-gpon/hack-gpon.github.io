## Architecture

Block diagram of the Lantiq FALC ON-S PEB 38035 ET (PEB98035) SoC used by the Source Photonics SPS-34-24T-HP-TDFO and its rebrands (Nokia / Alcatel-Lucent G-010S-P, Huawei MA5671A, FS.com GPON-ONU-34-20BI). The laser driver (LDD) and the limiting amplifier (LA) are integrated in the SoC, so the BOSA is connected directly to it.

```mermaid
%%{ init: { 'flowchart': { 'htmlLabels': false, 'curve': 'stepBefore' } } }%%
flowchart LR
  Z[" "] <-- GPON ODN --> A(BOSA)

  subgraph SOC [Lantiq FALC ON-S PEB 38035 ET]
    B("LDD") ~~~
    C("LA") ~~~
    D("CDR/<br/>SERDES") <-->
    E("GPON<br/>MAC") <-->
    F("Network<br/>Processor") <-->
    G("Ethernet<br/>MAC")
    H("Controller")

    D --> B
    C --> D
  end

  B --> A
  A --> C

  G <-- SGMII/HSGMII --> X[" "]
  H <-- I2C --> Y[" "]

  SOC ~~~ I("SPI NOR Flash")

  classDef ghost fill:transparent,stroke:transparent,color:transparent
  class Z,X,Y ghost
```

Diagram adapted from [pon.wiki: Source Photonics SPS-34-24T-HP-TDFO](https://pon.wiki/gpon/ont/source-photonics/sps-34-24t-hp-tdfo/#architecture) ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)).
