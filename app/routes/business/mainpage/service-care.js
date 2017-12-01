import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend({
  realTemplateName:'blank-page-2',
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  header_title: "生活照料",
  queryParams: {
      customerIdParams: {
          refreshModel: true
      },
      scanFlag: {
          refreshModel: true
      },
      toSpecservice: {
          refreshModel: true
      },
  },

  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);
    // controller.set("querySpecFalg","care");
    // console.log("setupController in service care");
    //当第一次进入页面时,才把全部选好的老人id传给组件
    // var customerId = this.get("global_curStatus.serveCustomerId");
    // controller.set("serveCustomerId",customerId);
  },
});
