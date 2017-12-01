import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  store: Ember.inject.service("store"),
  global_curStatus: Ember.inject.service("current-status"),
  dateService:Ember.inject.service('date-service'),
  service_notification:Ember.inject.service("notification"),
  constants: Constants,
  stopScroll: true,
  hasDataFlag: 0,
  hasPauseFlag: 0,
  videoBoxBig:true,
  videoHasDoneFlag:true,
  showBoxFlag:false,//是否显示此组件
  // showBoxFirstFlag:false,//是否第一次显示此组件
  resetVideoSize(myPlayer){
      // var videoJsBoxWidth = $(".video-js-pc").width();
      var videoJsBoxWidth = $(window).width();
      var ratio = 1440/800;
      // var ratio = 1440/900;
      var videoJsBoxHeight = videoJsBoxWidth/ratio;
      console.log("videoJsBoxHeight in:",videoJsBoxHeight);
      if(myPlayer){
        myPlayer.height(videoJsBoxHeight);
      }else{
        $(".video-js-mobile").height(videoJsBoxHeight);
      }
  },

  init: function() {
    let _self = this;
    this._super(...arguments);
    Ember.run.schedule('afterRender',function(){
    });
  },
  didInsertElement:function(){
    let _self = this;
    // 接受socket通知
    _self.resetVideoSize();
    $(window).on("resize", function(){
      _self.resetVideoSize();
    });
    _self.get("service_notification").registNoticePage(function(msgObj){
      if(msgObj.code == '1104'){
        let data = JSON.parse(msgObj.content);
        if(data.success == 1){
          _self.incrementProperty("hasDataFlag");
          _self.set("msgObj",data);
        }
      }
    });
    let myPlayer = videojs("my-video");
    _self.set("myPlayer",myPlayer);
  },
  // 进入页面开始加载视频
  hasRenderObs:function(){
    let _self = this;
    let showBoxFlag = this.get("showBoxFlag");
    console.log("showBoxFlagshowBoxFlag:",showBoxFlag);
    if(!showBoxFlag){
      return;
    }
    // let showBoxFirstFlag = _self.get("showBoxFirstFlag");
    // if(!showBoxFirstFlag){
    //   let myPlayer = videojs("my-video");
    //   _self.set("myPlayer",myPlayer);
    // }
    let curCustomer = _self.get("global_curStatus").getCustomer();
    this.set("customerName",curCustomer.get("name"));
    let curCustomerId = curCustomer.get("id");
    let str = "startLive@cid" + curCustomerId;
    console.log("startLive str:",str);
    _self.get('store').query('device', {
      filter: {
        queryType: str
      }
    }).then(function(deviceList) {
      // App.lookup('controller:business.mainpage').showMobileLoading();
    });
  }.observes('showBoxFlag').on("init"),
  // socket传数据，开始播放视频
  hasDataObs:function(){
    let _self = this;
    let hasDataFlag = this.get("hasDataFlag");
    console.log("hasDataFlag:",hasDataFlag);
    if(!hasDataFlag){
      return;
    }
    let myPlayer = _self.get("myPlayer");
    myPlayer.ready(function(){
      let myPlayer = this;
      console.log("myPlayer in on:",myPlayer);
      myPlayer.width("100%");
      let msgObj = _self.get("msgObj");
      let cameraId = msgObj.cameraId;
      console.log("cameraId:",cameraId);
      Ember.run.later(function(){
        myPlayer.src({
          src: msgObj.showUrl,
          type: 'application/x-mpegURL',
        });
        console.log("run in 2s");
        myPlayer.play();
        _self.set("videoHasDoneFlag",false);
        console.log("videoHasDoneFlag after:",_self.get("videoHasDoneFlag"));
        resetVideoSize(myPlayer);
      },1000);
      // App.lookup('controller:business.mainpage').closeMobileLoading();
      // myPlayer.play();
    });

  }.observes('hasDataFlag').on("init"),
  //暂停时停止推流
  hasPauseObs:function(){
    let _self = this;
    let hasPauseFlag = this.get("hasPauseFlag");
    console.log("hasPauseFlag:",hasPauseFlag);
    if(!hasPauseFlag){
      return;
    }
    let curCustomer = _self.get("global_curStatus").getCustomer();
    let curCustomerId = curCustomer.get("id");
    let str = "endLive@cid" + curCustomerId;
    console.log("endLive str:",str);
    _self.get('store').query('device', {
      filter: {
        queryType: str
      }
    }).then(function(deviceList) {
    });
  }.observes('hasPauseFlag'),



  actions:{
    closeVideoBox(){
      console.log("closeVideoBox in com");
      let myPlayer = this.get("myPlayer");
      myPlayer.pause();
      this.incrementProperty("hasPauseFlag");
      this.set("showBoxFlag",false);
      this.set("videoHasDoneFlag",true);
    },
    switchVideoBoxToSmall(){
      console.log("switchVideoBoxToSmall in com");
      this.set("videoBoxBig",false);
      console.log("videoBoxBig:",this.get("videoBoxBig"));
    },
    switchVideoBoxToBig(){
      console.log("switchVideoBoxToBig in com");
      this.set("videoBoxBig",true);
    },
  }




});
