import Ember from 'ember';

/*
 * 创建人:梁慕学
 * 日期:2017-09-01
 * 媒体功能类
 */
export default Ember.Service.extend({
  recordRTC: null,//录制实体


  //摄像头连接成功后的回调
  successCallback(stream,callback) {
    // RecordRTC usage goes here
    let options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    let recordRTC = RecordRTC(stream, options);
    this.set("recordRTC",recordRTC);
    recordRTC.startRecording();
    if(callback){
      callback();
    }
  },
  //录制启动
  startRecord(callback,failCallback){
    let _self = this;
    if(this.get("recordRTC")){
      if(failCallback){
        //不带参数表示正在录制
        failCallback();
      }
    }
    let mediaConstraints = { video: true, audio: true };
    navigator.mediaDevices.getUserMedia(mediaConstraints).
    then(function(stream){
      //成功后开始进行录制
      _self.successCallback(stream,callback);
    }).catch(function(error){
      //失败后进行提示
      console.log("get media fail",error);
      if(failCallback){
        failCallback(error);
      }
    });
  },
  //结束录制
  stopRecord(callback){
    let _self = this;
    let recordRTC = this.get("recordRTC");
    if(!recordRTC){
      return;
    }
    recordRTC.stopRecording(function (audioVideoWebMURL) {
        // video.src = audioVideoWebMURL;
        var recordedBlob = recordRTC.getBlob();
        recordRTC.getDataURL(function(dataURL) {
          if(callback){
            callback();
            _self.set("recordRTC",null);
          }
        });
    });
  },
});
