import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "nursingplandetailList",
  infiniteModelName: "nursingplandetail",
  infiniteContainerName:"serviceOrderLookContainer",
  constants:Constants,
  queryFlag:1,

  init:function(){
    this.set("selectTypecode","all");
  },

  tabFuncs:Ember.computed(function() {
    let list = new Ember.A();
    let all = Ember.Object.create({
      typecode:"all",
      typename:"全部",
      select:true,
    });
    let jujiaServiceStatus1 = Ember.Object.create({
      typecode:"jujiaServiceStatus1",
      typename:"待分配",
      select:false,
    });
    let jujiaServiceStatus2 = Ember.Object.create({
      typecode:"jujiaServiceStatus2",
      typename:"已分配",
      select:false,
    });
    let jujiaServiceStatus3 = Ember.Object.create({
      typecode:"jujiaServiceStatus3",
      typename:"已上路",
      select:false,
    });
    let jujiaServiceStatusYWC = Ember.Object.create({
      typecode:"jujiaServiceStatusYWC",
      typename:"已完成",
      select:false,
    });
    list.pushObject(all);
    list.pushObject(jujiaServiceStatus1);
    list.pushObject(jujiaServiceStatus2);
    list.pushObject(jujiaServiceStatus3);
    list.pushObject(jujiaServiceStatusYWC);
    console.log("list computed:",list);
    return list;
  }),

  itemObs: function(){
    var _self = this;
    _self._showLoading();
    var commonInitHasCompleteFlag = this.get("global_curStatus.commonInitHasCompleteFlag");
    console.log("queryObs run commonInitHasCompleteFlag",commonInitHasCompleteFlag);
    let curCustomer = this.get("statusService").getCustomer();
    let queryFlag = this.get("queryFlag");
    console.log("curCustomer in public",curCustomer);
    if(!commonInitHasCompleteFlag||!curCustomer||!curCustomer.get("id")||!queryFlag){
      return;
    }
    var customerId = curCustomer.get("id");
    let selectTypecode = this.get("selectTypecode");
    if(!selectTypecode){
      selectTypecode = "all";
      this.set("selectTypecode","all");
    }
    let params = {};
    let filter = {
      customer:{id:customerId}
    };
    //如果不是查全部，拼接筛选条件
    if(selectTypecode == "all"){
      filter = $.extend({}, filter, {
        'serviceStatus@$isNotNull':'null',
      });
    }else{
      filter = $.extend({}, filter, {
        serviceStatus:{
          typecode:selectTypecode,
        }
      });
    }
    let sort = {
      createDateTime:'desc'
    };
    params.filter = filter;
    params.sort = sort;
    this.infiniteQuery('nursingplandetail',params);
  }.observes("queryFlag","global_curStatus.commonInitHasCompleteFlag","statusService.curStatus.currentCustomer").on("init"),


  actions:{
    switchTab(code){
      this.set("selectTypecode",code);
      this.incrementProperty("queryFlag");
    },

  },

});
