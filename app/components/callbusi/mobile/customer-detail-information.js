import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
import InfiniteScroll from '../../../controllers/infinite-scroll';

export default BaseUiItem.extend(InfiniteScroll,{
  store: Ember.inject.service("store"),
  infiniteContentPropertyName: "customerDetailInformationList",
  infiniteModelName: "customer",
  infiniteContainerName:"customerDetailInformationContainer",
  // customerObs: function(){
  //   var _self = this;
  //   var customer = this.get("customer");
  //   if(!customer){return;}
  //   console.log("ynamicsList jinru customer",customer);
  //   var customerId = customer.get("id");
  //   console.log("ynamicsList jinru customer",customerId);
  //   var params = {filter:{customer:{id:customerId}}};
  //   var sort = {
  //     lastUpdateDateTime:"desc",
  //     createDateTime:"desc",
  //   };
  //   params.sort = sort;
  //   this.infiniteQuery('customer',params);
  //   this.querydynamicsList();
  // }.observes("switchShowFlag","customer"),

});
