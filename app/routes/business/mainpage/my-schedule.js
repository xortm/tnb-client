import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title:'我的排班',
    model(){
      return {};
    },

  setupController: function(controller,model){
    this._super(controller,model);

    controller.reopen({
    });
  },

});
