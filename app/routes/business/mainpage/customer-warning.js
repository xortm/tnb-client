import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'消息通知',
  queryParams: {
      customerListFlag: {
          refreshModel: true
      },
  },

  setupController: function(controller,model){
    this._super(controller,model);
  },
});
