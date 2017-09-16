import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  global_curStatus: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"scoreQuestionCustomerContainer",
  preventInfinite: true,
  customerListFlag: 0,
  constants:Constants,

  uploadUrl: Ember.computed(function() {return this.get("pathConfiger").get("uploadUrl");}),

  customerItem:Ember.computed("customerId","itemIdFlag",function(){
    //从全局上下文服务里拿到外层传递的数据
    this._showLoading();
    let customerItem = this.get("feedBus").get("customerItemData");
    console.log("customerItem computed:",customerItem);
    this.get("feedBus").set("serviceData",null);//重置feedbus数据
  //与传参进行比较，一致才设置
    if(customerItem.get("customerId")===this.get("customerId")){
      this.hideAllLoading();
      return customerItem;
    }
  }),

  actions:{
    switchShowAction(){
      this.directInitScoll(true);
    },

  }
});
