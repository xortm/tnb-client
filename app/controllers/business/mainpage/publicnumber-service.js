import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  feedBus: Ember.inject.service("feed-bus"),
  store: Ember.inject.service("store"),
  statusService: Ember.inject.service("current-status"),

  infiniteContentPropertyName: "serviceexeList",
  infiniteModelName: "serviceexe",
  infiniteContainerName:"publicnumberServiceContainer",
  "page[size]": 10,
  constants:Constants,
  //查询标志的观察者
  queryObs: function(){
    let _self = this;
    _self._showLoading();
    var commonInitHasCompleteFlag = this.get("global_curStatus.commonInitHasCompleteFlag");
    console.log("queryObs run commonInitHasCompleteFlag",commonInitHasCompleteFlag);
    let curCustomer = this.get("statusService").getCustomer();
    console.log("curCustomer in public",curCustomer);
    if(!commonInitHasCompleteFlag||!curCustomer||!curCustomer.get("id")){
      return;
    }
    var customerId = curCustomer.get("id");
    // var filter = {customerId:customerId};
    this.infiniteQuery('serviceexe',{filter:{'flagQueryType':customerId}});

  }.observes("global_curStatus.commonInitHasCompleteFlag","statusService.curStatus.currentCustomer").on("init"),

});
