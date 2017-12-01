import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var Answer = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  question: DS.belongsTo('evaluatequestion'),//问题
  answer: DS.belongsTo('evaluateanswer'),//答案
  result: DS.belongsTo('evaluateresult',{inverse:"answers"}),//评估id
  createUser:DS.belongsTo('User'),//创建id人
  lastUpdateUser: DS.belongsTo('User'),//更改者id
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更改时间
  forRisk:DS.attr('number'),
  selectFlag:DS.attr('number'),//选中标识，1，已选，0，未选
  answerId: Ember.computed("answer",function(){
    var answer = this.get("answer");
    if(answer&&answer.get("id")){
      return answer.get("id");
    }
  }),
});
export default Answer;
