import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  model(){
    console.log("member-notice model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },

});
