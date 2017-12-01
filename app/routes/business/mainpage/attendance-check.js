import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'考勤查看',
  setupController: function(controller,model){
    this._super(controller,model);
    //当第一次进入页面时,才把全部选好的老人id传给组件
    var employeeId = this.get("global_curStatus.attendanceEmployeeId");
    controller.set("attendanceEmployeeId",employeeId);
  },
});
