import DS from 'ember-data';
import BaseModel from './base-model';

var Building = BaseModel.extend({
  name:DS.attr('string'),//名称
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  seq:DS.attr('string'),//楼宇编号
  upLandFloorNum:DS.attr('number'),//地上层数
  downLandFloorNum:DS.attr('number'),//地下层数
  create4Flag:DS.attr('number'),//是否生成4层  0生成  1不生成
  floorNum:Ember.computed("upLandFloorNum","downLandFloorNum",function(){
    return this.get("upLandFloorNum") + this.get("downLandFloorNum");
  }),
  roomNum:DS.attr('number'),//楼宇房间数
  remark:DS.attr('string'),//备注
  bedAllNum:DS.attr('number'),//所有床位数
  bedInNum:DS.attr('number'),//在住床位数
  // children: DS.hasMany('floor', {
  //     inverse: 'parent'
  // }),
  floors:DS.hasMany('floor',{inverse:'building'}),
  allName:Ember.computed('name','building',function(){
    var name=this.get('building.name')+'-'+this.get('name');
    return name;
  }),
  hasInit: false,
});

export default Building;
