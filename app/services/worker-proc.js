import Ember from 'ember';
const { callStatus_noCall,callStatus_calling, callStatus_inCall,callStatus_callEnd,callStatus_callFail } = Constants;

/*线程支持*/
export default Ember.Service.extend({
  statusService: Ember.inject.service("current-status"),
  //状态监控线程
  statusWorker:null,
  global_curStatus:Ember.inject.service(),
  store: Ember.inject.service('store'),
  data_loader:Ember.inject.service('data-loader'),
  init() {
    var _self = this;
    this._super(...arguments);
    //创建保持连接的worker,3分钟一轮询
    this.statusWorker = this.createWorker("statusWorker",function(result,callback){
      _self.get("store").findAll("sysconfig").then(function(sysconfig){
        //每三分钟重置一次服务器时间和当时的系统时间
        _self.set('data_loader.sysconfig.sysTime',sysconfig.get("firstObject").get('sysTime'));
        console.log("sysTime in work:",sysconfig.get("firstObject").get('sysTime'));
        _self.set('data_loader.firstLocalTime',Math.floor(new Date().getTime()/1000));
        callback();
      });
    },{duration:3*60});
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

    //启动状态监控
    Ember.run.later(function(){
      _self.statusWorker.start();
      // _self.mapWorker.start();
    },1000);
  },
  //创建worker
  createWorker: function(workerName,mainProcess,options){
    var _self = this;
    var Worker = Ember.Object.extend(Ember.Evented, {
      workerName: workerName,
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
        console.log("start worker");
        this.isRunning = true;
        this.trigger('start');
        this.run();
      },
      run: function(){
        var that = this;
        this.operative.process(function(result){
          Ember.run.later(that, function() {
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
