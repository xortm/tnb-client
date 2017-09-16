import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  queryParams: {
      customerId: {
          refreshModel: true
      },
  },
  dateService: Ember.inject.service("date-service"),
  header_title: "充值确认",
  model(){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
    var customerId = controller.get("customerId");
  },
});
