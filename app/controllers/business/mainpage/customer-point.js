import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  global_curStatus: Ember.inject.service("current-status"),
  constants: Constants,
  infiniteContentPropertyName: "preferenceList",
  infiniteModelName: "customer-preference",
  infiniteContainerName:"customerPointContainer",
  nocustomerId:false,
  queryFlagInFlag:0,

  customerObs: function(){
    var _self = this;
    _self._showLoading();
    var customerId = this.get("healtyCustomerId");
    console.log("customerId in log",customerId);
    if(!customerId){
      console.log("customerId in log in !",customerId);
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    console.log("ynamicsList in customer",customerId);
    //查询偏好表
    this.store.query('customer-preference',{
      filter:{customer:{id:customerId}}
    }).then(function(itemList){
      console.log('itemList in save:',itemList);
      let list = itemList.sortBy('startNum');
      _self.set('preferenceList',list);
      _self.hideAllLoading();
      _self.directInitScoll(true);
    });
  }.observes("healtyCustomerId","queryFlagInFlag").on("init"),

  queryFlagIn(){
    this.incrementProperty("queryFlagInFlag");
  },

  actions:{
    switchShowAction(){
      this.directInitScoll();
    },

  },

});
