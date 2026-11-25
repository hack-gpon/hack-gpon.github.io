## Architecture

Block diagram of the MaxLinear PRX126 SoC ([product page](https://www.maxlinear.com/product/access/fiber-access/socs-for-optical-networking-units-onu/prx126)), a single-core MIPS interAptiv (34Kc family) running at 400 MHz, the successor of the Lantiq/Intel Falcon. Unlike the [Lantiq Falcon](/ont-nokia-g-010s-p#architecture), the laser driver / limiting amplifier (PMD) is an external chip between the BOSA and the SoC.

```mermaid
%%{ init: { 'flowchart': { 'htmlLabels': false, 'curve': 'stepBefore' } } }%%
flowchart LR
  Z[" "] <-- Fiber --> A(BOSA)
  B("DRIVER/<br/>LA<br/>(PMD)")
  A --> B
  B --> A

  subgraph SOC [MaxLinear PRX126]
    C("SERDES<br/>/CDR")
    subgraph MAC
      D("10G(E)PON<br/>PCS&MAC/<br/>TC") ~~~
      E("10G-<br/>Ethernet<br/>PCS&MAC")
    end
    C <--> MAC
    F("Network<br/>Processor<br/>/Packet<br/>Switch")
    MAC <--> F
    G("10G-<br/>Ethernet<br/>PCS&<br/>MAC")
    F <--> G <--> H("SERDES<br/>/CDR")
    I("XO/PLL") ~~~
    J("Multi-Core Processor/Subsystem Controller")
  end

  B <--> C
  Y[" "]
  Y -- SFI/XFI --> H
  H --> Y
  J <-- I2C --> X[" "]

  SOC ~~~ K("Crystal 40MHz") ~~~ L("SLC NAND Flash") ~~~ M("LPDDR3")

  classDef ghost fill:transparent,stroke:transparent,color:transparent
  class Z,Y,X ghost
```

Diagram adapted from [pon.wiki](https://pon.wiki/xgs-pon/ont/bfw-solutions/was-110/#architecture) ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)).
