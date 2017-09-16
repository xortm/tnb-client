import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {
    staffStatus,
    staffStatusIn,
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
        var include= {employee:"department"};
        params.include = include;//关联带出 department  1对多不能关联带出  多对一可以关联带出
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
              if(curController.get('staffStatus.typecode')!="the_all"){
                filter = $.extend({}, filter, {'[staffStatus][typecode]':curController.get('staffStatus.typecode')});
              }
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
        console.log(Constants.staffStatus);
        var queryCondition = controller.get('queryCondition');
        var theAll = {
          typename:"全部",
          typecode:"the_all",
          namePinyin:"全部",
        };
        var dicttypes = this.get("global_dataLoader.dicttypes");
        var list = dicttypes.filterBy('typegroup.typegroupcode', 'staffStatus');
        var staffStatusIn ;
        list.forEach(function(dict){
          dict.set("namePinyin",dict.get("typename"));
          if (dict.get("typecode")=="staffStatusIn") {
            staffStatusIn = dict;
          }
        });
        list.pushObject(theAll);
        controller.set("staffStatusList",list);
        controller.set('staffDetail', null);
        controller.get("staffStatus",Constants.staffStatusIn);
        this._super(controller, model);
        controller.set('queryCondition', queryCondition);
        controller.send("statusSelect",staffStatusIn);
    },
    actions: {
        searchStaff: function() {
            this.doQuery();
        },
    }
});
