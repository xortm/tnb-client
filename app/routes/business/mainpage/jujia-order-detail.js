import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  global_dataLoader: Ember.inject.service('data-loader'),
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  header_title:'订单详情',
  model(){
    return{};
  },
  setupController(controller,model){
    let _self = this;
    this._super(controller, model);
    let editMode=this.getCurrentController().get('editMode');
    let id=this.getCurrentController().get('id');

    let nursingplandetail = this.store.peekRecord('nursingplandetail',id);
    controller.set('nursingplandetail',nursingplandetail);
    if(editMode=='edit'){
      controller.set("defaultEmployee", null);
      controller.set('detailEdit',true);
      let employeeList = this.get("global_dataLoader").get("employeeSelecter");
      employeeList.forEach(function(employee) {
        employee.set('employeePinyin', employee.get("name"));
      });
      controller.set('employeeList',employeeList);
    }else{
      controller.set('detailEdit',false);
    }

  }
});
