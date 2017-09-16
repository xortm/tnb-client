import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var backvist = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  backVistType: DS.belongsTo('dicttype'),//回访类型
  content: DS.attr('string'),//回访内容
  createDateTime: DS.attr('number'),//创建时间
  lastUpdateDateTime: DS.attr('number'),//更改时间
  consultInfo: DS.belongsTo('consultinfo'),//咨询表id
  vistUser: DS.belongsTo('employee'),//接待员工
  customerName: DS.attr('string'),//客户姓名
  accessType: DS.belongsTo('dicttype'),//跟进类别
  customerTel: DS.attr('number'), //客户电话
  remark: DS.attr('string'),//备注
  liveIntent:DS.belongsTo('dicttype'),//入住意向
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
  //回访时间
  createDate:Ember.computed("createDateTime",function(){
    var createDateTime=this.get("createDateTime");
    if(!createDateTime){
      return null;
    }
    return this.get("dateService").timestampToTime(createDateTime);
  }),
  createDateTimeString:Ember.computed("createDateTime",function(){
    var createDateTime=this.get("createDateTime");
    return this.get("dateService").formatDate(createDateTime,"yyyy-MM-dd hh:mm");
    }),
});
export default backvist;
