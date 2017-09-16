import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {
    staffStatus,
    taskApplyStatus_applyFail,
    taskApplyStatus_refuseInvitation
} = Constants;

export default BaseBusiness.extend(Pagination, {
    header_title: '员工列表',
    queryParams: {
        flag: {
            refreshModel: true
        }
    },
    model() {
        return {};
    },
    doQuery: function() {
        var _self = this;
        var params = this.buildQueryParams();
        // var include= {employee:"department"};
        // params.include = include;//关联带出 department  1对多不能关联带出  多对一可以关联带出
        var staffList = this.findPaged('employee', params, function(orgList) {});
        this.getCurrentController().set("staffList", staffList);
        console.log('doQuery orgList', staffList);
    },
    saveRefresh: function() {
        this.refresh();
    },
    buildQueryParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
            if (curController.get('queryCondition')) {
                filter = $.extend({}, filter, {
                    'name@$like@$or1': curController.get('queryCondition')
                });
                filter = $.extend({}, filter, {
                    'staffCardCode@$like@$or1': curController.get('queryCondition')
                });
                filter = $.extend({}, filter, {
                    'staffTel@$like@$or1': curController.get('queryCondition')
                });
            }
            if (curController.get("staffStatus")) {
                filter = $.extend({}, filter, {'[staffStatus][id]':curController.get('staffStatusId')});
            }
        }
        params.filter = filter;
       sort = {
            remark: 'asc'
        };
        params.sort = sort;
        console.log("params is:", params);
        return params;
    },
    setupController: function(controller, model) {
        controller.set("staffStatus", null);
        controller.set("queryCondition", null);
        console.log(Constants.staffStatus);
        var queryCondition = controller.get('queryCondition');
        controller.set('staffDetail', null);
        this._super(controller, model);
        console.log("controller in", controller);
        controller.set('queryCondition', queryCondition);
        if (controller.get('flag') && controller.get('flag') === 'edit') {
            console.log("flag1  ", controller.get('flag'));
        } else {
            console.log("flag2  ", controller.get('flag'));
            this.doQuery();
        }
    },
    actions: {
        searchStaff: function() {
            this.doQuery();
        },
    }
});
