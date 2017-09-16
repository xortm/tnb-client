import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:"全部消息",
  model(){
    console.log("model in message");
    return ;
  },
  doQuery:function(){
    var params = this.buildQueryParams();
    this.get("global_ajaxCall").set("action","messageTypeOne");
    var mail = this.findPaged('message',params);
    this.getCurrentController().set("messageMail",mail);
    console.log("mail",mail);
    return mail;
  },
  buildQueryParams:function(){
    var params = this.pagiParamsSet();
    var curUser = this.get('global_curStatus').getUser();
    var filter = {toUser:{id:curUser.get("id")},type:1};
    // var sort = {createTime:"desc"};
    // params.sort = sort;
    params.filter = filter;
    console.log("params is:",params);
    return params;
  },


  //设置controller信息，不再单独建立controller文件
  setupController:function(controller,model){
    this._super(controller,model);
    this.doQuery();
    this.defineController(controller,model);
    console.log("controller in",controller);
  },
  defineController:function(controller,model){
    controller.reopen({

      actions:{
        sendTheMessage: function (fromId){
          var _self = this;
          this.set('showsendMessageModel',true);
          this.set("fromId",fromId);
          this.store.findRecord("user",fromId).then(function(fromName){
            _self.set("fromName",fromName.get("name"));
          });
        },
        sendMessage:function(){
          var _self = this;
          var userId = this.get("fromId");
          console.log("kefuID",userId);
          var curUser = this.get("global_curStatus").getUser();
          console.log("dangqianID",curUser.get("id"));
          var dialogue = this.get("dialogue");
          console.log("haha",dialogue);
          var message = this.store.createRecord('message',{});
          if (dialogue && dialogue.replace(/\s+/,'')) {
            this.store.findRecord("user",curUser.get("id")).then(function(fromUser){
              message.set('fromUser',fromUser);
              console.log("curUserformUser",fromUser);
              _self.store.findRecord("user",userId).then(function(toUser){
                message.set('toUser',toUser);
                console.log("curUserformUser",toUser);
                message.set('type',"1");
                message.set('hasRead',"0");
                console.log("save1111111",message);
                message.set('content',dialogue);
                message.save().then(function() {
                  _self.set("dialogue","");
                  _self.set('showsendMessageModel',false);
                });
              });
            });
          }
        },
        //关闭发送消息弹窗
        cancelSubmit:function(){
          this.set('showsendMessageModel',false);
        },
        //刷新界面
        saveRefresh: function() {
          this.refresh();
        },
        //查看对话并回复 会把未读的标记为已读
        compose:function(mail){
          console.log("compose,task",mail);
          var ID = mail;
          var params = {
            fromUser_id:ID,
          };
          // this.transitionToRoute("/business/mainpage/task-detail/"+tid+"/2");
          var mainpageController = App.lookup('controller:business.mainpage');
          //mainpageController.switchMainPage('task-detail',params);
          mainpageController.switchMainPage('view-news',params);

          this.get("global_ajaxCall").set("action","");
          var curUser =  this.get("global_curStatus").getUser();
          this.store.query("message",{filter:{hasRead:0,type:1,fromUser:{id:ID},toUser:{id:curUser.get("id")}}}).then(function(messageList){
            console.log("clear messageList ",messageList);
            messageList.forEach(function(item){
              item.set("hasRead",1);
              item.save().then(function(){
                  //_self.get('target').send('saveRefresh');
                  mainpageController.MessageNoticeCheck2();
              });
            });
          });

        },

      }
    });
  }

});
