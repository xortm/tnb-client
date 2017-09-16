import DS from 'ember-data';
import BaseModel from './base-model';

var nursegroup = BaseModel.extend({
  name:DS.attr('string'),//护工组名称
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  createUser:DS.belongsTo('user'),//创建者ID
  leader:DS.belongsTo('employee'),//组长ID
  staffs:DS.hasMany('employeenursinggroup'),//组员列表
  beds:DS.hasMany('bednursegroup'),//照看床位
  customers:DS.hasMany('customer'),//老人列表
  staffListName:Ember.computed('staffs',function(){
    let staffs = this.get('staffs');
    let str = '';
    staffs.forEach(function(staff){
      str +=  staff.get("employee.name")+'，';
    });
    return str.substring(0,str.length-1);
  }),
});


export default nursegroup;
