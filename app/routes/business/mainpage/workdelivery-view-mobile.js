import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'交接班信息',
  setupController: function(controller,model){
    this._super(controller,model);
  },
});
