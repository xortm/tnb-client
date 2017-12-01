import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "nursingplandetailList",
  infiniteModelName: "nursingplandetail",
  infiniteContainerName:"myOrderLookingContainer",
  constants:Constants,
  queryFlag:1,
  //只有当当前页面时route是service-care时,才会把切换以后的老人id传递给组件,使其加载数据
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
    let queryFlag = this.get("queryFlag");
    console.log("queryObs run queryFlag",queryFlag);
    if(!commonInitHasCompleteFlag||!queryFlag){
      return;
    }
    let curUser = this.get("statusService").getUser();
    let employeeId = curUser.get("employee.id");
    console.log("employeeId:",employeeId);
    let selectTypecode = this.get("selectTypecode");
    console.log("selectTypecode:",selectTypecode);
    if(!selectTypecode){
      selectTypecode = "all";
      this.set("selectTypecode","all");
    }
    let params = {};
    let filter = {serviceOperater:{id:employeeId}};
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
    console.log("params after:"+params);
    this.infiniteQuery('nursingplandetail',params);
  }.observes("queryFlag","global_curStatus.commonInitHasCompleteFlag").on("init"),


  actions:{
    switchTab(code){
      this.set("selectTypecode",code);
      this.incrementProperty("queryFlag");
    },
    switchShowAction(){
    },

  },

});
