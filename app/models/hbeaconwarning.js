import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

//预警
var hbeaconWarning = BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    deviceId: DS.attr("string"), //按键id，与老人绑定
    scannerId: DS.attr("string"), //设备id，与老人绑定
    callTime: DS.attr("number"), //呼叫时间
    reason: DS.attr("string"), //预警说明
    operater: DS.belongsTo('employee'), //处理人
    bed: DS.belongsTo('bed'), //床位
    flag: DS.belongsTo('dicttype'), //处理标识
    operateNote: DS.attr("string"), //处理说明
    caller: DS.belongsTo('customer'), //呼叫老人
    createDateTime: DS.attr("number"), //创建时间
    cancelTime:DS.attr('number'),//复位时间
    operateTime:DS.attr('number'),//处理时间
    cancelTimeStr:Ember.computed("cancelTime", function() {
        var cancelTime = this.get("cancelTime");
        return cancelTime?this.get("dateService").formatDate(cancelTime, "yyyy-MM-dd hh:mm:ss"):'无';
    }),
    status: Ember.computed("flag", function() {
        var flag = this.get("flag");
        if (flag == "hbeaconWarningCalling") {
            return "未处理";
        } else {
            return "已处理";
        }
    }),
    callTimeDate: Ember.computed("callTime", function() {
        var callTime = this.get("callTime");
        return this.get("dateService").timestampToTime(callTime);
    }),
    callTimeString: Ember.computed("callTime", function() {
        var callTime = this.get("callTime");
        return this.get("dateService").formatDate(callTime, "yyyy-MM-dd hh:mm:ss");
    }),
    createDateTimeShortString: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        if(!createDateTime){return null;}
        var timeStr = this.get("dateService").formatDate(createDateTime, "MM-dd hh:mm");
        var timeString = timeStr.replace(/-0/,"月");
        timeString = timeString.replace(/-/,"月");
        timeString = timeString.replace(/ /,"日 ");
        console.log("timeString.charAt(0):",timeString.charAt(0));
        if(timeString.charAt(0) == "0"){
          var createDateTimeShortString = timeString.substring(1);
          return createDateTimeShortString;
        }else{
          return timeString;
        }
    }),
    cancelTimeShortString: Ember.computed("cancelTime", function() {
        var cancelTime = this.get("cancelTime");
        if(!cancelTime){return null;}
        var timeStr = this.get("dateService").formatDate(cancelTime, "MM-dd hh:mm");
        var timeString = timeStr.replace(/-0/,"月");
        timeString = timeString.replace(/-/,"月");
        timeString = timeString.replace(/ /,"日 ");
        console.log("timeString.charAt(0):",timeString.charAt(0));
        if(timeString.charAt(0) == "0"){
          var cancelTimeShortString = timeString.substring(1);
          return cancelTimeShortString;
        }else{
          return timeString;
        }
    }),
    createTimeString: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd hh:mm:ss");
    }),
    operateTimeShortString: Ember.computed("operateTime", function() {
        var operateTime = this.get("operateTime");
        if(!operateTime){return null;}
        var timeStr = this.get("dateService").formatDate(operateTime, "MM-dd hh:mm");
        var timeString = timeStr.replace(/-0/,"月");
        timeString = timeString.replace(/-/,"月");
        timeString = timeString.replace(/ /,"日 ");
        console.log("timeString.charAt(0):",timeString.charAt(0));
        if(timeString.charAt(0) == "0"){
          var operateTimeShortString = timeString.substring(1);
          return operateTimeShortString;
        }else{
          return timeString;
        }
    }),
});
export default hbeaconWarning;
