import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

export default BaseItem.extend({
  classNames: ['customer-picker-head'],
  serveCustomerId: null,//已选择老人id
  // customerSelected:null,//已选择老人
  queryCusObj:null,//查询条件
  hasAllCusFlag:false,//所有入住老人
  // expandMode: false,
  isExpandFlag: false,//是否第一次展开标志
  isExpand: 0,//是否第一次展开
  isExpandMode: false,//设置显示隐藏
  queryCustomer: false,//是否显示全部老人
  store: Ember.inject.service('store'),
  dataLoader: Ember.inject.service("data-loader"),
  global_curStatus: Ember.inject.service("current-status"),
  allSrc: "./assets/images/icon/all1.png",
  //根据页面设置已选择老人或者员工
  listSelectedEnd: Ember.computed('isSquare','serveCustomerSelected','healtyCustomerSelected','logCustomerSelected','attendanceEmployeeSelected', function() {
    var isSquare = this.get("isSquare");
    console.log("isSquare in customerSelecter:",isSquare);
    var serveCustomerSelected = this.get("serveCustomerSelected");
    var healtyCustomerSelected = this.get("healtyCustomerSelected");
    var logCustomerSelected = this.get("logCustomerSelected");
    var attendanceEmployeeSelected = this.get("attendanceEmployeeSelected");
    if(isSquare == 7){
      return serveCustomerSelected;
    }
    if(isSquare == 9){
      return healtyCustomerSelected;
    }
    if(isSquare == 10){
      return logCustomerSelected;
    }
    if(isSquare == 12){
      return attendanceEmployeeSelected;
    }
  }),
  initObs:function(){
    // this._super(...arguments);
    var isSquare = this.get("isSquare");
    console.log("isSquare in init:",isSquare);
    if(isSquare == 7){
      var serveCustomerId = localStorage.getItem("serveCustomerId");
      console.log("serveCustomerIdlocalStorage",serveCustomerId);
      if(serveCustomerId){
        // queryCusObj = JSON.parse(queryCusObj);
        if(serveCustomerId=="all"){
          console.log("init serveCustomerIdlocalStorage");
          this.set("queryCustomer",true);
        }else {
          this.set("queryCustomer",false);
        }
      }
    }else if(isSquare == 12){
      let attendanceEmployeeId = this.get("global_curStatus.attendanceEmployeeId");
      if(attendanceEmployeeId=="all"){
        console.log("init serveCustomerIdlocalStorage");
        this.set("queryCustomer",true);
      }else {
        this.set("queryCustomer",false);
      }
    }else{
      this.set("queryCustomer",false);
    }
  }.observes("isSquare").on("init"),
  actions:{
    switchExpand(){
      console.log("in switchExpand");
      var _self = this;
      _self.set("isExpandMode",true);
      if(!this.get("isExpandFlag")){
        this.set("isExpand",1);
        this.set("isExpandFlag",true);
      }else{
        this.set("isExpand",2);
      }
      // this.set("expandMode",true);
      // var hasAllCusFlag = this.get("hasAllCusFlag");
      // if(hasAllCusFlag){return;}
      // var filter = {
      //   'customerStatus---1':{'typecode@$or1---1':'customerStatusIn'},
      //   'customerStatus---2':{'typecode@$or1---2':'customerStatusTry'}
      // };
      // // var sort = {
      // //   name: 'asc',
      // // };
      // this.get("store").query("customer",{filter:filter}).then(function(customerList){
      //     _self.set("allCustomers",customerList);
      //     console.log("allCustomers",customerList);
      //     _self.set("hasAllCusFlag",true);
      // });
      // var manObj = this.get("dataLoader").findDict("customerStatusIn");
      // this.set("isExpandFlag",true);
    },
    //收起
    switchShrink(){
      this.set("isExpandMode",false);
      if(this.get("isExpandFlag")){
        this.set("isExpand",2);
      }
      // this.set("expandMode",false);
    },
    //选择某个老人
    choiceCustomer(cid,leaveStatus){
      console.log('choiceCustomer in customer-selecter');
      let _self = this;
      // var queryCustomer = this.get("queryCustomer");
      let isSquare = this.get("isSquare");
      if(cid == "ALL"){
        this.set("queryCustomer",true);
        if(isSquare == 12){
          this.set("attendanceEmployeeId","all");
        }else if(isSquare == 7){
          let queryCusObj = _self.get("queryCusObj");
          console.log("queryCusObj in choiceCustomer:",queryCusObj);
          queryCusObj.queryCusFlag = "all";
          _self.set("serveCustomerId","all");
          console.log("queryCusObj",queryCusObj);
          console.log("queryCusObj queryCusFlag",queryCusObj.queryCusFlag);
          localStorage.queryCusObj = JSON.stringify(queryCusObj);
          _self.get("global_curStatus").set("queryCusFlag",queryCusObj.queryCusFlag);
          _self.get("global_curStatus").set("queryCusObj",queryCusObj);
        }
      }else{
        //只需要设置id，即可引发全局customer变化
        if(isSquare == 7){
          if(leaveStatus == 1){
            return;
          }
          let queryCusObj = _self.get("queryCusObj");
          console.log("queryCusObj in choiceCustomer:",queryCusObj);
          queryCusObj.queryCusFlag = "personal";
          _self.set("serveCustomerId",cid);
          console.log("queryCusObj",queryCusObj);
          console.log("queryCusObj queryCusFlag",queryCusObj.queryCusFlag);
          localStorage.queryCusObj = JSON.stringify(queryCusObj);
          _self.get("global_curStatus").set("queryCusFlag",queryCusObj.queryCusFlag);
          _self.get("global_curStatus").set("queryCusObj",queryCusObj);
        }
        if(isSquare == 9){
          this.set("healtyCustomerId",cid);
        }
        if(isSquare == 10){
          this.set("logCustomerId",cid);
        }
        if(isSquare == 12){
          this.set('global_curStatus.timeSearch',false);
          this.set("attendanceEmployeeId",cid);

        }
        if(isSquare == 15){
          this.set('evaluateCustomerId',cid);
        }
        this.set("queryCustomer",false);
      }
    },



  }
});
