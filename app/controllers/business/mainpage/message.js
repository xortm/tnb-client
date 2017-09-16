import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "messageNews",
  infiniteModelName: "message",
  infiniteContainerName:"messageContainer",

  actions:{
    toDetailItem:function (messageDetailType) {//toDetailItem check
      console.log("compose,task",messageDetailType);
      var ID = messageDetailType;
      var params = {
        messageDetailType:ID,
      };

      var itemId = "messageItem_"+ ID;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('look-message',params);
        },100);
      },200);

      //清空消息
      this.get("global_ajaxCall").set("action","");
      var curUser =  this.get("global_curStatus").getUser();//'type@$or1---1':1,'type@$or1---2':2,
      this.store.query("message",{filter:{hasRead:0,
      detailType:ID,toUser:{id:curUser.get("id")}}}).then(function(messageList){
        console.log("clear messageList11111 ",messageList);
        messageList.forEach(function(item){
          item.set("hasRead",1);
          item.save().then(function(){
          });
        });
      });
    },

    largen:function (message) {
      console.log("largen in");
      message.toggleProperty("display_extend");
    },
  }
});
