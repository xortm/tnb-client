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
  header_title:'体检报告',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('physical-report',id).then(function(report){
        controller.set('report',report);
      });
    }else{
      controller.set('detailEdit',true);
      controller.set('report',this.store.createRecord('physical-report',{}));
    }
   this.store.query("customer", {}).then(function(list) {
       controller.set("customerList", list);
    });
  }
});
