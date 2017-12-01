import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "nursingplandetailList",
  infiniteModelName: "nursingplandetail",
  infiniteContainerName:"serviceOrderLookingContainer",
  constants:Constants,
  queryFlag:1,
  //只有当当前页面时route是service-care时,才会把切换以后的老人id传递给组件,使其加载数据
  serveCustomerIdObs: function(){
    var switchDateFlag = this.get("global_curStatus.switchDateFlag");
    var curRoutePath=this.get('service_PageConstrut').get('curRouteName');
    if(curRoutePath === "service-order-looking"){
      this.set("switchDateFlag",switchDateFlag);
    }
  }.observes("global_curStatus.switchDateFlag").on("init"),

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
    let switchDateFlag = this.get("switchDateFlag");
    let queryFlag = this.get("queryFlag");
    console.log("queryObs run queryFlag",queryFlag);
    console.log("queryObs run switchDateFlag",switchDateFlag);
    console.log("queryObs run commonInitHasCompleteFlag",commonInitHasCompleteFlag);
    if(!commonInitHasCompleteFlag||!queryFlag||!switchDateFlag){
      return;
    }
    let selectTypecode = this.get("selectTypecode");
    console.log("selectTypecode:",selectTypecode);
    if(!selectTypecode){
      selectTypecode = "all";
      this.set("selectTypecode","all");
    }
    let params = {};
    let filter = {};
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
    let compareDate = null;
    if(switchDateFlag == "jintian"){
      compareDate = _self.get("dateService").getTodayTimestamp();
    }else if(switchDateFlag == "yizhou"){
      compareDate = _self.get("dateService").getDaysBeforeTimestamp(7);
    }else if(switchDateFlag == "yiyue"){
      compareDate = _self.get("dateService").getDaysBeforeTimestamp(30);
    }
    console.log("compareDate after:"+compareDate);
    if(compareDate){
      filter = $.extend({}, filter, {
          'createDateTime@$gte': compareDate
      });
    }
    let sort = {
      createDateTime:'desc'
    };
    params.filter = filter;
    params.sort = sort;
    console.log("params after:"+params);
    _self.get('global_ajaxCall').set('action','jujia');
    this.infiniteQuery('nursingplandetail',params);
  }.observes("queryFlag","global_curStatus.commonInitHasCompleteFlag","switchDateFlag").on("init"),


  actions:{
    switchTab(code){
      this.set("selectTypecode",code);
      this.incrementProperty("queryFlag");
    },
    switchShowAction(){
      //当以后切换进入页面时,才把全局选好的时间传给组件
      var switchDateFlag = this.get("global_curStatus.switchDateFlag");
      this.set("switchDateFlag",switchDateFlag);
    },

  },

});
