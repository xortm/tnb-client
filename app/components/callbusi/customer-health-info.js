import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer-health-info';
import lookupValidator from 'ember-changeset-validations';
export default BaseItem.extend(CustomerValidations, {
    constants: Constants,
    drugallegyHave: false,
    drugallegyNOHave: false,
    exposurehistoryNOHave: false,
    exposurehistoryHave: false,
    operationhistoryNOHave: false,
    operationhistoryHave: false,
    injuryhistoryNOHave: false,
    injuryhistoryHave: false,
    bloodhistoryNOHave: false,
    bloodhistoryHave: false,
    genetichistoryNOHave: false,
    genetichistoryHave: false,
    have: false,
    homehave: false,
    homehave2: false,
    homehave3: false,
    homehave4: false,
    disabledhave: false,
    dataLoader: Ember.inject.service("data-loader"),
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    today: Ember.computed(function() {
        let today = this.get('dateService').getCurrentTime();
        today = this.get("dateService").timestampToTime(today);
        return today;
    }),
    customerModel: Ember.computed("healthRecordInfo", function() {
        var model = this.get("healthRecordInfo");
        console.log("model healthRecordInfo", model);
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(CustomerValidations), CustomerValidations);
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.customer-service');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    //计算clickFlag值查询数据
    clickFlagObs: function() {
        this.search();
    }.observes("clickFlag"),
    detailModify: Ember.computed("addMode", function() {
        var addMode = this.get("addMode");
        if (addMode) {
            return true;
        } else {
            return false;
        }
    }),
    //组件入口
    didInsertElement: function() {},
    search: function() {
        var _self = this;
        //添加界面
        if (this.get('addMode') || !this.get('healthRecordInfo')) {
            //构造过敏史数组
            let drugAllegyTypeList = _self.get("dataLoader").findDictList("drugAllegyType"); //字典数组
            let drugAllegyAry = new Ember.A(); //过敏史数组
            drugAllegyTypeList.forEach(function(drugAllegyType) {
                let drugAllegyObj = _self.get('store').createRecord('drugallegy', {
                    drugAllegyType: drugAllegyType,
                    hasSelcted: false,
                });
                drugAllegyAry.push(drugAllegyObj);
            });
            this.set('drugAllegyAry', drugAllegyAry);
            //构造暴露史数组
            let exposureTypeList = _self.get("dataLoader").findDictList("exposureType");
            let exposureAry = new Ember.A();
            exposureTypeList.forEach(function(exposureType) {
                let exposureObj = _self.get('store').createRecord('exposurehistory', {
                    exposureType: exposureType,
                    hasSelcted: false,
                });
                exposureAry.push(exposureObj);
            });
            this.set('exposureAry', exposureAry);
            //构造疾病史数组
            let diseaseTypeList = _self.get("dataLoader").findDictList("diseaseType");
            let diseaseAry = new Ember.A();
            diseaseTypeList.forEach(function(diseaseType) {
                let diseaseObj = _self.get('store').createRecord('diseasehistory', {
                    diseaseType: diseaseType,
                    hasSelcted: false,
                });
                diseaseAry.push(diseaseObj);
            });
            this.set('diseaseAry', diseaseAry);
            //构建手术史数组
            let operatInjuryTypeList = _self.get("dataLoader").findDictList("operatInjuryType");
            let operationAry = new Ember.A();
            operatInjuryTypeList.forEach(function(operatInjuryType) {
                let operationObj = _self.get('store').createRecord('operationhistory', {
                    operatInjuryType: operatInjuryType,
                });
                operationAry.push(operationObj);
            });
            this.set('operationAry', operationAry);
            //构建外伤史数组
            let injuryTypeList = _self.get("dataLoader").findDictList("operatInjuryType");
            let injuryAry = new Ember.A();
            injuryTypeList.forEach(function(operatInjuryType) {
                let injuryObj = _self.get('store').createRecord('injuryhistory', {
                    operatInjuryType: operatInjuryType,
                });
                injuryAry.push(injuryObj);
            });
            this.set('injuryAry', injuryAry);
            //构建输血史数组
            let bloodReasonTypeList = _self.get("dataLoader").findDictList("bloodReasonType");
            let bloodAry = new Ember.A();
            bloodReasonTypeList.forEach(function(bloodReasonType) {
                let bloodObj = _self.get('store').createRecord('bloodhistory', {
                    bloodReasonType: bloodReasonType,
                });
                bloodAry.push(bloodObj);
            });
            this.set('bloodAry', bloodAry);

            //构建家族史数组
            let familyAry = new Ember.A();
            //家族史-对应的关系
            let homeManTypeList = _self.get("dataLoader").findDictList("homeManType");
            //家族史-对应疾病字典
            let homeHistoryTypeList = _self.get("dataLoader").findDictList("homeHistoryType");
            homeHistoryTypeList = homeHistoryTypeList.sortBy('realRemark');
            this.set('homeHistoryTypeList', homeHistoryTypeList);
            homeManTypeList.forEach(function(homeManType) {
                homeHistoryTypeList.forEach(function(homeHistoryType) {
                    let homeManObj = _self.get('store').createRecord('familyhistory', {
                        homeManType: homeManType,
                        homeHistoryType: homeHistoryType,
                        hasSelcted: false,
                    });
                    familyAry.push(homeManObj);
                });
            });
            //根据不同关系构建四个数组
            let familyAry1 = new Ember.A();
            let familyAry2 = new Ember.A();
            let familyAry3 = new Ember.A();
            let familyAry4 = new Ember.A();
            familyAry.forEach(function(family) {
                if (family.get('homeManType.typecode') == 'homeManType1') { //父亲
                    familyAry1.push(family);
                }
                if (family.get('homeManType.typecode') == 'homeManType2') { //母亲
                    familyAry2.push(family);
                }
                if (family.get('homeManType.typecode') == 'homeManType3') { //子女
                    familyAry3.push(family);
                }
                if (family.get('homeManType.typecode') == 'homeManType4') { //兄弟姐妹
                    familyAry4.push(family);
                }
            });
            this.set('familyAry', familyAry);
            this.set('familyAry1', familyAry1);
            this.set('familyAry2', familyAry2);
            this.set('familyAry3', familyAry3);
            this.set('familyAry4', familyAry4);
            //构建疾病情况数组
            let disabledTypeList = _self.get("dataLoader").findDictList("disabledType");
            let diseaseconditionAry = new Ember.A();
            disabledTypeList.forEach(function(disabledType) {
                let diseaseconditionObj = _self.get('store').createRecord('diseasecondition', {
                    disabledType: disabledType,
                    hasSelcted: false,
                    healthrecord: _self.get('healthRecordInfo'),
                });
                diseaseconditionAry.push(diseaseconditionObj);
            });
            this.set('diseaseconditionAry', diseaseconditionAry);
            return;
        }

        //详情界面
        //查询数据(过敏史)
        _self.get('store').query('drugallegy', {
            filter: {
                '[healthrecord][id]': _self.get('healthRecordInfo.id')
            },
        }).then(function(drugallegyHasList) {
            if (drugallegyHasList.get('length')) {
                _self.set('drugallegyHave', true);
                _self.set('drugallegyNOHave', false);
            } else {
                _self.set('drugallegyHave', false);
                _self.set('drugallegyNOHave', true);
            }
            //构造过敏史数组
            let drugAllegyTypeList = _self.get("dataLoader").findDictList("drugAllegyType"); //字典数组
            let drugAllegyAry = new Ember.A(); //过敏史数组
            drugAllegyTypeList.forEach(function(drugAllegyType) {
                let drugAllegyObj = _self.get('store').createRecord('drugallegy', {
                    drugAllegyType: drugAllegyType,
                    hasSelcted: false,
                    healthrecord: _self.get('healthRecordInfo'),
                });
                let obj = drugallegyHasList.findBy("drugAllegyTypeCode", drugAllegyType.get("typecode"));
                if (obj && obj.get("id")) {
                    drugAllegyObj.set("hasSelcted", true);
                    if (drugAllegyType.get("typecode") === "allergyType3") {
                        drugAllegyObj.set("remark", obj.get("remark"));
                        drugAllegyObj.set("showInput", true);
                    }
                }
                drugAllegyAry.push(drugAllegyObj);
            });
            _self.set('drugAllegyAry', drugAllegyAry);
        });
        //查询暴露史
        _self.get('store').query('exposurehistory', {
            filter: {
                '[healthrecord][id]': _self.get('healthRecordInfo.id')
            },
        }).then(function(exposurehistoryHasList) {
            if (exposurehistoryHasList.get('length')) {
                _self.set('exposurehistoryHave', true);
                _self.set('exposurehistoryNOHave', false);
            } else {
                _self.set('exposurehistoryHave', false);
                _self.set('exposurehistoryNOHave', true);
            }
            //构造暴露史数组
            let exposureTypeList = _self.get("dataLoader").findDictList("exposureType");
            let exposureAry = new Ember.A();
            exposureTypeList.forEach(function(exposureType) {
                let exposureObj = _self.get('store').createRecord('exposurehistory', {
                    exposureType: exposureType,
                    hasSelcted: false,
                    healthrecord: _self.get('healthRecordInfo'),
                });
                let obj = exposurehistoryHasList.findBy("exposureTypeCode", exposureType.get("typecode"));
                if (obj && obj.get("id")) {
                    exposureObj.set("hasSelcted", true);
                }
                exposureAry.push(exposureObj);
            });
            _self.set('exposureAry', exposureAry);
        });
        //查询疾病史表
        _self.get('store').query('diseasehistory', {
            filter: {
                '[healthrecord][id]': _self.get('healthRecordInfo.id')
            },
        }).then(function(diseasehistoryHasList) {
            //构造疾病史数组
            let diseaseTypeList = _self.get("dataLoader").findDictList("diseaseType");
            let diseaseAry = new Ember.A();
            diseaseTypeList.forEach(function(diseaseType) {
                let diseaseObj = _self.get('store').createRecord('diseasehistory', {
                    diseaseType: diseaseType,
                    hasSelcted: false,
                    healthrecord: _self.get('healthRecordInfo'),
                });
                let obj = diseasehistoryHasList.findBy("diseaseTypeCode", diseaseType.get("typecode"));
                if (obj && obj.get("id")) {
                    diseaseObj.set("hasSelcted", true);
                    //添加肿瘤备注
                    if (diseaseType.get("typecode") === "diseaseType6") {
                        diseaseObj.set("tumourRemark", obj.get("tumourRemark"));
                        diseaseObj.set('showInput',true);
                    }
                    //添加职业病备注
                    if (diseaseType.get("typecode") === "diseaseType12") {
                        diseaseObj.set("occupationRemark", obj.get("occupationRemark"));
                        diseaseObj.set('showInput',true);
                    }
                    //添加其他备注
                    if (diseaseType.get("typecode") === "diseaseType13") {
                        diseaseObj.set("otherRemark", obj.get("otherRemark"));
                        diseaseObj.set('showInput',true);
                    }
                }
                diseaseAry.push(diseaseObj);
            });
            _self.set('diseaseAry', diseaseAry);
        });
        //查询手术史数组
        _self.get('store').query('operationhistory', {
            filter: {
                '[healthrecord][id]': _self.get('healthRecordInfo.id')
            },
        }).then(function(operationhistoryHasList) {
            if (operationhistoryHasList.get('length')) {
                _self.set('operationhistoryHave', true);
                _self.set('operationhistoryNOHave', false);
            } else {
                _self.set('operationhistoryHave', false);
                _self.set('operationhistoryNOHave', true);
            }
            //构建手术史数组
            let operatInjuryTypeList = _self.get("dataLoader").findDictList("operatInjuryType");
            let operationAry = new Ember.A();
            operatInjuryTypeList.forEach(function(operatInjuryType) {
                let operationObj = _self.get('store').createRecord('operationhistory', {
                    operatInjuryType: operatInjuryType,
                    healthrecord: _self.get('healthRecordInfo'),
                });
                let obj = operationhistoryHasList.findBy("operatInjuryTypeCode", operatInjuryType.get("typecode"));
                if (obj && obj.get("id")) {
                    //名称一
                    if (operatInjuryType.get("typecode") === "operatInjuryType1") {
                        operationObj.set("operationName", obj.get("operationName"));
                        operationObj.set("operationDate", obj.get("operationDate"));
                        let operationTime = _self.get('dateService').timeStringToTimestamp(obj.get('operationDate'));
                        operationObj.set('operationTime',operationTime);
                    }
                    //名称二
                    if (operatInjuryType.get("typecode") === "operatInjuryType2") {
                        operationObj.set("operationName", obj.get("operationName"));
                        operationObj.set("operationDate", obj.get("operationDate"));
                        let operationTime = _self.get('dateService').timeStringToTimestamp(obj.get('operationDate'));
                        operationObj.set('operationTime',operationTime);
                    }
                }
                operationAry.push(operationObj);
            });
            _self.set('operationAry', operationAry);
        });
        //查询外伤史数组
        _self.get('store').query('injuryhistory', {
            filter: {
                '[healthrecord][id]': _self.get('healthRecordInfo.id')
            },
        }).then(function(injuryhistoryHasList) {
            if (injuryhistoryHasList.get('length')) {
                _self.set('injuryhistoryHave', true);
                _self.set('injuryhistoryNOHave', false);
            } else {
                _self.set('injuryhistoryHave', false);
                _self.set('injuryhistoryNOHave', true);
            }
            //构建外伤史数组
            let operatInjuryTypeList = _self.get("dataLoader").findDictList("operatInjuryType");
            let injuryAry = new Ember.A();
            operatInjuryTypeList.forEach(function(operatInjuryType) {
                let injuryObj = _self.get('store').createRecord('injuryhistory', {
                    operatInjuryType: operatInjuryType,
                    healthrecord: _self.get('healthRecordInfo'),
                });
                let obj = injuryhistoryHasList.findBy("operatInjuryTypeCode", operatInjuryType.get("typecode"));
                if (obj && obj.get("id")) {
                    //名称一
                    if (operatInjuryType.get("typecode") === "operatInjuryType1") {
                        injuryObj.set("injuryName", obj.get("injuryName"));
                        injuryObj.set("injuryDate", obj.get("injuryDate"));
                        let injuryTime = _self.get('dateService').timeStringToTimestamp(obj.get('injuryDate'));
                        injuryObj.set('injuryTime',injuryTime);
                    }
                    //名称二
                    if (operatInjuryType.get("typecode") === "operatInjuryType2") {
                        injuryObj.set("injuryName", obj.get("injuryName"));
                        injuryObj.set("injuryDate", obj.get("injuryDate"));
                        let injuryTime = _self.get('dateService').timeStringToTimestamp(obj.get('injuryDate'));
                        injuryObj.set('injuryTime',injuryTime);
                    }
                }
                injuryAry.push(injuryObj);
            });
            _self.set('injuryAry', injuryAry);
        });
        //查询输血史数组
        _self.get('store').query('bloodhistory', {
            filter: {
                '[healthrecord][id]': _self.get('healthRecordInfo.id')
            },
        }).then(function(bloodhistoryHasList) {
            if (bloodhistoryHasList.get('length')) {
                _self.set('bloodhistoryHave', true);
                _self.set('bloodhistoryNOHave', false);
            } else {
                _self.set('bloodhistoryHave', false);
                _self.set('bloodhistoryNOHave', true);
            }
            //构建输血史数组
            let bloodReasonTypeList = _self.get("dataLoader").findDictList("bloodReasonType");
            let bloodAry = new Ember.A();
            bloodReasonTypeList.forEach(function(bloodReasonType) {
                let bloodObj = _self.get('store').createRecord('bloodhistory', {
                    bloodReasonType: bloodReasonType,
                    healthrecord: _self.get('healthRecordInfo'),
                });
                let obj = bloodhistoryHasList.findBy("bloodReasonTypeCode", bloodReasonType.get("typecode"));
                if (obj && obj.get("id")) {
                    //原因一
                    if (bloodReasonType.get("typecode") === "bloodReasonType1") {
                        bloodObj.set("causes", obj.get("causes"));
                        bloodObj.set("bloodDate", obj.get("bloodDate"));
                        let bloodTime = _self.get('dateService').timeStringToTimestamp(obj.get('bloodDate'));
                        bloodObj.set('bloodTime',bloodTime);
                    }
                    //原因二
                    if (bloodReasonType.get("typecode") === "bloodReasonType2") {
                        bloodObj.set("causes", obj.get("causes"));
                        bloodObj.set("bloodDate", obj.get("bloodDate"));
                        let bloodTime = _self.get('dateService').timeStringToTimestamp(obj.get('bloodDate'));
                        bloodObj.set('bloodTime',bloodTime);
                    }
                }
                bloodAry.push(bloodObj);
            });
            _self.set('bloodAry', bloodAry);
        });
        //查询家族史表
        _self.get('store').query('familyhistory', {
            filter: {
                '[healthrecord][id]': _self.get('healthRecordInfo.id')
            },
        }).then(function(familyhistoryHasList) {
            //构建家族史数组
            let familyAry = new Ember.A();
            //家族史-对应的关系
            let homeManTypeList = _self.get("dataLoader").findDictList("homeManType");
            //家族史-对应疾病字典
            let homeHistoryTypeList = _self.get("dataLoader").findDictList("homeHistoryType");
            homeHistoryTypeList = homeHistoryTypeList.sortBy('realRemark');
            _self.set('homeHistoryTypeList', homeHistoryTypeList);
            homeManTypeList.forEach(function(homeManType) {
                homeHistoryTypeList.forEach(function(homeHistoryType) {
                    let homeManObj = _self.get('store').createRecord('familyhistory', {
                        homeManType: homeManType,
                        homeHistoryType: homeHistoryType,
                        hasSelcted: false,
                        healthrecord: _self.get('healthRecordInfo'),
                    });
                    let list = familyhistoryHasList.filter(function(familyhistory) {
                        return familyhistory.get('homeManType.typecode') == homeManType.get("typecode");
                    });
                    let obj = list.findBy("homeHistoryTypeCode", homeHistoryType.get("typecode"));
                    if (obj && obj.get("id")) {
                        homeManObj.set('hasSelcted', true);
                        if (homeHistoryType.get("typecode") === "homeHistoryType12") {
                            homeManObj.set("remark", obj.get("remark"));
                            homeManObj.set('showInput',true);
                        }
                    }
                    familyAry.push(homeManObj);
                });
            });
            //根据不同关系构建四个数组
            let familyAry1 = new Ember.A();
            let familyAry2 = new Ember.A();
            let familyAry3 = new Ember.A();
            let familyAry4 = new Ember.A();
            familyAry.forEach(function(family) {
                if (family.get('homeManType.typecode') == 'homeManType1') { //父亲
                    familyAry1.push(family);
                }
                if (family.get('homeManType.typecode') == 'homeManType2') { //母亲
                    familyAry2.push(family);
                }
                if (family.get('homeManType.typecode') == 'homeManType3') { //子女
                    familyAry3.push(family);
                }
                if (family.get('homeManType.typecode') == 'homeManType4') { //兄弟姐妹
                    familyAry4.push(family);
                }
            });
            _self.set('familyAry', familyAry);
            _self.set('familyAry1', familyAry1);
            _self.set('familyAry2', familyAry2);
            _self.set('familyAry3', familyAry3);
            _self.set('familyAry4', familyAry4);
        });
        //判断遗传病史
        if (_self.get('healthRecordInfo.geneticHistory')) {
            _self.set('genetichistoryNOHave', false);
            _self.set('genetichistoryHave', true);
        } else {
            _self.set('genetichistoryNOHave', true);
            _self.set('genetichistoryHave', false);
        }
        //查询疾病情况表
        _self.get('store').query('diseasecondition', {
            filter: {
                '[healthrecord][id]': _self.get('healthRecordInfo.id')
            },
        }).then(function(diseaseconditionHasList) {
            //构建疾病情况数组
            let disabledTypeList = _self.get("dataLoader").findDictList("disabledType");
            let diseaseconditionAry = new Ember.A();
            disabledTypeList.forEach(function(disabledType) {
                let diseaseconditionObj = _self.get('store').createRecord('diseasecondition', {
                    disabledType: disabledType,
                    hasSelcted: false,
                    healthrecord: _self.get('healthRecordInfo'),
                });
                let obj = diseaseconditionHasList.findBy("disabledTypeCode", disabledType.get("typecode"));
                if (obj && obj.get("id")) {
                    diseaseconditionObj.set('hasSelcted', true);
                    if (disabledType.get("typecode") === "disabledType8") {
                        diseaseconditionObj.set("remark", obj.get("remark"));
                        diseaseconditionObj.set('showInput',true);
                    }
                }
                diseaseconditionAry.push(diseaseconditionObj);
            });
            _self.set('diseaseconditionAry', diseaseconditionAry);
        });
    },
    actions: {
        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        //修改
        detailModifyClick: function() {
            this.set('detailModify', true);
        },
        //保存按钮
        detailSaveClick: function() {
            var _self = this;
            var customerModel = this.get("customerModel");
            var healthRecordInfo = null;
            if (this.get('healthRecordInfo')) {
                healthRecordInfo = this.get("healthRecordInfo");
            } else {
                healthRecordInfo = this.get('store').createRecord('healthrecord', {});
            }
            var mainpageController = App.lookup('controller:business.mainpage');
            var drugAllegyAry = this.get('drugAllegyAry');
            let drugAllegyArr = new Ember.A();
            drugAllegyAry.forEach(function(newObj) {
                if (newObj.get('hasSelcted')) {
                    drugAllegyArr.push(newObj);
                }
            });
            var exposureAry = this.get('exposureAry');
            let exposureArr = new Ember.A();
            exposureAry.forEach(function(newObj) {
                if (newObj.get('hasSelcted')) {
                    exposureArr.push(newObj);
                }
            });
            var diseaseAry = this.get('diseaseAry');
            let diseaseArr = new Ember.A();
            diseaseAry.forEach(function(newObj) {
                if (newObj.get('hasSelcted')) {
                    diseaseArr.push(newObj);
                }
            });
            var operationAry = this.get('operationAry');
            let operationArr = new Ember.A();
            operationAry.forEach(function(newObj) {
                if (newObj.get('operationName') || newObj.get('operationTime')) {
                    operationArr.push(newObj);
                }
            });
            var injuryAry = this.get('injuryAry');
            let injuryArr = new Ember.A();
            injuryAry.forEach(function(newObj) {
                if (newObj.get('injuryName') || newObj.get('injuryTime')) {
                    injuryArr.push(newObj);
                }
            });
            var bloodAry = this.get('bloodAry');
            let bloodArr = new Ember.A();
            bloodAry.forEach(function(newObj) {
                if (newObj.get('bloodName') || newObj.get('bloodTime')) {
                    bloodArr.push(newObj);
                }
            });
            var familyAry = this.get('familyAry');
            let familyArr = new Ember.A();
            familyAry.forEach(function(newObj) {
                if (newObj.get('hasSelcted')) {
                    familyArr.push(newObj);
                }
            });
            var diseaseconditionAry = this.get('diseaseconditionAry');
            let diseaseconditionArr = new Ember.A();
            diseaseconditionAry.forEach(function(newObj) {
                if (newObj.get('hasSelcted')) {
                    diseaseconditionArr.push(newObj);
                }
            });
            //判断如果保存的数据为空，则如下：
            //this.store.createRecord('hbeaconwarning', {});
            if(drugAllegyArr.get('length')===0){
              drugAllegyArr.push(_self.get('store').createRecord('drugallegy', {delStatus:1}));
            }
            if(exposureArr.get('length')===0){
              exposureArr.push(_self.get('store').createRecord('exposurehistory', {delStatus:1}));
            }
            if(diseaseArr.get('length')===0){
              diseaseArr.push(_self.get('store').createRecord('diseasehistory', {delStatus:1}));
            }
            if(operationArr.get('length')===0){
              operationArr.push(_self.get('store').createRecord('operationhistory', {delStatus:1}));
            }
            if(injuryArr.get('length')===0){
              injuryArr.push(_self.get('store').createRecord('injuryhistory', {delStatus:1}));
            }
            if(bloodArr.get('length')===0){
              bloodArr.push(_self.get('store').createRecord('bloodhistory', {delStatus:1}));
            }
            if(familyArr.get('length')===0){
              familyArr.push(_self.get('store').createRecord('familyhistory', {delStatus:1}));
            }
            if(diseaseconditionArr.get('length')===0){
              diseaseconditionArr.push(_self.get('store').createRecord('diseasecondition', {delStatus:1}));
            }
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            healthRecordInfo.set('drugallegys', drugAllegyArr);
            healthRecordInfo.set('exposurehistorys', exposureArr);
            healthRecordInfo.set('diseasehistorys', diseaseArr);
            healthRecordInfo.set('operationhistorys', operationArr);
            healthRecordInfo.set('injuryhistorys', injuryArr);
            healthRecordInfo.set('bloodhistorys', bloodArr);
            healthRecordInfo.set('familyhistorys', familyArr);
            healthRecordInfo.set('diseaseconditions', diseaseconditionArr);
            if (this.get('addMode') || !this.get('healthRecordInfo')) {
                healthRecordInfo.set('customer', this.get('customerInComp'));
            }
            healthRecordInfo.save().then(function() {
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                if (_self.get('addMode')) {
                    //alert("添加");
                    mainpageController.switchMainPage('customer-service', {});
                }
                _self.set('detailModify', false);
                _self.set('healthRecordInfo',healthRecordInfo);
                _self.sendAction('refreshFuntion');
            });


        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            if (this.get("addMode")) {
                mainpageController.switchMainPage('customer-service', {});
            }
        },
        //删除按钮
        delById: function() {
            var _self = this;
            var healthRecordInfo = this.get('healthRecordInfo');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此入住信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                healthRecordInfo.set("delStatus", 1);
                healthRecordInfo.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('customer-service');
                });
            });
        },
        //手术时间
        changeOperationTimeAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("healthRecordInfo.operationTime", stamp);
        },
        //外伤史时间
        changeInjuryTimeAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("healthRecordInfo.injuryTime", stamp);
        },
        //输血时间
        changeBloodTimeAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("healthRecordInfo.bloodTime", stamp);
        },
        //选择是否有过敏史
        drugallegyChooseNoHave: function() {
            this.set('drugallegyNOHave', true);
            this.set('drugallegyHave', false);
            //当点击无的时候，清空所有的选中项
            if (this.get('drugallegyNOHave')) {
                this.get('drugAllegyAry').forEach(function(drugAllegy) {
                    drugAllegy.set('hasSelcted', false);
                    drugAllegy.set('remark', '');
                });
            }
        },
        drugallegyChooseHave: function() {
            this.set('drugallegyNOHave', false);
            this.set('drugallegyHave', true);
        },
        //选择是否有暴露史
        exposurehistoryChooseNoHave: function() {
            this.set('exposurehistoryNOHave', true);
            this.set('exposurehistoryHave', false);
            //当点击无的时候，清空所有的选中项
            if (this.get('exposurehistoryNOHave')) {
                this.get('exposureAry').forEach(function(exposure) {
                    exposure.set('hasSelcted', false);
                });
            }
        },
        exposurehistoryChooseHave: function() {
            this.set('exposurehistoryNOHave', false);
            this.set('exposurehistoryHave', true);
        },
        //选择是否有手术史
        operationhistoryChooseNoHave: function() {
            this.set('operationhistoryNOHave', true);
            this.set('operationhistoryHave', false);
            if (this.get('operationhistoryNOHave')) {
                this.get('operationAry').forEach(function(operation) {
                    operation.set('operationName', '');
                });
            }
        },
        operationhistoryChooseHave: function() {
            this.set('operationhistoryNOHave', false);
            this.set('operationhistoryHave', true);
        },
        //选择是否有外伤史
        injuryhistoryChooseNoHave: function() {
            this.set('injuryhistoryNOHave', true);
            this.set('injuryhistoryHave', false);
            if (this.get('injuryhistoryNOHave')) {
                this.get('injuryAry').forEach(function(injury) {
                    injury.set('injuryName', '');
                });
            }
        },
        injuryhistoryChooseHave: function() {
            this.set('injuryhistoryNOHave', false);
            this.set('injuryhistoryHave', true);
        },
        //选择是否有输血史
        bloodhistoryChooseNoHave: function() {
            this.set('bloodhistoryNOHave', true);
            this.set('bloodhistoryHave', false);
            if (this.get('bloodhistoryNOHave')) {
                this.get('bloodAry').forEach(function(blood) {
                    blood.set('causes', '');
                });
            }
        },
        bloodhistoryChooseHave: function() {
            this.set('bloodhistoryNOHave', false);
            this.set('bloodhistoryHave', true);
        },
        //选择是否有遗传病史
        genetichistoryChooseNoHave: function() {
            this.set('genetichistoryNOHave', true);
            this.set('genetichistoryHave', false);
            if (this.get('genetichistoryNOHave')) {
                this.get('healthRecordInfo').set('geneticHistory','');
            }
        },
        genetichistoryChooseHave: function() {
            this.set('genetichistoryNOHave', false);
            this.set('genetichistoryHave', true);
        },
        //选择过敏史
        chooseDrugAllegyType: function(drugAllegyType) {
            if (this.get('drugallegyNOHave')) {
                return;
            }
            if (drugAllegyType.get('hasSelcted')) {
                drugAllegyType.set('hasSelcted', false);
                drugAllegyType.set('showInput',false);
            } else {
                drugAllegyType.set('hasSelcted', true);
                if(drugAllegyType.get('drugAllegyType.typecode')=='allergyType3'){
                  drugAllegyType.set('showInput',true);
                }
            }

        },
        //选择暴露史
        chooseExposureType: function(exposureType) {
            if (this.get('exposurehistoryNOHave')) {
                return;
            }
            if (exposureType.get('hasSelcted')) {
                exposureType.set('hasSelcted', false);
            } else {
                exposureType.set('hasSelcted', true);
            }
        },
        //选择疾病史
        chooseDiseaseType: function(diseaseType) {
            if (diseaseType.get('diseaseType.typecode') == 'diseaseType1') {
                if (diseaseType.get('hasSelcted')) {
                    this.set('have', false);
                    diseaseType.set('hasSelcted', false);

                } else {
                    this.set('have', true);
                    diseaseType.set('hasSelcted', true);
                    this.get('diseaseAry').forEach(function(disease) {
                        if (disease.get('diseaseType.typecode') == 'diseaseType1') {} else {
                            disease.set('hasSelcted', false);
                            disease.set('tumourRemark', '');
                            disease.set('otherRemark', '');
                            disease.set('occupationRemark', '');
                        }
                    });
                }
            } else {
                if (this.get('have')) {
                    return;
                }
                if (diseaseType.get('hasSelcted')) {
                    diseaseType.set('hasSelcted', false);
                    diseaseType.set('showInput',false);
                } else {
                    diseaseType.set('hasSelcted', true);
                    if(diseaseType.get('diseaseType.typecode')=='diseaseType6' || diseaseType.get('diseaseType.typecode')=='diseaseType12' ||diseaseType.get('diseaseType.typecode')== 'diseaseType13'){
                      diseaseType.set('showInput',true);
                    }
                }
            }
        },
        //选择家族史
        chooseHomeHistoryType1: function(homeHistoryType) {
            if (homeHistoryType.get('homeHistoryType.typecode') == 'homeHistoryType1') {
                if (homeHistoryType.get('hasSelcted')) {
                    this.set('homehave', false);
                    homeHistoryType.set('hasSelcted', false);

                } else {
                    this.set('homehave', true);
                    homeHistoryType.set('hasSelcted', true);
                    this.get('familyAry1').forEach(function(family) {
                        if (family.get('homeHistoryType.typecode') == 'homeHistoryType1') {

                        } else {
                            family.set('hasSelcted', false);
                            family.set('remark', '');
                        }
                    });
                }
            } else {
                if (this.get('homehave')) {
                    return;
                }
                if (homeHistoryType.get('hasSelcted')) {
                    homeHistoryType.set('hasSelcted', false);
                    homeHistoryType.set('showInput',false);
                } else {
                    homeHistoryType.set('hasSelcted', true);
                    if(homeHistoryType.get('homeHistoryType.typecode')=="homeHistoryType12"){
                      homeHistoryType.set('showInput',true);
                    }
                }
            }
        },
        chooseHomeHistoryType2: function(homeHistoryType) {
            if (homeHistoryType.get('homeHistoryType.typecode') == 'homeHistoryType1') {
                if (homeHistoryType.get('hasSelcted')) {
                    this.set('homehave2', false);
                    homeHistoryType.set('hasSelcted', false);
                } else {
                    this.set('homehave2', true);
                    homeHistoryType.set('hasSelcted', true);
                    this.get('familyAry2').forEach(function(family) {
                        if (family.get('homeHistoryType.typecode') == 'homeHistoryType1') {} else {
                            family.set('hasSelcted', false);
                            family.set('remark', '');
                        }
                    });
                }
            } else {
                if (this.get('homehave2')) {
                    return;
                }
                if (homeHistoryType.get('hasSelcted')) {
                    homeHistoryType.set('hasSelcted', false);
                    homeHistoryType.set('showInput',false);
                } else {
                    homeHistoryType.set('hasSelcted', true);
                    if(homeHistoryType.get('homeHistoryType.typecode')=="homeHistoryType12"){
                      homeHistoryType.set('showInput',true);
                    }
                }
            }
        },
        chooseHomeHistoryType3: function(homeHistoryType) {
            if (homeHistoryType.get('homeHistoryType.typecode') == 'homeHistoryType1') {
                if (homeHistoryType.get('hasSelcted')) {
                    this.set('homehave3', false);
                    homeHistoryType.set('hasSelcted', false);

                } else {
                    this.set('homehave3', true);
                    homeHistoryType.set('hasSelcted', true);
                    this.get('familyAry3').forEach(function(family) {
                        if (family.get('homeHistoryType.typecode') == 'homeHistoryType1') {

                        } else {
                            family.set('hasSelcted', false);
                            family.set('remark', '');
                        }
                    });
                }
            } else {
                if (this.get('homehave3')) {
                    return;
                }
                if (homeHistoryType.get('hasSelcted')) {
                    homeHistoryType.set('hasSelcted', false);
                    homeHistoryType.set('showInput',false);
                } else {
                    homeHistoryType.set('hasSelcted', true);
                    if(homeHistoryType.get('homeHistoryType.typecode')=="homeHistoryType12"){
                      homeHistoryType.set('showInput',true);
                    }
                }
            }
        },
        chooseHomeHistoryType4: function(homeHistoryType) {
            if (homeHistoryType.get('homeHistoryType.typecode') == 'homeHistoryType1') {
                if (homeHistoryType.get('hasSelcted')) {
                    this.set('homehave4', false);
                    homeHistoryType.set('hasSelcted', false);

                } else {
                    this.set('homehave4', true);
                    homeHistoryType.set('hasSelcted', true);
                    this.get('familyAry4').forEach(function(family) {
                        if (family.get('homeHistoryType.typecode') == 'homeHistoryType1') {

                        } else {
                            family.set('hasSelcted', false);
                            family.set('remark', '');
                        }
                    });
                }
            } else {
                if (this.get('homehave4')) {
                    return;
                }
                if (homeHistoryType.get('hasSelcted')) {
                    homeHistoryType.set('hasSelcted', false);
                    homeHistoryType.set('showInput',false);
                } else {
                    homeHistoryType.set('hasSelcted', true);
                    if(homeHistoryType.get('homeHistoryType.typecode')=="homeHistoryType12"){
                      homeHistoryType.set('showInput',true);
                    }
                }
            }
        },
        //选择疾病情况
        chooseDisabledType: function(disabledType) {
            if (disabledType.get('disabledType.typecode') == 'disabledType1') {
                if (disabledType.get('hasSelcted')) {
                    this.set('disabledhave', false);
                    disabledType.set('hasSelcted', false);
                } else {
                    this.set('disabledhave', true);
                    disabledType.set('hasSelcted', true);
                    this.get('diseaseconditionAry').forEach(function(diseasecondition) {
                        if (diseasecondition.get('disabledType.typecode') == 'disabledType1') {} else {
                            diseasecondition.set('hasSelcted', false);
                            diseasecondition.set('remark', '');
                        }
                    });
                }
            } else {
                if (this.get('disabledhave')) {
                    return;
                }
                if (disabledType.get('hasSelcted')) {
                    disabledType.set('hasSelcted', false);
                    disabledType.set('showInput',false);
                } else {
                    disabledType.set('hasSelcted', true);
                    if(disabledType.get('disabledType.typecode')=='disabledType8'){
                      disabledType.set('showInput',true);
                    }
                }
            }
        },
    }
});
