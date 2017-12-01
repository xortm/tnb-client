set ssh_string tiannianbao@60.205.226.66
spawn ssh $ssh_string
expect "~]$"
send "cd webapp-jujia\r"
expect "~]$"
send "unzip -o webapp.zip\r"
expect eof

