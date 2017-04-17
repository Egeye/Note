### Git 使用

Github：Egeye8t
Git：<https://git-scm.com/download/> 

1. 配置
	``` git
	git config --global user.name "Egeye"
	git config --global user.email "egeye4y@gmail.com"
	```
	> 查看配置
	``` git
	git config user.name
	git config user.email
	```
	
2. 创建代码仓库 
	``` git
	git init
	```
	> 需要CD命令到目标目录

3. 设置换行命令
	``` git
	git config --global core.autocrlf false 
	```
	> 如果有出警告
	>> warning: LF will be replaced by CRLF in readme.txt.The file will have its original line endings in your working directory.

	
4. 添加
	``` git
	git add <filename/directory>
	git add .
	```
	> 添加单个指定文件或者指定整个目录，或者添加所有的

5. 提交到本地仓库
	``` git
	git commit <文件名> -m "Describe message."
	git commit -m "Describe message."
	```
	> -m参数来加上提交的描述信息，没有描述信息的提交被认为是不合法的
	
	>> add 命令是把想要提交的代码先添加进来
	
	>> commit 命令则是真正地去执行提交操作


6. Git忽略
	``` git
	vi .gitignore
	```
	> 创建一个名为.gitignore的文件，写入此文件中的文件名或者目录代表不纳入版本控制中

7. 查看状态
	``` git
	git status
	```

8. 查看修改
	``` git
	git diff
	git diff src/com/example/test/MainActivity.java
	```

9. 撤销修改

	``` git
	git checkout src/com/example/test/MainActivity.java
	```
	> 只适用于那些还没有执行过add命令的文件

	``` git
	git reset HEAD src/com/example/test/MainActivity.java
	```
	> 已经添加了，取消添加使用的是reset命令

10. 查看提交记录
	``` git
	git log
	```
	> 只查看其中一条记录，在命令中指定该记录的id，并加上-1参数（这边是数字1）

	``` git
	git log 2e7c0547af28cc1e9f303a4a1126fddbb704281b -1
	```
	
	``` git
	git log 2e7c0547af28cc1e9f303a4a1126fddbb704281b -1 –p
	```
	> 查看提交记录具体修改内容，在命令中加入-p参数

11. 分支
	``` git
	git branch –a
	```
	> 查看分支
	
	``` git
	git branch version1.0
	```
	> 创建分支

	
	``` git
	git checkout version1.0
	```
	> 切换分支

	
	``` git
	git branch -D version1.0
	```
	> 删除分支

	>> 主线为 master分支
	
	>> 分支前面*号代表当前所处的分支

12. 合并
	``` git
	git checkout master
	git merge version1.0
	```
	> 需要先切换到需要合并的分支上

13. 与远程版本库协作
	``` git
	git clone https://github.com/exmaple/test.git
	```
	 
	``` git
	git push origin master
	```
	> 本地修改的内容同步到远程版本库

	``` git
	git fetch origin master
	git diff origin/master
	git merge origin/master
	```
	> 将远程版本库上的修改同步到本地
	
	>> 执行这个命令后，就会将远程版本库上的代码同步到本地，却不会合并到任何分支上去，而是会存放在到一个origin/master分支上，通过diff命令来查看远程版本库上修改内容，再调用merge命令将origin/master分支上的修改合并到主分支上
	
	``` git
	git pull origin master
	```
	> 从远程版本库上获取最新的代码并且合并到本地

***
### 一、拣选合并

拣选合并可以拣选分支上1个或多个提交进行合并，并保留原分支的提交注释信息。

合并前：
             A---B---C      top
         /        
    D---E---F---G---H    master
 
把top分支上的B和C拣选合并到master分支上

1. 切换到master分支
	gitcheckout master
	
2. 拣选合并 B 和 C
	git cherry-pick B C（B 和 C 之间用空格隔开）
	
3. 合并结束后看log
	LogID 即哈希值改变，注释信息不变

合并后： 
             A---B---C      top
         /        
    D---E---F---G---H---B'---C'   master

注：合并产生conflict，解决了conflict，用 git add  conflict文件，然后用git commit不带注释可保留原提交注释。


### 二、压合合并

压合合并可以将分支上1个或多个提交压合成1个提交进行合并，不保留了原分支的注释信息，如果原分支的几个提交都是解决同一个问题，这时候可以用压合合并，把几个提交压合成一个提交，写新的注释信息。

合并前：
          A---B---C      top
         /        
    D---E---F---G---H    master

把top分支上的B和C压合合并到master分支上

1. 切换到master分支
	gitcheckout master
	
2. 压合合并 B和C
	git merge --squash B C （B和C之间用空格隔开）
	
3. 把合并过来的修改提交到master分支上
	git commit -m " 注释 "
	
4. 合并结束后看log
	新增一条提交，注释是新的注释

合并后：
          A---B---C      top
         /        
    D---E---F---G---H---BC    master

注：两个分支通过  git merge --squash ，只能把 A 或者 AB 或者 ABC 合并到master 上， 不能实现  BC 到 master上
git merge --squash 后面如果跟着哈希值，不管跟几个哈希值，不管哈希值的顺序，合并从分叉后的以第一个哈希值到后面跟着的最后一个哈希值之间的修改
注：合并产生conflict，解决了conflict，用 git add conflict文件

### 三、分支合并

合并前：
          A---B---C      top
         /        
    D---E---F---G---H    master

把top分支合并到master分支上

1. 切换到master分支
	gitcheckout master
	
2. 合并top分支
	git merge top
	
3. 合并结束后看log
	top上的提交增加到master上，并新增一条合并信息。

合并后：
          A-----B----C      top
         /            \
    D---E---F---G---H---I    master

注：合并产生conflict，解决了conflict，用 git add conflict文件


***
待功能开发完毕之后，合并到develop分支，合并的时候有两种方式： 

1. 压合合并：将在issue1上的修改作为一次提交到develop分支上 
       git checkout develop 
       git merge --squash issue1

2. 直接合并：可以保留issue1上全部的历史提交记录 
       git checkout develop 
       git merge issue1 

       合并错误日志：2.10：Already up-to-date

3. 拣选合并：将issue1上的部分活动合并到develop上，这个方式不适合上面描述的场景 
       git checkout develop 
       git cherry-pick 321d76f（连续拣选可以通过-n选项） 


Git reflog 恢复项目历史
