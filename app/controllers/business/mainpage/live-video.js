import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  global_curStatus: Ember.inject.service("current-status"),
  dateService:Ember.inject.service('date-service'),
  service_notification:Ember.inject.service("notification"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"liveVideoContainer",
  preventInfinite:true,
  stopScroll: true,
  hasRenderFlag: 0,
  hasDataFlag: 0,
  hasPauseFlag: 0,
  queryFlagInFlag: 0,

  init: function(){
    let _self = this;
    Ember.run.schedule('afterRender',function(){
      // let myPlayer = videojs("my-video");
      // console.log("myPlayer afterRender:",myPlayer);
      // myPlayer.src({
      //   src: 'http://47.104.2.109:81/hls/100384215.m3u8',
      //   // src: 'http://47.104.2.109:81/hls/test.m3u8',
      //   type: 'application/x-mpegURL',
      // });
      // myPlayer.play();
      // _self.hideAllLoading();
      _self.get("service_notification").registNoticePage(function(msgObj){
        if(msgObj.code == '1104'){
          let data = JSON.parse(msgObj.content);
          if(data.success == 1){
            _self.incrementProperty("hasDataFlag");
            _self.set("msgObj",data);
          }
        }
      });
      _self.incrementProperty("hasRenderFlag");
    });
  },
  // 进入页面开始加载视频
  hasRenderObs:function(){
    let _self = this;
    let hasRenderFlag = this.get("hasRenderFlag");
    let queryFlagInFlag = this.get("queryFlagInFlag");
    let hasDataFlag = this.get("hasDataFlag");
    console.log("hasDataFlag:",hasDataFlag);
    console.log("queryFlagInFlag:",queryFlagInFlag);
    console.log("hasRenderFlag:",hasRenderFlag);
    _self._showLoading();
    if(!hasRenderFlag){
      return;
    }
    let myPlayer = videojs("my-video");
    myPlayer.play();
    let curCustomer = _self.get("global_curStatus").getCustomer();
    let curCustomerId = curCustomer.get("id");
    let str = "startLive@cid" + curCustomerId;
    console.log("startLive str:",str);
    _self.get('store').query('device', {
      filter: {
        queryType: str
      }
    }).then(function(deviceList) {
      _self.hideAllLoading();
      _self.directInitScoll(true);
      App.lookup('controller:business.mainpage').showMobileLoading();
    });
  }.observes('hasRenderFlag','queryFlagInFlag').on("init"),
  // socket传数据，开始播放视频
  hasDataObs:function(){
    let _self = this;
    let hasRenderFlag = this.get("hasRenderFlag");
    let hasDataFlag = this.get("hasDataFlag");
    console.log("hasDataFlag:",hasDataFlag);
    console.log("hasRenderFlag:",hasRenderFlag);
    if(!hasDataFlag){
      return;
    }
    let resetVideoSize = function(myPlayer){
        var videoJsBoxWidth = $(".video-js").width();
        var ratio = 1440/900;
        var videoJsBoxHeight = videoJsBoxWidth/ratio;
        console.log("videoJsBoxHeight in resetVideoSize:",videoJsBoxHeight);
        console.log("myPlayer in resetVideoSize:",myPlayer);
        myPlayer.height(videoJsBoxHeight);
    };

    let myPlayer = videojs("my-video");
    myPlayer.ready(function(){
      let myPlayer = this;
      console.log("myPlayer in on:",myPlayer);
      myPlayer.width("100%");
      let msgObj = _self.get("msgObj");
      let cameraId = msgObj.cameraId;
      console.log("cameraId:",cameraId);
      myPlayer.src({
        src: msgObj.showUrl,
        type: 'application/x-mpegURL',
      });
      myPlayer.play();
      resetVideoSize(myPlayer);
      App.lookup('controller:business.mainpage').closeMobileLoading();
      // myPlayer.play();
    });
    $(window).on("resize", function(){
      resetVideoSize(myPlayer);
    });
    // let curCustomer = _self.get("global_curStatus").getCustomer();
    // let curCameraId = curCustomer.get("id");

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

  queryFlagIn(){
    // this.incrementProperty("queryFlagInFlag");
  },

  actions:{
    switchShowAction(){
      console.log("yesdd");
      this.incrementProperty("queryFlagInFlag");
    },
    //激活退回页面的事件处理
    switchBackAction(){
      console.log("hasPauseFlag run");
      this.incrementProperty("hasPauseFlag");
    },

  },

});
