import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  queryParams: {
    fromUser_id: {
      refreshModel: true
    }
  },
  header_title:"消息详情",
  //刷新界面


  model(){
    console.log("model11111111111");
    return;
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
      var dialogue = controller.get("dialogue");
      console.log("haha",dialogue);
      var message = this.store.createRecord('message',{});
      if (dialogue && dialogue.replace(/\s+/,'')) {
        this.store.findRecord("user",curUser.get("id")).then(function(fromUser){
          message.set('fromUser',fromUser);
          console.log("curUserformUser",fromUser);
          that.store.findRecord("user",controller.get("fromUser_id")).then(function(toUser){
            message.set('toUser',toUser);
            console.log("curUserformUser",toUser);
            message.set('type',"1");
            message.set('hasRead',"0");
            console.log("save1111111",message);
            message.set('content',dialogue);
            //message.set('business',"messageMail")
            message.save().then(function() {
              controller.set("dialogue","");
              //that.refresh();
              var messageMailAll = that.doQuery();
              controller.set("messageMailAll",messageMailAll);
              //that.doQuery();
            });
          });
        });

      }
    },

  },
  doQuery:function(){
    var params = this.buildQueryParams();
    this.get("global_ajaxCall").set("action","");
    var mail = this.findPaged('message',params);
    //this.getCurrentController().set("messageList",message);
    console.log('doQuery mail',mail)
    return mail;
  },
  buildQueryParams:function(){
    var curController = this.getCurrentController();
    var fromUserId = curController.get("fromUser_id");
    console.log("formUseraaaaaaaaaaaaaa",fromUserId);
    var params = this.pagiParamsSet();
    var curUser = this.get('global_curStatus').getUser();
    var filter = {
        'toUser---1':{'id@$or2---1':curUser.get("id")},
        'fromUser---1':{'id@$or1---2':fromUserId},
        'toUser---2':{'id@$or1---1':fromUserId},
        'fromUser---2':{'id@$or2---2':curUser.get("id")},
      //toUser:{id:curUser.get("id")},
      //fromUser:{id:fromUserId},  status:{typecode:Constants.taskApplyStatus_applySuc},
      // 'status---1':{'typecode@$or1---1':Constants.taskStatus_begin},
      // 'status---2':{'typecode@$or1---2':Constants.taskStatus_isPassed},
      type:1
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
    this.defineController(controller,model);
    console.log("controller in",controller);
    var messageMailAll = this.doQuery();
    controller.set("messageMailAll",messageMailAll);
  },
  defineController:function(controller,model){
    controller.reopen({

      findName:function(){
        var _self = this;
        this.store.findRecord("user",controller.get("fromUser_id")).then(function(name){
           _self.set("fromName",name.get("name"));
           console.log("fromName",name.get("name"));
        });
      },
      fromName:Ember.computed(function(){
        this.findName();
      }),
      //当前登陆人
      theSelf:Ember.computed(function () {
        var curUser = this.get('global_curStatus').getUser();
        return curUser.get("id");
      }),

      //显示信息 发送人为当前自己的时候 显示为"我"; 我发送给 接收人  还有时间:当前时间要与昨天的半夜12点比较过了昨天就要显示 日期
      // myself:Ember.computed(function(){
      //   var curUser = this.get("global_curStatus").getUser().id;
      //   var fromUser = this.get("fromUser_id");
      //   console.log("name11111111111",curUser);
      //   console.log("name222222222222",fromUser);
      //   var str = "";
      //   if(fromUser === curUser){
      //     str = "我";
      //   }
      //   else {
      //     str = fromUser.name;
      //   }
      //   return str;
      // }),
      actions:{
        //回上一级页面
        back:function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('view-all');
        },

      }
    });
  }
});
