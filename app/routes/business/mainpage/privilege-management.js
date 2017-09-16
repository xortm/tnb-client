import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {
    taskApplyStatus_applyFail,
    taskApplyStatus_refuseInvitation
} = Constants;

export default BaseBusiness.extend(Pagination, {
    header_title: '权限信息列表',
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
        var privilegeList = this.findPaged('privilege', params, function(privilegeList) {
        });
        this.getCurrentController().set("privilegeList", privilegeList);
        console.log('doQuery privilegeList', privilegeList);
    },
    buildQueryParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
            if (curController.get('queryCondition')) {
                filter = $.extend({}, filter, {
                    'showName@$like@$or1': curController.get('queryCondition')
                });
                filter = $.extend({}, filter, {
                    'mobileMenuName@$like@$or1': curController.get('queryCondition')
                });
            }
            if (curController.get('queryParentCondition')) {
                filter["[parent][showName@$like]"]= curController.get('queryParentCondition');
            }
            if (curController.get("systemType")) {
                    filter.systemType= curController.get('systemType');
            }
        }
        params.filter = filter;
        sort = {
            level: 'asc'
        };
        params.sort = sort;
        console.log("params is:", params);
        return params;
    },
    saveRefresh: function() {
        this.refresh();
    },
    setupController: function(controller, model) {
        var queryCondition = controller.get('queryCondition');
        this._super(controller, model);
        console.log("controller in", controller);
        controller.set('queryCondition', queryCondition);
        if (controller.get('flag')&&controller.get('flag')==='edit') {
            console.log("flag1  ", controller.get('flag'));
        } else {
            console.log("flag2  ", controller.get('flag'));
            this.doQuery();
        }
        // this.doQuery();
    },
    actions: {
        searchPrivilege: function() {
            this.doQuery();
        },
        searchParentPrivilege: function() {
            this.doQuery();
        }
    }
});
