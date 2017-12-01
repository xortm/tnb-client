import Ember from 'ember';
import BaseBusiness from '../base-business';
const {accountType1,accountType2} = Constants;
export default BaseBusiness.extend({
  dateService: Ember.inject.service("date-service"),
  header_title: "服务管理",
  model(){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
    var _self = this;
  },
});
