import Ember from 'ember';
import config from '../config/environment';

/*线程支持*/
export default Ember.Service.extend({
  statusService: Ember.inject.service("current-status"),
  //状态监控线程
  statusWorker:null,
  netcheckWorker:null,
  netcheckDur: 5,
  global_curStatus:Ember.inject.service(),
  store: Ember.inject.service('store'),
  data_loader:Ember.inject.service('data-loader'),
  //网络状况
  netStatusBad:Ember.computed("netcheckWorker",function(){
    if(!this.get("netcheckWorker")){
      return false;
    }
    return this.get("netcheckWorker.netBad");
  }),
  isTestMode: function(){
    var href = window.location.href;
    let tempStr = href.substring(7,href.length);
    let secStr = tempStr.split("/")[1];
    console.log("secStr is:" + secStr);
    //如果是测试模式，则不跳转
    if(secStr==="tests"){
      console.log("rtn for test");
      return true;
    }
    return false;
  },
  init() {
    var _self = this;
    this._super(...arguments);
    //测试模式不进入
    if(this.isTestMode()){
      return;
    }
    //创建保持连接的worker,3分钟一轮询
    this.statusWorker = this.createWorker("statusWorker",function(result,callback){
      _self.get("store").findAll("sysconfig").then(function(sysconfig){
        //每三分钟重置一次服务器时间和当时的系统时间
        if(_self.get('data_loader')&&_self.get('data_loader.sysconfig')){
          _self.set('data_loader.sysconfig.sysTime',sysconfig.get("firstObject").get('sysTime'));
          console.log("sysTime in work:",sysconfig.get("firstObject").get('sysTime'));
          _self.set('data_loader.firstLocalTime',Math.floor(new Date().getTime()/1000));
        }
        callback();
      });
    },{duration:3*60});
    //用于网络连接探测的worker
    this.netcheckWorker = this.createWorker("netcheckWorker",function(result,callback){
      let that = this;
      let wholeUrl = config.wxScanurl;
      let url = null;
      if(wholeUrl.indexOf("index.html")>0){
        url = wholeUrl.replace("index.html","keepalive.txt");
      }else{
        url = wholeUrl + "/keepalive.txt";
      }
      //每隔几秒发送一次针对web文件的请求，以确定是否连接正常
      $.ajax({
          url: url,
          error: function(e){
              console.log("netcheckWorker fail",e);
              //如果失败，则缩短检测时间
              _self.get("netcheckWorker").set("callDuration",1);
              _self.get("netcheckWorker").processCheckFail();
              callback();
          },
          success: function(){
              console.log("netcheckWorker ok");
              _self.get("netcheckWorker").set("callDuration",_self.get("netcheckDur"));
              _self.get("netcheckWorker").processCheckOk();
              callback();
          },
          timeout: 3000
      });
    },{duration:_self.get("netcheckDur")});
    this.netcheckWorker.reopen({
      failTime: 0,
      netBad: false,
      processCheckFail(){
        //每失败一次，累加失败标志
        this.incrementProperty("failTime");
        //3次及以上，认为网络不通
        if(this.get("failTime")>2){
          _self.get("statusService").set("netConnected",false);
          this.set("netBad",true);
        }
      },
      processCheckOk(){
        //成功以后重置相关标志
        this.set("failTime",0);
        _self.get("statusService").set("netConnected",true);
        this.set("netBad",false);
      }
    });

    this.mapWorker = this.createWorker("mapWorker",function(result,callback){
      var mapObj, geolocation;
      //加载地图，调用浏览器定位服务
      mapObj = new AMap.Map('iCenter');
      mapObj.plugin('AMap.Geolocation', function() {
          geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：无穷大
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              buttonPosition:'RB',
          });
          geolocation.getCurrentPosition(dealResult);
      });
      function dealResult(status,result){
        var curUser = _self.get("statusService").getUser();
        if (!curUser) {
           return;
        }
        if (status=="complete") {
          let personLocation=_self.get('store').createRecord("personlocation");
          let positingUser=_self.get('store').createRecord('user');
          positingUser.set("id",curUser.get("id"));
          personLocation.set("positingUser",positingUser);
          personLocation.set("amapLat",result.position.getLat());
          personLocation.set("amapLng",result.position.getLng());
          personLocation.save().then(function(data){
          },function(err){
          });
          callback();
        }
      }
    },{duration:60});

    //启动监控
    Ember.run.later(function(){
      _self.statusWorker.start();
      _self.netcheckWorker.start();
      // _self.mapWorker.start();
    },1000);
  },
  //创建worker
  createWorker: function(workerName,mainProcess,options){
    var _self = this;
    var Worker = Ember.Object.extend(Ember.Evented, {
      workerName: workerName,
      busiOpt:options,
      callDuration:options.duration,//轮询间隔，单位秒
      operative:null,
      isRunning: false,//运行标志
      init: function() {
        this.operative = operative({
          process: function(callback){
            callback();
          }
        });
      },
      start: function() {
        console.log("start worker:" + workerName);
        this.isRunning = true;
        this.trigger('start');
        this.run();
      },
      run: function(){
        var that = this;
        this.operative.process(function(result){
          setTimeout(function() {
            mainProcess(result,function(){
              //如果未停止，间隔后继续发请求
              if(!_self.isRunning){
                //console.log("need again");
                that.run();
              }else{
                //console.log("end run");
              }
            });
          }, that.callDuration*1000);
        });
      },
      stop: function() {
        this.isRunning = false;
        this.trigger('stop');
      }
    });
    var worker = Worker.create();
    worker.one("stop",function(){
      console.log("stop event in");
    });
    return worker;
  },
  /*开启状态监控线程*/
  startStatusWorker: function(){
    var curStatus = this.get("curStatus");
    curStatus.currentUser = user;
    this.set("curStatus",curStatus);
  },
});
