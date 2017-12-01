import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "customerdayfoodplanList",
  infiniteModelName: "customerdayfoodplan",
  infiniteContainerName:"customerOrderingContainer",
  // scrollPrevent: true,
  queryFlagInFlag: 0,
  constants:Constants,
  currentDate:Ember.computed(function(){
    let currentTime = this.get("dateService").getTodayTimestamp();
    console.log("currentTime in ordering:",currentTime);
    return currentTime;
  }),
  init: function(){
    this._super(...arguments);
    var _self = this;
    this.store.query("food",{}).then(function(foodList){
      console.log("foodList after query:",foodList);
      _self.get("dataLoader").set("foodList",foodList);
      _self.set("foodList",foodList);
    });
  },

  customerObs: function(){
    var _self = this;
    console.log("queryFlagInFlag:",this.get("queryFlagInFlag"));
    this.infiniteQuery('customerdayfoodplan',{filter:{},sort:{diningDate:'desc'}});
  }.observes("queryFlagInFlag").on("init"),

  actions:{
    switchShowAction(){
      this.incrementProperty("queryFlagInFlag");//触发重新查询
    },
    invitation(){
      this.set('addNewOrdering',false);
    },
    addOrdering:function(){
      var _self = this;
      var itemId = "customer-ordering";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.set('addNewOrdering',true);
        },100);
      },200);
    },
    saveNewOrdering(){
      var _self = this;
      let foodplanInfo = this.get('foodplanInfo');
      var mainpageController = App.lookup('controller:business.mainpage');
      let customerdayfoodplanList = this.get('customerdayfoodplanList');
      let curUser = this.get("statusService").getUser();
      let params;
      let time = this.get('diningDate');
      if(!time){
        App.lookup('controller:business.mainpage').popTorMsg("订餐日期不能为空");
      }else{
        this.set('addNewOrdering',false);
        let queryStartDate = this.get("dateService").getFirstSecondStampOfDayString(time);
        let queryEndDate = this.get("dateService").getLastSecondStampOfDayString(time);
        this.store.query("customerdayfoodplan",{
          filter:{
            diningDate: queryStartDate,
            // queryStartDate: queryStartDate,
            // queryEndDate: queryEndDate
          }
        }).then(function(customerdayfoodplanList){
          console.log("customerdayfoodplanList length:",customerdayfoodplanList.get("length"));
          let length = customerdayfoodplanList.get("length");
          var params = {};
          var mainpageController = App.lookup('controller:business.mainpage');
          if(!length){
            // let date = this.get('dateService').timeStringToTimestamp(time);
            let foodplanInfo = _self.store.createRecord('customerdayfoodplan',{
              diningDate:queryStartDate,
              createUser:curUser
            });
            console.log('diningDate in food',foodplanInfo.get('diningDate'));
            foodplanInfo.save().then(function(foodplan){
              params= {itemId:foodplan.get("id"),source:"add",itemIdFlag:Math.random()};
              // params= {diningDate:foodplan.get('diningDate'),source:"add",itemIdFlag:Math.random()};
              _self.get("feedService").set("customerOrderingData",foodplan);
              mainpageController.switchMainPage('customer-ordering-detail',params);
              _self.set('diningDate',null);
            });
          }else{
            let customerdayfoodplan = customerdayfoodplanList.get("firstObject");
            params= {itemId:customerdayfoodplan.get("id"),source:"edit",itemIdFlag:Math.random()};
            _self.get("feedService").set("customerOrderingData",customerdayfoodplan);
            mainpageController.switchMainPage('customer-ordering-detail',params);
            _self.set('diningDate',null);
          }
        });
      }
    },


  },

});
