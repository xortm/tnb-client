import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  model() {
    return {};
  },

  setupController: function(controller,model){
    this.store.query('nursegroup',{}).then(function(groups){
      controller.set('groups',groups);
    });
    this.store.query('employee',{filter:{queryType:'employeeWithoutGroup'}}).then(function(staffs){
      staffs = staffs.filter(function(staff){
        return staff.get('staffStatus.typecode')!=='staffStatusLeave';
      });
      controller.set('staffs',staffs);
    });
    this._super(controller,model);
    let nav = '选择排班人员';

    Ember.run.schedule('afterRender',function(){
      controller.send('nav',nav);
    });
  }
});
