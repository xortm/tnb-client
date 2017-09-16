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
  total1:DS.attr('number'),//服务类消费金额(床位)
  total2:DS.attr('number'),//餐饮消费金额
  total3:DS.attr('number'),//照护类消费金额
  total:DS.attr('number'),//账单金额
  billTime:DS.attr('number'),//账单时间
  billYear:DS.attr('number'),//账单年
  billQuarter:DS.attr('number'),//账单季度
  billMonth:DS.attr('number'),//账单月
  billTimeString:Ember.computed("billTime",function(){
    var billDate=this.get("billTime");
    return this.get("dateService").formatDate(billDate,"yyyy-MM-dd");
  }),
});

export default Customerbill;
