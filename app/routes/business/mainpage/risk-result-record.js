import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation,fieldType1,fieldType2,fieldType3,fieldType4} = Constants;

export default BaseBusiness.extend({

  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  header_title: Ember.computed("global_curStatus.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    return '业务表详情(' + customerName +')';
  }),
  queryParams: {
    resultId: {
        refreshModel: true
    },
    recordId: {
        refreshModel: true
    },
  },

  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);

  },
});
