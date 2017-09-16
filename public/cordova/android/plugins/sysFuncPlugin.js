cordova.define("org.apache.cordova.plugin.SysFuncPlugin", function(require, exports, module) { var cordova = require('cordova');
var SysFuncPlugin = function(){};
SysFuncPlugin.prototype = {
        exitApp:function(){
            return cordova.exec(null, null,"SysFuncPlugin","exitApp",[]);
        },
        envSetup:function(success, error,envData){
        	console.log("envSetup go:" + JSON.stringify(envData));
            cordova.exec(success, function(err){
            	console.log("env setup call err:" + err);
            },"SysFuncPlugin","envSetup",[envData]);
        },
        clearSplash:function(){
        	console.log("clearSplash go:");
            return cordova.exec(null, function(err){
            	console.log("clearSplash call err:" + err);
            },"SysFuncPlugin","clearSplash",[]);
        },
        copyAssetsFile:function(data,callbackAction){
        	console.log("copyAssetsFile go:" + JSON.stringify(data));
            return cordova.exec(function(data){
            	console.log("copy sucess:" + data);
            	callbackAction(data);
            }, function(err){
            	console.log("copyAssetsFile call is err:" + err);
            	callbackAction();
            },"SysFuncPlugin","copyAssetsFile",[data.sourceFile,data.destFile]);
        },
        unzipFile:function(data,callbackAction){
        	console.log("unzipFile go:" + JSON.stringify(data));
            return cordova.exec(function(data){
            	console.log("unzip sucess:" + data);
            	callbackAction(data);
            }, function(err){
            	console.log("unzipFile call err:" + err);
            },"SysFuncPlugin","unzipFile",[data.path,data.zipname]);
        },
        //关闭加载页
        closeLoadingPage:function(data){
        	console.log("closeLoadingPage go:" + JSON.stringify(data));
            return cordova.exec(function(data){
            	console.log("closeLoadingPage sucess:" + data);
            }, function(err){
            	console.log("closeLoadingPage call err:" + err);
            },"SysFuncPlugin","closeLoadingPage",[]);
        },
        //显示加载进度
        showProgress:function(data){
        	console.log("showProgress go:" + JSON.stringify(data));
            return cordova.exec(function(dataBak){
            	console.log("showProgress sucess:" + dataBak);
            }, function(err){
            	console.log("showProgress call err:" + err);
            },"SysFuncPlugin","showProgress",[data.type,data.progressDur]);
        },
};
var sysFunc = new SysFuncPlugin();
module.exports = sysFunc;
});
