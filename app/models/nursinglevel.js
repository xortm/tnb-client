import DS from 'ember-data';
import BaseModel from './base-model';

var nursinglevel = BaseModel.extend({
  name:DS.attr('string'),//护理等级名称
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  createUser:DS.belongsTo('user'),//创建者ID
  remark:DS.attr('string'),//备注
  selfCareLevel:DS.hasMany('dicttype'),//对应的自理等级
  price:DS.attr('string'),//日价格
  totalPrice:DS.attr('string'),//月价格
  highScore:DS.attr('number'),//最高分
  lowScore:DS.attr('number'),//最低分
  sourceRemark:DS.attr('string'),//类型编码
  modelSource:DS.belongsTo('evaluatemodelsource'),
  sourceCode:DS.attr('string'),
  delFlag:Ember.computed('sourceRemark',function(){
    let sourceRemark = this.get('sourceRemark');
    if(sourceRemark == 'beijing'){
      return false;
    }else{
      return true;
    }
  }),
  services:DS.hasMany('nursinglevelitem'),
  servicesName:Ember.computed('services',function(){
    var name='';
    this.get('services').forEach(
      function(servece){
        name += servece.get('item.name')+'，';
      }
    );
    if(name.length===0){
      name='无';
    }else{
      name=name.substring(0,name.length-1);
    }
    return name;
  }),
  selfCareLevelName:Ember.computed('selfCareLevel',function(){
    let selfCareLevel = this.get('selfCareLevel');
    if(!selfCareLevel){
      return '无';
    }
    let name = '';
    selfCareLevel.forEach(function(selfCareLevel){
      name += selfCareLevel.get('typename') + ',';
    });
    return name.substring(0,name.length-1);
  })


});

export default nursinglevel;
