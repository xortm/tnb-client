/*--
创建人:薛立想
创建时间:2017-09-20
评分问卷用不同的jrol组件
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
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"scoreByEmployeeContainer",
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
    this.hideAllLoading();
    this.directInitScoll(true);
  }.observes("showLoadingImgFlag"),

  actions:{

  },

});
