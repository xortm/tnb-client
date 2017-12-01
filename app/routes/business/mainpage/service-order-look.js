import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'订单查看',
  setupController: function(controller,model){
    this._super(controller,model);
  },
});
