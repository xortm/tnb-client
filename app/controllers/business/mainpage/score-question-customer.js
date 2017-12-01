import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

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

  item:Ember.computed("itemIdFlag",function(){
    //从全局上下文服务里拿到外层传递的数据
    this._showLoading();
    let source = this.get("source");
    if(source == "customerFlag"){
      let customerItem = this.get("feedBus").get("customerItemData");
      console.log("customerItem computed:",customerItem);
      this.get("feedBus").set("customerItemData",null);//重置feedbus数据
    //与传参进行比较，一致才设置
      if(customerItem.get("customerId")===this.get("customerId")){
        this.hideAllLoading();
        return customerItem;
      }
    }else if(source == "employeeFlag"){
      let employeeItem = this.get("feedBus").get("employeeItemData");
      console.log("employeeItem computed:",employeeItem);
      this.get("feedBus").set("employeeItemData",null);//重置feedbus数据
    //与传参进行比较，一致才设置
      if(employeeItem.get("employeeId")===this.get("employeeId")){
        this.hideAllLoading();
        return employeeItem;
      }
    }
  }),

  actions:{
    switchShowAction(){
      this.directInitScoll(true);
    },

  }
});
