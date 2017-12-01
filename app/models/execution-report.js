import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  createTime: DS.attr('number'), //创建时间
  title: DS.attr('string'), //名称
  content: DS.attr('string'), //内容
  checkScore: DS.attr('number'), //签到分数
  mealScore: DS.attr('number'), //膳食分数
  sportScore: DS.attr('number'), //运动分数
  medicationScore: DS.attr('number'), //用药分数
  recoveryScore: DS.attr('number'), //康复分数
  customer:DS.belongsTo('customer'),//用戶
  //根据规则拼出完整的url
  picPathUrl: Ember.computed('title', function() {
      var title = this.get("title");
      if (!title) {
          return null;
      }
      console.log("this.pathConfiger", this.get("pathConfiger"));
      return this.get("pathConfiger").getEnclosureRemotePath(title);
  }),
  createTimeDate: Ember.computed("createTime", function() {
      var createTime = this.get("createTime");
      return this.get("dateService").timestampToTime(createTime);
  }),
  createTimeString: Ember.computed("createTime", function() {
      var createTime = this.get("createTime");
      if(createTime){
        return this.get("dateService").formatDate(createTime, "yyyy-MM-dd");
      }else {
        return '';
      }
  }),
});
