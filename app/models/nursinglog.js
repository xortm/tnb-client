import DS from 'ember-data';
import BaseModel from './base-model';

var Nursinglog = BaseModel.extend({
  dataService: Ember.inject.service("date-service"),
  nurscustomer:DS.belongsTo('customer'),//对应的老人
  recordUser:DS.belongsTo('employee'),//记录人
  createUser:DS.belongsTo('user'),//创建人
  remark:DS.attr('string'),//护理内容
  nursingDate:DS.attr('number'),//护理日期
  recordTime:DS.attr('number'),//记录时间

  //记录时间
  recordTimeDate:Ember.computed("recordTime",function(){
    var recordTime1=this.get("recordTime");
    return this.get("dataService").timestampToTime(recordTime1);
  }),
  recordTimeString:Ember.computed("recordTime",function(){
    var recordTime1= this.get("recordTime");
    if(recordTime1=== null){
      return this.get("dataService").getCurrentTime();
    }
    return this.get("dataService").formatDate(recordTime1,"yyyy-MM-dd hh:mm");
  }),
  recordTimeStringNMddhhmm:Ember.computed("recordTime",function(){
    var recordTime1= this.get("recordTime");
    if(recordTime1=== null){
      return this.get("dataService").getCurrentTime();
    }
    return this.get("dataService").formatDate(recordTime1,"MM/dd hh:mm");
  }),

  //护理日期
  nursinglogDate:Ember.computed("nursingDate",function(){
    var recordTime=this.get("nursingDate");
    return this.get("dataService").timestampToTime(recordTime);
  }),
  nursinglogDateString:Ember.computed("nursingDate",function(){
    var logTime = this.get("nursingDate");
    return this.get("dataService").formatDate(logTime,"yyyy-MM-dd");

    }),

    remarkContent:Ember.computed('remark',function(){
      let remark = this.get("remark");
      if(remark){
        let content;
        if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
          content = JSON.parse(remark).content;
          return content;
        }else {
          return remark;
        }
      }
    }),

    remarkHasApplyNum:Ember.computed('remark',function(){
      let remark = this.get("remark");
      let str = '';
      if(remark){
        if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
          console.log("nursinglogremarkHasApplyNum remark",remark);
          if((JSON.parse(remark).logTag)){
            let logTag = JSON.parse(remark).logTag;
            console.log("nursinglogremarkHasApplyNum logTag",logTag);
            if(logTag==536){//因为存在数据库中的是id  dicttype 只能用id判断 已完成
              str = 1;
            }else if (logTag==535) {//需跟进
              str = 2;
            }else if (logTag==537) {//总结
              str = 3;
            }
            // logTag.forEach(function(item){//数据改变放弃数组
            //   if(item==536){//因为存在数据库中的是id  dicttype 只能用id判断 已完成
            //     console.log("nursinglogremarkHasApplyNum 536  item",item);
            //     str = 1;
            //   }else if (item==535) {//需跟进
            //     str = 2;
            //   }else if (item==537) {//总结
            //     str = 3;
            //   }
            // });
          }else {
            str = str;
          }
        }else {
          str = str;
        }
      }
      return str;
    }),

    remarkTagString:Ember.computed('remark',function(){
      let remark = this.get("remark");
      let str = '';
      if(remark){
        if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
          console.log("nursinglogremarkHasApplyNum remark",remark);
          if((JSON.parse(remark).logTag)){
            let logTag = JSON.parse(remark).logTag;
            console.log("nursinglogremarkHasApplyNum logTag",logTag);
            if(logTag==536){//因为存在数据库中的是id  dicttype 只能用id判断 已完成
              str = '已完成';
            }else if (logTag==535) {//需跟进
              str = '需跟进';
            }else if (logTag==537) {//总结
              str = '总结';
            }
          }else {
            str = str;
          }
        }else {
          str = str;
        }
      }
      return str;
    }),

    remarkTag:Ember.computed('remark',function(){
      let remark = this.get("remark");
      if(remark){
        if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
          console.log("nursinglogremarkHasApplyNum remark",remark);
          if((JSON.parse(remark).logTag)){
            let logTag = JSON.parse(remark).logTag;
            console.log("nursinglogremarkHasApplyNum logTag",logTag);
            return logTag;
          }
        }
      }
    }),


});

export default Nursinglog;
