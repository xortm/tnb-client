import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  title:DS.attr('string'),//标题
  contents:DS.attr('string'),//内容
  picPath:DS.attr('string'),//图片地址
  type:DS.belongsTo('dicttype'),//类型
  sportType:DS.belongsTo('dicttype'),//运动类型
  sportTime:DS.attr('number'),//运动时间
  customer:DS.belongsTo('customer'),//用户
  scheme:DS.belongsTo('scheme'),//方案
  createTime:DS.attr('number'),//创建时间
  // 创建时间序列化
  createTimeStr:Ember.computed("createTime",function(){
    var createTime = this.get("createTime");
    return this.get("dateService").formatDate(createTime,"yyyy-MM-dd hh:mm");
  }),

  //根据规则拼出完整的url
  picPathUrl: Ember.computed('picPath', function() {
      var picPath = this.get("picPath");
      if (!picPath) {
          picPath = "anonymous.png";
          return this.get("pathConfiger").getAvatarLocalPath(picPath);
      }
      console.log("this.pathConfiger", this.get("pathConfiger"));
      return this.get("pathConfiger").getJujiaRemotePath(picPath);
  }),

});
