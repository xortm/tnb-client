import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const { taskApplyStatus_applyFail,taskApplyStatus_refuseInvitation,taskApplyStatus_invited,taskApplyStatus_apply,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_applySuc} = Constants;

export default BaseBusiness.extend(Pagination,{
  header_title: '查看我的客服',
  model() {
    // this.set('header_title','查看我的客服');
    return {};
  },
  doQuery: function(){
    var params = this.buildQueryParams();
    // var _self = this;
    // var csList;
    var curTask = this.get("global_curStatus").getTask();
    if(!curTask||!curTask.get("id")){
      return;
    }
    var csList = this.findPaged('user-task',params,function(csList){
      csList.forEach(function(csItem) {
        csItem.get('user').set("audit",false);

        csItem.get('user').set("csStatus",'');
        csItem.get('user').set("csAudit",false);
        if(csItem.get('status').get('typecode') === taskApplyStatus_invited)//已邀请
        {
          csItem.get('user').set("csStatus",'邀请中');
        }
        if(csItem.get('status').get('typecode') === taskApplyStatus_apply)//待审核
        {
          csItem.get('user').set("audit",true);
          csItem.get('user').set("csStatus",'申请任务');
          csItem.get('user').set("changeStatus",true);
        }
        if(csItem.get('status').get('typecode') === taskApplyStatus_SuccNotLocateSeat)//已通过（未分配坐席）
        {
          csItem.get('user').set("csStatus",'已通过(未分配坐席)');
        }
        if(csItem.get('status').get('typecode') === taskApplyStatus_applySuc)//已通过
        {
          csItem.get('user').set("csStatus",'工作中');
        }
        csItem.get('user').set('taskInfo',true);
        csItem.get('user').set("inviteInfo",false);
      });
    });
    this.getCurrentController().set("csList",csList);
  },
  buildQueryParams: function(){
    var params = this.pagiParamsSet();
    var curTask = this.get("global_curStatus").getTask();
    var curController = this.getCurrentController();
    var filter = {task:{id:curTask.get('id')}};
    // if(curController&&curController.get('statusCode'))
    // {
    //   filter = $.extend({}, filter, {'status':{'typecode':curController.get('statusCode')}});
    // }
    if(curController&&curController.get("csStatusSel")){
      filter = $.extend({}, filter, {status:{'typecode': curController.get('csStatusSel.typecode')}});
    }
    else {
      filter = $.extend({}, filter, {'status---1':{'typecode@$not---1':taskApplyStatus_applyFail},'status---2':{'typecode@$not---2':taskApplyStatus_refuseInvitation}});
    }
    if(curController&&curController.get('csname'))
    {
      filter.user = {'name@$like':curController.get('csname')};
    }
    params.filter = filter;
    console.log("params is:",params);
    return params;
  },

  setupController: function(controller,model){
    var csname = controller.get('csname');
    this._super(controller, model);
    this.defineController(controller,model);
    var curTask = this.get("global_curStatus").getTask();
    controller.set('curTask',curTask);
    controller.set('csname',csname);
    this.doQuery();
    console.log("controller in",controller);
    controller.set("csStatus",[{
      id:1,
      typename: '待审核客服',
      typecode: taskApplyStatus_apply
    },{
      id:2,
      typename: '邀请中的客服',
      typecode: taskApplyStatus_invited
    },{
      id:3,
      typename: '已通过(坐席未分配)的客服',
      typecode: taskApplyStatus_SuccNotLocateSeat
    },{
      id:4,
      typename: '工作中的客服',
      typecode: taskApplyStatus_applySuc
    }]);
  },

  defineController: function(controller,model){
    var _self = this;
    controller.reopen({
      Constants:{taskApplyStatus_applyFail:taskApplyStatus_applyFail, taskApplyStatus_refuseInvitation:taskApplyStatus_refuseInvitation, taskApplyStatus_invited:taskApplyStatus_invited, taskApplyStatus_apply:taskApplyStatus_apply, taskApplyStatus_SuccNotLocateSeat:taskApplyStatus_SuccNotLocateSeat, taskApplyStatus_applySuc:taskApplyStatus_applySuc},
      // dropdownTitle: '— — 我的客服 — —',
      taskStatusSel: null,
      csname: '',
      // taskApplyEvent: function(user,taskApplyStatus) {
      //   var self = this;
      //   var curTask = this.get("global_curStatus").getTask();
      //   self.get("store").query('dicttype', {filter: {typecode: taskApplyStatus}}).then(function (dicttypes) {
      //     var dicttype = dicttypes.get("firstObject");
      //     self.store.query("user-task", {filter:{task:{id:curTask.get('id')},user:{id:user.get('id')}}}).then(function(userTasks) {
      //       var userTaskEnt = userTasks.get("firstObject");
      //       userTaskEnt.get('user').set('statusName',dicttype.get('typename'));
      //       userTaskEnt.get('user').set('changeStatus',false);
      //       userTaskEnt.set("status", dicttype);
      //       if(taskApplyStatus === taskApplyStatus_SuccNotLocateSeat) {
      //         userTaskEnt.get('user').set('csStatus','已通过(未分配坐席)');
      //         self.get("global_ajaxCall").set("action","approved");
      //       }
      //       else {
      //         userTaskEnt.get('user').set('csStatus','已拒绝申请');
      //         self.get("global_ajaxCall").set("action","notApproved");
      //       }
      //       userTaskEnt.save().then(function() {
      //         _self.refresh();
      //       });
      //     });
      //   });
      // },
      actions: {
        staSelect(status){
          this.set("csStatusSel",status);
          _self.doQuery();
        },
        // taskStatus: function (value,titleName) {
        //   this.set('statusCode',value);
        //   this.set('dropdownTitle',titleName);
        //   _self.doQuery();
        // },
        // agreeApply: function (csuser) {
        //   this.taskApplyEvent(csuser,taskApplyStatus_SuccNotLocateSeat);
        // },
        // refuseApply: function (csuser) {
        //   this.taskApplyEvent(csuser,taskApplyStatus_applyFail);
        // },
        searchCs: function() {
          _self.doQuery();
        },
      }
    });
    controller.setProperties(model);
  },
});
