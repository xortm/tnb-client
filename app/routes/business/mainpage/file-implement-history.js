import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  model(){
    console.log("FileImplement model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },

});
