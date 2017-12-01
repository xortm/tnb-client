import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userMemberFeedbackContainer",

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,
  dataLength: function(fData){
      var intLength=0;
      for (var i=0;i<fData.length;i++){
          if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255)){
              intLength=intLength+2;
            }else{
              intLength=intLength+1;
            }
      }
      return intLength;
  },

  queryFlagIn: function(){
    this.hideAllLoading();
  },
  init:function(){
    this.hideAllLoading();
  },

  actions:{
    feedbackTypeSelect: function(dict) {
        this.set("feedbackType", dict);
        // this.set('sportType', dict);
        console.log("feedbackType dict111",dict);
    },
    saveItem: function(){
      var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
      var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
      let _self = this;
      var feedbackContents = this.get('feedbackContents');
      console.log("feedbackContents",feedbackContents);
      var feedbackType = this.get("feedbackType");
      console.log("feedbackType",feedbackType);
      //this.set('tipInfo', "");
      if ('undefined' === typeof(feedbackType) || '' === feedbackType) {
        App.lookup("controller:business").popTorMsg("反馈事项不能为空!");
          // this.set('tipInfo', "反馈事项不能为空");
          return ;
      }
      if ('undefined' === typeof(feedbackContents) || '' === feedbackContents) {
        App.lookup("controller:business").popTorMsg("反馈内容不能为空!");
          // this.set('tipInfo', "反馈内容不能为空");
          return ;
      }
      if ('undefined' !== typeof(feedbackContents) && '' !== feedbackContents && this.dataLength(feedbackContents) >1600) {
        App.lookup("controller:business").popTorMsg("反馈内容不能超过800字!");
          // this.set('tipInfo', "反馈内容不能超过800字");
          return ;
      }
      this.set('tipInfo', "");
      this.store.findRecord('customer',curCustomerId).then(function(customer){
        var feedback = _self.store.createRecord('feedback',{
          type:feedbackType,
          contents:feedbackContents,
          customer:customer,
        });
        // let feedback = _self.store.createRecord('feedback',{});
        // feedback.set('customer',customer);
        // feedback.set('type',feedbackType);
        // feedback.set('contents',feedbackContents);
        feedback.save().then(function(){
          App.lookup("controller:business").popTorMsg("提交成功!");
          App.lookup('controller:business.mainpage').switchMainPage('jujia-my');
        });
      });
      //  清空页面的input输入框
      this.set('feedbackContents', "");
    },

  },

});
