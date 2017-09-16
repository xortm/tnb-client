import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
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

export default BaseBusiness.extend(Pagination, {
    pageyModelListName: "content",
    feedService: Ember.inject.service('feed-bus'),
    header_title: "业务查询",
    model() {
        return {};
    },
    setupController(controller, model) {
        var _self = this;
        this._super(controller, model);
        //controller.incrementProperty("queryFlagInFlagT");
        this.set("showLoadingImgIn", true);
        controller.set("querySpecFalg", "send");
    },
});
