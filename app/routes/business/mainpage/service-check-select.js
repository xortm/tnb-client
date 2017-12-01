import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title: "检查内容",
  queryParams: {
    strType:{
      refreshModel:true
    },
    serviceCheckId:{
      refreshModel:true
    }
  },
  model(params){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },


});
