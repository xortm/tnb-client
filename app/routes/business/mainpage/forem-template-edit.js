import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend({
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  // header_title: "压疮评估",
  queryParams: {
    source:{
      refreshModel:true
    },
    resultId:{
      refreshModel:true
    },
    editType:{
      refreshModel:true
    }
  },
  header_title: Ember.computed("global_dataLoader.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    let str = this.getCurrentController().get('source');
    if(str=='user'){
      return '选择记录人(' + customerName +')';
    }
    if(str=='date'){
      return '选择记录日期(' + customerName +')';
    }
  }),

  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);
    this.store.query('employee',{filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(employeeList){
      controller.set('employeeList',employeeList);
    });
  },
});
