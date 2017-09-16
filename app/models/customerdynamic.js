import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*老人动态*/
var Customerdynamic = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  title: DS.attr('string'),//标题
  contents: DS.attr('string'),//内容
  customer:DS.belongsTo('customer'),//客户
  tenant:DS.belongsTo('tenant'),//租户
  createDateTime: DS.attr('number'),//创建时间
  createUser: DS.belongsTo('user'),//创建人
  lastUpdateDateTime: DS.attr('number'),//更改时间
  lastUpdateUser: DS.belongsTo('user'),//更改人
  delStatus:DS.attr('number'),//删除状态 1已删除0未删除
  remark: DS.attr('string'),//备注
  picPath: DS.attr('string'),//图片地址
  videoInfo: DS.belongsTo('video-info'),//视频信息
  dynamicType: DS.belongsTo('dicttype'),//动态类型(typecode:dynamicType)
  readStatus:DS.attr('number'),//是否已读 0否1是 默认0

  createTimeString:Ember.computed("createDateTime",function(){
    var createTime=this.get("createDateTime");
    return this.get("dateService").formatDate(createTime,"yyyy-MM-dd");
  }),

  createTimeStr:Ember.computed("createDateTime",function(){
    var createTime=this.get("createDateTime");
    return createTime?this.get("dateService").formatDate(createTime, "MM-dd hh:mm"):'无';
  }),

  picPathUrl: Ember.computed('picPath', function() {
      var picPath = this.get('picPath');
      if (!picPath) {
          picPath = "drug-img.png";
          return this.get("pathConfiger").getAvatarLocalPath(picPath);
      }
      return this.get("pathConfiger").getAvatarRemotePath(picPath);
  }),

});
export default Customerdynamic;
