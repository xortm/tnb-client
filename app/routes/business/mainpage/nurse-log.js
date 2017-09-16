import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'护理日志',
  queryParams: {
      dynamicsFlag: {
          refreshModel: true
      },
  },

  setupController: function(controller,model){
    this._super(controller,model);
  },
});
