var loader_needUpdate = false;
/*判断手机端类型*/
function loader_getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
        return "android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "ios";
    }
    return "unknown";
}
//url参数拆分
function loader_analysisParam(paras) {
	var url = location.href;
	console.log("url is:" + url);
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	console.log("paraString is:" + paraString);
	var paraObj = {};
  var i,j;
	for (i = 0; j = paraString[i]; i++) {
		paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
	}
	var returnValue = paraObj[paras.toLowerCase()];
	if ( typeof (returnValue) === "undefined") {
		return null;
	} else {
		return returnValue;
	}
}

function loader_lightNone(){
  var btn = light.getElementsByTagName("span")[0];
  btn.onclick = function(){
    light.style.display='none';fade.style.display='none';
  };
}
//解码
function loader_decodeSrc(targetData){
  console.log("targetData len is:" + targetData.length);
  var deCompress = window.pako.ungzip(targetData);
  console.log("deCompress len:" + deCompress.length);
  var decodedString = stringFromUTF8Array(deCompress);
  console.log("deCompress over:" + decodedString.length);
  return decodedString;
}
//取得key名字
function loader_getScriptKey(url){
  var filePart = url.substring(url.lastIndexOf('/')+1);
  var key = "scriptKey_" + filePart;
  key = key.replace(".","_");
  console.log("key is:" + key);
  return key;
}
//定义加载脚本
var load_loadScript = function(type,data,callback,waitCall,key){
  var headElement = document.getElementsByTagName("head")[0];
  var newScriptElement,newStyleElement;
  if(type==="script"){
    newScriptElement  = document.createElement("script");
    newScriptElement.type = "text/javascript";
    newScriptElement.text = data;
    console.log("js load,key:" +  key);
    if(!waitCall){
      headElement.appendChild(newScriptElement);
      callback(data);
      return;
    }
    //延迟加载，直到条件满足
    var wait = function(){
      if (waitCall()) {
        console.log("append with:" + key);
        headElement.appendChild(newScriptElement);
        console.log("append over:" + key);
        callback();
      } else {
        console.log("need wait with:" + key);
        setTimeout( wait, 500 );
      }
    };
    wait();
  }else{
    if(!waitCall){
      $("head").append("<style>" + data + "</style>");
      callback(data);
      return;
    }
    //延迟加载，直到条件满足
    var waitCss = function(){
      if (waitCall()) {
        $("head").append("<style>" + data + "</style>");
        callback();
      } else {
        console.log("need wait with:" + key);
        setTimeout( waitCss, 500 );
      }
    };
    waitCss();
  }
};
//定义获取脚本
var load_queryScript = function (url, type,callback,loadProgressCall,waitCall,failCallback) {
  var key = loader_getScriptKey(url);
  var queryBack = function(backdata){
    if(callback){
      load_loadScript(type,backdata,callback,waitCall,key);
    }else{
      load_loadScript(type,backdata,null,null,key);
    }
  };
  //如果不需要更新，从本地取得脚本
  if(!loader_needUpdate){
    loader_storage.getItem(key,function(encData){
      //字符串转为压缩数据的数组
      // var data = StringView.base64ToBytes(encData);
      // console.log("data len:" + data.length);
      // var decData = loader_decodeSrc(data);
      console.log("encData len:" + encData.length);
      queryBack(encData);
    });
    return;
  }
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.addEventListener("progress", loadProgressCall, false);
  xmlHttp.onload = function(e){
    console.log("this.response len:" + this.response.length);
    var uInt8Array = new Uint8Array(this.response);
    console.log("arrayBuffer len:" + uInt8Array.length);
    console.log("query ok:" + url);
    //脚本的压缩数据转换为字符串，并存储到本地
    // var encData = StringView.bytesToBase64(uInt8Array);
    // console.log("keyname before setItem:"+key);
    // console.log("keyname encData:"+encData.length);
    // loader_storage.setItem(key,encData);
    //解压及处理
    var decData = loader_decodeSrc(uInt8Array);
    console.log("decData save len:"+decData.length);
    loader_storage.setItem(key,decData);
    queryBack(decData);
  };
  xmlHttp.open("get", url, true);
  xmlHttp.responseType = "arraybuffer";
  xmlHttp.send();
};
//脚本存储功能封装
var loader_storage = {
  mode: 2,//存储方式 1：localstorage 2：indexeddb
  versionDB: null,
  indexedDB: null,
  schema:"versionSche",
  init: function(callback){
    //初始化indexeddb
    var dbName = "version";
    var dbVersion = 2.0;
    this.versionDB = {};
    this.versionDB = window.indexedDB ||
                    window.webkitIndexedDB ||
                    window.mozIndexedDB;
    var _self = this;
    if ('webkitIndexedDB' in window) {
       window.IDBTransaction = window.IDBTransaction;
       window.IDBKeyRange = window.IDBKeyRange;
    }
    this.versionDB.onerror = function(e) {
        console.log("db err",e);
    };
    var open = this.versionDB.open(dbName,dbVersion);
    open.onupgradeneeded = function(e) {
      console.log ("Going to upgrade our DB");
      var db = open.result;
      //创建schema
      if(!db.objectStoreNames.contains(_self.schema)) {
        console.log("need create sche:" + _self.schema);
        var store = db.createObjectStore(_self.schema, {keyPath: "key"});
      }
    };
    open.onsuccess = function() {
      console.log ("success our DB: " + dbName);
      _self.versionDB.db = open.result;
      if(callback){
        callback();
      }
    };
  },
  getItem: function(key,callback){
    if(this.mode==1){
      callback(localStorage.getItem(key));
      return ;
    }
    //indexedDB模式
    var db = this.versionDB.db;
    var trans = db.transaction([this.schema], "readwrite");
    var store = trans.objectStore(this.schema);
    var value = store.get(key);
    value.onsuccess=function(e){
        console.log("key " + key + " get suc:" + e.target.result);
        if(!e.target.result){
          callback();
        }else{
          callback(e.target.result.value);
        }
    };
    value.onerror=function(e){
        console.log("key " + key + " get err:",e);
        callback();
    };
  },
  setItem: function(key,value){
    if(this.mode==1){
      return localStorage.setItem(key,value);
    }
    //indexedDB模式
    var db = this.versionDB.db;
    var trans = db.transaction([this.schema], "readwrite");
    var store = trans.objectStore(this.schema);
    var request = store.put({key:key,value:value});
    request.onsuccess = function(e) {
      console.log("key:" +key + "put ok");
    };
    request.onerror = function(e) {
      console.log("key:" +key + "put err",e);
    };
  }
};
//浏览器判断入口
window.onload = function(){
  var userAgent=window.navigator.userAgent;
  var light = document.getElementById('light');
  var fade = document.getElementById('fade');
  if(userAgent.search(/iPhone/)!=-1){return;}
  if (userAgent.indexOf("OPR") > -1) {
    if(confirm("Opera浏览器可能无法完全支持我们的页面，确定要继续进入么？")){
    }else {
      window.location.href="bower.html";
    }
    // alert("Opera");
  } //判断是否Opera浏览器
  if (userAgent.indexOf("Firefox") > -1) {
    if(confirm("火狐浏览器可能无法完全支持我们的页面，确定要继续进入么？")){
    }else {
      window.location.href="bower.html";
    }
    // alert("Firefox");
  } //判断是否Firefox浏览器

   if (userAgent.indexOf("Safari") > -1){
     if (userAgent.indexOf("Chrome") > -1){
      //  alert("Chrome");
     }else {
       if(confirm("Safari浏览器可能无法完全支持我们的页面，确定要继续进入么？")){
       }else {
         window.location.href="bower.html";
       }
      //  light.style.display = "block";
      //  fade.style.display = "block";
      //  loader_lightNone();
       //  alert("Safari");
     }
    }

  if (userAgent.indexOf("Trident")>-1) {//IE 内核
    if(/MSIE (6|7|8|9|10)/.test(userAgent)){
      alert("低版本IE浏览器无法完全支持我们的页面,关闭将会跳转至下载新浏览器页面");
      window.location.href="bower.html";
    }else {
      // alert("MSIE11");
      if(confirm("IE浏览器可能无法完全支持我们的页面，确定要继续进入么？")){
      }else {
        window.location.href="bower.html";
      }
    }
  }
  if (window.ActiveXObject) {//IE 11??
    if(confirm("IE浏览器可能无法完全支持我们的页面，确定要继续进入么？")){
    }else {
      window.location.href="bower.html";
    }
  }
};

