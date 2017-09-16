import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const { taskApplyStatus_applyFail,taskApplyStatus_refuseInvitation,taskApplyStatus_invited,taskApplyStatus_apply,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_applySuc} = Constants;

export default BaseBusiness.extend(Pagination,{
  header_title: '查看客服详情',
  queryParams: {
    detail_type: {
      refreshModel: true
    },
    user_id:{
      refreshModel: true
    }
  },

  model() {
    // this.set('header_title','查看客服详情');
    return {};
  },
  doQuery: function(){
    var _self = this;
    var controller = this.getCurrentController();
    var detailType = controller.get('detail_type');
    var userId = controller.get('user_id');
    var queryParams;
    var csCustomerList;
    var curTask = this.get("global_curStatus").getTask();
    var user = _self.getUser(userId,detailType);
    if(curTask&&curTask.get('id')) {
      queryParams = this.buildQueryParams(userId);
      console.log('queryParams',queryParams);
      csCustomerList = this.findPaged('cs-customer',queryParams);
      controller.set('csCustomerList',csCustomerList);
      controller.set('user',user);
      _self.getUserTask(userId).then(function(userTasks) {
        var userTask = userTasks.get('firstObject');
        controller.set('userTask',userTask);
      });
    }
    else {
      controller.set('csCustomerList',csCustomerList);
      controller.set('user',user);
    }
  },
  setupController: function(controller,model){
    this._super(controller, model);
    this.defineController(controller,model);
    console.log("controller in",controller);
    var curTask = this.get("global_curStatus").getTask();
    var curUser = this.get("global_curStatus").getUser();
    controller.set('curTask',curTask);
    controller.set('curUser',curUser);
    this.doQuery();
  },

  buildQueryParams: function(userid){
    var params = this.pagiParamsSet();
    var curTask = this.get("global_curStatus").getTask();
    var filter = {cs:{id:userid},customer:{task:{id:curTask.get('id')}}};
    var sort={createTime:'desc'};
    params.filter = filter;
    params.sort = sort;
    console.log("params is:",params);
    return params;
  },
  getUserTask: function(userid) {
    var _self = this;
    var task = _self.get("global_curStatus").getTask();
    return _self.store.query('user-task',{filter:{task:{id:task.get("id")},user:{id:userid}}});
  },
  getUser:function (userid,detailType) {
    var _self = this;
    var user = _self.store.findRecord("user", userid);
    user.then(function(userData) {            
      userData.set("inviteInfo",false);
      userData.set("csAudit",false);
      // userData.set("inMine",false);
      userData.set("taskInfo",false);
      userData.set("csStatus",'');
      // userData.set("invitation",false);
      userData.set("inWork",false);
      userData.set("audit",false);
      // userData.set("inWorkNoSeat",false);
      var task = _self.get("global_curStatus").getTask();
      if(!task||!task.get('id')) {
        userData.set("inviteInfo",true);
        userData.set("isInvite",false);
        userData.set("inviteStatus","邀请");
        return ;
      }
      else {
        _self.getUserTask(userid).then(function(userTasks) {
          var userTask = userTasks.get('firstObject');
          if(!userTask || userTask.get('status').get('typecode') === taskApplyStatus_applyFail|| userTask.get('status').get('typecode') === taskApplyStatus_refuseInvitation) {
            userData.set("inviteInfo",true);
            userData.set("isInvite",false);
            userData.set("inviteStatus","邀请");
          }
          else {
            userData.set('taskInfo',true);
            userData.set("inviteInfo",false);
            if(userTask.get('status').get('typecode') === taskApplyStatus_invited)//已邀请
            {
              // userData.set("invitation",true);
              userData.set("csStatus",'邀请中');
            }
            if(userTask.get('status').get('typecode') === taskApplyStatus_apply)//待审核
            {
              userData.set("csAudit",true);
              userData.set("audit",true);
              userData.set("csStatus",'申请任务');
              userData.set("changeStatus",true);
            }
            if(userTask.get('status').get('typecode') === taskApplyStatus_SuccNotLocateSeat)//已通过（未分配坐席）
            {
              // userData.set("inWorkNoSeat",true);
              userData.set("csStatus",'已通过(未分配坐席)');
            }
            if(userTask.get('status').get('typecode') === taskApplyStatus_applySuc)//已通过
            {
              userData.set("inWork",true);
              userData.set("csStatus",'工作中');
            }
          }
          });
        }
      });
    return user;
  },

  defineController: function(controller,model){
    controller.reopen({

    });
    controller.setProperties(model);
  },

});
