import Ember from 'ember';
import BaseBusiness from '../base-business';
const {taskStatus_submitted,taskStatus_saved,authenticate_forbidden,authenticate_not,authenticate_yes,authenticate_succ,authenticate_fail} = Constants;

export default BaseBusiness.extend({
  header_title: '发布任务',
  queryParams: {
    task_id: {
      refreshModel: true
    },
  },
  model() {
    return;
  },
  //设置controller信息，不再单独建立controller文件
  setupController: function(controller,model){
    var _self = this;
    controller.set('callinPayError',false);
    controller.set('onlinePayError',false);
    controller.set('calloutPayError',false);
    controller.set('poPayError',false);
    controller.set('csNeedError',false);
    controller.set('chooseDateFromError',false);
    controller.set('descError',false);
    controller.set('titleError',false);
    controller.set('taskTypesError',false);
    controller.set('workTimesError',false);
    controller.set('typeOne',true);
    controller.set('typeTwo',true);
    controller.set('submitTaskDisa',false);
    controller.set('saveTaskDisa',false);
    this._super(controller, model);
    _self.store.query('dicttype',{filter:{'typegroup':{'typegroupcode':'csLanguage'}}}).then(function(lanDicts) {
      lanDicts.forEach(function(lan) {
        lan.set('checked',false);
      });
      controller.set('language',lanDicts);
      _self.store.query('worktime',{filter:{}}).then(function(worktimes) {
        worktimes.forEach(function(worktime) {
          worktime.set('checked',false);
        });
        controller.set('workTimes',worktimes);
        _self.store.query('dicttype',{filter:{'typegroup':{'typegroupcode':'tasktype'}}}).then(function(dicttypes) {
          var typeOne = new Ember.A();
          var typeTwo = new Ember.A();
          dicttypes.forEach(function(dicttype) {
            dicttype.set('checked',false);
          });
          if(controller.get('task_id')) {
            _self.store.findRecord('task',controller.get('task_id')).then(function(task) {
              task.get('language').forEach(function(lan) {
                lan.set('checked',true);
              });
              task.get('worktimes').forEach(function(time) {
                time.set('checked',true);
              });
              task.get('taskTypes').forEach(function(type) {
                controller.set('typeOne',false);
                if(type.get('remark') === 2) {
                  controller.set('typeTwo',false);
                }
                type.set('checked',true);
              });
            });
          }
          dicttypes.forEach(function(dicttype) {
            if(dicttype.get('remark') === 1) {
              typeOne.pushObject(dicttype);
            }
            else if(dicttype.get('remark') === 2) {
              typeTwo.pushObject(dicttype);
            }
          });
          controller.set('taskTypesOne',typeOne);
          controller.set('taskTypesTwo',typeTwo);
        });
      });
    });
    if(controller.get('task_id')) {
      this.store.findRecord('task',controller.get('task_id')).then(function(task) {
        controller.set('task',task);
        var beginTime = task.get('beginDateComp');
        var endTime = task.get('endDateComp');
        if(beginTime&&(!endTime||(endTime=='待定'))) {
          controller.set('durType','长期');
        }
        else if (beginTime&&endTime&&(endTime!='待定')) {
          controller.set('durType','短期');
        }
        else {
          controller.set('durType','');
        }
      });
    }
    else {
      var task = this.store.createRecord('task', {});
      var extendIfo = this.store.createRecord('taskextend', {});
      task.set('extendIfo',extendIfo);
      controller.set('task',task);
      controller.set('durType','');
    }

    this.defineController(controller,model);
  },

  defineController: function(controller,model){
    controller.reopen({
      // typeOne: true,
      // typeTwo: true,
      queryUserPrivate:function() {
        var curUser =  this.get("global_curStatus").getUser();
        return this.store.findRecord("userPrivate",curUser.get("id"));
      },
      queryDicttype:function(type) {
        return this.store.query('dicttype',{filter:{'typecode':type}});
      },
      // 把页面curTask数据，存到task中，并保存
      copyData:function(task,curTask,taskextend,status) {
        var self = this;
        self.queryUserPrivate().then(function(userEnt){
          task.set('pubuser',userEnt);
          if(curTask&&curTask.get('title')) {
            task.set('title',curTask.get('title'));
          }
          // if(curTask&&curTask.get('code')) {
          //   task.set('code',curTask.get('code'));
          // }
          if(curTask&&curTask.get('desc')) {
            task.set('desc',curTask.get('desc'));
          }
          if(curTask&&curTask.get('beginDateComp')) {
            if(!curTask.get('endDateComp')||(curTask.get('endDateComp')==='待定')) {
              task.set('durType',1);
            }
            var beginTime = self.change(curTask.get('beginDateComp'));
            task.set('beginTime',beginTime);
          }
          if(curTask&&curTask.get('endDateComp')&&(curTask.get('endDateComp')!=='待定')) {
            if(curTask.get('beginDateComp')) {
              task.set('durType',2);
            }
            var endTime = self.change(curTask.get('endDateComp'));
            task.set('endTime',endTime);
          }
          if(curTask&&curTask.get('extendIfo')&&curTask.get('extendIfo').get('csNeed')) {
            taskextend.set('csNeed',curTask.get('extendIfo').get('csNeed'));
            // task.set('extendIfo',taskextend);
          }
          var taskLan = new Ember.A();
          self.get('language').forEach(function(lan) {
            if(lan.get('checked')) {
              taskLan.pushObject(lan);
            }
          });
          task.set('language',taskLan);

          var taskTypes = new Ember.A();
          self.get('taskTypesOne').forEach(function(taskTypeOne) {
            if(taskTypeOne.get('checked')) {
              taskTypes.pushObject(taskTypeOne);
            }
          });
          self.get('taskTypesTwo').forEach(function(taskTypeTwo) {
            if(taskTypeTwo.get('checked')) {
              taskTypes.pushObject(taskTypeTwo);
            }
          });
          task.set('taskTypes',taskTypes);
          if(!self.get('typeTwo')) {
            task.set('callType',2);
          }
          else if (!self.get('typeOne')) {
            task.set('callType',1);
          }
          else {
            task.set('callType',null);
          }
          var worktimes = new Ember.A();
          self.get('workTimes').forEach(function(time) {
            if(time.get('checked')) {
              worktimes.pushObject(time);
            }
          });
          task.set('worktimes',worktimes);
          self.get('language').forEach(function(lan) {
            if(lan.get('checked')) {
              task.get('language').pushObject(lan);
            }
          });
          if(curTask&&curTask.get('sexPreference')) {
            task.set('sexPreference',curTask.get('sexPreference'));
          }
          else {
            task.set('sexPreference',0);//性别要求默认是不限
          }
          task.set('settleAccountWay',0);//结账周期默认是实时
          // if(curTask&&curTask.get('settleAccountWay')) {
          //   task.set('settleAccountWay',curTask.get('settleAccountWay'));
          // }
          // else {
          //   task.set('settleAccountWay',0);//结账周期默认是实时
          // }
          if(self.get('typeOne')) {
            task.set('calloutPay',null);
            task.set('poPay',null);
          }
          else {
            if(curTask&&curTask.get('calloutPay')) {
              task.set('calloutPay',curTask.get('calloutPay'));
            }
            if(curTask&&curTask.get('poPay')) {
              task.set('poPay',curTask.get('poPay'));
            }
          }
          if(self.get('typeTwo')) {
            task.set('callinPay',null);
            task.set('onlinePay',null);
          }
          else {
            if(curTask&&curTask.get('callinPay')&&!self.get('typeTwo')) {
              task.set('callinPay',curTask.get('callinPay'));
            }
            if(curTask&&curTask.get('onlinePay')&&!self.get('typeTwo')) {
              task.set('onlinePay',curTask.get('onlinePay'));
            }
          }
          if(self.get('logoUrl')) {
            task.set('iconFile',self.get('logoUrl'));
          }
          if(self.get('rarUrl')) {
            task.set('explicitApplyFile',self.get('rarUrl'));
          }
          if(curTask&&curTask.get('explicitNum')) {
            task.set('explicitNum',curTask.get('explicitNum'));
          }

          if(status === taskStatus_saved) {
            self.queryDicttype(taskStatus_saved).then(function(dicttypes) {
              var dicttype = dicttypes.get('firstObject');
              task.set('status',dicttype);
              taskextend.save().then(function(extInfo) {
                task.set('extendIfo',extInfo);
                task.save().then(function() {
                  self.set('alertModal',true);
                  self.set('alertInfo','您的任务已保存到草稿~');
                });
              });
            },function() {
              self.set('submitTaskDisa',false);
              self.set('saveTaskDisa',false);
              alert('操作失败');
            });
          }
          else {
            if (userEnt.get('status') === authenticate_succ) {
              self.queryDicttype(taskStatus_submitted).then(function(dicttypes) {
                var dicttype = dicttypes.get('firstObject');
                task.set('status',dicttype);
                self.get("global_ajaxCall").set("action","taskVerify");
                taskextend.save().then(function(extInfo) {
                  task.set('extendIfo',extInfo);
                  task.save().then(function() {
                    self.set('alertModal',true);
                    self.set('alertInfo','您的任务已提交审核，请耐心等待后台人员的审核，可在所有任务里查看审核进度~');
                  });
                },function() {
                  self.set('submitTaskDisa',false);
                  self.set('saveTaskDisa',false);
                  alert('操作失败');
                });
              });
              return;
            }
            else {
              self.queryDicttype(taskStatus_saved).then(function(dicttypes) {
                var dicttype = dicttypes.get('firstObject');
                task.set('status',dicttype);

                taskextend.save().then(function(extInfo) {
                  task.set('extendIfo',extInfo);
                  task.save().then(function() {
                    if(userEnt.get('status') === authenticate_forbidden) {
                      self.set('alertModal',true);
                      self.set('alertInfo','您的账号已被冻结，不能发布任务！该任务已保存到所有任务,认证成功后，您可再次编辑发布~');
                    }
                    else if (userEnt.get('status') === authenticate_not||userEnt.get('status') === authenticate_fail) {
                      self.set("confirmIdModal",true);
                    }
                    else if (userEnt.get('status') === authenticate_yes) {
                      self.set('alertModal',true);
                      self.set('alertInfo','您的认证申请正在审核中，请耐心等待！该任务已保存到所有任务,认证成功后，您可再次编辑发布~');
                    }
                  });
                },function() {
                  self.set('submitTaskDisa',false);
                  self.set('saveTaskDisa',false);
                  alert('操作失败');
                });
              });
              return;
            }
          }
        });
      },
      submitEnt(status,curTask){
        var self = this;
        var taskextend;
        if(controller.get('task_id')) { //修改task
          self.store.findRecord('task', controller.get('task_id')).then(function(task) {
            if(task&&task.get('extendIfo')&&task.get('extendIfo').get('id')) {
              self.store.findRecord('taskextend', task.get('extendIfo').get('id')).then(function(taskextend){
                console.log('edit task taskextend',taskextend);
                self.copyData(task,curTask,taskextend,status);
              });
            }
            else {
              console.log('edit task2',task.get('extendIfo'));
              taskextend = self.store.createRecord('taskextend', {});
              self.copyData(task,curTask,taskextend,status);
            }
          });
        }
        else { //新增task
          var task = self.store.createRecord('task', {});
          taskextend = self.store.createRecord('taskextend', {});
          self.copyData(task,curTask,taskextend,status);
        }
      },
      change(time){
        var date = new Date();
        date.setFullYear(time.substring(0,4));
        date.setMonth(time.substring(5,7)-1);
        date.setDate(time.substring(8,10));
        date.setHours(time.substring(11,13));
        date.setMinutes(time.substring(14,16));
        date.setSeconds(time.substring(17,19));
        return Date.parse(date)/1000;
      },
      toDbl: function(value) {
    		if(value<10)
    		{
    			return '0'+value;
    		}
    		else
    		{
    			return ''+value;
    		}
    	},
      actions:{
        selectTypeOne: function(taskType) {
          var chec = !taskType.get('checked');
          taskType.set('checked',chec);
          var self = this;
          var len = 0;
          self.get('taskTypesTwo').forEach(function(typeTwo) {
            if(typeTwo&&typeTwo.get('checked')) {
              len = len+1;
              return;
            }
          });
          if(len === 0) {
            if(!taskType.checked) {
              self.set('typeOne',true);
              this.get('taskTypesOne').forEach(function(typeOne) {
                if(typeOne.get('checked')) {
                  self.set('typeOne',false);
                  return;
                }
              });
            }
            else {
              self.set('typeOne',false);
            }
          }
        },
        selectTypeTwo: function(taskType) {
          var chec = !taskType.get('checked');
          taskType.set('checked',chec);
          var self = this;
          self.set('typeOne',true);
          self.get('taskTypesOne').forEach(function(typeOne) {
            if(typeOne&&typeOne.get('checked')) {
              self.set('typeOne',false);
              return;
            }
          });
          if(!taskType.checked) {
            self.set('typeTwo',true);
            this.get('taskTypesTwo').forEach(function(typeTwo) {
              if(typeTwo.get('checked')) {
                self.set('typeOne',false);
                self.set('typeTwo',false);
                return;
              }
            });
          }
          else {
            self.set('typeOne',false);
            self.set('typeTwo',false);
          }
        },

        selectEvent: function(item) {
          var chec = !item.get('checked');
          item.set('checked',chec);
        },

        submitTask: function(task) {
          if(this.get('submitTaskDisa')||this.get('saveTaskDisa')) {
            return;
          }
          var self = this;
          var workTim = false;
          self.get('workTimes').forEach(function(time) {
            if(time.get('checked')) {
              workTim = true;
              return;
            }
          });
          if(!workTim) {
            self.set('workTimesError',true);
          }
          else {
            self.set('workTimesError',false);
          }
          var taskTyp = false;
          self.get('taskTypesOne').forEach(function(type) {
            if(type.get('checked')) {
              taskTyp = true;
              return;
            }
          });
          self.get('taskTypesTwo').forEach(function(type) {
            if(type.get('checked')) {
              taskTyp = true;
              return;
            }
          });
          if(!taskTyp) {
            self.set('taskTypesError',true);
          }
          else {
            self.set('taskTypesError',false);
          }
          if(!task.get('title')) {
            self.set('titleError',true);
          }
          else {
            self.set('titleError',false);
          }
          if(!task.get('desc')) {
            self.set('descError',true);
          }
          else {
            self.set('descError',false);
          }
          if(!task.get('beginDateComp')||(task.get('endDateComp')==="待定")||!task.get('endDateComp')) {
            self.set('chooseDateFromError',true);
            self.set('chooseDateFromErrorInfo','必选');
          }
          else {
            var dateNow = new Date( );
            var nowDateStr = dateNow.getFullYear()+self.toDbl(dateNow.getMonth()+1)+self.toDbl(dateNow.getDate());
            var beginDateStr = task.get('beginDateComp').substring(0,4)+task.get('beginDateComp').substring(5,7)+task.get('beginDateComp').substring(8,10);
            var endDateStr = task.get('endDateComp').substring(0,4)+task.get('endDateComp').substring(5,7)+task.get('endDateComp').substring(8,10);
            if(beginDateStr<nowDateStr) {
              self.set('chooseDateFromError',true);
              self.set('chooseDateFromErrorInfo','开始日期小于当前日期');
            }
            else if (endDateStr<nowDateStr) {
              self.set('chooseDateFromError',true);
              self.set('chooseDateFromErrorInfo','结束日期小于当前日期');
            }
            else if(beginDateStr>endDateStr) {
              self.set('chooseDateFromError',true);
              self.set('chooseDateFromErrorInfo','开始日期大于结束日期');
            }
            else {
              self.set('chooseDateFromError',false);
            }
          }

          if(!task.get('extendIfo').get('csNeed')) {
            self.set('csNeedError',true);
            self.set('csNeedErrorInfo','必填');
          }
          else if (!(/^\d+$/.test(task.get('extendIfo').get('csNeed')))) {
            self.set('csNeedError',true);
            self.set('csNeedErrorInfo','格式不正确');
          }
          else {
            self.set('csNeedError',false);
          }
          if(!self.get('typeOne')) {
            self.set('calloutPayError',true);
            self.set('poPayError',true);
            if(!task.get('calloutPay')&&task.get('calloutPay')!==0) {
              self.set('calloutPayErrorInfo','必填');
            }
            else if (!(/^\d+$/.test(task.get('calloutPay')))) {
              self.set('calloutPayErrorInfo','格式不正确');
            }
            else {
              self.set('calloutPayError',false);
            }
            if(!task.get('poPay')&&task.get('poPay')!==0) {
              self.set('poPayErrorInfo','必填');
            }
            else if (!(/^\d+$/.test(task.get('poPay')))) {
              self.set('poPayErrorInfo','格式不正确');
            }
            else {
              self.set('poPayError',false);
            }
          }
          if(!self.get('typeTwo')) {
            self.set('callinPayError',true);
            self.set('onlinePayError',true);
            if(!task.get('callinPay')&&task.get('callinPay')!==0) {
              self.set('callinPayErrorInfo','必填');
            }
            else if (!(/^\d+$/.test(task.get('callinPay')))) {
              self.set('callinPayErrorInfo','格式不正确');
            }
            else {
              self.set('callinPayError',false);
            }
            if(!task.get('onlinePay')&&task.get('onlinePay')!==0) {
              self.set('onlinePayErrorInfo','必填');
            }
            else if (!(/^\d+$/.test(task.get('onlinePay')))) {
              self.set('onlinePayErrorInfo','请输入非负整数');
            }
            else {
              self.set('onlinePayError',false);
            }
          }
          if(self.get('needExplicitNum')&&(!task.get('explicitNum'))) {
            self.set('explicitNumError',true);
          }
          if(!self.get('explicitNumError')&&!self.get('workTimesError')&&!self.get('taskTypesError')&&!self.get('titleError')&&!self.get('descError')&&!self.get('chooseDateFromError')&&!self.get('csNeedError')&&!self.get('calloutPayError')&&!self.get('poPayError')&&!self.get('callinPayError')&&!self.get('onlinePayError')){
            console.log('submit task');
            self.set('submitTaskDisa',true);
            self.set('saveTaskDisa',true);
            self.submitEnt(taskStatus_submitted,task);
          }
        },
        saveTask: function(task) {
          if(this.get('submitTaskDisa')||this.get('saveTaskDisa')) {
            return;
          }
          this.set('submitTaskDisa',true);
          this.set('saveTaskDisa',true);
          this.submitEnt(taskStatus_saved,task);
        },
        closeAlert: function(){
          this.set("alertModal",false);
          var mainpageController = App.lookup('controller:business.mainpage');
    			mainpageController.switchMainPage('business-task');
        },
      }
    });
    controller.setProperties(model);
  },
});
