import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var Customerdrugprojectitem = BaseModel.extend({
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  createUser:DS.belongsTo('user'),//创建者ID
  remark:DS.attr('string'),//备注
  project:DS.belongsTo('customerdrugproject'),//所用药品
  assistType:DS.belongsTo('dicttype'),//协助类型
  useDrugDate:DS.attr('string'),//用药时间
  useDrugSpec:DS.belongsTo('dicttype'),//用药规格
  useDrugNum:DS.attr('number'),//用药数量
  useDrugWay:DS.attr('string'),//用药方法
  useDrugFreq:DS.attr('number'),//用药频次

  useDrugDateStr:Ember.computed('useDrugDate',function(){
    let useDrugDate = this.get('useDrugDate');
    let strArr = useDrugDate.split(',');
    for(let i=0;i<strArr.length;i++){
      strArr[i] = strArr[i] + '点';
    }
    let str = strArr.join(',');
    return str;
  })
});
export default Customerdrugprojectitem;
