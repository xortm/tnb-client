import DS from 'ember-data';
import BaseModel from './base-model';

var Drug = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  name:DS.attr('string'),//药品名称
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  drugType:DS.belongsTo('dicttype'),//药品类型
  drugForm:DS.belongsTo('drugFormType'),//药品制剂
  // drugForm:DS.belongsTo('drugFormType', {async: false}),//药品制剂
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  createUser:DS.belongsTo('user'),//创建者ID
  remark:DS.attr('string'),//备注
  drugFactory:DS.attr('string'),//药品厂家
  drugSpec:DS.belongsTo('dicttype'),//剂型
  drugNum:DS.attr('number'),//数量
  spec:DS.attr('string'),//最小规格
  unit:DS.attr('string'),//剂量单位
  generalName:DS.attr('string'),//通用名称
  headImg:DS.attr('string'),//图片地址
  printType:DS.attr('number'),//0,普通药品，1，特殊药品，用来区分如何打印
  printTypeName:Ember.computed('printType',function(){
    let printType = this.get('printType');
    if(printType == 1){
      return '特殊';
    }else{
      return '普通';
    }
  }),
  avatarUrl: Ember.computed('headImg', function() {
      var avatar = this.get('headImg');
      if (!avatar) {
          avatar = "drug-img.png";
          return this.get("pathConfiger").getAvatarLocalPath(avatar);
      }
      return this.get("pathConfiger").getAvatarRemotePath(avatar);
  }),
});

export default Drug;
