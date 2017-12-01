import Ember from 'ember';

/*
 * 创建人：梁慕学 2017-09-18
 * 说明：初始化页面的配置类
 */
export default Ember.Service.extend({
  //移动端部分
  mobile:{
    needPrepareRouteNames:["service-care","service-nurse","consultation-detail-mobile","customer-warning","service-order-looking","my-order-looking"],//需要进行预准备的页面
  },
  //公众号部分
  public:{
    needPrepareRouteNames:["customer-dynamic","publichealth-data","publicnumber-service","service-order-list","service-order-look","drug-information"],//需要进行预准备的页面
    //需要单独加载的js定义
    partLoad:[{routeName:"publichealth-data",jsFiles:["echarts"]}]
  },
  partLoaded: [],//已加载过的js内容
  dbInitOver: false,//标志是否已经初始化完毕

  initStorage: function(){
    let _self = this;
    var promise =  new Ember.RSVP.Promise(function (resolve, reject) {
      _self.get("fileStorage").init(function(){
        _self.set("dbInitOver",true);
        resolve();
      });
    });
    return promise;
  },
  //是否需要加载单独js文件
  isNeedPartJs: function(routeName){
    let partJs = this.get("public.partLoad").findBy("routeName",routeName);
    if(!partJs){
      return false;
    }
    return true;
  },
  hasPartJs: function(jsName){
    return this.get("partLoaded").contains(jsName);
  },
  //获取并加载对应的js内容
  getPartJsAndAppend: function(routeName,callback){
    console.log("getPartJsAndAppend in,routeName:" + routeName);
    let _self = this;
    this.getPartJs(routeName,function(jsName,jsData){
      //如果已经加载过，则直接返回
      if(!jsName){
        callback();
        return;
      }
      var bodyElement = document.getElementsByTagName("body")[0];
      let newScriptElement  = document.createElement("script");
      newScriptElement.type = "text/javascript";
      newScriptElement.text = jsData;
      bodyElement.appendChild(newScriptElement);
      console.log("append script over:" + jsName);
      //标记已加载
      _self.get("partLoaded").pushObject(jsName);
      callback();
    });
  },
  //根据route名，取得需要加载的js内容
  getPartJs: function(routeName,callback){
    let _self = this;
    let partJs = this.get("public.partLoad").findBy("routeName",routeName);
    let fileName = partJs.jsFiles[0];
    //如果此js文件已经加载过了，则不重复加载
    if(this.hasPartJs(fileName)){
      callback();
      return;
    }
    let key= this.getPartKey(fileName);
    //从本地存储获取js内容
    this.get("fileStorage").getItem(key,function(item){
      //如果本地存储没有，从网络获取
      if(!item){
        let url = "assets/part/" + fileName + ".js";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onload = function(e){
          console.log("part.response len:" + this.response.length);
          // console.log("this.responseText:" + this.responseText);
          //获取后存储到本地
          _self.get("fileStorage").setItem(key,this.responseText,function(){
            console.log("set over");
            if(callback){
              callback(key,xmlHttp.responseText);
            }
          });
        };
        xmlHttp.open("get", url, true);
        xmlHttp.responseType = 'text';
        // xmlHttp.responseType = "arraybuffer";
        xmlHttp.send();
      }else{
        callback(key,item);
      }
    });
  },
  getPartKey: function(fileName){
    return "part_" + fileName;
  },
  //局部加载的文件存储功能
  fileStorage:{
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
    setItem: function(key,value,callback){
      //indexedDB模式
      var db = this.versionDB.db;
      var trans = db.transaction([this.schema], "readwrite");
      var store = trans.objectStore(this.schema);
      var request = store.put({key:key,value:value});
      request.onsuccess = function(e) {
        console.log("key:" +key + " put ok");
        if(callback){
          callback();
        }
      };
      request.onerror = function(e) {
        console.log("key:" +key + " put err",e);
      };
    }
  }
});
