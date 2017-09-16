import DS from 'ember-data';
import BaseModel from './base-model';
const {billStatus1,billStatus2,billStatus3,billType1,billType2,billType3,billType4}=Constants;
var Customerbill = BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  createUser:DS.belongsTo('user'),//创建者ID
  remark:DS.attr('string'),//备注
  customer:DS.belongsTo('customer'),//用户
  operateUser:DS.belongsTo('user'),//审核人
  operateTime:DS.attr('number'),//审核时间
  operateRemark:DS.attr('string'),//审核备注
  total:DS.attr('string'),//账单金额
  billStatus:DS.belongsTo('dicttype'),//账单状态
  billTime:DS.attr('number'),//账单时间
  billType:DS.belongsTo('dicttype'),//账单类别（周，月，季，年）
  billYear:DS.attr('number'),//账单年
  billQuarter:DS.attr('number'),//账单季度
  billMonth:DS.attr('number'),//账单月
  billCreateType:DS.belongsTo('dicttype'),//账单创建类型
  billStatType:DS.belongsTo('dicttype'),//账单统计类型
  year:Ember.computed("billYear",function(){
    let year = this.get('billYear');
    return year+'年';
  }),
  month:Ember.computed("billMonth",function(){
    let month = this.get('billMonth');
    return month+'月';
  }),
  quarter:Ember.computed("billQuarter",function(){
    let quarter = this.get('billQuarter');
    return '第'+quarter+'季度';
  }),
  audit:Ember.computed('billStatus',function(){
    let status = this.get('billStatus.typecode');
    if(status==billStatus2||status==billStatus1){
      return false;
    }else{
      return true;
    }
  }),
  billTimeString:Ember.computed("billTime",function(){
    var billDate=this.get("billTime");
    return this.get("dateService").formatDate(billDate,"yyyy-MM-dd");
  }),
  showRemark:Ember.computed('remark','operateRemark',function(){
    let remark = this.get('remark');
    let operateRemark = this.get('operateRemark');
    if(operateRemark){
      return operateRemark;
    }else{
      return remark;
    }
  }),
  showTime:Ember.computed('billType',function(){
    let status = this.get('billType.typecode');
    let year = this.get('billYear');
    let quarter = this.get('billQuarter');
    let month = this.get('billMonth');
    let billTimeString = this.get('billTimeString');
    if(status==billType1){

    }
    else if(status==billType2){
      return year+'年'+month+'月账单';
    }
    else if(status==billType3){
      return year+'年第'+quarter+'季度账单';
    }
    else if(status==billType4){
      return year+'年账单';
    }else{
      return billTimeString;
    }
  })
});

export default Customerbill;
