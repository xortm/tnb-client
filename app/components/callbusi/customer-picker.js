import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

export default BaseItem.extend({
  classNames: ['customer-picker-head'],
  customerId: null,//已选择老人id
  customerSelected:null,//已选择老人
  queryCusObj:null,//查询条件
  hasAllCusFlag:false,//所有入住老人
  expandMode: false,
  store: Ember.inject.service('store'),
  dataLoader: Ember.inject.service("data-loader"),
  global_curStatus: Ember.inject.service("current-status"),
  init:function(){
    this._super(...arguments);
    var queryCusObj = localStorage.getItem("queryCusObj");
    console.log("queryCusObjlocalStorage",queryCusObj);
    if(queryCusObj){
      queryCusObj = JSON.parse(queryCusObj);
      if(queryCusObj.queryCusFlag=="all"){
        console.log("init queryCusObjlocalStorage");
        this.set("queryCustomer",true);
      }else {
        this.set("queryCustomer",false);
      }
    }
  },
  actions:{
    //展开
    switchExpand(){
      console.log("in switchExpand");
      this.set("expandMode",true);
      var _self = this;
      var hasAllCusFlag = this.get("hasAllCusFlag");
      if(hasAllCusFlag){return;}
      var filter = {
        'customerStatus---1':{'typecode@$or1---1':'customerStatusIn'},
        'customerStatus---2':{'typecode@$or1---2':'customerStatusTry'}
      };
      this.get("store").query("customer",{filter:filter}).then(function(customerList){
          _self.set("allCustomers",customerList);
          _self.set("hasAllCusFlag",true);
      });
      var manObj = this.get("dataLoader").findDict("customerStatusIn");
    },
    //收起
    switchShrink(){
      this.set("expandMode",false);
    },
    //选择某个老人
    choiceCustomer(cid){
      //只需要设置id，即可引发全局customer变化
      this.set("customerId",cid);
      this.send("switchShrink");
    },
    queryCustomer(){
      var queryCustomer = this.get("queryCustomer");
      var queryCusObj = this.get("queryCusObj");
      console.log("queryCusObj beforeif",queryCusObj);
      if(queryCustomer){
        this.set("queryCustomer",false);
        queryCusObj.queryCusFlag = "personal";//false是个人
      }else {
        this.set("queryCustomer",true);
        console.log("queryCusObj queryCusFlag",queryCusObj.queryCusFlag);
        queryCusObj.queryCusFlag = "all";//true 是全部
      }
      console.log("queryCusObj",queryCusObj);
      localStorage.queryCusObj = JSON.stringify(queryCusObj);
      this.get("global_curStatus").set("queryCusFlag",queryCusObj.queryCusFlag);
      this.get("global_curStatus").set("queryCusObj",queryCusObj);

    },
  }
});