/*应用入口*/
$(document).on('ready', function() {
  //如果是客户端，加载cordova库
  var isCordova = loader_analysisParam("isCordova");
  //标题自适应
  var type = loader_analysisParam("type");
  var systype = loader_analysisParam("systype");
  if(systype&&systype.indexOf("#")>0){
    systype = systype.substring(0,systype.indexOf("#"));
  }
  var oritype = localStorage.getItem("type");
  if(!oritype){
    oritype = "service";
  }
  if(type&&type.indexOf("#")>0){
    type = type.substring(0,type.indexOf("#"));
  }
  if(systype&&systype.indexOf("#")>0){
    systype = systype.substring(0,systype.indexOf("#"));
  }
  if(!type){
    type = "service";
  }
  if(systype==="2"){
    document.title = '康颐老人关爱';
    $("#loadTitle").text("康颐");
  }else{
    if(type==="consumer"){
      document.title = '感恩陪伴老人关爱';
    }
  }
  console.log("ready in load");
  loader_storage.init(function(){
    //比较版本，决定是否从远程取得
    var versionRemote = $("#progressBarArea").attr("version");
    //异步方式取得key值
    loader_storage.getItem("tiannianbao_version",function(versionLocal){
      if(!versionLocal){
        versionLocal = 0;
      }
      console.log("versionLocal:" + versionLocal + " and versionRemote:" + versionRemote);
      if(versionLocal<versionRemote){
        loader_needUpdate = true;
      }
      //进度条变化
      var loadProgress = function(evt){
        if (evt.lengthComputable) {
          var percent = evt.loaded / evt.total * 100;
          var progressBarWidth = percent/100 * $("#progressBar").width();
          console.log("progressBarWidth:" + progressBarWidth);
        	$("#progressBar").find('div').width(progressBarWidth).html(percent + "%&nbsp;");
        } else {
          console.log("unable compute length",evt);
        }
      };
      //加载css
      load_queryScript("assets/styles/app.css","css", function(){
        console.log("app css loaded");
        $("#progressBar").attr("appCssLoaded","yes");
      },null,function(){
        //通过标志控制是否加载,保证先加载verdor css
        console.log("vendorCssLoaded is:" + $("#progressBar").attr("vendorCssLoaded"));
        return $("#progressBar").attr("vendorCssLoaded");
      });
      load_queryScript("assets/vendor.css","css",function(){
        console.log("vendor.css loaded");
        //设置加载完毕标志
        $("#progressBar").attr("vendorCssLoaded","yes");
      });
      if(oritype!==type){
        //把当前系统类型设置到本地存储
        localStorage.setItem("type",type);
        //如果改变了系统，则清空本地账号缓存
        var rmkey = [];
        for (var i = 0; i < localStorage.length; i++){
          if(localStorage.key(i).indexOf("localstorage")===0||localStorage.key(i).indexOf("index-localstorage")===0){
            console.log("rm key is:" + localStorage.key(i));
            rmkey.push(localStorage.key(i));
          }
        }
        for(var j=0;j<rmkey.length;j++){
          console.log("rm item is:" + rmkey[j]);
          localStorage.removeItem(rmkey[j]);
        }
      }
      if(isCordova){
        var osType = loader_getMobileOperatingSystem();
        console.log("need cordova");
        load_queryScript("./cordova/" + osType + "/cordova.js","script",function(){
          console.log("cordova.js load ok");
        });
      }
      load_queryScript("assets/tiannianbao.js", "script", function(){
        console.log("tiannianbao loaded");
        var progress = $("#progressBarArea");
        progress.hide();
        //设置版本号
        loader_storage.setItem("tiannianbao_version",versionRemote);
      },null,function(){
        //通过标志控制是否加载
        console.log("vendorLoaded is:" + $("#progressBar").attr("vendorLoaded"));
        var vf = $("#progressBar").attr("vendorLoaded");
        var vsf = $("#progressBar").attr("vendorCssLoaded");
        var asf = $("#progressBar").attr("appCssLoaded");
        var flag = true;
        if(!vf || !vsf ||!asf){
          flag = false;
        }
        console.log("vf:" + vf + " and vsf:" + vsf + " and asf:" + asf + " and flag:"+ flag);
        return flag;
      });
      load_queryScript("assets/vendor.js", "script",function(){
        console.log("vendor loaded");
        //设置加载完毕标志
        $("#progressBar").attr("vendorLoaded","yes");
      },function(e){
        loadProgress(e);
      });
    });
  });
});

function stringFromUTF8Array(data){
  const extraByteMap = [ 1, 1, 1, 1, 2, 2, 3, 0 ];
  var count = data.length;
  var str = "";

  for (var index = 0;index < count;)
  {
    var ch = data[index++];
    if (ch & 0x80)
    {
      var extra = extraByteMap[(ch >> 3) & 0x07];
      if (!(ch & 0x40) || !extra || ((index + extra) > count))
      return null;

      ch = ch & (0x3F >> extra);
      for (;extra > 0;extra -= 1)
      {
        var chx = data[index++];
        if ((chx & 0xC0) != 0x80)
        return null;

        ch = (ch << 6) | (chx & 0x3F);
      }
    }

    str += String.fromCharCode(ch);
  }

  return str;
}
