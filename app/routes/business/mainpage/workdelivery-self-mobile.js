import Ember from 'ember';
import BaseBusiness from '../base-business';
const {
    taskStatus_begin,
    taskStatus_isPassed,
    taskApplyStatus_apply,
    taskApplyStatus_applySuc,
    taskApplyStatus_applyFail,
    taskApplyStatus_invited,
    taskApplyStatus_SuccNotLocateSeat,
    taskApplyStatus_refuseInvitation
} = Constants;

export default BaseBusiness.extend({
    pageyModelListName: "content",
    feedService: Ember.inject.service('feed-bus'),
    dataLoader: Ember.inject.service("data-loader"),
    header_title: "交接班信息",
    model() {
        return {};
    },
    setupController(controller, model) {
        var _self = this;
        this._super(controller, model);
        _self.get("dataLoader").set('conTabCode', "sendTab");
        this.set("showLoadingImgIn", true);
        controller.set("querySpecFalg", "send");
    },
});
