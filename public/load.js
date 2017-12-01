var loader_needUpdate = false;
var loader_fileName_vendorJs = "vendor.js";
var loader_fileName_appJs = "tiannianbao.js";
var loader_fileName_vendorCss = "vendor.css";
var loader_fileName_appCss = "app.css";
/*判断手机端类型*/
function loader_getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }
  if (/android/i.test(userAgent)) {
    console.log('mobile name :','android');
    return "android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    console.log('mobile name :','ios');
    return "ios";
  }
  console.log('mobile name :','unknown');
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
function loader_decodeSrc(targetData,type){
  //判断浏览器类型，如果是iPhone内置safari，不解压
  var userAgent=window.navigator.userAgent;
  var deCompress;
  var decodedString;
  var typeConsumer = loader_analysisParam("type");
    var md = loader_getMobileOperatingSystem();
    console.log("md.mobile()", md);
    if (md!=='unknown'&&typeConsumer!=='consumer') {
      if(type=='css'){
        deCompress = window.pako.ungzip(targetData);
        decodedString = stringFromUTF8Array(deCompress);
      }else{
        decodedString = targetData;
      }
    }else{
    deCompress = window.pako.ungzip(targetData);
    decodedString = stringFromUTF8Array(deCompress);
    console.log("targetData len is:" + targetData.length);
    console.log("deCompress len:" + deCompress.length);
    console.log("deCompress over:" + decodedString.length);
  }

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
var load_offline_index = 1;
//添加进度条进度
var load_increaseProgress = function(){
  var percent = load_offline_index / 4 ;
  var progressBarWidth = percent * $("#progressBar").width();
  console.log("progressBarWidth:" + progressBarWidth);
  $("#progressBar").find('div').width(progressBarWidth).html(percent + "%&nbsp;");
  load_offline_index++;
};
//定义加载脚本
var load_loadScript = function(type,data,callback,waitCall,key){
  var bodyElement = document.getElementsByTagName("body")[0];
  var newScriptElement,newStyleElement;
  if(type==="script"){
    newScriptElement  = document.createElement("script");
    newScriptElement.type = "text/javascript";
    newScriptElement.text = data;
    console.log("js load,key:" +  key);
    if(!waitCall){
      console.log("append with:" + key);
      bodyElement.appendChild(newScriptElement);
      console.log("append over:" + key);
      callback(data);
      return;
    }
    //延迟加载，直到条件满足
    var wait = function(){
      if (waitCall()) {
        console.log("append with:" + key);
        bodyElement.appendChild(newScriptElement);
        console.log("append over:" + key);
        callback();
      } else {
        console.log("need wait with:" + key);
        setTimeout( wait, 100 );
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
  console.log('获取脚本');
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
      queryBack(encData);
    });
    return;
  }
  var userAgent=window.navigator.userAgent;
  var md = loader_getMobileOperatingSystem();
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.addEventListener("progress", loadProgressCall, false);
  var uInt8Array;
  var decData;
  var typeConsumer = loader_analysisParam("type");
  xmlHttp.onload = function(e){
    console.log("this.response len:" + this.response.length);
    if (md!=='unknown'&&typeConsumer!=='consumer') {
      console.log("query ok:" + url);
      console.log('query type ' + type);
      if(type=='css'){
        uInt8Array = new Uint8Array(this.response);
      }else{
        uInt8Array = this.response;
      }
      //解压及处理
      decData = loader_decodeSrc(uInt8Array,type);
      console.log("key in res:" + key);
      // if(key=="scriptKey_app-pub_css"){
      //   console.log("save contents");
      //   var saveBlob = (function () {
      //       var a = document.createElement("a");
      //       document.body.appendChild(a);
      //       a.style = "display: none";
      //       return function (blob, name) {
      //           var url = window.URL.createObjectURL(blob);
      //           a.href = url;
      //           a.download = name;
      //           a.click();
      //           window.URL.revokeObjectURL(url);
      //       };
      //   }());
      //   var filename = "decData";
      //   var blob = new Blob([decData], {type: "text/plain;charset=utf-8"});
      //   saveBlob(blob, filename+".txt");
      // }
      loader_storage.setItem(key,decData);
      queryBack(decData);
    }else{
      uInt8Array = new Uint8Array(this.response);
      console.log("arrayBuffer len:" + uInt8Array.length);
      console.log("query ok:" + url);
      //解压及处理
      decData = loader_decodeSrc(uInt8Array,type);
      loader_storage.setItem(key,decData);
      queryBack(decData);
    }
  };
  url = url + "?v=" + Math.random();
  xmlHttp.open("get", url, true);
  if (md!=='unknown'&&typeConsumer!=='consumer') {
    if(type=='css'){
      xmlHttp.responseType = "arraybuffer";
    }else{
      xmlHttp.responseType = "text";
    }

  }else{
    xmlHttp.responseType = "arraybuffer";
  }

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
  },
  deleteItems: function(keyMatch){
    //indexedDB模式
    var db = this.versionDB.db;
    var trans = db.transaction([this.schema], "readwrite");
    var store = trans.objectStore(this.schema);
    //进行模糊匹配
    var keyRangeValue = IDBKeyRange.bound(keyMatch, keyMatch + '\uffff');
    var pdestory = store.openCursor(keyRangeValue);
    pdestory.onsuccess = function(event) {
      var cursor = event.target.result;
      //逐个删除所有匹配的健
      if(cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      } else {
        console.log('Entries all displayed.');
      }
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
  //判断是否是ios
  var md = loader_getMobileOperatingSystem();
  //移动端
  if(md!=='unknown'&&type!=='consumer'){
    //引用不同的js库文件
    loader_fileName_vendorJs = "vendor-webmobile.js";
    loader_fileName_appJs = "tiannianbao-webmobile.js";
    loader_fileName_vendorCss = "vendor.css";
    loader_fileName_appCss = "app.css";
  }
  console.log("type in loader:",type);
  var systype = loader_analysisParam("systype");
  // var homePage = loader_analysisParam("homePage");
  // console.log("homePage in loader:",homePage);
  // if(homePage && homePage === "consumer-service" || homePage === "publichealth-data" || homePage === "customer-dynamic" || homePage === "accounts-message"){
  //   localStorage.setItem(Constants.uickey_homePage,homePage);
  // }else{
  //   localStorage.setItem(Constants.uickey_homePage,"");
  // }
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
    //公众号
    if(type==="consumer"){
      //换标题
      document.title = '感恩陪伴老人关爱';
      //引用不同的js库文件
      loader_fileName_vendorJs = "vendor-pub.js";
      loader_fileName_appJs = "tiannianbao-pub.js";
      loader_fileName_vendorCss = "vendor-pub.css";
      loader_fileName_appCss = "app-pub.css";
    }
  }
  console.log("ready in load");
  loader_storage.init(function(){
    //比较版本，决定是否从远程取得
    var versionRemote = $("#progressBarArea").attr("version");
    var partVersionRemote = $("#progressBarArea").attr("partVersion");
    //处理单独文件版本
    if(partVersionRemote){
      loader_storage.getItem("tiannianbaoPartVersion",function(partVersionLocal){
        if(!partVersionLocal){
          partVersionLocal = 0;
        }
        //如果需要更新，则先从本地数据删除所有单独文件
        if(partVersionLocal<partVersionRemote){
          loader_storage.deleteItems("part_");
        }
      });
    }
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
      load_queryScript("assets/styles/" + loader_fileName_appCss,"css", function(){
        console.log("app css loaded");
        $("#progressBar").attr("appCssLoaded","yes");
        //本地加载模式下，增加进度条
        if(!loader_needUpdate){
          load_increaseProgress();
        }
      },null,function(){
        //通过标志控制是否加载,保证先加载verdor css
        console.log("vendorCssLoaded is:" + $("#progressBar").attr("vendorCssLoaded"));
        return $("#progressBar").attr("vendorCssLoaded");
      });
      load_queryScript("assets/" + loader_fileName_vendorCss,"css",function(){
        console.log("vendor.css loaded");
        //设置加载完毕标志
        $("#progressBar").attr("vendorCssLoaded","yes");
        //本地加载模式下，增加进度条
        if(!loader_needUpdate){
          load_increaseProgress();
        }
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
      load_queryScript("assets/" + loader_fileName_appJs, "script", function(){
        console.log("tiannianbao loaded");
        var progress = $("#progressBarArea");
        //本地加载模式下，增加进度条
        if(!loader_needUpdate){
          load_increaseProgress();
        }
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
      load_queryScript("assets/" + loader_fileName_vendorJs, "script",function(){
        console.log("vendor loaded");
        //设置加载完毕标志
        $("#progressBar").attr("vendorLoaded","yes");
        //本地加载模式下，增加进度条
        if(!loader_needUpdate){
          load_increaseProgress();
        }
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
