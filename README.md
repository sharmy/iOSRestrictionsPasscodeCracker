# iOS访问限制密码暴力破解node脚本
需要先使用[iBackupBot](http://www.icopybot.com/download.htm) 获取iOS备份后的访问限制加密后密码及加密key  
详细获取教程参见: [知乎-忘记 iOS 的访问限制密码，如何找回或重设？](https://www.zhihu.com)  
**注意：安装了uc浏览器的，请先卸载它再备份，否则iBackupBot可能无法获取信息**  
## 使用方法： 
> npm install  
> node cracker.js -k W7tAe0hOydAKCYAjeNnj9YZyLXc= -s NzJ4xQ==  
> -k: 即为加密后的字符串  
> -s: 为加密随机key  
> -n: 可选，为进行暴力破解的进程数，默认为cpu个数  

# iOSRestrictionsPasscodeCracker
a nodejs version of [iOS Restrictions Passcode Cracker](http://ios7hash.derson.us/)  
**notice: uninstall UC broswer on your iPhone, otherwise iBackupBot can not read iPhone backup files**  
## useage： 
> npm install  
> node cracker.js -k W7tAe0hOydAKCYAjeNnj9YZyLXc= -s NzJ4xQ==  
> -k: RestrictionsPasswordKey of your iphone  
> -s: RestrictionsPasswordSalt of your iphone  
> -n: optional, how many process use to crack your password 