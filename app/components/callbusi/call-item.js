import Ember from 'ember';
import sideCardItem from '../ui/side-card-item';

/*通话信息组件*/
export default sideCardItem.extend({
  /*绑定数据*/
  call: null,//对应的通话记录

  /*动态监控状态变化，反向影响页面显示*/
  observeTask: function(){
    var showStatus = this.get("task").get("CRL_showStatus");
    console.log("CRL_showStatus change:" + showStatus);
    if(showStatus===1){
      this.set("showFunc",true);
    }else{
      this.set("showFunc",false);
    }
    if(showStatus===2){
      this.set("showApplyTip",true);
    }else{
      this.set("showApplyTip",false);
    }
  }.observes('task.CRL_showStatus'),
  showFunc:Ember.computed("task",function(){
      console.log("this task CRL_showStatus:" + this.get("task").get("CRL_showStatus"));
      console.log("this task " , this.get("task"));
      if(this.get("task").get("CRL_showStatus")===1){
        return true;
      }
      return false;
  }),
  showApplyTip:Ember.computed(function(){
      if(this.task.get("CRL_showStatus")===2||this.task.get("CRL_showStatus")===3||this.task.get("CRL_showStatus")===4){
        return true;
      }
      return false;
  }),
  //工作时段文字显示
  worktimeString: Ember.computed("task",function(){
    var _self = this;
    var promise =  new Ember.RSVP.Promise(function (resolve, reject) {
      _self.get("task").get("worktime").then(function(worktimes){
        var combineStr = worktimes.reduce(function(previousValue, worktime){
          console.log("beginHour in:" + worktime.get("beginHour"));
          return previousValue + worktime.get("beginHour") + ":00--" + worktime.get("endHour") + ":00,";
        }, "");
        console.log("combineStr:" + combineStr);
        resolve(combineStr);
      });
    });
    var result = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin).create({
      promise: promise
    });
    return result;
  }),

  actions:{
    applyTask(){
      console.log('======1=1=======1=======111111=========='+this.task.get("CRL_showStatus"));
        console.log("apply task in");
        this.sendAction("applyTask",this.get("task"));
    }
  }
});
