import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  global_curStatus: Ember.inject.service("current-status"),
  constants: Constants,
  infiniteContentPropertyName: "preferenceList",
  infiniteModelName: "customer-preference",
  infiniteContainerName:"customerPointContainer",
  nocustomerId:false,
  queryFlagInFlag:0,
  // customerExtendFlag:false,

  customerObs: function(){
    var _self = this;
    _self._showLoading();
    var customerId = this.get("healtyCustomerId");
    let customer = this.store.peekRecord('customer',customerId);
    // this.set("customer",customer);
    console.log("customerId in log",customerId);
    if(!customerId){
      console.log("customerId in log in !",customerId);
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }
    // console.log("customer exend:",customer.get("customerExtend"));
    // console.log("customer exend 11:",customer.get("customerExtend.interest"));
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    console.log("ynamicsList in customer",customerId);
    //查询偏好表
    this.store.query('customer-extend',{
      filter:{customer:{id:customerId}}
    }).then(function(customerExtendList){
      if(!customerExtendList.get("length")){
        let createRecord = _self.get("store").createRecord("customer-extend",{
          customer:customer
        });
        createRecord.save().then(function(customerExtend){
          _self.set('customerExtend',customerExtend);
        });
        // _self.set('customerExtend',_self.get("store").createRecord("customer-extend",{
        //   customer:customer
        // }));
        // _self.set("customerExtendFlag",false);
      }else{
        _self.set('customerExtend',customerExtendList.get("firstObject"));
        // _self.set("customerExtendFlag",true);
      }
    });
    this.store.query('customer-preference',{
      filter:{customer:{id:customerId}}
    }).then(function(itemList){
      console.log('itemList in save:',itemList);
      let list = itemList.sortBy('startNum');
      _self.set('preferenceList',list);
      _self.hideAllLoading();
      _self.directInitScoll(true);
    });
  }.observes("healtyCustomerId","queryFlagInFlag","refreshFlag").on("init"),

  queryFlagIn(){
    this.incrementProperty("queryFlagInFlag");
  },

  actions:{
    goDetail(str,obj){
      console.log("go goDetail");
      var _self = this;
      // let id = null;
      // if(this.get("customerExtendFlag")){
        let id = obj.get("id");
      // }
      var itemId = str + "_" + id;
      console.log("gotoDetail itemId",itemId);
      var params = {};
      params= {id:id,flag:str,source:'edit',itemIdFlag:Math.random()};
      console.log("gotoDetail params",params);
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          //通过全局服务进行上下文传值
          console.log("customer in list:",obj);
          _self.set("curPreference",obj);
          _self.get("feedBus").set("hobbyData",obj);
          mainpageController.switchMainPage('customer-hobby-detail',params);
        },100);
      },200);
    },
    addPoint:function(){
      var _self = this;
      var flag = Math.random();
      var customerId = this.get("healtyCustomerId");
      var itemId = "customer_point_add";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var params = {
            id:customerId,
            flag:"preference",
            source:'add',
            itemIdFlag:Math.random()
          };
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('customer-hobby-detail',params);
        },100);
      },200);
    },
    switchShowAction(){
      // this.get("customerExtend").rollbackAttributes();
      // this.get("curPreference").rollbackAttributes();
      // this.incrementProperty("refreshFlag");
      this.directInitScoll();
    },

  },

});
