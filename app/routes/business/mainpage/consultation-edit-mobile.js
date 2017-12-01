import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
    dataLoader: Ember.inject.service("data-loader"),
    dateService: Ember.inject.service("date-service"),
    queryParams: {
        source: {
            refreshModel: true
        },
        infoId: {
            refreshModel: true
        },
        editType: {
            refreshModel: true
        }
    },
    model(params) {
        return {};
    },
    buildQueryParams: function() {
        var params = {};
        var controller = this.getCurrentController();
        var source = controller.get("source");
        var filter = {};
        console.log("consult edit source ", source);
        if (source === 'advGender') { //性别
            return 'sexType';
            filter = {
                typegroup: {
                    typegroupcode: 'sexType'
                }
            };
        }
        if (source === 'liveIntent') {
            return 'liveIntent';
            filter = {
                typegroup: {
                    typegroupcode: 'liveIntent'
                }
            };
        }
        if (source === 'customerSelfCareAbility') {
            return 'selfCareLevel';
            filter = {
                typegroup: {
                    typegroupcode: 'selfCareLevel'
                }
            };
        }
        if (source === 'relationType') {
            return 'conRelationType';
            filter = {
                typegroup: {
                    typegroupcode: 'conRelationType'
                }
            };
        }
        if (source === 'consultChannel') {
            return 'consultChannel';
            filter = {
                typegroup: {
                    typegroupcode: 'consultChannel'
                }
            };
        }
        if (source === 'consultRelation') {
            return 'relationType';
            filter = {
                typegroup: {
                    typegroupcode: 'relationType'
                }
            };
        }
        if (source === 'customerGender') {
            return 'sexType';
            filter = {
                typegroup: {
                    typegroupcode: 'sexType'
                }
            };
        }
        if (source === 'customerEducation') {
            return 'educationLevel';
            filter = {
                typegroup: {
                    typegroupcode: 'educationLevel'
                }
            };
        }
        if (source === 'advWay') {
            return 'consultSource';
            filter = {
                typegroup: {
                    typegroupcode: 'consultSource'
                }
            };
        }
        if (source === 'inPreference') {
            return 'inPreference';
            filter = {
                typegroup: {
                    typegroupcode: 'inPreference'
                }
            };
        }
        params.filter = filter;
        console.log("params filter", params);
        return params;
    },
    doQuery() {
        var controller = this.getCurrentController();
        var source = controller.get("source");
        var infoId = controller.get("infoId");
        var editType = controller.get("editType");
        var _self = this;
        controller.set('nowDate', _self.get("dateService").formatDateT(_self.get("dataLoader").getNowTime(), "yyyy-MM-dd hh:mm"));
        if (editType === 'select') {
            //var params = this.buildQueryParams();
            var groupCode = this.buildQueryParams();
            let selfChooseList = _self.get("dataLoader").findDictList(groupCode);
            let rs = new Ember.A();
            selfChooseList.forEach(function(item) {
                item.set('select', false);
                rs.pushObject(item);
            });
            let tempList = rs.sortBy('typecode').reverse();
            controller.set("selfChooseList", tempList);
        }
        if (editType === 'staff') {
            _self.store.query('employee', {
                filter: {
                    staffStatus: {
                        typecode: 'staffStatusIn'
                    }
                }
            }).then(function(employeeList) {
                controller.set('employeeList', employeeList);
            });
        }
        if (source === 'remark' || source === 'care' || source === 'customerPS' || source === 'customerAddr' || source === 'dietRequirements' || source === 'roomRequirements' || source === 'serviceRequirements' || source === 'otherRequirements' || source === 'discontent') {
            controller.set('textType', 'textarea');
        } else {
            controller.set('textType', 'text');
        }
        controller.set('succeed', '');
        _self.set('editType', editType);
        this.store.findRecord('consultinfo', infoId).then(function(consultinfo) {
            if (source === 'advTel') {
                controller.set('edit', consultinfo.get('advTel'));
                _self.set('header_title', '咨询人电话');
            } else if (source === 'advName') {
                controller.set('edit', consultinfo.get('advName'));
                _self.set('header_title', '咨询人姓名');
            } else if (source === 'liveIntent') { //身份证号码
                console.log("curUser.get  curUser", consultinfo);
                controller.set('dictTemp', consultinfo.get('liveIntent'));
                controller.set('theChoose', consultinfo.get('liveIntent'));
                if (consultinfo.get('liveIntent')) {
                    controller.refreshChooseSingleList(consultinfo.get('liveIntent'), true);
                }
                _self.set('header_title', '咨询意向');
            } else if (source === 'remark') {
                controller.set('edit', consultinfo.get('remark'));
                _self.set('header_title', '详细情况');
            } else if (source === 'customerName') {
                controller.set('edit', consultinfo.get('customerName'));
                _self.set('header_title', '老人姓名');
            } else if (source === 'customerPS') { //
                controller.set('edit', consultinfo.get('customerPS'));
                _self.set('header_title', '老人身体状况');
            } else if (source === 'customerAddr') { //
                controller.set('edit', consultinfo.get('customerAddr'));
                _self.set('header_title', '老人居住地址');
            } else if (source === 'customerBrith') { //
                controller.set('edit', consultinfo.get('customerBrith'));
                _self.set('header_title', '老人年龄');
            } else if (source === 'customerTel') { //
                controller.set('edit', consultinfo.get('customerTel'));
                _self.set('header_title', '老人电话');
            } else if (source === 'customerSelfCareAbility') { //
                controller.set('dictTemp', consultinfo.get('customerSelfCareAbility'));
                controller.set('theChoose', consultinfo.get('customerSelfCareAbility'));
                if (consultinfo.get('customerSelfCareAbility')) {
                    controller.refreshChooseSingleList(consultinfo.get('customerSelfCareAbility'), true);
                }
                _self.set('header_title', '自理能力');
            } else if (source === 'relationType') { //
                controller.set('dictTemp', consultinfo.get('relationType'));
                controller.set('theChoose', consultinfo.get('relationType'));
                if (consultinfo.get('relationType')) {
                    controller.refreshChooseSingleList(consultinfo.get('relationType'), true);
                }
                _self.set('header_title', '咨询形式');
            } else if (source === 'care') { //
                controller.set('edit', consultinfo.get('care'));
                _self.set('header_title', '特别关心');
            } else if (source === 'dietRequirements') { //
                controller.set('edit', consultinfo.get('dietRequirements'));
                _self.set('header_title', '餐饮要求');
            } else if (source === 'roomRequirements') { //
                controller.set('edit', consultinfo.get('roomRequirements'));
                _self.set('header_title', '房间要求');
            } else if (source === 'roomRequirements') { //
                controller.set('edit', consultinfo.get('roomRequirements'));
                _self.set('header_title', '房间要求');
            } else if (source === 'serviceRequirements') { //
                controller.set('edit', consultinfo.get('serviceRequirements'));
                _self.set('header_title', '照护要求');
            } else if (source === 'otherRequirements') { //
                controller.set('edit', consultinfo.get('otherRequirements'));
                _self.set('header_title', '其它要求');
            } else if (source === 'psychologicalPrice') { //
                controller.set('edit', consultinfo.get('psychologicalPrice'));
                _self.set('header_title', '心理价位');
            } else if (source === 'discontent') { //
                controller.set('edit', consultinfo.get('discontent'));
                _self.set('header_title', '不满意地方');
            } else if (source === 'advGender') { //
                controller.set('dictTemp', consultinfo.get('advGender'));
                controller.set('theChoose', consultinfo.get('advGender'));
                if (consultinfo.get('advGender')) {
                    controller.refreshChooseSingleList(consultinfo.get('advGender'), true);
                }
                _self.set('header_title', '咨询人性别');
            } else if (source === 'consultChannel') { //
                controller.set('dictTemp', consultinfo.get('consultChannel'));
                controller.set('theChoose', consultinfo.get('consultChannel'));
                if (consultinfo.get('consultChannel')) {
                    controller.refreshChooseSingleList(consultinfo.get('consultChannel'), true);
                }
                _self.set('header_title', '咨询方式');
            } else if (source === 'consultRelation') { //
                controller.set('dictTemp', consultinfo.get('consultRelation'));
                controller.set('theChoose', consultinfo.get('consultRelation'));
                if (consultinfo.get('consultRelation')) {
                    controller.refreshChooseSingleList(consultinfo.get('consultRelation'), true);
                }
                _self.set('header_title', '与老人关系');
            } else if (source === 'customerGender') { //
                controller.set('dictTemp', consultinfo.get('customerGender'));
                controller.set('theChoose', consultinfo.get('customerGender'));
                if (consultinfo.get('customerGender')) {
                    controller.refreshChooseSingleList(consultinfo.get('customerGender'), true);
                }
                _self.set('header_title', '老人性别');
            } else if (source === 'customerEducation') { //
                controller.set('dictTemp', consultinfo.get('customerEducation'));
                controller.set('theChoose', consultinfo.get('customerEducation'));
                _self.set('header_title', '文化程度');
            } else if (source === 'appointmentDate') { //
                if (consultinfo.get('appointmentDate')) {
                    controller.set('nowDate', _self.get("dateService").formatDateT(consultinfo.get('appointmentDate'), "yyyy-MM-dd hh:mm"));
                } else {
                    controller.set('nowDate', _self.get("dateService").formatDateT(_self.get("dataLoader").getNowTime(), "yyyy-MM-dd hh:mm"));
                }
                _self.set('header_title', '预约参观时间');
            } else if (source === 'advDate') { //
                if (consultinfo.get('advDate')) { //2017-08-08T08:08
                    controller.set('nowDate', _self.get("dateService").formatDateT(consultinfo.get('advDate'), "yyyy-MM-dd hh:mm"));
                } else {
                    controller.set('nowDate', _self.get("dateService").formatDateT(_self.get("dataLoader").getNowTime(), "yyyy-MM-dd hh:mm"));
                }
                _self.set('header_title', '咨询时间');
            } else if (source === 'receiveStaff') { //2017-08-08T08:08
                controller.set('theChoose', consultinfo.get('receiveStaff'));
                _self.set('header_title', '接待人');
            } else if (source === 'otherReceiveStaff') { //
                controller.set('theChoose', consultinfo.get('otherReceiveStaff'));
                _self.set('header_title', '预约接待人');
            } else if (source === 'advWay') { //
                controller.set('theChoose', null);
                if (consultinfo.get('advWay')) {
                    consultinfo.get('advWay').forEach(function(item) {
                        if (controller.get("selfChooseList").findBy("typecode", item.get("typecode"))) {
                            controller.get("selfChooseList").removeObject(item);
                            item.set('select', true);
                            controller.get("selfChooseList").pushObject(item);
                        }
                    });
                    let tempList = controller.get("selfChooseList").sortBy('typecode').reverse();
                    controller.set("selfChooseList", tempList);
                    // consultinfo.get('advWay').forEach(function(advWayObj) {
                    //     controller.set('theChoose', advWayObj);
                    // });
                }
                _self.set('header_title', '了解渠道');
            } else if (source === 'inPreference') { //
                controller.set('theChoose', null);
                if (consultinfo.get('inPreference')) {
                    consultinfo.get('inPreference').forEach(function(item) {
                        if (controller.get("selfChooseList").findBy("typecode", item.get("typecode"))) {
                            controller.get("selfChooseList").removeObject(item);
                            item.set('select', true);
                            controller.get("selfChooseList").pushObject(item);
                        }
                    });
                    let tempList = controller.get("selfChooseList").sortBy('typecode').reverse();
                    controller.set("selfChooseList", tempList);
                    // consultinfo.get('inPreference').forEach(function(advWayObj) {
                    //     controller.set('theChoose', advWayObj);
                    // });
                }
                _self.set('header_title', '入住偏好');
            }
        });
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        this.doQuery();
    },

});
