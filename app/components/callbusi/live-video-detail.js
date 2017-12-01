import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service("store"),
  statusService: Ember.inject.service("current-status"),
  global_curStatus: Ember.inject.service("current-status"),
  service_notification:Ember.inject.service("notification"),
  hasDataFlag:0,
  videoBoxBig:true,
  // showBoxFirstFlag:false,//是否第一次显示此组件
  isShowVideoDetail:false,//PC视频直播全局的弹框 显示标志位
  resetVideoSize(myPlayer){
      // var videoJsBoxWidth = $(".video-js-pc").width();
      var videoJsBoxWidth = $(window).width();
      var ratio = 1440/800;
      // var ratio = 1440/900;
      var videoJsBoxHeight = videoJsBoxWidth/ratio/2;
      console.log("videoJsBoxHeight in:",videoJsBoxHeight);
      if(myPlayer){
        myPlayer.height(videoJsBoxHeight);
      }else{
        $(".video-js-pc").height(videoJsBoxHeight);
      }
  },
  resetPlay(myPlayer,cameraId){
    myPlayer.play();
    let curDevice;
    this.get("deviceObj").forEach(function(item){
      if(item.get("deviceId") == cameraId){
        curDevice = item;
      }
    });
    curDevice.set("hasConnectFlag",true);
  },
  init: function(){
    let _self = this;
    this._super(...arguments);
    let socketObjList = new Ember.A();
    this.set("socketObjList",socketObjList);
    let maxDeviceNumber = _self.get("global_curStatus.maxDeviceNumber");
    let maxDeviceList = new Ember.A();
    let num = 0;
    while (num < maxDeviceNumber) {
      let item = Ember.Object.create({
        videoId:"video-" + num,
        device:null,
      });
      maxDeviceList.pushObject(item);
      num++;
    }
    this.set("maxDeviceList",maxDeviceList);
  },

  didInsertElement:function(){
    let _self = this;
    _self.resetVideoSize();
    $(window).on("resize", function(){
      _self.resetVideoSize();
    });
    _self.get("service_notification").registNoticePage(function(msgObj){
      //socket筛选
      if(msgObj.code == '1104'){
        let data = JSON.parse(msgObj.content);
        if(data.success == 1){
          _self.hasDataFun(data,false);
          // _self.incrementProperty("hasDataFlag");
        }
      }
    });
    let maxDeviceList = _self.get("maxDeviceList");
    maxDeviceList.forEach(function(item){
      let videoId = item.get("videoId");
      let myPlayer = videojs(videoId);
      item.set("videoJsObj",myPlayer);
    });
  },
  // socket传数据，开始播放视频
  hasDataFun(msgObj,flag){
    let _self = this;
    console.log("msgObj in hasDataFun:",msgObj);
    let cameraId = msgObj.cameraId;
    console.log("msgObj.cameraId:",msgObj.cameraId);
    console.log("deviceObj:",_self.get("deviceObj"));
    let myPlayer;
    let maxDeviceList = _self.get("maxDeviceList");
    maxDeviceList.forEach(function(item){
      let deviceId = item.get("device.deviceId");
      if(deviceId == cameraId){
        myPlayer = item.get("videoJsObj");
      }
    });
    myPlayer.ready(function(){
      let myPlayer = this;
      console.log("myPlayer in on:",myPlayer);
      Ember.run.later(function(){
        myPlayer.src({
          src: msgObj.showUrl,
          type: 'application/x-mpegURL',
        });
        _self.resetVideoSize(myPlayer);
        try{
          _self.resetPlay(myPlayer,cameraId);
        }catch(e){
          console.log("play fail",e);
          myPlayer.pause();
          Ember.run.later(function(){
            _self.resetPlay(myPlayer,cameraId);
          },2000);
        }
      },5000);
    });
    if(!flag){
      let dataItem = Ember.Object.create({
        showUrl:msgObj.showUrl,
        cameraId:msgObj.cameraId
      });
      let socketObjList = _self.get("socketObjList");
      socketObjList.pushObject(dataItem);
    }

  },
  // socket传数据，开始播放视频
  closeVideoFun(deviceIdStr){
    let _self = this;
    _self.get('store').query('device', {
      filter: {
        queryType: deviceIdStr
      }
    }).then(function(deviceList) {
    });

  },

  deviceObjObs:function(){
    let _self = this;
    console.log("deviceObjFlag before:",this.get("deviceObjFlag"));
    if(!this.get("deviceObjFlag")){
      return ;
    }
    let maxDeviceList = _self.get("maxDeviceList");
    maxDeviceList.forEach(function(item){
      item.set("device",null);
    });
    let deviceObj = this.get("deviceObj");
    console.log("deviceObj:",deviceObj);
    let length = deviceObj.get("length");
    console.log("length:",length);
    _self.send("switchVideoBoxToBig");
    // Ember.run.later(function(){
    //   _self.resetVideoSize();
    // },500);
    let deviceIdStr = "startLive@did";
    let socketObjList = _self.get("socketObjList");
    console.log("socketObjList in query:",socketObjList);
    if(!socketObjList.get("length")){
      deviceObj.forEach(function(device){
        // device.set("hasConnectFlag",false);
        deviceIdStr += device.get("deviceId") + ",";
      });
      console.log("deviceIdStr11:",deviceIdStr);
    }else{
      deviceObj.forEach(function(device){
        var socketObj = socketObjList.findBy("cameraId",device.get("deviceId"));
        // var socketObj = socketObjList.filter(function(socketObj) {
        //   return socketObj.cameraId === device.get("deviceId");
        // });
        // let socketObj = socketObjList.findBy("cameraId",device.get("deviceId"));
        // device.set("hasConnectFlag",false);
        if(!socketObj){
          deviceIdStr += device.get("deviceId") + ",";
        }else{
          _self.hasDataFun(socketObj,true);
        }
      });
      console.log("deviceIdStr22:",deviceIdStr);
      socketObjList.forEach(function(socketObj){
        let device = deviceObj.findBy("deviceId",socketObj.get("cameraId"));
        if(!device){
          socketObjList.removeObject(socketObj);
        }else{
          return;
        }
      });

    }
    let k = 0;
    deviceObj.forEach(function(device){
      maxDeviceList.objectAt(k).set("device",device);
      k++;
    });
    console.log("maxDeviceList after:",maxDeviceList);
    deviceIdStr = deviceIdStr.substr(0,deviceIdStr.length-1);
    _self.get('store').query('device', {
      filter: {
        queryType: deviceIdStr
      }
    }).then(function(deviceList) {
    });
    // let videoList = new Ember.A();
    // deviceObj.forEach(function(device){
    //   let item = Ember.Object.create({
    //     deviceId:device.get("deviceId"),
    //     url:"",
    //     device:device,
    //   });
    //   videoList.pushObject(item);
    // });
    // console.log("videoList in obs:",videoList);



  }.observes('deviceObjFlag').on("init"),
  actions:{
    closeVideoBox(maxDevice){
      let _self = this;
      console.log("closeVideoBox in com");
      let deviceId = maxDevice.get("device.deviceId");
      let deviceIdStr = "endLive@did" + deviceId;
      this.closeVideoFun(deviceIdStr);
      let deviceObj = this.get("deviceObj");
      maxDevice.get("device").set("hasSelected",false);
      deviceObj.removeObject(maxDevice.get("device"));
      maxDevice.set("device",null);
      // if(deviceObj.get("length") == 1){
      //   console.log("run in 1");
      //   Ember.run.later(function(){
      //     _self.resetVideoSize();
      //   },300);
      // }
      if(!deviceObj.get("length")){
        this.set("isShowVideoDetail",false);
      }
    },
    closeAllVideoBox(){
      let _self = this;
      console.log("closeAllVideoBox in com");
      let deviceIdStr = "endLive@did";
      let deviceObj = this.get("deviceObj");
      console.log("deviceObj in close:",deviceObj);
      deviceObj.forEach(function(device){
        deviceIdStr += device.get("deviceId") + ",";
        device.set("hasSelected",false);
        // deviceObj.removeObject(device);
      });
      deviceIdStr = deviceIdStr.substr(0,deviceIdStr.length-1);
      this.closeVideoFun(deviceIdStr);
      // this.set("deviceObj",null);
      let maxDeviceList = _self.get("maxDeviceList");
      maxDeviceList.forEach(function(item){
        item.set("device",null);
      });
      this.set("isShowVideoDetail",false);
    },
    switchVideoBoxToSmall(){
      console.log("switchVideoBoxToSmall in com");
      this.set("videoBoxBig",false);
      console.log("videoBoxBig:",this.get("videoBoxBig"));
    },
    switchVideoBoxToBig(){
      let _self = this;
      console.log("switchVideoBoxToBig in com");
      this.set("videoBoxBig",true);
      // Ember.run.later(function(){
      //   _self.resetVideoSize();
      // },300);
    },

  }
});
