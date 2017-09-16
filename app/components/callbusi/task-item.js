import Ember from 'ember';
import ItemGestures from '../ui/mobile/item-gestures';
const { authenticate_succ,taskStatus_isPassed,taskStatus_isEnd,taskStatus_begin} = Constants;


export default Ember.Component.extend(ItemGestures,{
  feedService: Ember.inject.service('feed-bus'),
  store: Ember.inject.service('store'),
  tagName: "div",
  classNameBindings:["isRow:row"],
  isRow: true,
  pathConfiger: Ember.inject.service("path-configer"),
  statusService: Ember.inject.service("current-status"),
  // task: null,//任务数据
  testParams: "test",
  source:'',
  alertmodal:false,
  task:null,
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
  redtype:Ember.computed('task',function(){
    var task = this.get('task');
    if(task){
    if(task.get('status').get('typecode') == taskStatus_begin){
        return true;
    }
    return false;
    }
  }),
  statusShow:Ember.computed('task',function(){
    var task = this.get('task');
    console.log('task get in statusShow',task);
    if(task){
      console.log('in task of if',task.get('status').get('typecode'));
    if(task.get('status').get('typecode') == taskStatus_begin){
      // this.set('redtype',true);
        return '任务已开始';
    }
    if(task.get('runstatus') == 0 && task.get('status').get('typecode') == taskStatus_isEnd){
      // this.set('redtype',false);
        return '任务已结束';
    }
    if(task.get('runstatus') == 0 && task.get('status').get('typecode') == taskStatus_isPassed){
      // this.set('redtype',false);
        return '任务未开始';
    }
  }
  }),
  // content:Ember.computed(function(){
  //   var curuser = this.get('statusService').getUser();
  //   return curuser.get('phone');
  // }),
  // applyDisabled: Ember.computed(function(){
  //   var _self = this;
  //   var reg = /^1[0-9]\d{9}$/;
  //   // if(this.get('content').match(/^1[3|4|5|8][0-9]\d{4,8}$/)) {//改变成正则表达式判断
  //   console.log('reg get in item',reg.test(this.get('content')));
  //     if(reg.test(this.get('content'))) {
  //       _self.set('visibility',false);
  //     console.log('false here in js');
  //     return false;
  //   }
  //   else {
  //     _self.set('visibility',true);
  //     console.log('true here in js');
  //     return true;
  //   }
  // }).property('content'),
  /*动态监控状态变化，反向影响页面显示*/
  observeTask: function(){
    console.log('task get in observeTask',this.get("task"));
    var showStatus = this.get("task").get("CRL_showStatus");
    // var isFull = this.get('task').get('extendIfo').get('isFull');
    console.log("CRL_showStatus change in item12345:" + showStatus);
    // console.log('isFullget',isFull);
    if(showStatus===1){
      this.set("showFunc",true);
    }else{
      this.set("showFunc",false);
    }
    // if(showStatus===2){
    //   this.set("showApplyTip",true);
    // }else{
    //   this.set("showApplyTip",false);
    // }
  }.observes('task.CRL_showStatus'),
  showFunc:Ember.computed("task",function(){
    console.log('task get in tasksk-item',this.get('task'));
    var task = this.get('task');
    if(task){
      var isFull = task.get('extendIfo').get('isFull');
      console.log("this task CRL_showStatus:" +task.get("CRL_showStatus"));
      console.log("this task isFull" ,isFull);
      console.log('task get in showFunc',task);
      if(task.get("CRL_showStatus")===1){
        console.log('true here !!');
        return true;
      }
      return false;
    }
  }),
  inviteRemark:Ember.computed('task',function(){
    var task = this.get('task');
    console.log('fnewofnew',task);
    this.queryInvitation(task);
  }),
  observetask:function(){
    var task = this.get('task');
    console.log('get task in observe',task);
    this.queryInvitation(task);
    this.queryfailReason(task);
  }.observes('task'),
  failreason:Ember.computed('task',function(){
    var task = this.get('task');
    console.log('fnewofnew fail',task);
    this.queryfailReason(task);
  }),
  queryfailReason(task){
    var _self = this;
    var curuser = this.get('statusService').getUser();
    // var Controller = App.lookup("controller:business.mainpage.task-detail");
    // console.log('dagfsdddddddddddddd',Controller.queryfailReason(task));
    _self.get('store').query('user-task',{filter:{task:{id:task.get('id')},user:{id:curuser.get('id')}}}).then(function(usertasks){

        var usertask = usertasks.get('firstObject');
        console.log('ewifnwe',usertask);
        if(usertask){
        var failreason = usertask.get('verifyFailReason');
        console.log('failreason',failreason);
        _self.set('failreason',failreason);
      }
    });
  },
  queryInvitation(task){
    console.log('fweinfwaejndqwbdcf',task);
    var _self = this;
    //mainController: Ember.inject.controller('business.mainpage'),
    var Controller = App.lookup("controller:business.mainpage.task-detail");
    // Controller.send("queryInvitation",task);
    console.log('dagfsdddddddddddddd',Controller.queryInvitation(task));
    Controller.queryInvitation(task).then(function(invitations){
      var invitation = invitations.get('firstObject');
      console.log('invitation.remark in js',invitation);
      // return invitation;
      _self.set('inviteRemark',invitation);
    });
  },
  // showApplyTip:Ember.computed(function(){
  //     if(this.task.get("CRL_showStatus")===2||this.task.get("CRL_showStatus")===3||this.task.get("CRL_showStatus")===4){
  //       return true;
  //     }
  //     return false;
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

  // applyTask(){
  //   console.log('in apply task now ~');
  //   this.send('applyTask');
  // },

  actions:{
    // applyTask(){
    //   var _self = this;
    //   console.log('======1=1=======1=======111111=========='+this.task.get("CRL_showStatus"));
    //     console.log("apply task in");
    //     var content = _self.get('content');
    //       _self.set('applyDisabled',true);//防止多次点击 申请按钮
    //       _self.sendAction("applyTask",content);
    // },

    cancelPassSubmit(){
        this.set("showPopPasschangeModal",false);
    },

    popFollow(){
      // console.log('esttseewtweraserae','a'+1);
      // console.log('function popfollow detail in');
      // console.log('function popfollow detail in',this.get('showPopPasschangeModal'));
      // var curUser = this.get('statusService').getUser();
      // if(curUser.get('status')==authenticate_succ){
      //   // this.set('applyDisabled',true);
      //   this.set("showPopPasschangeModal",true);
      // }
      // else{
      //   this.set('alertmodal',true);
      // }
      this.sendAction('popFollow');
    },
    agreeApplyed(task){
      // var curUser = this.get('statusService').getUser();
      // if(curUser.get('status')==authenticate_succ){
        // console.log('in jiodfnwenf');
        this.sendAction('agreeApplyed',task);
      // }
      // else{
      //   console.log('in jiodfnwenf else');
      //   this.set('alertmodal',true);
      // }
      // console.log('in jiodfnwenf ifififf',this.get('alertmodal'));
      // console.log('in agree applyof item',task);
    },
    refuseApplyed(task){
      // var curUser = this.get('statusService').getUser();
      // if(curUser.get('status')==authenticate_succ){
          this.sendAction('refuseApplyed',task);
      // }
      // else{
      //   this.set('alertmodal',true);
      // }
    },
  }
});
