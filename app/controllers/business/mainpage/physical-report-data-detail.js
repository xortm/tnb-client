import Ember from 'ember';
import Changeset from 'ember-changeset';
import TradeValidations from '../../../validations/physical-report';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend({
  constants: Constants,
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  pathConfiger: Ember.inject.service("path-configer"),
  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  reportObs: function() {
      var model = this.get("report");
      console.log("model report", model);
      if (!model) {
          return null;
      }
      var reportModel = new Changeset(model, lookupValidator(TradeValidations), TradeValidations);
      this.set("reportModel", reportModel);
  }.observes("report"),
  actions:{
    invalid() {
    },
    saveAction:function(report){
      var _self = this;
      var reportModel = this.get("reportModel");
      console.log("reportModel picPath:",reportModel.get("picPath"));
      var mainpageController = App.lookup('controller:business.mainpage');
      var editMode = this.get('editMode');
      var id = this.get('id');
      reportModel.validate().then(function() {
          if (reportModel.get('errors.length') === 0) {
              App.lookup('controller:business.mainpage').openPopTip("正在保存");
              reportModel.save().then(function() {
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  if (id) {
                      _self.set('detailEdit', false);
                  } else {
                      mainpageController.switchMainPage('physical-report-data');
                      _self.set('detailEdit', false);
                  }
              });
          } else {
              reportModel.set("validFlag", Math.random());
          }
      });
    },
    deleteAction:function(report){
      var self=this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此体检报告", function() {
          App.lookup('controller:business.mainpage').openPopTip("正在删除");
          var reportModel=self.get("reportModel");
          reportModel.set("delStatus",1);
          reportModel.save().then(
            function(){
              App.lookup('controller:business.mainpage').showPopTip("删除成功");
              App.lookup('route:business.mainpage.physical-report-data').refresh();
              App.lookup('controller:business.mainpage').switchMainPage('physical-report-data');
            }
          );
      });
    },
    editAction:function(){
      this.set("detailEdit",true);
    },
    //取消
    detailCancel:function(){
     App.lookup('controller:business.mainpage').switchMainPage('physical-report-data');
    },
    changeCreateTime:function(date) {
        var stamp = this.get("dateService").timeToTimestamp(date);
        this.set("reportModel.createTime", stamp);
    },
    // 图片上传成功
    uploadSucc:function(response){
      var res = JSON.parse(response);
      var picPath = res.relativePath;
      this.set("reportModel.picPath",picPath);
    },
    customerSelect:function(customer){
      this.set("reportModel.customer",customer);
   }
  },
  doSave:function(report,isDelete){
  },
  doNothing:function(){

  }
});
