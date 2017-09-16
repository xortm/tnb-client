import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "lookMessage",
  infiniteModelName: "message",
  infiniteContainerName:"lookMessageContainer",
  //当前登陆人
  theSelf:Ember.computed(function () {
    var curUser = this.get('global_curStatus').getUser();
    return curUser.get("id");
  }),

  //图标样式
  iconClass:Ember.computed("messageDetailType",function(){
    var messageDetailType = this.get("messageDetailType");
    var showStr = "";
    if(messageDetailType==1){
      showStr = "fa-warning";
    }
    if(messageDetailType==2){
      showStr = "fa-credit-card";
    }
    if(messageDetailType==3){
      showStr = "fa-sign-in";
    }
    if(messageDetailType==4){
      showStr = "fa-wheelchair";
    }
    if(messageDetailType==7){
      showStr = "fa-heart";
    }
    return showStr;
  }),

  detailTypeObserver:function(){
    var lookMessageR = App.lookup('route:business.mainpage.look-message');
    lookMessageR.theName();
    lookMessageR.doQuery();
  }.observes("messageDetailType"),
});
