import DS from 'ember-data';
import BaseModel from './base-model';

var workdelivery = BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  remark:DS.attr('string'),//交接详情
  sender:DS.belongsTo('employee'),//发起人
  receiver:DS.belongsTo('employee'),//接收人
  receiveTime:DS.attr('number'),
  status:DS.belongsTo('dicttype'),
  createDateString:Ember.computed("createDateTime",function(){
    var createDateTime=this.get("createDateTime");
    return this.get("dateService").formatDate(createDateTime,"yyyy-MM-dd hh:mm");
  }),
  receiveDateString:Ember.computed("receiveTime",function(){
    var receiveTime=this.get("receiveTime");
    if(receiveTime){
          return this.get("dateService").formatDate(receiveTime,"yyyy-MM-dd hh:mm");
    }else{
      return;
    }

  }),
  remarkString:Ember.computed("remark",function(){
    var remark=this.get("remark");
    if(remark){
       if(remark.length>10){
         return   remark.substring(0, 9)+"...";
       }else{
         return remark;
       }
    }else {
      return null;
    }
    }),
});

export default workdelivery;
