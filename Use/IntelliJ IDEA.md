### 快捷键
1. Alt + J 选词 （反复按快捷键，即可继续向下同时选中下一个相同的文本进行同时编辑） 
    > => Ctrl + D
2. Ctrl + Alt + O 格式化导包
3. Ctrl + Alt + L 格式化代码
4. F7/F8/F9 调试时分别对应Step into，Step over，Continue
5. Ctrl + W 选你所想(选择当前单词)

### 插件
1. CodeGlance

2. > IDEA自带数据库插件

### 自定义快捷键
1. redo
    > Ctrl + Y
2. add selection for next occurrence
    > Ctrl + D
3. Duplicate Line or Selection
    > Ctrl + Shift + D

### 设置
1. 【Settings...】→【Editor】→【General】→【Appearance】→【Show method separators】
2. 【Settings...】→【Editor】→【General】→【Appearance】→【Show Right Margin】
3. 【Settings】 -> 【Code Style】 -> 【Java】 ，在右边选择 “Code Generation” Tab，然后找到 Comment Code 那块，把 
Line comment at first column 
Block comment at first column 
去掉前面两个的复选框

### 自定义配置和缓存位置
* 不管你将 IntelliJ 装在什么地方，它都会在 C 盘的用户目录下创建 .IntelliJIdeaXX
* 将.IntelliJIdeaXX 目录移到其他分区的办法： 
1. 将C盘的.IntelliJIdeaXX 目录拷贝至自定义位置； 
2. 修改intellij idea安装目录下 \bin\idea.properties文件，将所有的 ${user.home} 替换为自定义位置 （注意斜杠的方向）
    ```
    cfg = D:/JetBrains
    idea.config.path=${cfg}/.IntelliJIdea/config
    idea.system.path=${cfg}/.IntelliJIdea/system
    ```
3. 启动 IntelliJ Idea 14，选择previous配置（即自定义位置）
--------------------------------------------------------------------------------

### 问题
Unregistered Vcs root detected The directory XXX is under Git, but is not registered in the Settings. Configure Ignore VCS root errors 
* [解决办法](http://stackoverflow.com/questions/27690431/configure-intellij-idea-such-that-source-detected-in-git-but-unregistered-vcs-ro)