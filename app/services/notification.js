import Ember from 'ember';
import config from '../config/environment';
import SockJS from 'sockjs';
const {withdrawCash_Succ,withdrawCash_Fail,recharge_Succ,recharge_Fail,bindWechat_Succ,bindWechat_Fail} = Constants;

export default Ember.Service.extend({
  service_curStatus:Ember.inject.service("current-status"),
  global_dataLoader: Ember.inject.service('data-loader'),
  socketRef: null,
  hasOpen: false,
  reconnectionFlag:0,
  voiceEmpty:true,
  init: function() {
    // return;
    var _self = this;
    var wsAddr = config.socketHost + "/alerm";
    console.log("wsAddr:" + wsAddr);
    var socket = new SockJS(wsAddr);
    let new_conn = function() {
        socket = new SockJS(wsAddr);
    };
    console.log("socket",socket);
    socket.onopen = function (e) {
            console.log("open  socket");
      _self.myOpenHandler(e);
    };
    socket.onmessage = function (e) {
      _self.myMessageHandler(e);
    };
    socket.onclose = function (e) {
      console.log("close  socket");
      _self.myCloseHandler(e);
    };
    this.set('socketRef', socket);
  },

  myOpenHandler(event,str) {
    this.set("hasOpen",true);
    this.socketLogin(str);

  },
  socketLogin: function(str){
    //已经登录了，就不再登
    if(!str&&this.get("hasLogin")){
      return;
    }
    var curUser = this.get("service_curStatus").getUser();
    console.log("check socketLogin hasOpen:" + this.get("hasOpen") + " curuser:",curUser);
    //发送登录token绑定信息
    if(this.get("hasOpen")&&curUser&&curUser.get("token")){
      console.log("socketLogin do");
      var msg = {code:"01",token:curUser.get("token")};
      var message = JSON.stringify(msg);
      this.get('socketRef').send(message);
      //设置登录状态
      this.set("hasLogin",true);
    }
  },
  sendMessage(message){
    this.get('socketRef').send(message);
    this.set('reconnectionFlag',0);
  },
  myMessageHandler(event) {
    let _self = this;
    var isMobile = this.get("service_curStatus").get('isMobile');
    var curUser = this.get("global_curStatus").getUser();
    var msg = JSON.parse(event.data);
    //根据注册的页面调用相关方法
    let noticeCall = this.get("noticeCall");
    if(noticeCall){
      noticeCall(msg);
    }
    //预警弹窗声音提示
    if(msg.code=='1102'){
      let bedList = this.get('global_dataLoader.allBedList');
      let isMobileStatus = this.get('global_curStatus.isMobile');
      let data = JSON.parse(msg.content);
      if(data.content=='按键呼叫'){
        if(!isMobileStatus){
          let bed = bedList.findBy('id',Number(data.bedId));
          let bedName = bedList.findBy('id',data.bedId).get('allBedName');
          let str = bedName + ':' + data.customerName + '老人发出呼叫';
          let list = _self.get('global_dataLoader.voiceList');
          list.push(str);
          _self.get('global_dataLoader').set('voiceList',list);
          console.log(list);
          // let voiceList = _self.get('global_dataLoader.voice-list');
          // if(voiceList.length>0){
          //   _self.voice(voiceList[0]);
          // }
          if(_self.get('voiceEmpty')){
            _self.set('voiceEmpty',false);
            _self.voice();
          }

        }

      }
    }
  },
  voice(str){
    let voiceList = this.get('global_dataLoader.voiceList');
    console.log(voiceList[0]);
    if(!str){
      App.lookup("controller:business.mainpage").showAlert(voiceList[0]);
    }else{
      App.lookup("controller:business.mainpage").showAlert(str);
    }
    let _self = this;
    let loopCount = 0;
    let zhText;
    if(!str){
      zhText = encodeURI(voiceList[0]);
    }else{
      zhText = encodeURI(str);
    }
    let audio = document.createElement('audio');
    audio.autoplay = 'autoplay';
    audio.loop = 'loop';
    audio.id = 'warning-audio';
    let source = document.createElement('source');
    source.src = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=3&text=" + zhText ;
    source.type = "audio/mpeg";
    audio.appendChild(source);
    let embed = document.createElement('embed');
    embed.height = 0;
    embed.width = 0;
    embed.src =  "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=3&text=" + zhText ;
    audio.appendChild(embed);
    document.body.appendChild(audio);
    document.getElementById('warning-audio').addEventListener('timeupdate',function(){
      if (this.currentTime == 0){
        ++loopCount;
      }

      if (loopCount == 9)  {
        this.pause();
        let audio = $('#warning-audio');
        audio.remove();
        voiceList.splice(0,1);
        _self.set('global_dataLoader.voiceList',voiceList);
        if(voiceList.length>0){
          _self.voice(voiceList[0]);
        }else{
          _self.set('voiceEmpty',true);
        }
      }
    });
  },
  myCloseHandler(event) {
    let _self = this;
    console.log('reconnectionFlag:',this.get('reconnectionFlag'));
    if(this.get('reconnectionFlag')<4){//重连次数限制
      if(this.get('hasOpen')&&this.get('hasLogin')){
        console.log('socket 重连');
        this.incrementProperty('reconnectionFlag');
        let wsAddr = config.socketHost + "/alerm";
        let socket = new SockJS(wsAddr);
        socket.onopen = function (e) {
                console.log("open  socket");
          _self.myOpenHandler(e,'reconnect');
        };
        socket.onmessage = function (e) {
          _self.myMessageHandler(e);
        };
        socket.onclose = function (e) {
          console.log("close  socket");
          _self.myCloseHandler(e);
        };
        this.set('socketRef', socket);
        console.log('re socket:',socket);
      }
    }

  },
  //注册收到的提醒通知需要给哪个页面方法处理
  registNoticePage(noticeCall){
    this.set("noticeCall",noticeCall);
  }
});
