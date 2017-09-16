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
  detailEdit:true,
  header_title:'护理组信息',
  model(){
    return{};
  },
  setupController(controller, model){
    let _self = this;
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    this.store.query('employee',{}).then(function(staffs){
      staffs = staffs.filter(function(staff){
        return staff.get('staffStatus.typecode')!=='staffStatusLeave';
      });
      controller.set('allStaffs',staffs);
    });
    this.store.query('bed',{}).then(function(bedList){
      controller.set('bedList',bedList);
    });
    if(id!==0&&editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('nursegroup',id).then(function(nurseGroupInfo){
        App.lookup('route:business.mainpage.nursing-worker-group-management').getStaffByNurseGroup(nurseGroupInfo);
        App.lookup('route:business.mainpage.nursing-worker-group-management').getCustomerByNurseGroup(nurseGroupInfo);
        _self.store.query('bednursegroup',{filter:{group:{id:id}}}).then(function(list){
           controller.set('selectedBeds',list);
        });
        _self.store.query('employeenursinggroup',{filter:{group:{id:id}}}).then(function(list){
          controller.set('hasStaffs',list);
        });
        controller.set('nurseGroupInfo',nurseGroupInfo);
      });

    }else{
      controller.set('nurseGroupInfo',this.store.createRecord('nursegroup', {}));
      controller.set('detailEdit',true);
      controller.set('hasStaffs',null);
      controller.set('selectedBeds',null);
    }
  }
});
