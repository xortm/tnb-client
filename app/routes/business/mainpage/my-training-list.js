import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'培训列表',
  queryParams: {
    trainingId: {
      refreshModel: true
    },
  },
  model(){
    console.log("member-notice model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },

});
