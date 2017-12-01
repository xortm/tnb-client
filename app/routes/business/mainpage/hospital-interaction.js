import Ember from 'ember';
import BaseBusiness from '../base-business';
const {accountType1,accountType2} = Constants;
export default BaseBusiness.extend({
  dateService: Ember.inject.service("date-service"),
  header_title: "院方互动",
  model(){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },
});
