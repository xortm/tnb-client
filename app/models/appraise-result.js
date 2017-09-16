import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
      dateService: Ember.inject.service('date-service'),
      appraiseUser:DS.belongsTo("user"),//评价用户
      appraiseCustomer:DS.belongsTo("customer"),//评价人
      appraiseTime:DS.attr("number"),//评价时间
      appraise:DS.belongsTo('appraise'),//相关评价
      items:DS.hasMany('appraise-result-item'),//评价条目
      employee:DS.belongsTo("employee"),//评价员工

      appraiseTimeStr:Ember.computed("appraiseTime", function() {
          var appraiseTime = this.get("appraiseTime");
          return appraiseTime?this.get("dateService").formatDate(appraiseTime, "MM-dd hh:mm"):'无';
      }),

      appraiseTimeShortString: Ember.computed("appraiseTime", function() {
          var appraiseTime = this.get("appraiseTime");
          if(!appraiseTime){return null;}
          var timeStr = this.get("dateService").formatDate(appraiseTime, "MM-dd hh:mm");
          var timeString = timeStr.replace(/-0/,"月");
          timeString = timeString.replace(/-/,"月");
          timeString = timeString.replace(/ /,"日 ");
          console.log("timeString.charAt(0):",timeString.charAt(0));
          if(timeString.charAt(0) == "0"){
            var appraiseTimeShortString = timeString.substring(1);
            return appraiseTimeShortString;
          }else{
            return timeString;
          }
      }),
});
