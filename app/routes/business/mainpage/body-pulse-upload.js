import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  model(){
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);
     var _self = this;
  },

});
