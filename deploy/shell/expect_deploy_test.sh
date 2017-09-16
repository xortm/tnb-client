set ssh_string tiannianbao@101.200.143.200
spawn ssh $ssh_string
expect "~]$"
send "cd webapp-publish\r"
expect "~]$"
send "unzip -o webapp.zip\r"
expect eof

