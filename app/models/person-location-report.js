import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
       dateService: Ember.inject.service('date-service'),
       createTime:DS.attr("number"),
       employee: DS.belongsTo('personlocation'),
       user:DS.belongsTo('user'),
       room:DS.belongsTo('room'),
       minitus:DS.attr("number"),
       wortTimeSetting:DS.belongsTo("worktimesetting"),
       generateTime:DS.attr("number"),
       timeStr:Ember.computed('minitus',function(){
         var minitus=this.get("minitus");
         var rtn="";
         var hour=parseInt(minitus/60);
          rtn+=hour<10?("0"+hour.toString()+":"):(hour.toString()+":");
         var min=minitus%60;
         rtn+=min<10?("0" +min.toString()+":00"):(min.toString()+":00");
         return rtn;
       }),
       createTimeStr:Ember.computed("createTime",function(){
         var time = this.get("createTime");
         time=time-24*60*60;//库里的时间是同步时间,比实际时间多一天,需要减一天
         return time?this.get("dateService").formatDate(time,"yyyy-MM-dd"):"";
         }),
         generateTimeStr:Ember.computed("generateTime",function(){
           var time = this.get("generateTime");
           return time?this.get("dateService").formatDate(time,"yyyy-MM-dd"):null;
           }),
});
