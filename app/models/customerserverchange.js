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
  customerStatusOld:DS.belongsTo('dicttype'),//变更前入住状态
  customerStatus:DS.belongsTo('dicttype'),//变更后入住状态
  chargeTypeOld: DS.belongsTo('dicttype'),//变更前结算类型
  chargeType: DS.belongsTo('dicttype'),//变更后结算类型
  priceOld: DS.attr('number'),//变更前总价格 (取customer里面的实际价格)
  priceNew: DS.attr('number'),//变更后总价格
  bedOld: DS.belongsTo('bed'),//变更前床位
  bedOldReferencePrice:DS.attr('number'),//变更前床位参考价格
  bedPriceOld:DS.attr('number'),//变更前床位实际价格
  bedNew: DS.belongsTo('bed'),//变更后床位
  bedNewReferencePrice:DS.attr('number'),//变更后床位参考价格
  bedPriceNew:DS.attr('number'),//变更后床位实际价格
  foodLevelOld:DS.belongsTo('dicttypetenant'),//变更前餐饮标准
  foodLevelOldReferencePrice:DS.attr('number'),//变更前餐饮参考价格
  foodPriceOld:DS.attr('number'),//变更前餐饮实际价格
  foodLevelNew:DS.belongsTo('dicttypetenant'),//变更后餐饮标准
  foodLevelNewReferencePrice:DS.attr('number'),//变更后餐饮参考价格
  foodPriceNew:DS.attr('number'),//变更后餐饮标准实际价格
  nursingLevelOld:DS.belongsTo('nursinglevel'),//变更前护理等级
  nursingLevelOldReferencePrice:DS.attr('number'),//变更前护理参考价格
  projectPriceOld:DS.attr('number'),//变更前护理实际价格
  nursingLevelNew:DS.belongsTo('nursinglevel'),//变更后护理等级
  nursingLevelNewReferencePrice:DS.attr('number'),//变更后护理参考价格
  projectPriceNew:DS.attr('number'),//变更后护理实际价格
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
  bedChange:Ember.computed('bedNew',function(){
    if(this.get('bedNew.id')){
      return true;
    }else{
      return false;
    }
  }),
  foodChange:Ember.computed('foodLevelNew',function(){
    if(this.get('foodLevelNew.id')){
      return true;
    }else{
      return false;
    }
  }),
  levelChange:Ember.computed('nursingLevelNew',function(){
    if(this.get('nursingLevelNew.id')){
      return true;
    }else{
      return false;
    }
  }),
  priceChange:Ember.computed('priceOld','priceNew',function(){
    if(this.get('priceOld')!==this.get('priceNew')){
      return true;
    }else{
      return false;
    }
  }),
  chargeTypeFlag:Ember.computed('customer',function(){
    let customer = this.get('customer');
    if(!customer){
      return ;
    }
    let chargeType = customer.get('chargeType');
    if(chargeType.get('typecode')=='chargeTypeY'){
      return true;
    }else{
      return false;
    }
  }),
  chargeTypeChange:Ember.computed('chargeTypeOld',function(){
    if(!this.get('chargeTypeOld')&&this.get('chargeType.id')){
      return true;
    }else if(this.get('chargeTypeOld.id')&&this.get('chargeTypeOld.id')!==this.get('chargeType.id')){
      return true;
    }else{
      return false;
    }
  }),
  chargeTypeYFlag:Ember.computed('chargeType',function(){
    let chargeType = this.get('chargeType');
    if(chargeType.get('typecode')=='chargeTypeY'){
      return true;
    }else{
      return false;
    }
  }),
  statusChange:Ember.computed('customerStatusOld',function(){
    let customer = this.get('customerStatusOld');
    if(this.get('customerStatusOld.id')){
      return true;
    }else{
      return false;
    }
  }),
  //直接入住生成的变更记录
  newFlowFlag:Ember.computed('bedOld','foodLevelOld','nursingLevelOld','customerStatusOld','chargeTypeOld',function(){
    let bedOld = this.get('bedOld');
    let foodLevelOld = this.get('foodLevelOld');
    let nursingLevelOld = this.get('nursingLevelOld');
    let customerStatusOld = this.get('customerStatusOld');
    let chargeTypeOld = this.get('chargeTypeOld');
    //直接入住生成的变更记录，所有的变更前信息均为空
    if(!bedOld.get('id')&&!foodLevelOld.get('id')&&!nursingLevelOld.get('id')&&!customerStatusOld.get('id')&&!chargeTypeOld.get('id')){
      return true;
    }else{
      return false;
    }

  }),
});
export default Change;
