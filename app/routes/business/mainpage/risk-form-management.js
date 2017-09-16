import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend({
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  // header_title: "压疮业务表",
  queryParams: {
    id: {
        refreshModel: true
    },
  },
  header_title: Ember.computed("global_curStatus.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    return '压疮业务表(' + customerName +')';
  }),

  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);
    let id = this.getCurrentController().get('id');
    let recordModel = this.get('feedService.recordModelList').findBy('id',id);
    this.set('feedService.curRecordModel',recordModel);
    // this.store.query('risk-record-result',{filter:{model:{id:id},customer:{id:this.get("global_curStatus.healtyCustomerId")}},sort:{id:'desc'}}).then(function(resultList){
    //   controller.set('resultList',resultList);
    //   _self.set('feedService.riskRecordResultList',resultList);
    // });
  },
});
