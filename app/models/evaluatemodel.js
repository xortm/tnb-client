import DS from 'ember-data';
import BaseModel from './base-model';

var Eva = BaseModel.extend({
    title: DS.attr('string'), //名称
    createDateTime: DS.attr('number'), //创建时间
    createUser: DS.belongsTo('user'), //创建人
    lastUpdateDateTime: DS.attr('number'), //更新时间
    lastUpdateUser: DS.belongsTo('user'), //更新人
    type: DS.belongsTo('dicttype'), //类型
    remark: DS.attr('string'), //备注
    riskAssessModel:DS.belongsTo('risk-assess-model'),
    useFlag:DS.attr('number'),//可用状态，0、可用，1、不可用
    questions:DS.hasMany('evaluatequestion'),
    scorescopes:DS.hasMany('evaluatescorescope'),//模板分数范围
    questionList:Ember.computed('questions',function(){
      let answers = this.get('questions');
      let list = new Ember.A();
      answers.forEach(function(answer){
        list.pushObject(answer);
      });
      for(let i=0;i<answers.get('length');i++){
        list.objectAt(i).set('curIndex',i+1);
      }
      return list;
    }),
    useStatus:Ember.computed('useFlag',function(){
      let useFlag = this.get('useFlag');
      if(useFlag==1){
        return '已禁用';
      }else{
        return '可用';
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

export default Eva;
