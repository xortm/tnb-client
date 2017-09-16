import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend(Pagination,{
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  header_title: "康复照料",
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
    controller.set("querySpecFalg","nurse");
    //当第一次进入页面时,才把全部选好的老人id传给组件
    var customerId = this.get("global_curStatus.serveCustomerId");
    controller.set("serveCustomerId",customerId);
  },
});
