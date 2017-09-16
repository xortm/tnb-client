import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  model(){
    console.log("healthy-file-test model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },

});
