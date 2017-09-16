import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  feedBus: Ember.inject.service("feed-bus"),
  header_title: "评分详情",
  queryParams: {
      customerId: {
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
    var customerId = controller.get("customerId");
    this.set("customerId",customerId);
  },
  headerTitleObs:function(){
    var controller = this.getCurrentController();
    var customerItem = controller.get("customerItem");
    let customerName = customerItem.get("appraiseResult.appraiseCustomer.name");
    let header_title = customerName + "老人评分详情";
    this.set('header_title',header_title);
  }.observes("customerId"),
  setupController:function(controller,model){
    this._super(controller,model);
    this.headerTitle();
  },
});
