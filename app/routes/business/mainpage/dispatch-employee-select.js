import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title: "选择接单员工",
  queryParams: {
    itemId: {
      refreshModel: true
    },
    itemIdFlag: {
      refreshModel: true
    },
   },
  model(params){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },


});
