import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'护理组信息',
  queryParams: {
    teamId: {
      refreshModel: true
    },
  },
  model(){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
    var _self = this;
  },

});
