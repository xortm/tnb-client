import DS from 'ember-data';
import BaseModel from './base-model';
const {billStatus1,billStatus2,billStatus3,billType1,billType2,billType3,billType4}=Constants;
export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  exe:DS.belongsTo('nursingplanexe'),
  total:DS.attr('number'),//账单金额
  customer:DS.belongsTo('customer'),//用户
  billTime:DS.attr('number'),//账单时间
  billYear:DS.attr('number'),//账单年
  billQuarter:DS.attr('number'),//账单季度
  billMonth:DS.attr('number'),//账单月
  billStatus:DS.belongsTo('dicttype'),//账单结算状态
  bill:DS.belongsTo('customerbill'),//所属总账单
  billTimeString:Ember.computed("billTime",function(){
    var billDate=this.get("billTime");
    return this.get("dateService").formatDate(billDate,"yyyy-MM-dd");
  }),
  // service:Ember.computed('exe',function(){
  //   let exe = this.get('exe');
  //   if(!exe){
  //     return ;
  //   }
  //   if(exe.get('detail.id')){
  //     return exe.get('detail.item');
  //   }
  //   if(exe.get('itemProject.id')){
  //     return exe.get('itemProject');
  //   }
  // }),
});
