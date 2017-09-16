import Ember from 'ember';
import ListItem from '../../ui/mobile/list-item';
import BaseUiItem from '../../ui/base-ui-item';
import InfiniteScroll from '../../../controllers/infinite-scroll';
// import InfiniteComponentBase from './infinite-component-base'; //报错 注释掉了

export default BaseUiItem.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  infiniteContentPropertyName: "nursinglogList",
  infiniteModelName: "nursinglog",
  infiniteContainerName:"nursinglogContainer",
  customerObs: function(){
    var customer = this.get("customer");
    console.log("customer1111",customer);
    if(!customer){return;}//因为观察者执行次数原因第一次会undefined 所以下面get报错，第一次没有就return，下次就有执行下去
    var customerId = this.get("customer").get("id");
    var _self = this;
    // var customerId = this.get("customer").get("id");

    console.log("ynamicsList jinru customer",customerId);
    console.log("warning-management1111",this.get("dateService"));
    var sevenDate = this.get("dateService").getDaysBeforeTimestamp(7);
    var params = {filter:{
      nurscustomer:{id:customerId},
      'recordTime@$gte': sevenDate,
    }};
    var sort = {
      recordTime:"desc",
    };
    params.sort = sort;
    this.infiniteQuery('nursinglog',params).then(function(nursinglogList){
      _self.set("nursinglogList",nursinglogList);
      console.log("set nursinglogList over",nursinglogList);
    });
  }.observes("dynamicsShowFlag","dynamicsShowFlagTrue","customer"),

  refresh:function(customerId){//组件内刷新没有用 此方法废弃 用了switchShowAction customer-detail内的
    console.log('ynamicsList jinru refresh1111',customerId);
    // var customer = this.get("store").peekRecord("customer",customerId);
    // this.set("customer",customer);
    // // this.querydynamicsList();
    // this.incrementProperty("dynamicsShowFlag");
    // console.log("dynamicsShowFlag",this.get("dynamicsShowFlag"),customer);
    // // this.incrementProperty("switchShowFlag");
  },
  actions:{
    theEdit:function(nursinglogId,nursingId){
      console.log("nursinglogId",nursinglogId);
      var itemId = "nosinglog_"+nursinglogId;
      var _self = this;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.sendAction("edit",nursinglogId,_self.get("customer.id"),nursingId);
        },100);
      },200);
    },
    addDynamics:function(){
      var _self = this;
      var itemId = "detail_dynamicsbtn";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.sendAction("addDynamics",_self.get("customer.id"));
        },100);
      },200);
    },

  },

});
