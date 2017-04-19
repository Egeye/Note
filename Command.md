### Command

1. 列出所有接口？：ifconfig
2. down掉接口：
  ifdown xxx
  ifup xxx
3. ip addr show
4. psql fmegdb
  SELECT * from operation_logs
  \g
5. mkdir
6. 权限：chmod 777 restroeData.sh
7. 取消挂载：umount /mnt
8. 查找文件命令：find / -name *pg-log*
9. 查看Apache进程命令：ps -ef | grep apache
10. ssh admcat3750@192.168.103.120

  > ssh user@192.168.100.85
  
  > configure
  
  > interface xxx（xxx是VLAN名）
  
  > ip address 192.168.111.222 255.0.0.0
  
  > show running-config （查看是否设置成功）  
11. pwd
12. 查找文件命令：find / -name *pg-log*

### Setting
1. 配置隧道时侦听端口可能会被占用
2. VirtualBox设置network Port forwarding

### SQLServer2005
1. cscript C:\inetpub\adminscripts\adsutil.vbs SET W3SVC/AppPools/Enable32bitAppOnWin64 1
2. C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\aspnet_regiis.exe -i
> 按顺序分别复制二个语句，然后在命令提示符上面右键粘贴，然后执行。

### 查看显卡信息
1. 运行：dxdiag

