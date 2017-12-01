import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  feedBus: Ember.inject.service("feed-bus"),
  header_title: "评分详情",
  queryParams: {
      customerId: {
          refreshModel: true
      },
      employeeId: {
          refreshModel: true
      },
      source: {
          refreshModel: true
      },
      itemIdFlag: {
          refreshModel: true
      },
  },

  model:function(){
    return {};
  },
  headerTitle(){
    var controller = this.getCurrentController();
    var itemIdFlag = controller.get("itemIdFlag");
    this.set("itemIdFlag",itemIdFlag);
  },
  headerTitleObs:function(){
    let controller = this.getCurrentController();
    let item = controller.get("item");
    let source = controller.get("source");
    let header_title;
    if(source == "customerFlag"){
      let customerName = item.get("appraiseResult.appraiseCustomer.name");
      header_title = customerName + "老人评分详情";
    }else if(source == "employeeFlag"){
      let employeeName = item.get("appraiseResult.employee.name");
      header_title = employeeName + "员工评分详情";
    }
    this.set('header_title',header_title);
  }.observes("itemIdFlag"),
  setupController:function(controller,model){
    this._super(controller,model);
    this.headerTitle();
  },
});
