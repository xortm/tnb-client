import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '活动计划',
    model() {
        return {};
    },
    buildQueryParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
            //时间条件搜索
            var queryCondition = curController.get('queryCondition');
            if (queryCondition) {
            }
        }
        params.filter = filter;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        console.log("params is", params);
        var planList = this.findPaged('activity-plan', params, function(planList) {});
        this.getCurrentController().set("planList", planList);
    },
    setupController: function(controller, model) {
        this.doQuery();
        //var queryCondition = controller.get('input');
        //controller.set('queryCondition', queryCondition);
        this._super(controller, model);
    }
});
