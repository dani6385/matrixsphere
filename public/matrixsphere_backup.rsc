# may/04/2026 18:00:27 by RouterOS 6.49.8
# software id = AXPL-352N
#
# model = RB750Gr3
# serial number = HE208MMK5FC
/interface bridge
add name=bridge1
/interface ethernet
set [ find default-name=ether1 ] name=eth1_ISP
set [ find default-name=ether2 ] name=eth2_Switch
set [ find default-name=ether3 ] name=eth3_PC
set [ find default-name=ether4 ] name=eth4_SSID
set [ find default-name=ether5 ] name=eth5_ISP
/interface wireless security-profiles
set [ find default=yes ] supplicant-identity=MikroTik
/ip hotspot profile
set [ find default=yes ] login-by=""
/ip hotspot user profile
set [ find default=yes ] name=admin
add mac-cookie-timeout=5m name=trial shared-users=50
/ip hotspot profile
add dns-name=matrixsphere.net hotspot-address=192.168.20.1 html-directory=\
    flash/hotspot login-by=cookie,http-chap,https,http-pap,trial,mac-cookie \
    name=hsprof1 trial-uptime-reset=5m trial-user-profile=trial
/ip pool
add name=dhcp_pool0 ranges=192.168.30.2-192.168.30.254
add name=dhcp_pool1 ranges=192.168.20.2-192.168.20.254
/ip dhcp-server
add address-pool=dhcp_pool0 disabled=no interface=eth3_PC name=dhcp1
add address-pool=dhcp_pool1 disabled=no interface=bridge1 name=dhcp2
/ip hotspot
add address-pool=dhcp_pool1 disabled=no interface=bridge1 name=hotspot1 \
    profile=hsprof1
/interface bridge port
add bridge=bridge1 interface=eth2_Switch
add bridge=bridge1 interface=eth4_SSID
/ip address
add address=192.168.30.1/24 interface=eth3_PC network=192.168.30.0
add address=192.168.20.1/24 interface=bridge1 network=192.168.20.0
/ip dhcp-client
add disabled=no interface=eth5_ISP
/ip dhcp-server network
add address=192.168.20.0/24 dns-server=8.8.8.8,8.8.4.4 gateway=192.168.20.1
add address=192.168.30.0/24 dns-server=1.1.1.1,1.0.0.1 gateway=192.168.30.1
/ip dns
set allow-remote-requests=yes servers=8.8.8.8,8.8.4.4,1.1.1.1,1.0.0.1
/ip firewall filter
add action=passthrough chain=unused-hs-chain comment=\
    "place hotspot rules here" disabled=yes
/ip firewall nat
add action=passthrough chain=unused-hs-chain comment=\
    "place hotspot rules here" disabled=yes
add action=masquerade chain=srcnat out-interface=eth5_ISP
add action=masquerade chain=srcnat comment="masquerade hotspot network" \
    src-address=192.168.20.0/24
/ip hotspot user
add name=dani6385 password=3985@dani
/ip hotspot walled-garden
add comment="Aset Logo" dst-host=id.matrixsphere
/system clock
set time-zone-name=Asia/Jakarta
/system ntp client
set enabled=yes server-dns-names=id.pool.ntp.org
