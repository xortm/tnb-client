import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'任务详情',
  queryParams: {
      itemIdFlag: {
          refreshModel: true
      },
  },
  model:function(){
    return {};
  },
  setupController: function(controller,model){
    console.log('come route');
    this._super(controller,model);
    controller.incrementProperty("serviceItemChangeFlag");
  },
});
