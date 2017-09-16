import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
      dateService: Ember.inject.service('date-service'),
      createTime:DS.attr("number"),//打分时间
      name: DS.attr('string'), //名称
      indicatorType:DS.belongsTo("assessment-indicator"),//考核项分类
      examOfficer:DS.belongsTo("employee"),//打分人
      examOfficerUser:DS.belongsTo("user"),//打分用户
      examiner:DS.belongsTo("employee"),//考核对象
      point:DS.attr("number"),//分数
      remark:DS.attr("string"),//备注
      examTime:DS.attr("number"),//考核时间
      type:DS.belongsTo('dicttype'),//考核类型
      results:DS.hasMany('assessment-indicator-result'),//考核结果集
      createTimeStr: Ember.computed("createTime",function(){
        var time=this.get("createTime");
        return time? this.get("dateService").formatDate(time,"MM-dd hh:mm"):null;
      }),
      createTimeDate:Ember.computed("createTime",function(){
        var time=this.get("createTime");
        return time?this.get("dateService").timestampToTime(time):null;
      }),
      examTimeStr: Ember.computed("examTime",function(){
        var time=this.get("examTime");
        return time? this.get("dateService").formatDate(time,"yyyy-MM-dd"):null;
      }),
      examTimeString: Ember.computed("examTime",function(){
        var time=this.get("examTime");
        return time? this.get("dateService").formatDate(time,"yyyy-MM-dd"):null;
      }),
     examTimeDate:Ember.computed("examTime",function(){
        var time=this.get("examTime");
        return time?this.get("dateService").timestampToTime(time):null;
      }),
});
