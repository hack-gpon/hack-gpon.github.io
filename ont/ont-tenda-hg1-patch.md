---
title: OMCI reset patch
has_children: false 
parent: Tenda HG1
---

## Premade patch for V1.0.2
This patch is for /bin/startup with MD5 `5e6db6934d662b5cef2f4c74b8cdf639`

```diff
1073c1073
< 00004300: 0040 2821 8f82 81c0 0040 c821 0000 0000  .@(!.....@.!....
---
> 00004300: 0040 2821 8f82 81c0 0040 c821 0320 f809  .@(!.....@.!. ..
1205c1205
< 00004b40: 0000 0000 0000 0000 8fdc 0010 27c2 0030  ............'..0
---
> 00004b40: 0320 f809 0000 0000 8fdc 0010 27c2 0030  . ..........'..0
1207c1207
< 00004b60: 0000 0000 0000 0000 8fdc 0010 2404 0008  ............$...
---
> 00004b60: 0320 f809 0000 0000 8fdc 0010 2404 0008  . ..........$...
1256c1256
< 00004e70: 0040 c821 0000 0000 0000 0000 8fdc 0010  .@.!............
---
> 00004e70: 0040 c821 0320 f809 0000 0000 8fdc 0010  .@.!. ..........
1258c1258
< 00004e90: 0040 c821 0000 0000 0000 0000 8fdc 0010  .@.!............
---
> 00004e90: 0040 c821 0320 f809 0000 0000 8fdc 0010  .@.!. ..........
1262c1262
< 00004ed0: 0040 2821 8f82 81c0 0040 c821 0000 0000  .@(!.....@.!....
---
> 00004ed0: 0040 2821 8f82 81c0 0040 c821 0320 f809  .@(!.....@.!. ..
1264c1264
< 00004ef0: 0040 2821 8f82 81c0 0040 c821 0000 0000  .@(!.....@.!....
---
> 00004ef0: 0040 2821 8f82 81c0 0040 c821 0320 f809  .@(!.....@.!. ..
```

Resulting patched file should have MD5 of `99aaaece6b7ed5a9ee0a075443d98943`

Add the following to `/etc/version.sh`, `rootfs_extracted/etc/scripts/chk_swver_2.sh` and `rootfs_extracted/etc/scripts/chk_swver.sh` to skip script checks by creating empty file inside JFFS2 config.

```diff
> if [ -f /var/config/skip_version ]; then
>       echo "Version adaptation bypass"
>       exit 0
> fi
```

## Tweaked default configuration

Enable telnet on LAN, disable http and telnet on WAN.

SSH and FTP components are removed from firmware and can't be enabled.

```diff
<        <Dir Name="ACL_IP_TBL"> <!--index=0-->
<                 <Value Name="instnum" Value="0"/>
<                 <Value Name="https_port" Value="443"/>
<                 <Value Name="https" Value="2"/>
<                 <Value Name="ftp_port" Value="21"/>
<                 <Value Name="web_port" Value="80"/>
<                 <Value Name="telnet_port" Value="23"/>
<                 <Value Name="icmp" Value="2"/>
<                 <Value Name="ssh" Value="2"/>
<                 <Value Name="snmp" Value="2"/>
<                 <Value Name="web" Value="2"/>
<                 <Value Name="tftp" Value="2"/>
<                 <Value Name="ftp" Value="0"/>
<                 <Value Name="telnet" Value="0"/>
<                 <Value Name="any" Value="0"/>
<                 <Value Name="Interface" Value="16"/>    <!--LAN-->
<                 <Value Name="State" Value="1"/>
<                 <Value Name="NetMask" Value="24"/>
<                 <Value Name="IPAddr" Value="0.0.0.0"/>
<          </Dir>
<          <Dir Name="ACL_IP_TBL"> <!--index=1-->
<                  <Value Name="instNum" Value="1"/>
<                  <Value Name="https_port" Value="443"/>
<                  <Value Name="https" Value="2"/>
<                  <Value Name="ftp_port" Value="21"/>
<                  <Value Name="web_port" Value="80"/>
<                  <Value Name="telnet_port" Value="23"/>
<                  <Value Name="icmp" Value="0"/>
<                  <Value Name="ssh" Value="0"/>
<                  <Value Name="snmp" Value="0"/>
<                  <Value Name="web" Value="1"/>
<                  <Value Name="tftp" Value="0"/>
<                  <Value Name="ftp" Value="0"/>
<                  <Value Name="telnet" Value="0"/>
<                  <Value Name="any" Value="0"/>
<                  <Value Name="Interface" Value="128"/>    <!--WAN-->
<                  <Value Name="State" Value="1"/>
<                  <Value Name="NetMask" Value="0"/>
<                  <Value Name="IPAddr" Value="0.0.0.0"/>
<         </Dir>
---
>         <Dir Name="ACL_IP_TBL"> <!--index=0-->
>                 <Value Name="instnum" Value="0"/>
>                 <Value Name="https_port" Value="443"/>
>                 <Value Name="https" Value="0"/>
>                 <Value Name="ftp_port" Value="21"/>
>                 <Value Name="web_port" Value="80"/>
>                 <Value Name="telnet_port" Value="23"/>
>                 <Value Name="icmp" Value="2"/>
>                 <Value Name="ssh" Value="0"/>
>                 <Value Name="snmp" Value="2"/>
>                 <Value Name="web" Value="2"/>
>                 <Value Name="tftp" Value="0"/>
>                 <Value Name="ftp" Value="0"/>
>                 <Value Name="telnet" Value="2"/>
>                 <Value Name="any" Value="0"/>
>                 <Value Name="Interface" Value="16"/>    <!--LAN-->
>                 <Value Name="State" Value="1"/>
>                 <Value Name="NetMask" Value="24"/>
>                 <Value Name="IPAddr" Value="0.0.0.0"/>
>          </Dir>
>          <Dir Name="ACL_IP_TBL"> <!--index=1-->
>                  <Value Name="instNum" Value="1"/>
>                  <Value Name="https_port" Value="443"/>
>                  <Value Name="https" Value="0"/>
>                  <Value Name="ftp_port" Value="21"/>
>                  <Value Name="web_port" Value="80"/>
>                  <Value Name="telnet_port" Value="23"/>
>                  <Value Name="icmp" Value="0"/>
>                  <Value Name="ssh" Value="0"/>
>                  <Value Name="snmp" Value="0"/>
>                  <Value Name="web" Value="0"/>
>                  <Value Name="tftp" Value="0"/>
>                  <Value Name="ftp" Value="0"/>
>                  <Value Name="telnet" Value="0"/>
>                  <Value Name="any" Value="0"/>
>                  <Value Name="Interface" Value="128"/>    <!--WAN-->
>                  <Value Name="State" Value="1"/>
>                  <Value Name="NetMask" Value="0"/>
>                  <Value Name="IPAddr" Value="0.0.0.0"/>
>         </Dir>
```


