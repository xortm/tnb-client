import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),

  infiniteContentPropertyName: "theCustomerList",
  infiniteModelName: "customer",
  infiniteContainerName:"theCustomerContainer",
  actions:{
    immediately(customerId){
      console.log("rechargeSure rechargeSure");
    },
  },
});
