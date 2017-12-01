import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userMedicineUploadContainer",

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,
  //根据规则拼出完整的url
  defaultImgSrc: Ember.computed('property', function() {
      let picPath = "upload-img.png";
      return this.get("pathConfiger").getJujiaLocalPath(picPath);
  }),
  uploadUrl: Ember.computed('property', function() {
      return this.get("pathConfiger").get("uploadUrl");
  }),
  queryFlagIn: function(){return;},

  actions:{
    uploadSucc: function(response) {
      var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
      var res = JSON.parse(response);
      var picPath = res.relativePath;
      let _self = this;
      console.log("++++res+++++", res);
      var dietObj = this.get("dataLoader").findDict(Constants.schemeType1);
      console.log("dietObj is", dietObj);
      console.log("res.relativePath", res.relativePath);
      var schemeRecord = _self.store.createRecord('schemeRecord', {
           type:dietObj,
           picPath: picPath,
           customer: curCustomer,
      });
      schemeRecord.save().then(function(){
        App.lookup("controller:business").popTorMsg("饮食上传成功!");
        App.lookup('controller:business.mainpage').switchMainPage('healthy-plan-diet');
      });

    },




  },

});
