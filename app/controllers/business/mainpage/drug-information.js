import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  statusService: Ember.inject.service("current-status"),
  dataLoader: Ember.inject.service("data-loader"),
  feedService: Ember.inject.service('feed-bus'),

  infiniteContentPropertyName: "customerdrugprojectList",
  infiniteModelName: "customerdrugproject",
  infiniteContainerName:"drugInformationContainer",
  queryFlagInFlag: 1,
  constants:Constants,

  customerObs: function(){
    let _self = this;
    _self._showLoading();
    let curCustomer = this.get("statusService").getCustomer();//获取curCustomer
    let curCustomerId = curCustomer.get("id");
    var params = {
      filter:{
        customerDrug:{customer:{id:curCustomerId}}
      },
      sort:{
        customerDrug:"desc"
      }
    };
    console.log("infiniteQuery run");
    this.store.query('customerdrugproject',params).then(function(customerdrugprojectList){
      customerdrugprojectList.forEach(function(item){
        //缺药业务的逻辑
        let useDrugNum = item.get("useDrugNum");
        let medicineDrugFreq = item.get("useDrugFreq");
        let allDrugNum = item.get("customerDrug.drugNum");
        console.log("allDrugNum::",allDrugNum);
        if(allDrugNum == "0"){
          item.set("littleDrugDetail","0");
        }else{
          let setDrugDaysRemind = _self.get("dataLoader").findConf(Constants.setDrugDaysRemind);
          console.log("setDrugDaysRemind in speservice:",setDrugDaysRemind);
          let drugRemainDays = Math.floor(allDrugNum/(useDrugNum*medicineDrugFreq));
          console.log("drugRemainDays::",drugRemainDays);
          if(drugRemainDays <= setDrugDaysRemind){
            item.set("littleDrugDetail",drugRemainDays);
          }
        }
        _self.hideAllLoading();
      });
      _self.set("customerdrugprojectList",customerdrugprojectList);
      console.log("customerDrug:",customerdrugprojectList.get("firstObject").get("customerDrug"));
      console.log("drug:",customerdrugprojectList.get("firstObject").get("customerDrug.drug"));
      console.log("drugName:",customerdrugprojectList.get("firstObject").get("customerDrug.drug.name"));
    });
  }.observes("queryFlagInFlag").on("init"),

  queryFlagIn(){
    this.incrementProperty("queryFlagInFlag");
  },

  actions:{
    switchShowAction(){
      this.directInitScoll();
    },
  },
});
