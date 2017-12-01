import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'服务预约',
  setupController: function(controller,model){
    this._super(controller,model);
  },
});
