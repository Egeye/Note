### Git 使用

> Github：Egeye-8t

> 码云：163-8t 

> [Git](<https://git-scm.com/download/>)

1. 配置 & 设置代理
	``` git
	git config --global user.name "Egeye"
	git config --global user.email "egeye4y@gmail.com"
	git config --global http.proxy 192.168.1.1:2234
	git config --global https.proxy 192.168.1.1:2234
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
	
	``` git
	git log 2e7c0547af28cc1e9f303a4a1126fddbb704281b -1
	```
	> 只查看其中一条记录，在命令中指定该记录的id，并加上-1参数（这边是数字1）

	``` git
	git log 2e7c0547af28cc1e9f303a4a1126fddbb704281b -1 –p
	```
	> 查看提交记录具体修改内容，在命令中加入-p参数

    ```
    git log filename
    ```
    > filename（绝对路径） 或 （先进入此文件所在的目录下，当前文件名）
    
    ```
    git diff --name-status LOG1 LOG2
    ```
    > 查看记录的文件列表


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

	> 主线为 master分支

	> 分支前面*号代表当前所处的分支

	```
	git push origin test:master
	```
	> 提交本地test分支作为远程的master分支，远程的github就会自动创建一个test分支

	```
	git push origin test:test
	```

	> 提交本地test分支作为远程的test分支

	```
	git push origin :test
	```
	> 删除远程的分支,左边的分支为空，那么将删除:右边的远程的分支,但是本地还会保存的

    > [git branch用法总结，查看、新建、删除、重命名](http://blog.csdn.net/afei__/article/details/51567155)
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

	> 权限问题

	>> cd ~/.ssh
	>>> 如果提示：No such file or directory 说明是第一次使用git，如果真的进入了.ssh文件夹说明曾经用过git，但是里面的文件可能失效或者不存在了

	>> mkdir key_backup$ cp id_rsa* key_backup$ rm id_rsa*
	>>> 这个是用来清除你原来的ssh秘钥，如果没有的话会报错，把这个命令敲上去一次曾经的秘钥现在肯定不在了（试过，没成功……）

	>> ssh-keygen -t rsa -C EMAIL
	>>> 这个命令是用来生成新的ssh秘钥，在回车中会提示你输入一个密码，这个密码会在你提交项目时使用，如果为空的话提交项目时则不用输入。您可以在你本机系统盘下，您的用户文件夹里发现一个.ssh文件，其中的id_rsa.pub文件里储存的即为刚刚生成的ssh密钥

	>> 点击你的_github头像__选择__settings__，然后选择__SSH and GPG keys__,选择__new SSH key__,然后将刚才的 id_rsa.pub里面的内容扔到key标题下的框中，title随你任性，接着你就可以更任性的push、clone啥的都没问题了

	> [Git 多账户配置使用，同时使用github 和 gitoschina](http://blog.csdn.net/bat1992/article/details/54893290)

	```
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
	
	```
	git fetch origin gui-v-1:gui-v-1
    ```
    从远程分支检出到本地分支
	

14. 对上一次commit的消息做修改
    > git commit --amend

***
### 一、拣选合并

* 拣选合并可以拣选分支上1个或多个提交进行合并，并保留原分支的提交注释信息。

* 合并前：

> D---E---A---B---C	[top]

> D---E---F---G---H---B	[master]

* 把top分支上的 ***B*** 和 ***C*** 拣选合并到master分支上

1. 切换到 ***master*** 分支
	> gitcheckout master

2. 拣选合并 B 和 C (B 和 C 之间用空格隔开)
	> git cherry-pick B C

3. 合并结束后看log
	> LogID 即哈希值改变，注释信息不变

* 合并后：

> D---E---A---B---C      [top]

> D---E---F---G---H---B'---C'   [master]

> 注：合并产生conflict，解决了conflict，用 git add  conflict文件，然后用git commit不带注释可保留原提交注释。


### 二、压合合并

* 压合合并可以将分支上1个或多个提交压合成1个提交进行合并，不保留了原分支的注释信息，如果原分支的几个提交都是解决同一个问题，这时候可以用压合合并，把几个提交压合成一个提交，写新的注释信息。

* 合并前：

> D---E---A---B---C	[top]

> D---E---F---G---H---B	[master]

* 把top分支上的B和C压合合并到master分支上

1. 切换到master分支
	> gitcheckout master

2. 压合合并 B和C
	> git merge --squash B C （B和C之间用空格隔开）

3. 把合并过来的修改提交到master分支上
	> git commit -m " 注释 "

4. 合并结束后看log
	> 新增一条提交，注释是新的注释

合并后：
          A---B---C      top
         /
    D---E---F---G---H---BC    master

注：两个分支通过  git merge --squash ，只能把 A 或者 AB 或者 ABC 合并到master 上， 不能实现  BC 到 master上
git merge --squash 后面如果跟着哈希值，不管跟几个哈希值，不管哈希值的顺序，合并从分叉后的以第一个哈希值到后面跟着的最后一个哈希值之间的修改
注：合并产生conflict，解决了conflict，用 git add conflict文件

### 三、分支合并

* 合并前：

	> D---E---A---B---C      top

    > D---E---F---G---H    master

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
* 待功能开发完毕之后，合并到develop分支，合并的时候有两种方式：

1. 压合合并：将在issue1上的修改作为一次提交到develop分支上
       > git checkout develop

       > git merge --squash issue1

2. 直接合并：可以保留issue1上全部的历史提交记录
       > git checkout develop

       > git merge issue1

       > 合并错误日志：2.10：Already up-to-date

3. 拣选合并：将issue1上的部分活动合并到develop上，这个方式不适合上面描述的场景
       > git checkout develop

       > git cherry-pick 321d76f（连续拣选可以通过-n选项）


* Git reflog 恢复项目历史


---
1. git log filename 可以看到fileName相关的commit记录
2. git log -p filename 可以显示每次提交的diff
3. git show commit-id filename 只看某次提交中的某个文件变化，可以直接加上fileName
4. git show -s --pretty=raw  id(59047cce6eeb2d8fd9fa361e01dbb88d9a37cf4e) 根据 commit-id 查看某个提交
5. 借助可视化工具 如 sourceTree 在最后一次修改的记录上 右键选中文件 查看历史修改
6. git log 的常用选项 filename （绝对路径） 或 （先进入此文件所在的目录下，当前文件名）

选项            | 说明
---             | ---
-p 				| 按补丁格式显示每个更新之间的差异。
--stat 			| 显示每次更新的文件修改统计信息。
--shortstat 	| 只显示 --stat 中最后的行数修改添加移除统计。
--name-only 	| 仅在提交信息后显示已修改的文件清单。
--name-status 	| 显示新增、修改、删除的文件清单。
--abbrev-commit | 仅显示 SHA-1 的前几个字符，而非所有的 40 个字符。
--relative-date | 使用较短的相对时间显示（比如，“2 weeks ago”）。
--graph 		| 显示 ASCII 图形表示的分支合并历史。
--pretty 		| 使用其他格式显示历史提交信息,可用的选项包括 oneline，short，full，fuller 和 format（后跟指定格式）。


---
选项                | 说明
---                 | ---
-(n) 				| 显示最近的 n 条提交
--since, --after 	| 仅显示指定时间之后的提交。
--until, --before 	| 仅显示指定时间之前的提交。
--author 			| 仅显示指定作者相关的提交。
--committer 		| 仅显示指定提交者相关的提交。
--grep 				| 仅显示含指定关键字的提交。
-S 					| 仅显示添加或移除了某个关键字的提交。


---

## Github
* 展示页面代码必须发布到名为“gh-pages”的分支上
* 访问地址为https://account.github.io/repository

---

#### Git放弃本地所有修改，强制更新

```
git fetch --all
git reset --hard origin/master
```

> git fetch 只是下载远程的库的内容，不做任何的合并

> git reset 把HEAD指向刚刚下载的最新的版本

### Git 问题
![image](http://note.youdao.com/yws/public/resource/7a44bf90ec69dcdc3e3da8d7db1d29d0/xmlnote/885F29946E914FD291158080591E019E/16256)

> git config --system http.sslverify false

http://rogerdudler.github.io/git-guide/index.zh.html

