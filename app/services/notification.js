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
    this.initSocket();
  },
  initObs: function(){
    console.log("test websocket: initObs hasopen "+this.get('hasOpen') +" hasLogin "+ this.get('service_curStatus.hasLogin'));
    if (this.get('hasOpen') && this.get('service_curStatus.hasLogin')) {
        this.socketLogin();
    }
  }.observes("hasOpen","service_curStatus.hasLogin"),
  //初始化socket
  initSocket(){
    var _self = this;
    var wsAddr = config.socketHost + "/alerm";
    console.log("test websocket: wsAddr:" + wsAddr);
    var socket = new SockJS(wsAddr);
    let new_conn = function() {
        socket = new SockJS(wsAddr);
    };
    console.log("socket",socket);
    socket.onopen = function (e) {
      console.log("test websocket: open  socket");
      _self.myOpenHandler(e);
    };
    socket.onmessage = function (e) {
      _self.myMessageHandler(e);
    };
    socket.onclose = function (e) {
      console.log("test websocket: close  socket");
      _self.myCloseHandler(e);
    };
    this.set('socketRef', socket);
  },
  myOpenHandler(event,str) {
    this.get('socketRef').onheartbeat = function() {
        console.log('test websocket: heartbeat');
    };
    this.set("sockeStr",str);
    this.set("hasOpen",true);
    //充值重连次数
    this.set('reconnectionFlag',0);
    console.log("test websocket: myOpenHandler end");
    //设置连接成功标志，取消
    // this.get("service_curStatus").connectSuc();
  //  this.socketLogin(str);
  },
  socketLogin: function(str){
    //已经登录了，就不再登
    // if(!str&&this.get('service_curStatus.hasLogin')){
    //   return;
    // }
    var curUser = this.get("service_curStatus").getUser();
    console.log("test websocket: check socketLogin hasOpen:" + this.get("hasOpen") + " curuser:",curUser);
    //发送登录token绑定信息
    if(this.get("hasOpen")&&curUser&&curUser.get("token")){
      console.log("test websocket: socketLogin do. token:"+this.get('service_curStatus.curStatus.currentUser.token'));
      var msg = {code:"01",token:curUser.get("token")};
      var message = JSON.stringify(msg);
      this.get('socketRef').send(message);
      //设置登录状态
      this.set("hasLogin",true);
    }
  },
  sendMessage(message){
    this.get('socketRef').send(message);
  },
  myMessageHandler(event) {
    let _self = this;
    var isMobile = this.get("service_curStatus").get('isMobile');
    var curUser = this.get("global_curStatus").getUser();
    var msg = JSON.parse(event.data);
    console.log("msg in no:",msg);
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
      if (this.currentTime === 0){
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
    //需要把连接标志置为否
    this.set("hasOpen",false);
    console.log('test websocket: reconnectionFlag:' + this.get('reconnectionFlag')+" hasopen:"+this.get('hasOpen'));
    if(this.get('reconnectionFlag')<=3){//重连次数限制
      //只有登录以后才重连
      // if(this.get('hasOpen')&&this.get('hasLogin')){
        console.log('test websocket: socket need reconnect');
        _self.incrementProperty('reconnectionFlag');
        Ember.run.later(function(){
          console.log('test websocket: socket reconnect go');
          _self.initSocket();
        },1000);
      // }else{
      //   console.log("test websocket: no open,no reconnect");
      // }
    }else{
      //如果超过了3次还没有连上，则认为网络不通,改为每10秒连一次
      console.log('test websocket: socket need slow reconnect');
      Ember.run.later(function(){
        console.log('test websocket: socket slow reconnect go');
        //设置网络故障状态,取消
        // _self.get("service_curStatus").connectFail();
        _self.initSocket();
      },1000*10);
    }
  },
  //注册收到的提醒通知需要给哪个页面方法处理
  registNoticePage(noticeCall){
    this.set("noticeCall",noticeCall);
  }
});
