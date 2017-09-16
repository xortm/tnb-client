import Ember from 'ember';
import BaseBusiness from '../base-business';
const {taskStatus_saved,taskStatus_submitted,taskStatus_isPassed,taskStatus_isEnd,taskStatus_noPass,taskStatus_begin} = Constants;
export default BaseBusiness.extend({
header_title: '查看所有任务',
  model() {
    return {};
  },
  doQuery: function(){
    var params = this.buildQueryParams();
    var taskList = this.get("store").query("task",params);
    taskList.then(function(tasks) {
      tasks.forEach(function(task) {
        task.set("taskbegin",false);
        task.set("person",false);
        task.set("isPassed",false);
        task.set("noPass",false);
        task.set("end",false);
        task.set("passed",false);
        task.set("submit",false);
        task.set("saved",false);
        if(task.get('status').get('typecode') === taskStatus_saved)//已保存草稿
        {
          task.set("person",true);
          task.set("saved",true);
        }
        if(task.get('status').get('typecode') === taskStatus_submitted)//已提交审核
        {
          task.set("submit",true);
          task.set("person",true);
        }
        if(task.get('status').get('typecode') === taskStatus_isPassed)//审核通过未开始
        {
          task.set("passed",true);
          task.set("person",true);
          task.set("isPassed",true);
        }
        if(task.get('status').get('typecode') === taskStatus_isEnd)//已结束
        {
          task.set("end",true);
          task.set("person",true);
        }

        if(task.get('status').get('typecode') === taskStatus_noPass)//审核未通过
        {
          task.set("noPass",true);
        }
        if(task.get('status').get('typecode') === taskStatus_begin)//已开始
        {
          task.set("begin",true);
          task.set("person",true);
          task.set("isPassed",true);
        }
      });
    });
    this.getCurrentController().set("taskList",taskList);
  },
  buildQueryParams: function(){
    var curController = this.getCurrentController();
    var curUser = this.get("global_curStatus").getUser();
    var filter = {pubuser:{id:curUser.get('id')}};
    if(curController&&curController.get("taskStatusSel")){
      filter = $.extend({}, filter, {status:{'typecode': curController.get('taskStatusSel.typecode')}});
    }
    var sort = {updateTime:'desc'};
    return {filter:filter,sort:sort};
  },

  //设置controller信息，不再单独建立controller文件
  setupController: function(controller,model){
    this._super(controller, model);
    this.defineController(controller,model);
    this.doQuery();
    console.log("controller in",controller);
    controller.set("taskStatus",[{
      id:1,
      typename: '草稿箱',
      typecode: taskStatus_saved
    },{
      id:2,
      typename: '正在审核的任务',
      typecode: taskStatus_submitted
    },{
      id:3,
      typename: '审核通过未开始的任务',
      typecode: taskStatus_isPassed
    },{
      id:4,
      typename: '审核未通过的任务',
      typecode: taskStatus_noPass
    },{
      id:5,
      typename: '正在进行的任务',
      typecode: taskStatus_begin
    },{
      id:6,
      typename: '已结束的任务',
      typecode: taskStatus_isEnd
    }]);
  },

  defineController: function(controller,model){
    var _self = this;
    controller.reopen({
      taskStatusSel: null,
      Constants:{taskStatus_saved:taskStatus_saved,taskStatus_submitted:taskStatus_submitted,taskStatus_isPassed:taskStatus_isPassed,taskStatus_isEnd:taskStatus_isEnd,taskStatus_noPass:taskStatus_noPass,taskStatus_begin:taskStatus_begin},
      actions:{
        staSelect(status){
          this.set("taskStatusSel",status);
          _self.doQuery();
        },
      }
    });
    controller.setProperties(model);
  }
});
