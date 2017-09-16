import DS from 'ember-data';
import BaseModel from './base-model';

var Floor = BaseModel.extend({
  name:DS.attr('string'),//名称
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  building:DS.belongsTo('building'),//所属楼宇
  // parent: DS.belongsTo('building', {
  //     inverse: 'children'
  // }),
  // children: DS.hasMany('room', {
  //     inverse: 'parent'
  // }),
  rooms:DS.hasMany('room'),
  seq:DS.attr('number'),//楼层编号
  // room:DS.hasmany('room')//
  allName:Ember.computed('name','building',function(){
    var name=this.get('building.name')+'-'+this.get('name');
    return name;
  })
});

export default Floor;
