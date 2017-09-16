import Ember from 'ember';
import Changeset from 'ember-changeset';
import TradeValidations from '../../../validations/evaluation-report';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend({
  reportModel:Ember.computed('report',function(){
    let model = this.get("report");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(TradeValidations), TradeValidations);
  }),
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  dataLoader: Ember.inject.service("data-loader"),
  actions:{
    invalid() {
    },
    saveAction:function(report){
      var _self = this;
      var reportModel = this.get("reportModel");
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
                      mainpageController.switchMainPage('evaluation-report');
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
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除评估报告", function() {
          App.lookup('controller:business.mainpage').openPopTip("正在删除");
          var reportModel=self.get("reportModel");
          reportModel.set("delStatus",1);
          reportModel.save().then(
            function(){
              App.lookup('controller:business.mainpage').showPopTip("删除成功");
              App.lookup('route:business.mainpage.evaluation-report').refresh();
              App.lookup('controller:business.mainpage').switchMainPage('evaluation-report');
            }
          );
      });
    },
    editAction:function(){
      this.set("detailEdit",true);
    },
    //取消
    detailCancel:function(){
     App.lookup('controller:business.mainpage').switchMainPage('evaluation-report');
    },
    changeCreateTime:function(date) {
        console.log("date is who", date);
        var stamp = this.get("dateService").timeToTimestamp(date);
        this.set("reportModel.createDateTime", stamp);
    },
    customerSelect:function(customer){
      console.log(customer.get("name"));
      this.set("reportModel.customer",customer);
   }
  },
  doSave:function(report,isDelete){
  },
  doNothing:function(){
  }
});
