import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  feedBus: Ember.inject.service("feed-bus"),
  header_title: "任务详情",
  queryParams: {
      itemId: {
          refreshModel: true
      },
      flag: {
          refreshModel: true
      },
      itemIdFlag: {
          refreshModel: true
      },
      taskFlag:{
        refreshModel:true
      }
  },

  model:function(){
    return {};
  },
  setupController:function(controller,model){
    this._super(controller,model);
    console.log("taskFlag in route:",controller.get("taskFlag"));
    //通知进行标签处理
    controller.incrementProperty("serviceItemChangeFlag");
  },
});
