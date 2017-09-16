import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {
    bizTypeWithdra_wash
} = Constants;

// import RouteMixin from 'ember-cli-3pagination/remote/route-mixin';

export default BaseBusiness.extend(Pagination, {
    header_title: '客户列表',
    //tableSelector:'#datatable1_wrapper',
    model() {
        return {};
    },
    perPage: 12,
    buildQueryParams() {
        var _self = this;
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
            if (curController.get('queryCondition')) {
                filter = $.extend({}, filter, {
                    '[bed][room][name@$like]@$or1': curController.get('queryCondition')
                });
                filter = $.extend({}, filter, {
                    '[bed][name@$like]@$or1': curController.get('queryCondition')
                });
                filter = $.extend({}, filter, {
                    'name@$like@$or1': curController.get('queryCondition')
                });
                filter = $.extend({}, filter, {
                    '[customerStatus][typecode@$like]@$or2---1': 'customerStatusIn'
                });
                filter = $.extend({}, filter, {
                    '[customerStatus][typecode@$like]@$or2---2': 'customerStatusTry'
                });
            } else {
                filter = $.extend({}, filter, {
                    '[customerStatus][typecode@$like]@$or1---1': 'customerStatusIn'
                });
                filter = $.extend({}, filter, {
                    '[customerStatus][typecode@$like]@$or1---2': 'customerStatusTry'
                });
            }
        }
        params.filter = filter;
        sort = {
            '[createTime]': 'desc',
        };
        params.sort = sort;
        console.log("params is:", params);
        return params;
    },
    doQuery: function() {
        var _self = this;
        var params = this.buildQueryParams(); //拼查询条件
        Ember.run.later(function() {
          let customerList =   _self.findPaged('customer', params,function(customerList) {
                //查询护理组
                var filterBedList = new Ember.A();
                var filter = {};
                customerList.forEach(function(customer) {
                    filterBedList.pushObject(customer.get('bed'));
                });
                for (var i = 0; i < customerList.length; i++) {
                    var j = i + 1;
                    var key = "bed][id@$or1---" + j;
                    var value = filterBedList.objectAt(i).get('id');
                    var filterNew = {};
                    filterNew[key] = value;
                    filter = $.extend({}, filter, filterNew);
                }
                if (customerList.length !== 0) {
                    _self.store.query('bednursegroup', {
                        filter:{group:{'delStatus@$not':1}}
                    }).then(function(bednursegroupList) {
                        _self.get('store').query('employeenursinggroup', {
                            filter: {}
                        }).then(function(employeenursinggroupList) {
                            customerList.forEach(function(customerObj) {
                              var realemployeenursinggroupList = new Ember.A();
                                let bedgroupList = bednursegroupList.filter(function(bednursegroup) {
                                    var a = bednursegroup.get('bed.id');
                                    var b = customerObj.get('bed.id');
                                    return a == b;
                                });
                                bedgroupList.forEach(function(bedgroup) {
                                    let filemployeenursinggroupList = employeenursinggroupList.filter(function(employeenursinggroup) {
                                        var a = employeenursinggroup.get('group.id');
                                        var b = bedgroup.get('group.id');
                                        return a == b;
                                    });
                                    filemployeenursinggroupList.forEach(function(employee) {
                                        realemployeenursinggroupList.pushObject(employee);
                                    });
                                });
                                var str = '';
                                if (realemployeenursinggroupList.get('length') <= 0) {
                                    customerObj.set('employeesName', '无');
                                } else {
                                    realemployeenursinggroupList.forEach(function(realemployeenursinggroup) {
                                        if (realemployeenursinggroup) {
                                            str += realemployeenursinggroup.get('employee.name') + ',';
                                        }
                                    });
                                    str = str.substring(0, str.length - 1);
                                    customerObj.set('employeesName', str);
                                }
                                return customerObj;
                            });
                        });
                        //---------------------------
                        //构造护理组
                        _self.set('bednursegroupList', bednursegroupList);
                        customerList.forEach(function(customerObj) {
                            var str = '';
                            let filbednursegroupList = bednursegroupList.filter(function(bednursegroup) {
                                var a = bednursegroup.get('bed.id');
                                var b = customerObj.get('bed.id');
                                return a == b;
                            });
                            if (filbednursegroupList.length <= 0) {
                                customerObj.set('groupsName', '无');
                                return;
                            }
                            filbednursegroupList.forEach(function(filbednursegroup) {
                                var groupName = filbednursegroup.get('group.name');
                                  str += groupName + ',';
                            });
                            str = str.substring(0, str.length - 1);
                            customerObj.set('groupsName', str);
                            return customerObj;
                        });
                    });
                }
                //查询护理方案(带出护理级别)
                if (customerList.length !== 0) {

                    _self.get('store').query('nursingproject', {
                        filter: {},
                        include: {
                            nursingproject: "level"
                        }
                    }).then(function(nursingList) {
                        customerList.forEach(function(customerObj) {
                            let filnursingprojectList = nursingList.filter(function(nursingproject) {
                                var a = nursingproject.get('customer.id');
                                var b = customerObj.get('id');
                                return a == b;
                            });
                            if (filnursingprojectList.length <= 0) {
                                customerObj.set('nursingName', '无');
                                customerObj.set('nursinglevelName', '无');
                                customerObj.set('levelPrice', '');
                                return;
                            }
                            var nursingObj = filnursingprojectList.get('firstObject');
                            if (nursingObj) {
                                var nursingName = nursingObj.get('name');
                                var nursinglevelName = nursingObj.get('level.name');
                                var levelPrice = nursingObj.get('price');
                                customerObj.set('nursingId', nursingObj.get('id'));
                                customerObj.set('nursingName', nursingName);
                                customerObj.set('nursinglevelName', nursinglevelName);
                                if (levelPrice) {
                                    customerObj.set('levelPrice', levelPrice);
                                } else {
                                    customerObj.set('levelPrice', '');
                                }
                            }
                            customerObj.set('referenceNursingPrice', nursingObj.get('price'));
                            return customerObj;
                        });
                    });

                }

            });
            _self.getCurrentController().set("cusList", customerList);
        }, 1);

    },
    actions: {
        search: function() {
            this.doQuery();
        }
    },
    setupController(controller, model) {
        this.doQuery();
        var queryCondition = controller.get('input');
        controller.set('queryCondition', queryCondition);
        this._super(controller, model);
        controller.set("textShow", true);
    }
});
