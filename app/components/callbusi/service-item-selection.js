import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

/*
 * 服务项目设置组件
 * create by lmx
 */
export default BaseItem.extend({
  serviceList:null,//服务项目数据
  //默认的服务项目
  defaultServiceList:Ember.computed("serviceList",function(){
    return this.get("serviceList").filterBy("type",1);
  }),
  //非默认服务项目，不符合入住时的服务等级
  otherServiceList:Ember.computed("serviceList",function(){
    return this.get("serviceList").filterBy("type",2);
  }),
  actions:{
    serviceItemSelect(itemCode){
      console.log("serviceItemSelect in,code:" + itemCode);
      var item = this.get("serviceList").findBy("code",itemCode);
      console.log("item is:",item);
      if(item.get("selected")){
        item.set("selected",false);
      }else{
        item.set("selected",true);
      }
    }
  }
});
