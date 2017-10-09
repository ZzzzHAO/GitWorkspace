**git init** //把当前这个目录变成Git可以管理的仓库
**ls -ah** //查看目录 包含隐藏文件
**git add file** //把文件添加到暂存区
**git commit -m "comment"** //提交到本地版本库
**git diff file** //查看修改内容
**git diff HEAD -- file** //查看工作区和版本库里面最新版的区别
**git log** //可以查看提交历史，以便确定要回退到哪个版本。
**git log --pretty=oneline** //可以查看提交历史  (每个版本占一行)
**git log --graph** //可以看到分支合并图
**git reset --hard HEAD^** //会退到上个版本，回退n个版本就写n个'^'或者简写成'HEAD~n'
**git reset HEAD file** //可以把暂存区的修改撤销掉，重新放回工作区
**git reflog** //记录你的每一次命令，查看命令历史，以便确定要回到未来的哪个版本。
**git rm file** //删除文件，也可以用'git add file'达到相同的目的(先物理删除文件，再执行此命令)
**git push -u origin master** //把当前分支master推送到远程(-u参数，第一次关联的时候要加，Git不但会把本地的master分支内容推送的远程新的master分支，还会把本地的master分支和远程的master分支关联起来)
**git push origin :dev** //删除远程分支
**git push origin --delete <branchName>**//删除远程分支
**git clone url** //克隆一个远程库(git地址要比https地址速度快)
**git checkout -b dev** //创建dev分支，然后切换到dev分支(没有-b表示切换分支)
**git checkout -b branch-name origin/branch-name** //在本地创建和远程分支对应的分支
**git checkout -- file** //可以丢弃工作区的修改
**git branch** //查看当前分支
**git branch -d dev** //删除指定(dev)分支
**git branch -D dev** //强行删除指定(dev)没有被合并过的分支
**git branch --set-upstream-to=origin/dev** //建立本地分支和远程分支的关联，以后只需要直接git pull和git push就可以了
**git merge dev** //合并指定分支(dev)到当前分支
**git merge --no-ff -m "comment" dev** //合并指定分支(dev)到当前分支，禁止Fast forward模式，merge时生成一个新的commit
**git stash** //可以把当前工作现场“储藏”起来，等以后恢复现场后继续工作
**git stash list** //查看保存的工作现场
**git stash apply stash@{0}** //恢复stash@{0}的工作现场
**git stash drop stash@{0}** //删除stash@{0}的工作现场
**git stash pop** //恢复并删除stash@{0}的工作现场
**git remote** //查看远程库信息
**git remote -v** //显示更详细的信息