import Ember from 'ember';
const { taskStatus_isPassed,taskStatus_isEnd,taskStatus_begin } = Constants;

export default Ember.Component.extend({
  statusService: Ember.inject.service("current-status"),
  tagName: "div",
  classNameBindings:["isRow:row"],
  isRow: true,
  pathConfiger: Ember.inject.service("path-configer"),
  task: null,//任务数据
  imgSrc:Ember.computed('task',function(){
    var task = this.get('task');
    if(task.get('callType') == 1){
      this.set('imgWidth',25);
      this.set('imgTitle','外呼型');
      return "assets/images/callout.png";
    }
    this.set('imgWidth',20);
    this.set('imgTitle','综合型');
    return "assets/images/callunit.png";
  }),
  taskLanguage:Ember.computed('task.get("language").[]',function(){
    var task = this.get('task');
    if(task){
      var taskLanguage = this.get('task').get('language');
      if(taskLanguage){
        console.log('taskLanguage get in nodetail page before',taskLanguage);
        var result = taskLanguage.reduce(function(previousValue,language){
          return previousValue +language.get('typename')+ '  ';
        },'');
        return result;
      }
    }
  }),
  statusShow:Ember.computed('task',function(){
    var task = this.get('task');
    console.log('task get in statusShow',task);
    if(task){
      console.log('in task of if',task.get('status').get('typecode'));
    if(task.get('status').get('typecode') == taskStatus_begin){
        return '任务已开始';
    }
    if(task.get('runstatus') == 0 && task.get('status').get('typecode') == taskStatus_isEnd){
        return '任务已结束';
    }
    if(task.get('runstatus') == 0 && task.get('status').get('typecode') == taskStatus_isPassed){
        return '任务未开始';
    }
  }
  }),
  /*动态监控状态变化，反向影响页面显示*/
  observeTask: function(){
    var showStatus = this.get("task").get("CRL_showStatus");
    console.log("CRL_showStatus change:" + showStatus);
    // if(showStatus===1){
    //   this.set("showFunc",true);
    // }else{
    //   this.set("showFunc",false);
    // }
    // if(showStatus===2){
    //   this.set("showApplyTip",true);
    // }else{
    //   this.set("showApplyTip",false);
    // }
    // if(showStatus===1){
    //   this.set("showApplyTip",false);
    // }
    // else{
    //   this.set("showApplyTip",true);
    // }
  }.observes('task.CRL_showStatus'),
  // showApplyTip:Ember.computed(function(){
  //   console.log('======1=1=======1=======111111=========='+this.get('task').get("CRL_showStatus"));
  //     // if(this.task.get("CRL_showStatus")===2||this.task.get("CRL_showStatus")===3||this.task.get("CRL_showStatus")===4){
  //     //   return true;
  //     // }
  //     // return false;
  //     if(this.task.get("CRL_showStatus")===2){
  //       return '2';
  //     }
  //     if(this.task.get("CRL_showStatus")===2){
  //       return '2';
  //     }
  //     if(this.task.get("CRL_showStatus")===2){
  //       return '2';
  //     }
  // }),
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
  // taskTypes:Ember.computed("task",function(){
  //   // this.get('store').query('task',{filter:{taskTypes:{}}});
  //   return task.get('taskTypes');
  // }),
  //任务图标
  taskIcon:Ember.computed(function(){
    var iconfile = this.task.get("iconFile");
    return this.get("pathConfiger").getTaskiconRemotePath(iconfile);
  }),

  // actions:{
  //   applyTask(){
  //       console.log("apply task in");
  //       this.sendAction("applyTask",this.get("task"));
  //   }
  // }
});
