import DS from 'ember-data';
import BaseModel from './base-model';

var Evaluateanswer = BaseModel.extend({
  content:DS.attr('string'),//问题内容
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  remark:DS.attr('string'),//备注
  score:DS.attr('number'),//分数
  // services:DS.hasMany('customerserviceitem'),//护理项目
  seq:DS.attr('number'),//编号
  question:DS.belongsTo('evaluatequestion'),//所属问题
  servicesName:Ember.computed('services',function(){
    var name='';
    this.get('services').forEach(
      function(servece){
        name += servece.get('name')+'，';
      }
    );
    if(name.length===0){
      name='无';
    }else{
      name=name.substring(0,name.length-1);
    }
    return name;
  }),
  answerContent:Ember.computed.alias('content'),
});

export default Evaluateanswer;
