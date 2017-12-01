import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend({
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  header_title: "交接班信息详情",
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
    opType: {
        refreshModel: true
    },
  },

  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);
    // alert(1);
    // if (this.get("itemId") !== null) {
    // alert(2);
    //     this.store.findRecord('consutinfo', this.get("itemId")).then(function(consultInfo) {
    //             controller.set("consultinfoItem", consultInfo);
    //         });
    //     }
    controller.set("querySpecFalg","");
  },
});
