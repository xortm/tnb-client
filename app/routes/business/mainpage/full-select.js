import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title: "考核打分",
  queryParams: {
    maxScore: {
      refreshModel: true
    },
    name: {
      refreshModel: true
    },
    assessmentIndicatorId: {
      refreshModel: true
    }
  },
  model(params){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },


});
