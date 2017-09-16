import Ember from 'ember';
import BaseController from './base-controller';

export default BaseController.extend({
    constants: Constants,
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    actions:{
      dietClick(dietParams) {
          if (dietParams) {
            this.set("dietParams", true);
            this.set("sportsParams", false);
            this.set("medicationParams", false);
          }
      },
      sportsClick(sportsParams) {
          if (sportsParams) {
            this.set("dietParams", false);
            this.set("sportsParams", true);
            this.set("medicationParams", false);
          }
      },
      medicationClick(medicationParams) {
          if (medicationParams) {
            this.set("dietParams", false);
            this.set("sportsParams", false);
            this.set("medicationParams", true);
          }
      },
      //查询条件：通过活动来查询
      selectCustomer(customer){
        if(customer){
          console.log("customer in controller:",customer);
          this.set('customer',customer);
          this.set('customerId',customer.get('id'));
        }else {
          this.set('customer',null);
          this.set('customerId',null);
        }
        App.lookup("route:business.mainpage.scheme-implementation").doQuery();
      },
      toBlownUp(diet){
        let picPathUrl = diet.get("picPathUrl");
        console.log("picPathUrl:",picPathUrl);
      },


    }
});
