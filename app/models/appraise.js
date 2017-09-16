import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
      dateService: Ember.inject.service('date-service'),
      name: DS.attr('string'), //名称
      createUser:DS.belongsTo("user"),//创建人
      completeStatus:DS.attr("number"),//完成状态
      endTime:DS.attr("number"),//结束时间
      items:DS.hasMany('appraise-item'),//评价条目
      results:DS.hasMany('appraise-result'),//评价结果
      remark:DS.attr("string"),//备注
      publishStatus:DS.attr("number"),//发布状态
      publichNum:DS.attr("number"),//发布次数
      incluedEmplooye:DS.attr("number"),//是否进行员工评价,0否1是

      endTimeShortString: Ember.computed("endTime", function() {
          var endTime = this.get("endTime");
          if(!endTime){return null;}
          var timeStr = this.get("dateService").formatDate(endTime, "MM-dd hh:mm");
          var timeString = timeStr.replace(/-0/,"月");
          timeString = timeString.replace(/-/,"月");
          timeString = timeString.replace(/ /,"日 ");
          console.log("timeString.charAt(0):",timeString.charAt(0));
          if(timeString.charAt(0) == "0"){
            var endTimeShortString = timeString.substring(1);
            return endTimeShortString;
          }else{
            return timeString;
          }
      }),

});
