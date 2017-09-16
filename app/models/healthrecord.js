import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var healthRecord = BaseModel.extend({
dateService: Ember.inject.service("date-service"),
customer: DS.belongsTo('customer'),//健康档案对应老人
drugallegys:DS.hasMany('drugallegy'),//药物过敏史类别
exposurehistorys:DS.hasMany('exposurehistory'),//暴露史类别
diseasehistorys:DS.hasMany('diseasehistory'),//疾病史的类别
operationhistorys:DS.hasMany('operationhistory'),//手术史的类别
injuryhistorys:DS.hasMany('injuryhistory'),//外伤史的类别
bloodhistorys:DS.hasMany('bloodhistory'),//输血史的类别
familyhistorys:DS.hasMany('familyhistory'),//家族史的类别
//medicalpaymentmodes:DS.hasMany('medicalpaymentmode'),//医疗方式支付的类型
geneticHistory: DS.attr('string'),//遗传病史
diseaseconditions:DS.hasMany('diseasecondition'),//疾病情况
remark:Ember.computed('drugallegys',function(){
  var drugallegys=this.get('drugallegys');
  drugallegys.forEach(function(drugallegy){
    if(drugallegy.get('remark')){
      return drugallegy.get('remark');
    }
  });
}),
});

export default healthRecord;
