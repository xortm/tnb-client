import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"customerFeedbackContainer",
  preventInfinite:true,

  moment: Ember.inject.service(),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,
  init:function(){
    this.hideAllLoading();
  },
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

  actions:{
    feedBackTypeOrgSelect: function(dict) {
        this.set("feedBackTypeOrg", dict);
        // this.set('sportType', dict);
        console.log("feedBackTypeOrg dict111",dict);
    },
    saveItem: function(){
      let _self = this;
      var curUser = _self.get("global_curStatus").getUser();
      console.log("curUser in:", curUser);
      var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
      console.log("curCustomer in:", curCustomer);
      var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
      var feedbackContents = this.get('feedbackContents');
      console.log("feedbackContents",feedbackContents);
      var telephoneNum = this.get('telephoneNum');
      console.log("telephoneNum",telephoneNum);
      // var feedBackTypeOrg = this.get("feedBackTypeOrg");
      // console.log("feedBackTypeOrg",feedBackTypeOrg);
      this.set('tipInfo', "");
      // if ('undefined' === typeof(feedBackTypeOrg) || '' === feedBackTypeOrg) {
      //   App.lookup("controller:business").popTorMsg("反馈事项不能为空!");
      //     // this.set('tipInfo', "反馈事项不能为空");
      //     return ;
      // }
      if ('undefined' === typeof(feedbackContents) || '' === feedbackContents) {
        // App.lookup("controller:business").popTorMsg("反馈内容不能为空!");
          this.set('tipInfo', "反馈内容不能为空");
          return ;
      }
      if ('undefined' !== typeof(feedbackContents) && '' !== feedbackContents && this.dataLength(feedbackContents) >600) {
        // App.lookup("controller:business").popTorMsg("反馈内容不能超过800字!");
          this.set('tipInfo', "反馈内容不能超过300字");
          return ;
      }
      this.set('tipInfo', "");
      // this.store.findRecord('customer',curCustomerId).then(function(customer){
        var feedback = _self.store.createRecord('feedback',{
          // type:feedBackTypeOrg,
          contents:feedbackContents,
          customer:curCustomer,
          user:curUser,
          telephone:telephoneNum,
        });
        feedback.save().then(function(){
          App.lookup("controller:business").popTorMsg("提交成功!");
          App.lookup('controller:business.mainpage').switchMainPage('accounts-message');
        });
      // });
      //  清空页面的input输入框
      this.set('feedbackContents', "");
      this.set('telephoneNum', "");
    },

  },

});
