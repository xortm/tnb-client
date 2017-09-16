import Ember from 'ember';
import BaseItem from '../base-ui-item';

export default BaseItem.extend({
  feedService: Ember.inject.service('feed-bus'),
  tagName: "div",
  classStatic: true,
  classNameBindings: ['classStatic:search-input'],
  hasSearchIcon: false,//是否有搜索图标
  valueDataObs:function(){
    var data = this.get("data");
    if(data){
      this.set("clearShow",true);
    }else {
      this.set("clearShow",false);
    }
    this.get("feedService").set("searchData",data);//设置到services全局变量 有下面change 方法
  }.observes("data","feedService.customerSearch"),
  change(inputValue){
    //输入结束后发送事件
    console.log("change in,inputValue:" + inputValue);
    this.sendAction("inputChange",inputValue);
  },
  actions:{
    clear(){
      this.set("data",'');
      // this.get("feedService").set("searchData",'');
    },
  },
});
