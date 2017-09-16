import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
  header_title: '老人动态',
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  model() {
      return {};
  },
  doQuery: function() {
      var mainpageController = App.lookup('controller:business.mainpage');
      var _self = this;
      var params = this.buildQueryParams();
      var curController = this.getCurrentController();
      this.store.query("customer",params).then(function(customerList){
        console.log("customerList query",customerList);
        curController.set("customerList", customerList);
        $("#datatable1_wrapper .position-relative img.loadingMainShow").css("display","none");
      });
      // var customerList = this.findPaged('customer', params);
      // this.getCurrentController().set("customerList", customerList);
      // console.log('doQuery1 orgList', customerList);
  },
  buildQueryParams: function(str) {
      var params = this.pagiParamsSet();
      var curController = this.getCurrentController();
      let filter;
      filter = {
        'customerStatus---1':{'typecode@$or1---1':'customerStatusIn'},
        'customerStatus---2':{'typecode@$or1---2':'customerStatusTry'}
      };
      params.filter = filter;
      var sort = {
        createTime:"desc"
      };
      params.sort = sort;
      console.log("params is:", params);
      return params;
  },
  queryWarning(){
    let _self = this;
    // var warningNewList = this.getCurrentController().get("warningNewList");//需要 预警未处理的老人(今日)
    var customerList = Ember.A();
    //取得系统时间
    let sysTime = _self.get("dataLoader").getNowTime();
    let date = this.get("dateService").timestampToTime(sysTime);
    let firstSec = this.get("dateService").getFirstSecondStampOfDay(date);//今天第一秒
    this.store.query("hbeaconwarning",{filter:{
      "createDateTime@$gte":firstSec,
    }}).then(function(warningNewList){
      if(warningNewList&&warningNewList.length>0){
        warningNewList.forEach(function(item){
          if(item.get("customer")){
            customerList.forEach(function(customerItem){
              if(customerItem!=item.get("customer")){
                customerList.pushObject(item.get("customer"));
              }
            });

          }
        });
      }
      _self.getCurrentController().set("customerList", customerList);
    });
  },
  saveRefresh: function() {
      this.refresh();
  },
  actions:{
    queryScheduled(){
      var curController = this.getCurrentController();
      curController.set('seachCriteria',false);
      var queryScheduled = curController.get("queryScheduled");
      if(queryScheduled){
        curController.set('queryScheduled',false);
        curController.set("customerList",curController.get("theCustomerList"));
      }else {
        curController.set('queryScheduled',true);
        this.queryWarning();
      }
    },

  },
  setupController:function(controller,model){
    this._super(controller,model);
    controller.set("customerSeach",true);
    this.store.query('customer',{filter:{
      'customerStatus---1':{'typecode@$or1---1':'customerStatusIn'},
      'customerStatus---2':{'typecode@$or1---2':'customerStatusTry'}
    }}).then(function(customers){
      controller.set("theCustomerList",customers);
    });
    this.doQuery();
  },
});
