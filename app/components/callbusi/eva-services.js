import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

/*
 * 服务项目设置组件
 * create by lmx
 */
export default BaseItem.extend({
  serviceList:null,//服务项目数据
  curAnswer:null,
  //已選的服务项目
  chooseService:Ember.computed('curAnswer.services','curAnswer.items',function(){
    var serviceList=this.get('curAnswer.services');
    if(!serviceList){
      serviceList = this.get('curAnswer.items');
    }
    console.log('serviceList');
    var name='';
    if(serviceList){
      serviceList.forEach(function(service){

          name += service.get('name')+"，";

      });
      name=name.substring(0,name.length-1);
    }

    return name;
  }),
  //所有項目列表
  allServiceList:Ember.computed("serviceList@each.selected",'curAnswer.items',"curAnswer.services@each.selected",function(){
    var serviceList=this.get('serviceList');
    var selectedService=this.get('curAnswer.services');
    if(!selectedService) {
      selectedService = this.get('curAnswer.items');
    }
    console.log(selectedService);
    if(selectedService&&serviceList){
      serviceList.forEach(function(service){
        service.set('selected',false);
        selectedService.forEach(function(serv){
          if(serv.id==service.id){
          service.set('selected',true);
        }
        });
      });
    }

    return serviceList;
  }),
  actions:{
    serviceItemSelect(itemCode){
      console.log("serviceItemSelect in,code:" + itemCode);
      var item = this.get("allServiceList").findBy("id",itemCode);
      var arr=this.get('curAnswer.services');
      if(!this.get('curAnswer.services')){
        arr = this.get('curAnswer.items');
      }
      console.log("item is:",item,item.get('name'),item.get('selected'));
      if(item.get("selected")){
        item.set("selected",false);
        arr.removeObject(item);
      }else{
        item.set("selected",true);
        arr.pushObject(item);
      }


    }
  }
});
