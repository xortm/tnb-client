import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  code:DS.attr('string'),
  name:DS.attr('string'),
  privileges: DS.hasMany('privilege'),
  remark:DS.attr('string'),
  items:DS.hasMany('customerserviceitem'),
  roleType:DS.belongsTo('dicttype'),
  privilegeList:new Ember.A(),
  // privilegeStr:Ember.computed('privilegeList',function(){
  //   var str = "";
  //   this.get("privilegeList").forEach(function(privilege){
  //     str += privilege.get("showName")+ ",";
  //   });
  //   if(str.length===0){
  //     str = "无";
  //   }else{
  //     str = str.substring(0,str.length-1);
  //   }
  //   return str;
  // }),
  isAuto:Ember.computed('code',function(){
    let code = this.get('code');
    if(code=="app"||code=="wechat"||code=="admin"){
      return true;
    }else{
      return false;
    }
  }),
});
