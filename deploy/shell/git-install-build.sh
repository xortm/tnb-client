codePath="/home/tiannianbao/tnb-client"
homePath="/home/tiannianbao"
shellPath="/home/tiannianbao/tnb-client/deploy/shell"
target_path="/home/tiannianbao/tnb-client/build"
target_path_for218="/home/tiannianbao/webapp_for_218"
deploy_path="/home/tiannianbao/webapp"
gitOsc="git@git.oschina.net:liangmuxue.oschina.net/tnb-client.git"
index_page="index_publish.html"
env_file="product_env.js"
expectitem="test"
deploy_temp_path="/home/tiannianbao/webapp-temp"

################################# 打包库选择 ##################################
read -p  "6090-居家库（1）  6060--demo库（2） 6080-生产发布库（3） 6070-生产测试库（4） 模拟测试环境(5) 退出（6）" choic

if [ $choic -eq 1 ]
then
        echo "打包 居家库"
        deploy_path="/home/tiannianbao/jujiaServer/webapp-jujia"
        env_file="jujia_env.js"
        expectitem="jujia"
elif [ $choic -eq 2 ]
then
        echo "打包 demo库"
        env_file="demo_env.js"
        deploy_path="/home/tiannianbao/testServer/webapp-demo"
        expectitem="demo"
elif [ $choic -eq 3 ]
then
        echo "打包 生产发布库"
        deploy_path="/home/tiannianbao/productServer/webapp"
				env_file="product_env.js"
				expectitem="product"
elif [ $choic -eq 4 ]
then
        echo "打包 生产测试库"
        deploy_path="/home/tiannianbao/webapp-publish"
elif [ $choic -eq 5 ]
then
        echo "打包 模拟测试环境"
        deploy_path="/home/tiannianbao/testServer/webapp-publish"
				env_file="monitest_env.js"
				expectitem="test"
elif [ $choic -eq 6 ]
then
        exit 0
else
        exit 2
fi

##拷贝替换首页
if [ "$1"x = "android"x ]; then
        index_page="index_android.html"
elif [ "$1"x = "public"x ]; then
        index_page="index_pub.html"
fi

################################# GIT拉取最新代码 ##################################
echo  "拉取代码..."
cd $homePath
if [ ! -d $codePath ]
then
        rm -rf $codePath
        git clone $gitOsc
else
        cd $codePath
        git stash save "s"
        git pull
fi

###################################################################################

#拷贝真正要部署的源配置文件
cp -f $codePath/app/$index_page $codePath/app/index.html
cp -f $codePath/config/$env_file $codePath/config/environment.js
#公众号替换依赖包
if [ "$1"x = "public"x ]; then
	cp -f $codePath/package_pub.json $codePath/package.json
fi

################################# install and build ##############################################
cd $codePath
echo  "npm install..."
npm install
echo  "bower install..."
bower install -q

if [ $choic -eq 1 ]
then
  cp -f $codePath/app/index_jujia.html $codePath/app/index.html
	echo  "ember build..."
	ember deploy production
	echo "ok"
elif [ $choic -eq 2 ]
then
	echo  "ember build..."
	if [ "$1"x = "android"x ]; then
		target_path="/home/tiannianbao/tnb-client/dist"
		ember build --environment=production
	else
		ember deploy production
	fi
	echo "ok"
elif [ $choic -eq 3 ]
then
	echo  "ember build..."
	if [ "$1"x = "android"x ]; then
		target_path="/home/tiannianbao/tnb-client/dist"
		ember build --environment=android
	elif [ "$1"x = "public"x ]; then
		ember deploy public
	else
		ember deploy production
	fi

elif [ $choic -eq 4 ]
then
	echo  "ember build..."
	if [ "$1"x = "android"x ]; then
		target_path="/home/tiannianbao/tnb-client/dist"
		ember build --environment=emuprod
	else
		ember deploy emuprod
	fi
elif [ $choic -eq 5 ]
then
	echo  "ember build..."
	if [ "$1"x = "android"x ]; then
		target_path="/home/tiannianbao/tnb-client/dist"
		ember build --environment=android
	elif [ "$1"x = "public"x ]; then
		ember deploy public
	else
		ember deploy production
	fi
fi

#公众号部署，拷贝不同库文件
if [ "$1"x = "public"x ]; then
	cp -f $target_path/assets/vendor.js $target_path/assets/vendor-pub.js
	cp -f $target_path/assets/tiannianbao.js $target_path/assets/tiannianbao-pub.js
	cp -f $target_path/assets/vendor.css $target_path/assets/vendor-pub.css
	cp -f $target_path/assets/styles/app.css $target_path/assets/styles/app-pub.css
fi
#安卓端部署，拷贝不同库文件
if [ "$1"x = "android"x ]; then
	cp -f $target_path/assets/vendor.js $target_path/assets/vendor-pub.js
	cp -f $target_path/assets/tiannianbao.js $target_path/assets/tiannianbao-android.js
	cp -f $target_path/assets/vendor.css $target_path/assets/vendor-pub.css
	cp -f $target_path/assets/styles/app.css $target_path/assets/styles/app-pub.css
  cp -f $target_path/assets/tiannianbao.js $deploy_path/assets/tiannianbao-webmobile.js
  cp -f $target_path/assets/vendor.js $deploy_path/assets/vendor-webmobile.js
fi
	################################# 打压缩包 ####################################
	cd $target_path
	echo  "产生对应压缩包..."
	zip -rq webapp.zip *
	if [ "$1"x = "android"x ]; then
		##生成安卓资源包

		rm -rf $deploy_path/tiannianbao/resource
		mkdir -p $deploy_path/tiannianbao/resource
		zip -d webapp.zip "./assets/*.map"
		zip -d webapp.zip "./assets/tiannianbao.js"
		zip -d webapp.zip "./assets/*-pub.*"
		cp webapp.zip $deploy_path/tiannianbao/resource/resource.zip
		cp $codePath/public/tiannianbao/resource/resource.json $deploy_path/tiannianbao/resource/.
	elif [ "$1"x = "public"x ]; then
		cp -f $target_path/index.html $deploy_path/index_pub.html
		cp -f $target_path/assets/vendor-pub.js $deploy_path/assets/vendor-pub.js
		cp -f $target_path/assets/tiannianbao-pub.js $deploy_path/assets/tiannianbao-pub.js
		cp -f $target_path/assets/vendor-pub.css $deploy_path/assets/vendor-pub.css
		cp -f $target_path/assets/styles/app-pub.css $deploy_path/assets/styles/app-pub.css
		mkdir $deploy_path/assets/part
		cp -f $target_path/assets/part/*.js $deploy_path/assets/part/.
	else
		cp webapp.zip $deploy_path/webapp.zip
		expect /home/tiannianbao/tnb-client/deploy/shell/expect_deploy_$expectitem.sh
	fi
echo  "ok..."
