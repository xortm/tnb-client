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
    header_title:'员工考核',
    model(){
      return{};
    },
    setupController(controller, model){
      this._super(controller, model);
      var editMode=this.getCurrentController().get('editMode');
      var id=this.getCurrentController().get('id');
      if(editMode=='edit'){
        controller.set('detailEdit',false);
        this.store.findRecord('assessment',id).then(function(assessment){
          controller.set('assessment',assessment);
        });
      }else{
        controller.set('detailEdit',true);
        controller.set('assessment',this.store.createRecord('assessment',{}));
      }
      this.store.query("employee", {filter:{"forTenant":"1"}}).then(function(employeeList) {
          controller.set("employeeList", employeeList);
      });
    }
});
