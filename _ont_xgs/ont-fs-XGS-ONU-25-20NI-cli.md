---
title: CLI command tree (XGS-ONU-25-20NI)
has_children: false
layout: default
parent: ONT FS.com Generic Compatible XGSPON Stick ONU with MAC SFP+ (XGS-ONU-25-20NI)
---

# Command tree

Available after `ONT>enable`.

## Version R4.4.20.022
```
+traffic             Service CLI menu
	+ces                 CES CLI menu (empty)
	+pon                 PON CLI menu
		+debug               PON debug command
			 rptwanstat          config report wan status to MEC
			 tcont               add/delete/flush a Tcont
			 flow                configure the parameters of a flow
			 queue               configure the parameters of a Tcont Queue
			 sendomci            Send a OMCI message
			 prbs                Enable/disable transmitting PRBS continuously
			 dyingGsend          Enable/disable transmitting PRBS continuously
			 omcidbg             Enable/disable kernel OMCI log
			 reportGemCnt        Enable/disable report gem counter to MEC
			 throughput          Enable/disable throughput test
			 ponmode             Enable/disable qos
			 dump_classifier     Dump classifier rule
			 gem_to_cpu          trap gem port all packets to cpu
		+hw                  PON Hardware level command
			 show                Show hardware status or configurations
			 read_reg            Read register value
			 write_reg           Write register value
		+ca                  PON cortina command
			 show                Show cortina status or configurations
		+app                 PON APP command
			 show                Show database in PMR app
			 sendmsg             Send Msg to PMR app
		 ber_interval        Configure the BER interval
		 sf_threshold        The threshold of BIP to report signal failure
		 sd_threshold        The threshold of BIP to report signal degrade
		 sn                  Set the serial number of the ONT
		 password            Set the password of ONT
		 to1_to2             Set the To1 To2 timer of ONT
		 show                show PON information
	+eth                 ETH CLI menu
		+debug               Ethernet Debug System CLI menu
			 pack                Ethernet CLI debug function for pack driver
			 brdg                Ethernet CLI debug function for SOC bridge
			 phy                 Ethernet CLI debug function for PHY
			 showconn            Show ethernet connection debug info
			 ethdbg              enable/disable the eth debug flag
		 show                Ethernet CLI Show
	+voip                VoIP CLI menu (empty)
	+omci                omci CLI menu
		+debug               OMCI Debug System CLI menu
			 showemrcfg          show the configuration of EMR from MEC
			 crc                 enable the crc check of omci message
			 omiterr             Enable/disable omitting OMCI errors
			 acpower             Start or stop power shedding
			 allocid             Function call mec_AddAllocId
			 ponstate            Function call mec_HandlePonStateChange
		+voip                OMCI VoIP System CLI menu
			 show                show the configuration of VMR from MEC
		+defaultxml          MEC Xml List CLI menu
			 show                show the List of default Xml from MEC
			 crc_commit          runtime xml add crc
			 restore_xml         runtime xml restore
		 show                Show the information of MEC
		 clear               Clear the runtime data
	+router              router CLI menu (empty)
	+dmr                 DMR CLI menu (empty)
	+hpna                HPNA CLI menu (empty)
+system              System CLI menu
	+mib                 MIB CLI menu
		+debug               MIB Debug System CLI menu
		 dump                Dump current mib to a file
		 reset               Reset mib to default values
		 show                Show the content of mib tables
	+log                 LOG CLI menu
		+kernel              KERNEL LOG CLI menu (empty)
		 show                Print out a log
		 dump                dump the content of a log file
		 set                 Save a log to a file
		 clear               Clear a log
		 collectlog          Collectlog all log
	+env                 ENV CLI menu
		 show                Print out enviroment variables
	+misc                MISC CLI menu
		+bob                 BOSA CLI menu
			 eep                 Misc CLI Show
			 unlock              Misc CLI Show
			 echo                Misc CLI Show
			 2090                Misc CLI Show
			 preheat             Misc CLI Show
			 auto                Misc CLI Show
			 automod             Misc CLI Show
			 restart             Misc CLI Show
		+debug               Misc Debug System CLI menu
			 showwc              Show write counter of mtd device
			 showbad             Show bad blocks of mtd device
		 show                Misc CLI Show
		 rf                  Misc CLI Show
		 filter              Misc CLI Show
		 agc                 Misc CLI Show
		 ponalarm            Misc CLI Show
		 mpcode              Read or write eeprom : EEP_MFG_PRODUCTCODE
		 mpsn                Read or write eeprom : EEP_MFG_PRODUCTSERIAL
		 mhwv                Read or write eeprom : EEP_MFG_HWVERSION
		 lasersn             Read or write eeprom : EEP_MFG_LASERSERIAL
		 mac1                Read or write eeprom : EEP_MFG_MAC1
		 mac2                Read or write eeprom : EEP_MFG_MAC2
		 eepver              Read or write eeprom : EEP_MFG_EEPVER
		 burnin              Read or write burnin flag : EEP_MFG_BURNIN
		 rfthigh             Read or write rfthigh in unit of 64 ohm : EEP_MFG_RFT_HIGH
		 rftlow              Read or write rftlow in unit of 64 ohm: EEP_MFG_RFT_LOW
		 rithigh             Read or write rithigh in unit of 64 ohm : EEP_MFG_RIT_HIGH
		 ritlow              Read or write ritlow in unit of 64 ohm: EEP_MFG_RIT_LOW
		 major               Read or write eeprom : EEP_HW_FUNCTIONMAJOR
		 minor               Read or write eeprom : EEP_HW_FUNCTIONMINOR
		 hwver               Read or write eeprom : EEP_HW_VERSION
		 vendor              Read or write eeprom : EEP_EQ_VENDORID
		 eqsn                Read or write eeprom : EEP_EQ_SERIALNUMBER
		 eqsnvend            Read or write eeprom : EEP_EQ_SNVENDOR
		 eqvid               Read or write eeprom : EEP_EQ_VERSIONID
		 eqid                Read or write eeprom : EEP_EQ_ID
		 img_name            Read or write eeprom : EEP_SW_BOOTIMAGE
		 admin_ip            Read or write eeprom : EEP_SW_IPADDR
		 admin_mask          Read or write eeprom : EEP_SW_IPMASK
		 server_ip           Read or write eeprom : EEP_SW_HOSTIPADDR
		 admin_gw            Read or write eeprom : EEP_SW_GATEIPADDR
		 ftp_user            Read or write eeprom : EEP_SW_FTPUSER
		 ftp_passwd          Read or write eeprom : EEP_SW_FTPPASS
		 bootflag            Read or write eeprom : EEP_SW_BOOTFLAG
		 admin_en            Read or write eeprom : EEP_SW_BOOTREMOTEEN
		 xgspon_regid        Read or write eeprom : XGS PON Registration ID
		 test_en             Read or write eeprom : EEP_SW_BOOTTESTEN
		 notcomplete         Read or write eeprom : EEP_SW_BOOTNOTCOMPLETE
		 act_img             Read or write eeprom : EEP_SW_ACTIVEIMAGE
		 commit_img          Read or write eeprom : EEP_SW_COMMITIMAGE
		 pon_passwd          Read or write eeprom : EEP_APP_GPONPASSWORD
		 register_id         Read or write eeprom : EEP_APP_GPONPASSWORD
		 hwerr               Read or write eeprom : EEP_HW_DIAGNOSTICCODE
		 vdsl2_vendor        Read or write eeprom : EEP_VDSL2_VENDORID
		 ssh_en              Read or write eeprom : EEPROM_RW_CMD
		 i2c_r               This command read i2c device in raw mode
		 i2c_w               This command write i2c device in raw mode
		 write_mem           This command is used to write otp
		 read_mem            This command is used to read otp
		 sendevent           This command is used to send led event directly
		 testloaden          This command enable test load for manufacture
		 testensn            This command enable test load for manufacture
		 eep_reset           This command restore EEPROM factory default configuration
		 eep_r8              This command read EEPROM in raw mode
		 eep_w8              This command write EEPROM in raw mode
		 eep_crc             This command update/check EEPROM crc value
		 exeep_r8            This command read EEPROM in raw mode
		 exeep_w8            This command write EEPROM in raw mode
		 exeep_crc           This command update/check EEPROM crc value
		 eepinfo             This command show eep info.
		 clearcfg            This command is used to clear ONT runtime config , if full para is set, clear loid also!Usage: clearcfg [full]
		 final_check         This command is used to show some important information for checking!
		 led                 This command is used to only turn on green leds,red leds or off all leds!Usage: led gon/ron/off
		 testloaden          This command enable test load for manufacture
		 testensn            This command enable test load for manufacture
		 get_gpio_val        This command get gpio value
		 diswdt              This command disable for manufacture
		 bosa                This command is used to set bosa version and type
		 image_copy          This command copy one image to another at next boot time
		 stopreboot          Stop reboot command for debug
	+manu                Manufacture CLI menu
		 we                  This command write eeprom for manufacture
		 wep                 This command only write PC for manufacture
		 wes                 This command only write SN for manufacture
		 wem1                This command only write MAC1 for manufacture
		 wem2                This command only write MAC2 for manufacture
		 ledon               This command turn on all led
		 ledoff              This command turn off all led
		 final_check         This command do final check
		 get_gpio_val        This command get gpio value
		 trans               This command show transceiver info
		 temp                This command show system temperature
		 er                  This command enable rf
		 dr                  This command diable rf
		 ef                  This command enable filter
		 df                  This command disable filter
		 ten                 This command enable test load
		 wd                  This command disable watchdog
		 tensn               This command enable test load, special for BL olt
		 ces_main            This command configure ces connection for main test board
		 ces_back            This command configure ces connection for backup test board
		 check_boot_status   This command check boot status
		 check_ranging_statusThis command check ranging status
		 check_usb_port      This command does manu test for USB device
		 reset_button_test   This command is used for Reset Button test
		 factory_reset       Clear all configuration and return to factory setting
		 load_certfile       Load ACS HTTPS private Cert file into ONT
	+fs                  File System CLI menu
		 show                Show the content of system memory
		 supgrade            super user Upgrade Image from Local Ftp Server
		 flash               System Flash memory Operation command
		 upgrade             Upgrade Image from Local Ftp Server
		 check               check the content of system mtd
	+net                 NET CLI menu
		 mirror              Set mirror debug
		 dump                Set dump frames debug
		 log                 Open/Close driver debug log
		 atconn              Active connection debug
		 show                Show NetMgr Data
	+shell               Shell
	+debug               System Debug CLI menu
		 showtimer           Show timers
		 showtask            Show task state
		 starttimer          Start timers
		 stoptimer           Start timers
		 md5                 calculate MD5 value from input string
		 md5num              calculate MD5 number string from input string
		 printlog            Set the log level to print to console
	 ontver              Show ONT Software Version
	 custom              Get/Set ONT Software custom information
```
