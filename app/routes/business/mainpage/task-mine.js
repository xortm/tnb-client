import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
const { taskStatus_isEnd,taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend(Pagination,{
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  header_title: "查看自己的任务",
  model() {
    // var model = {statusList: {}, taskList: {}};
    // model.statusList = this.getstatusList();
    // model.taskList = this.gettaskList();
    // return new Ember.RSVP.hash(model);
    if(this.get("global_curStatus.isMobile")){
      return this.gettaskList();
    }
    return {};
  },
  getstatusList: function () {
    var _self = this;
    var statusList = new Ember.RSVP.Promise(function (resolve, reject) {
      _self.get("store").query("dicttype",{filter:{typegroup:{typegroupcode:'taskApplyStatus'}}}).then(function(lists) {
        console.log('statuslistget',lists);
        resolve(lists);
      });
    });
    console.log('statusListget',statusList);
    return statusList;
  },
  getParams:function(){
    var params = this.pagiParamsSet();
    var curController = this.getCurrentController();
    console.log('fadfdsf',curController);
    var filter = {};
    var curUser = this.get("global_curStatus").getUser();
    var curTask = this.get("global_curStatus").getTask().get('task');
    filter = $.extend({},filter,{user:{id:curUser.get('id')}});
    if(curController && curController.get('statusSel')){
      var status = curController.get('statusSel');
      console.log('status get in taskine',status);
        filter = $.extend({},filter,{status:{id:status.get('id')}});
    }
    if(curController && curController.get('onGoingChoose')){
      console.log('aaabb');
        filter = $.extend({},filter,{task:{status:{'typecode@$or1---1':taskStatus_begin,'typecode@$or1---2':taskStatus_isPassed}}});
    }
    if(curController && curController.get('hasCompletedChoose')){
        filter = $.extend({},filter,{task:{status:{typecode:taskStatus_isEnd}}});
    }
    params.filter = filter;
    var sort={task:{updateTime:'desc'}};
    params.sort = sort;
    console.log('status get in task-mine!! params',params);
    return params;
  },
  gettaskList:function(){
    console.log('in here two');
    var _self = this;
    var curuser= _self.get("global_curStatus").getUser();//'user-task',{filter{user:{id:user.get('id')}}}
    // var taskList = new Ember.RSVP.Promise(function(resolve,reject){
    //   _self.get('store').query("userTask",{filter:{user:{id:curuser.get('id')}}}).then(function(lists){
    //     console.log('tasklistget',lists);
    //     resolve(lists);
    //   });
    // });
    //
    var params = this.getParams();
    console.log('params get in task-mine',params);
    var taskList;
    // var Controller = this.getCurrentController();
    var Controller = App.lookup('controller:business.mainpage.task-mine');
    if(this.get("global_curStatus.isMobile")){
      // var Controller = this.get("controller");
      console.log('fwefwefe',Controller);
      taskList = Controller.infiniteQuery('userTask',params,function(List){
        _self.setStatus(List);
      });
    }
    else{
        taskList = _self.findPaged('userTask',params,function(list){
        _self.setStatus(list);
        console.log('taskListget in findPaged',list);
      });
    }
    console.log('taskListget',taskList);
    return taskList;
  },
  setupController(controller,model){
    var _self = this;
    this._super(controller, model);
    controller.setProperties(model);
    controller.set('taskList', _self.gettaskList());
    controller.reopen({
      hasCompletedChoose:false,
      onGoingChoose:true,
      dropdownTitle: '全部',
      csname: '',
      currentUser: Ember.computed(function(){
        return this.get("global_curStatus").getUser();
      }),
      actions:{
        taskStatus: function (sta) {
          // this.set('status',value);
          this.set('statusSel',sta);
          var taskList = _self.gettaskList();
          this.set('taskList',taskList);
        },
        gotoDetailPage(task){
          console.log("gotoDetailPage,task",task);
          var tid = task.get("id");
          var pubuserId = task.get('pubuser').get('id');
          var params = {
            task_id:tid,
            pubuserId:pubuserId,
            source:2
          };
          // this.transitionToRoute("/business/mainpage/task-detail/"+tid+"/2");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('task-detail',params);
        },
        onGoing(){
          this.set('onGoingChoose',true);
          this.set('hasCompletedChoose',false);
           controller.set('taskList', _self.gettaskList());
          // this.set('taskList',taskList);
          // console.log('aaain',this.get('taskList'));
        },
        hasCompleted(){
          this.set('hasCompletedChoose',true);
          this.set('onGoingChoose',false);
          controller.set('taskList', _self.gettaskList());
          // this.set('taskList',taskList);
          // console.log('bbbin',this.get('taskList'));
        }
      }
    });
    controller.set('statusList',_self.getstatusList());
  },
  // listenner: function() {
  //   console.log('in listenner');
  //   this.get('feedService').on('headerEvent_queryTask', this, 'gettaskList');
  // }.on('init'),
  // //注销时清除事件绑定
  // cleanup: function() {
  //   console.log('in cleanup');
  //   this.get('feedService').off('headerEvent_queryTask', this, 'gettaskList');
  // }.on('willDestroyElement'),
  setStatus(tasks){
    console.log('tasksget in setStatus',tasks);
    var _self = this;
    var curuser = this.get('global_curStatus').getUser();
    // tasks.then(function(userTasks){
      tasks.forEach(function(userTask){
        // Task.set('CRL_showStatus',1);
        console.log('Task get in square',userTask);
        console.log('set status here ',userTask.get('id'));
      _self.get('store').findRecord('task',userTask.get('task').get('id')).then(function(ttask){
        // var ttask = task.get('firstObject');
        // if(!userttask){
        //   console.log('usertask get undefined in',Task.get('extendIfo').get('isFull'));
        //   if(Task.get('extendIfo').get('isFull') == 1){
        //     console.log('innnnnnn');
        //     Task.set("CRL_showStatus",8);
        //   }
        //   else{
        //   Task.set("CRL_showStatus",1);
        //   }
        // }
        // else{
        if(userTask.get("status").get("typecode")===taskApplyStatus_apply){
          console.log('in apply~~');
          ttask.set("CRL_showStatus",2);
          console.log('in apply~~ status',ttask.get('CRL_showStatus'));
        }
        else if(userTask.get("status").get("typecode")===taskApplyStatus_applySuc){
          console.log('in apply succ');
          ttask.set("CRL_showStatus",3);
          console.log('in apply succ status',ttask.get('CRL_showStatus'));
        }
        else if(userTask.get("status").get("typecode")===taskApplyStatus_applyFail){
          console.log('in apply fail');
          ttask.set("CRL_showStatus",4);
          console.log('in apply fail status',ttask.get('CRL_showStatus'));
        }
        else if(userTask.get("status").get("typecode")===taskApplyStatus_invited){
          ttask.set("CRL_showStatus",5);
        }
        else if(userTask.get("status").get("typecode")===taskApplyStatus_SuccNotLocateSeat){
          ttask.set("CRL_showStatus",6);
        }
        else if(userTask.get("status").get("typecode")===taskApplyStatus_refuseInvitation){
          ttask.set("CRL_showStatus",7);
        }
      // }
        // else{
        //   Task.set('CRL_showStatus',1);
        // }
        });

      });
    // });

  },
});
