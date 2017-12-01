import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var Evaluate = BaseModel.extend({
    pathConfiger: Ember.inject.service("path-configer"),
    dateService: Ember.inject.service("date-service"),
    customer: DS.belongsTo('customer'), //老人姓名
    name: DS.attr('string'), //问卷名称
    model: DS.belongsTo('evaluatemodel'), //评估模板
    result: DS.attr('string'), //评估建议
    score: DS.attr('number'), //分数
    user: DS.belongsTo('employee'), //评估人
    createDateTime: DS.attr('number'), //评估日期
    lastUpdateDateTime:DS.attr('number'),
    evaluateBatch:DS.belongsTo('evaluatebatch'), //所属批次
    scores: null,
    batch:DS.attr('number'),//问卷批次
    remark:DS.attr('string'), //问卷备注
    answers:DS.hasMany('evaluateexameranswer',{inverse:"result"}),//对应答案表
    answersTemp:DS.hasMany('evaluateexameranswer'),
    level:DS.belongsTo('nursinglevel'), //评估等级
    actionLevel:DS.belongsTo('dicttype'),//老人自理能力等级
    contents:DS.attr('string'),
    completeStatus:DS.attr('number'),//问卷完成状态，0，未完成，1，已完成
    serviceArray: new Ember.A(),
    completeName:Ember.computed('completeStatus',function(){
      let completeStatus = this.get('completeStatus');
      if(completeStatus==1){
        return '已完成';
      }else{
        return '未完成';
      }
    }),
    evaluateServiceItemStr: Ember.computed("serviceArray", function() {
        var str = "";
        var serviceArray = this.get("serviceArray");
        console.log("serviceArray in item", serviceArray);
        serviceArray.forEach(function(service) {
            str += '<span class="padding10 nomarginTop">' + service.get("name") + '</span>';
        });
        if (str.length === 0) {
            str = '无';
        } else {
            str = str.substring(0, str.length - 1);
        }
        return str;
    }),
    evaResult: Ember.computed("model", "scores", "evaluateServiceItemStr", function() {
        var model = this.get("model");
        console.log("model is who", model);
        var type = model.get("type");
        console.log("type is who", type);
        if (type) {
            var typecode = type.get("typecode");
            console.log("typecode is who", typecode);
            if (typecode == "evaluateTypeByScore") {
                return this.get("scores");
            }
            if (typecode == "evaluateTypeByItem") {
                //console.log("==",typeId=="163");
                return this.get("evaluateServiceItemStr");
            }
        }
    }),
    createDate: Ember.computed("createDateTime", function() {
        var  createDateTime= this.get("createDateTime");
        return createDateTime?this.get("dateService").timestampToTime(createDateTime):null;
    }),
    createDateTimeString: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return createDateTime?this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd"):null;
    }),
    lastUpdateDateTimeString: Ember.computed("lastUpdateDateTime", function() {
        var lastUpdateDateTime = this.get("lastUpdateDateTime");
        return lastUpdateDateTime?this.get("dateService").formatDate(lastUpdateDateTime, "yyyy-MM-dd"):null;
    }),

});
export default Evaluate;
