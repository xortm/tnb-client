import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  statusService: Ember.inject.service("current-status"),
  dataLoader: Ember.inject.service("data-loader"),
  feedService: Ember.inject.service('feed-bus'),

  infiniteContentPropertyName: "customerdynamicList",
  infiniteModelName: "customerdynamic",
  infiniteContainerName:"customerDynamicContainer",
  "page[size]": 10,
  pageScrollY: 120,
  uploadUrl: Ember.computed(function() {return this.get("pathConfiger").get("uploadUrl");}),
  constants:Constants,

  customerObs: function(){
    let _self = this;
    var commonInitHasCompleteFlag = this.get("global_curStatus.commonInitHasCompleteFlag");
    console.log("queryObs run commonInitHasCompleteFlag",commonInitHasCompleteFlag);
    if(!commonInitHasCompleteFlag){
      return;
    }
    let curCustomer = this.get("statusService").getCustomer();//获取curCustomer
    let curCustomerId = curCustomer.get("id");
    var params = {
      filter:{
        customer:{id:curCustomerId}
      },
      sort:{
        createDateTime:"desc"
      }
    };
    console.log("infiniteQuery run");
    this.infiniteQuery('customerdynamic',params);
  }.observes("global_curStatus.commonInitHasCompleteFlag").on("init"),

  actions:{
    switchShowAction(){
      this.directInitScoll();
    },
  },
});
