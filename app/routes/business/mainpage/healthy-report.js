import Ember from 'ember';
import BaseBusiness from '../base-business';

// const {healthExamType9,healthExamType8,healthExamType7} = Constants;
export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
// header_title:'我的',
  model(){
    console.log("HealthyFileCheck model");
    var model = Ember.Object.create({});
    return model;
  },

  setupController: function(controller,model){
    this._super(controller,model);
  },

});
