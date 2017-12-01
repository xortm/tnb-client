import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'老人订餐列表',

  setupController: function(controller,model){
    this._super(controller,model);
  },
});
