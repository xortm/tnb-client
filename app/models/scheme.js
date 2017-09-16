import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  title: DS.attr('string'), //名称
  contents: DS.attr('string'), //内容
  picPath: DS.attr('string'), //图片地址
  createTime: DS.attr('number'), //创建时间
  url: DS.attr('string'), //链接地址
  isChose: DS.attr('number'), //是否选择
  type: DS.belongsTo('dicttype'), //方案类型

  //根据规则拼出完整的url
  picPathUrl: Ember.computed('picPath', function() {
      var picPath = this.get("picPath");
      if (!picPath) {
          picPath = "upload-img.png";
          return this.get("pathConfiger").getJujiaLocalPath(picPath);
      }
      console.log("this.pathConfiger", this.get("pathConfiger"));
      return this.get("pathConfiger").getJujiaRemotePath(picPath);
  }),
  // 拼接时间
  createTimeStr:Ember.computed("createTime",function(){
    var createTime = this.get("createTime");
    return this.get("dateService").formatDate(createTime,"yyyy-MM-dd hh:mm");
  }),

});
