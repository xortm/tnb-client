import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
    header_title:'员工请假',
    model(){
      return{};
    },
    setupController(controller, model){
      let _self = this;
      this._super(controller, model);
      var editMode=this.getCurrentController().get('editMode');
      var id=this.getCurrentController().get('id');
      if(editMode=='edit'){
        controller.set('detailEdit',false);
        this.store.findRecord('employee-leave-flow',id).then(function(leave){
          controller.set('leave',leave);
          var allowEdit=leave.get("status")!==null&&leave.get("status")<=1;
          controller.set("allowEdit",allowEdit);
          //是否可以编辑的状态判断 allowEdit
          switch (controller.get('leave.flowStatus')) {
            case 0:
              controller.set('allowEdit',true);
              break;
            case 1:
              controller.set('allowEdit',false);
              break;
            case 2:
              controller.set('allowEdit',true);
              break;
            case 99:
              controller.set('allowEdit',false);
              break;
            default:
          }
        });
      }else{
        controller.set('detailEdit',true);
        controller.set('leave',this.store.createRecord('employee-leave-flow',{}));
      }

     this.store.query("employee", {}).then(function(list) {
       console.log('可以请假的员工数量：',list.get('length'));
       let filter ;
       filter = $.extend({}, filter, {
           'flowStatus@$or1---1': 0
       });
       filter = $.extend({}, filter, {
           'flowStatus@$or1---2': 1
       });
       filter = $.extend({}, filter, {
           'flowStatus@$or1---3': 2
       });
       _self.store.query('employee-leave-flow',{filter}).then(function(leaveList){
         let leaveEmployees = new Ember.A();
         leaveList.forEach(function(leaveInfo){
           leaveEmployees.pushObject(leaveInfo.get('applicant'));
         });
         let employeeList = new Ember.A();
         list.forEach(function(employee){
           if(!leaveEmployees.findBy('id',employee.get('id'))){
             if(employee.get('staffStatus.typecode')!=='staffStatusLeave'){
               employeeList.pushObject(employee);
             }

           }
         });
         controller.set("employeeList", employeeList);
       });

      });
    }
});
