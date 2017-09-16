import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend(Pagination,{
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  header_title: "跟进信息详情",
  queryParams: {
    dataId: {
        refreshModel: true
    },
    infoId: {
        refreshModel: true
    },
    source: {
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
    //     this.store.findRecord('consultinfo', this.get("itemId")).then(function(consultInfo) {
    //             controller.set("consultinfoItem", consultInfo);
    //         });
    //     }
    _self.get("dataLoader").set('conTabCode', 'tabCallBack');
    controller.set("querySpecFalg","nurse");
  },
});
