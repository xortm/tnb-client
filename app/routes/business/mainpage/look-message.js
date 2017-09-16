import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
    messageDetailType: {
      refreshModel: true
    }
  },
  //header_title:"消息详情",
  //刷新界面

  model(){
    console.log("model11111111111");
    //return this.doQuery();
    return;
  },
  theName:function(){
    var _self = this;
    var controller = this.getCurrentController();
    var messageDetailType = controller.get("messageDetailType");
    var showStr = "";
    if(messageDetailType==1){
      showStr = "预警提醒";
    }
    if(messageDetailType==2){
      showStr = "缴费提醒";
    }
    if(messageDetailType==3){
      showStr = "签到提醒";
    }
    if(messageDetailType==4){
      showStr = "服务提醒";
    }
    if(messageDetailType==7){
      showStr = "健康数据提醒";
    }
    console.log("showStr111",showStr);
    _self.set("header_title",showStr);
    // this.store.findRecord("user",controller.get("fromUser_id")).then(function(name){
    //    _self.set("header_title",name.get("name"));
    //    console.log("header_title",name.get("name"));
    // });
  },

  doQuery:function(){
    var controller = this.getCurrentController();
    this.get("global_ajaxCall").set("action","");
    var params = this.buildQueryParams();
    controller.infiniteQuery('message',params);
    // this.findPaged('message',params).then(function(lookMessage){
    //   console.log("message1111",lookMessage);
    //   controller.set('lookMessage2',lookMessage);
    //   //return lookMessage;
    // });// 一用findPaged 就是Promise 不是class
    //var lookMessage = this.store.query("message",{filter:params.filter,sort:{createTime:"desc"}});
    //return lookMessage;
  },
  buildQueryParams:function(){
    var curController = this.getCurrentController();
    var messageDetailType = curController.get("messageDetailType");
    //var fromUserId = this.get("fromUser_id");
    var params = {};
    var curUser = this.get('global_curStatus').getUser();
    var filter = {
      // 'toUser---1':{'id@$or2---1':curUser.get("id")},
      // 'fromUser---1':{'id@$or1---2':fromUserId},
      // 'toUser---2':{'id@$or1---1':fromUserId},
      // 'fromUser---2':{'id@$or2---2':curUser.get("id")},
      toUser:{id:curUser.get("id")},
      detailType:messageDetailType,
      type:2,
    };
    var sort = {createTime:"desc"};
    params.sort = sort;
    params.filter = filter;
    console.log("params is:",params);
    return params;
  },

  //设置controller信息，不再单独建立controller文件
  setupController:function(controller,model){
    this._super(controller,model);
    // this.defineController(controller,model);
    console.log("controller in",controller);
    //var lookMessage = this.get("lookMessage2");
    // this.doQuery();
    // this.theName();
  },


  actions:{
    saveRefresh: function() {
      this.refresh();
    },
    //"发送"按钮
    sendMessage: function(){
      var that = this;
      var controller = this.getCurrentController();
      var curUser = this.get("global_curStatus").getUser();
      var content = controller.get("content");
      console.log("haha",content);
      var message = this.store.createRecord('message',{});
      if (content&& content.replace(/\s+/,'')) {
        this.store.findRecord("user",curUser.get("id")).then(function(fromUser){
          message.set('fromUser',fromUser);
          console.log("curUserformUser",fromUser);
          that.store.findRecord("user",controller.get("fromUser_id")).then(function(toUser){
            message.set('toUser',toUser);
            console.log("curUserformUser",toUser);
            message.set('type',"1");
            message.set('hasRead',"0");
            console.log("save1111111",message);
            message.set('content',content);
            //message.set('business',"messageMail")
            message.save().then(function() {
              controller.set("content","");
              //that.refresh();
              var messageMailAll = that.doQuery();
              controller.set("messageMailAll",messageMailAll);
            });
          });
        });

      }
    },

  },
});
