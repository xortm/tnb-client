import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
header_title:'家属信息',
  model(){
    console.log("csinfo model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },

});
