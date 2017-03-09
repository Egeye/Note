#### 资源文件
1. 按钮点击效果
	```Xml		
	<?xml version="1.0" encoding="utf-8"?>
	<selector xmlns:android="http://schemas.android.com/apk/res/android" android:enterFadeDuration="200">

		<item android:drawable="@drawable/btn_pressed" android:state_pressed="true"></item>
		<item android:drawable="@drawable/btn_normal"></item>

	</selector>
	```

2. 矩形纯色
	```Xml
	<?xml version="1.0" encoding="utf-8"?>
	<shape xmlns:android="http://schemas.android.com/apk/res/android"
	android:shape="rectangle">

		<solid android:color="@color/purple" />

	</shape>
	```

#### ADB 命令
1. 将电脑文件复制到模拟器中命令：
	> adb push d:/abc.txt /sdcard/

2. 将模拟器文件复制到电脑命令：
	> adb pull /sdcard/xyz.txt d:/


#### APK 程序是 Android 程序的发布包，打包步骤：
1. 通过 DX 工具对*.class文件进行准换得到*.dex文件
2. 通过 AAPT 工具打包所有资源文件得到*.ap_文件
3. 通过 apkbuilder 工具把前两步得到的文件打包成 APK 包				
