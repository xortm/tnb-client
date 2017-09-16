import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title: "任务详情",
  model:function(){
    return {};
  },
  setupController:function(controller,model){
    this._super(controller,model);
  },
});
