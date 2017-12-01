import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {
    staffStatus,
    staffStatusIn,
    taskApplyStatus_applyFail,
    taskApplyStatus_refuseInvitation
} = Constants;
export default BaseBusiness.extend(Pagination,{
  header_title:'护理排班列表',
  model() {
    return {};
  },
  feedBus: Ember.inject.service("feed-bus"),
  dateService: Ember.inject.service("date-service"),
  dataLoader:Ember.inject.service('data-loader'),
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'[user][name@$like]@$or1':curController.get('queryCondition')});
        }
    }
    if(this.get('typeID')){
      filter = $.extend({}, filter, {'[type][id]':this.get('typeID')});
    }
    params.filter = filter;
    sort = {
        remark: 'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    // var _self=this;
    var params=this.buildQueryParams();
    var staffscheduleList=this.findPaged('staffschedule',params,function(staffscheduleList){});
    this.getCurrentController().set("staffscheduleList", staffscheduleList);
    this.getCurrentController().set("typeID",'');
  },

  setupController: function(controller,model){
    this.set('typeID','');
    this.doQuery();
    var _self=this;
    controller.set('staffList',this.get('dataLoader.staffList'));
    this.store.query('staffschedule',{}).then(function(staffschedules){
      controller.set('staffschedules',staffschedules);
    });
    this.store.query('nursegroup',{}).then(function(groups){
      controller.set('groups',groups);
    });
    this.store.query('employee',{filter:{queryType:'employeeWithoutGroup'}}).then(function(staffs){
      staffs = staffs.filter(function(staff){
        return staff.get('staffStatus.typecode')!=='staffStatusLeave';
      });
      controller.set('staffs',staffs);
    });
    this.store.query('worktimesetting',{}).then(function(workList){
      controller.set('workList',workList);
    });
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    //取所有在职员工
    // this.store.query('employee',{filter:{staffStatus:{typecode:Constants.staffStatusIn}}}).then(function(staffList){
    //   controller.set('staffList',staffList);
    // });

    Ember.run.schedule("afterRender",this,function() {
      controller.setDate(new Date());
      let copyWeek = controller.get('copyWeekList').findBy('week',controller.get('curWeek')+1);
      controller.send('selectCopyWeek',copyWeek);
      controller.send('nav');
      $("#content").mouseup(function(e){
        let workpop = $("#datatable1");
        if(workpop.length>0){
          if(!workpop.is(e.target) && workpop.has(e.target).length === 0){
            controller.send('closePop');
          }else{
            e.preventDefault();
			      e.stopPropagation();
          }
        }
      });
    });
  }
});
