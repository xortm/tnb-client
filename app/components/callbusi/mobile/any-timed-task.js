/*--
创建人:薛立想
创建时间:2017-08-30
定时任务与不定时任务用不同的jrol组件
 --*/
import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
import InfiniteScroll from '../../../controllers/infinite-scroll';

export default BaseUiItem.extend(InfiniteScroll,{
  store: Ember.inject.service("store"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  feedBus: Ember.inject.service("feed-bus"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  global_curStatus: Ember.inject.service("current-status"),
  constants: Constants,
  k: 0,
  // infiniteContentPropertyName: Ember.computed(function(){
  //   return this.get("infiniteContentPropertyName");
  // }),
  //动态计算当前infiniteContainerName
  infiniteContainerName: Ember.computed("infiniteName",function(){
    let infiniteContainerName = this.get("infiniteName") + "-anytime";
    console.log("infiniteContainerName anytime:",infiniteContainerName);
    return  infiniteContainerName;
  }),
  //下拉刷新,传递给上层
  queryFlagIn: function(){
    this.sendAction("queryFlagInAction");
  },
  //观察者:只刷新jroll,保证滚动的位置不变
  directInitScollFlagObs:function(){
    if(this.get("scollFlag") == "1"){return;}
    console.log("run scollFlag in directInitScollFlagObs anytime");
    this.refreshScrollerAction();
  }.observes("scollFlag"),
  //观察者:只刷新jroll,保证滚动的位置不变
  showLoadingImgFlagObs:function(){
    console.log("run in showLoadingImgFlagObs");
    this.set("countList",null);
    this.hideAllLoading();
    this.directInitScoll(true);
  }.observes("showLoadingImgFlag","antTimeedTaskFlag"),

  actions:{
    saveNursingLog(customerId,detailContent,callback){
      this.sendAction("saveNursingLog",customerId,detailContent,callback);
    },

    finishSave(item,callback){
      this.sendAction("finishSave",item,callback);
    },

    countItemExpand(selecedServiceId){
      this.sendAction("countItemExpand",selecedServiceId);
    },

    itemExpand(selecedServiceId){
      this.sendAction("itemExpand",selecedServiceId);
    },
    //这个是判断 list是否在hbs加载完毕标示
    didInsertActCustomer(code){
      let _self = this;
      var countList = this.get("countList");
      var k = this.get("k");
      k++;
      this.set("k",k);
      console.log("k and countListLenght",k,countList.get("length"));
      if(k >= countList.get("length")){
        console.log("LoadingImgInss101010");
        _self.hideAllLoading();
        this.set("k",0);
        console.log("k and countListLenght",k);
        this.directInitScoll(true);
      }
    },



  },

});
