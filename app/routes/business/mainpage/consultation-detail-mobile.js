import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend({
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  header_title: "咨询信息详情",
  queryParams: {
    itemId: {
        refreshModel: true
    },
    itemIdFlag: {
        refreshModel: true
    },
    source: {
        refreshModel: true
    },
    refreshFlag: {
        refreshModel: true
    },
    clickActFlag: {
        refreshModel: true
    },
  },

  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);
    //controller.set("clickActFlag","tabInfo");
    controller.set("querySpecFalg","");
  },
});
