import DS from 'ember-data';
import BaseModel from './base-model';

var Serviceitem=BaseModel.extend({
  name:DS.attr('string'),//护理项目名称
  referencePrice :DS.attr('string'),//参考价格
  // careType:DS.belongsTo('dicttype'),//护理类别
  countType:DS.belongsTo('dicttype'),//执行方式(随时执行/定时执行)
  frequency:DS.attr('string'),//频次
  period:DS.belongsTo('dicttype'),//周期
  serviceTime:DS.attr('string'),//所需时间
  remark:DS.attr('string'),//护理说明
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  roleType:DS.belongsTo('dicttype'),//角色类型
  serviceType:DS.belongsTo('dicttype'),//项目类型
  finishLevels:DS.hasMany('servicefinishlevel'),//完成情况
  merchs:DS.hasMany('servicemerch'),//医护用品
  serviceNum:DS.attr('string'),//数量单位
  serviceValueType:DS.belongsTo('dicttype'),//服务类型，增值服务或基础服务
  price:DS.attr('number'),
  valueAdd:Ember.computed('serviceValueType',function(){
    let serviceValueType = this.get('serviceValueType');
    if(serviceValueType.get('typecode')=='serviceValueTypeZZ'){
      return true;
    }else{
      return false;
    }
  }),
  createTime: Ember.computed('createDateTime', function() {
      var dateOri = this.get("createDateTime");
      var date = new Date(dateOri * 1000);
      if (date === 'Invalid Date') {
          date = '';
      } else {
          date = date.getFullYear() + "-" + this.toDbl(date.getMonth() + 1) + "-" + this.toDbl(date.getDate()) + " " + this.toDbl(date.getHours()) + ":" + this.toDbl(date.getMinutes());
      }
      return date;
  }),
  toDbl: function(value) {
      if (value < 10) {
          return '0' + value;
      } else {
          return '' + value;
      }
  }

});

export default Serviceitem;
