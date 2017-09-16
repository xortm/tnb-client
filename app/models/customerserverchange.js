import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var Change = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  createDateTime: DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime: DS.attr('number'),//更改时间
  lastUpdateUser:DS.belongsTo('user'),//更改者
  remark: DS.attr('string'),//备注
  customer:DS.belongsTo('customer'),//申请人id
  priceOld: DS.attr('number'),//变更前价格 (取customer里面的实际价格)
  priceNew: DS.attr('number'),//变更后价格
  bedOld: DS.belongsTo('bed'),//变更前床位
  bedNew: DS.belongsTo('bed'),//变更后床位
  bedPriceOld:DS.attr('number'),//变更后床位参考价格
  bedPriceNew:DS.attr('number'),//变更后床位实际价格
  foodLevelOld:DS.belongsTo('dicttypetenant'),//变更前餐饮标准
  foodLevelNew:DS.belongsTo('dicttypetenant'),//变更后餐饮标准
  foodPriceOld:DS.attr('number'),//变更后餐饮标准参考价格
  foodPriceNew:DS.attr('number'),//变更后餐饮标准实际价格
  projectPriceOld:DS.attr('number'),//变更前护理价格
  projectPriceNew:DS.attr('number'),//变更后护理价格
  effectiveTime: DS.attr("number"), //服务变更生效时间
  status:DS.belongsTo('dicttype'),//状态 applyStatus
  createDate :Ember.computed("createDateTime",function(){
    var createDateTime=this.get("createDateTime");
    if (!createDateTime) {
        return null;
    }
    return this.get("dateService").timestampToTime(createDateTime);
  }),
  createDateString:Ember.computed("createDateTime",function(){
    var createDateTime=this.get("createDateTime");
    return this.get("dateService").formatDate(createDateTime,"yyyy-MM-dd");
  }),
  effectiveDate:Ember.computed("effectiveTime", function() {
      var effectiveTime = this.get("effectiveTime");
      if (!effectiveTime) {
          return null;
      }
      return this.get("dateService").timestampToTime(effectiveTime);
  }),
  effectiveTimeString: Ember.computed("effectiveTime", function() {
      var effectiveTime = this.get("effectiveTime");
      return this.get("dateService").formatDate(effectiveTime, "yyyy-MM-dd");

  }),
});
export default Change;
