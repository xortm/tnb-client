set ssh_string tiannianbao@47.93.78.97
spawn ssh $ssh_string
expect "~]$"
send "cd webapp\r"
expect "~]$"
send "unzip -o webapp.zip\r"
expect eof

