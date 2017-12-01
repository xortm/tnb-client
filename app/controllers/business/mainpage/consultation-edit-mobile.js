import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const {
    educationLevelPrimary,
    educationLevelJunior,
    educationLevelSenior,
    educationLevelUniversity,
    inPreference
} = Constants;

export default Ember.Controller.extend(InfiniteScroll, {
    infiniteContentPropertyName: "selfChooseList",
    infiniteModelName: "dicttype",
    infiniteContainerName: "consultEditContainer",
    scrollPrevent: true,
    dateService: Ember.inject.service('date-service'),
    dataLoader: Ember.inject.service("data-loader"),
    feedService: Ember.inject.service('feed-bus'),
    editEnd: true,
    backRoutePath: null, //返回路径
    curRoutePath: null, //当前路径
    isSquare: true,
    constants: Constants,
    listAdv: new Ember.A(), //暂存咨询渠道
    listIn: new Ember.A(), //暂存入住偏好
    dictTemp: null, //暂存选项
    queryObs: function() {
        App.lookup('route:business.mainpage.consultation-edit-mobile').doQuery();
    }.observes("source"),

    isMobile: Ember.computed(function() {
        console.log("isMobile in:", this.get("global_curStatus").get("isMobile"));
        return this.get("global_curStatus").get("isMobile");
    }),
    //通过event service监控顶部菜单的选择事件，并进行相关方法调用
    // listenner: function() {
    //     this.get('feedService').on('saveFun_save_con', this, 'save');
    // }.on('init'),
    ageRegular: Ember.computed(function() {
        var num = this.get('edit');
        var Reg = /^(?:[1-9]\d?|1[0-4]\d|150)$/;
        return this.Regular(num, Reg);
    }).property('edit'),
    phoneRegular: Ember.computed(function() {
        var num = this.get('edit');
        //var Reg = /^1\d{10}/;
        var Reg = /^[0-9]\d*$/;
        return this.Regular(num, Reg);
    }).property('edit'),
    emailRegular: Ember.computed(function() {
        var num = this.get('edit');
        var Reg = /^\w+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
        return this.Regular(num, Reg);
    }).property('edit'),
    codeRegular: Ember.computed(function() {
        var num = this.get('edit');
        var Reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
        return this.Regular(num, Reg);
    }).property('edit'),
    numRegular: Ember.computed(function() {
        var num = this.get('edit');
        var Reg = /^[1-9]\d*$/;
        return this.Regular(num, Reg);
    }).property('edit'),
    Regular: function(num, Reg) {
        if (num && !(Reg.test(num))) {
            return false;
        }
        return true;
    },
    maxlength: Ember.computed("source", function() {
        var maxlength = "";
        var source = this.get("source");
        if (source === 'age') {
            maxlength = "3";
        }
        if (source === 'staffMail') {
            maxlength = "33";
        }
        if (source === 'staffTel') {
            maxlength = '11';
        }
        if (source === 'staffCardCode') {
            maxlength = '18';
        }
        if (source === 'weixin') {
            maxlength = '33';
        }
        return maxlength;
    }),
    editPlaceholder: Ember.computed("source", function() {
        var editPlaceholder = "";
        var source = this.get("source");
        if (source === 'advName') {
            editPlaceholder = "请输入咨询人姓名";
        }
        if (source === 'remark') {
            editPlaceholder = "请输入详细内容";
        }
        if (source === 'customerBrith') {
            editPlaceholder = "请输入年龄";
        }
        if (source === 'staffCardCode') {
            editPlaceholder = "请输入身份证号";
        }
        if (source === 'advTel') {
            editPlaceholder = '请输入手机号码';
        }
        if (source === 'staffMail') {
            editPlaceholder = "请输入邮箱账号";
        }
        if (source === 'weixin') {
            editPlaceholder = '请输入微信账号';
        }
        if (source === 'curAddress') {
            editPlaceholder = '请输入家庭住址';
        }
        if (source === 'care' || source === 'dietRequirements' || source === "discontent" || source === 'psychologicalPrice' || source === 'roomRequirements' || source === 'serviceRequirements' || source === 'otherRequirements') {
            editPlaceholder = '请输入您所关心的内容';
        }
        if (source === 'dietRequirements' || source === "discontent" || source === 'psychologicalPrice' || source === 'roomRequirements' || source === 'serviceRequirements' || source === 'otherRequirements') {
            editPlaceholder = '请输入您的要求';
        }
        if (source === 'psychologicalPrice') {
            editPlaceholder = '请输入您的心理价位';
        }
        if (source === "discontent") {
            editPlaceholder = '请输入您不满意的地方';
        }
        return editPlaceholder;
    }),
    queryFlagIn: function() {

    },
    refreshChooseMoreList: function(data, flag) {
        if (this.get("selfChooseList").findBy("typecode", data.get("typecode"))) {
            this.get("selfChooseList").removeObject(data);
            data.set('select', flag);
            this.get("selfChooseList").pushObject(data);
            let tempList = this.get("selfChooseList").sortBy('typecode').reverse();
            this.set("selfChooseList", tempList);
        }
    },
    refreshChooseSingleList: function(data, flag) {
      console.log("data in:",data);
      console.log("data in typecode:",data.get("typecode"));
        if (this.get("selfChooseList").findBy("typecode", data.get("typecode"))) {
            this.get("selfChooseList").removeObject(data);
            data.set('select', flag);
            let rs = new Ember.A();
            this.get("selfChooseList").forEach(function(item) {
                if (item.get('typecode') !== data.get('typecode')) {
                    item.set('select', false);
                    rs.pushObject(item);
                }
            });
            rs.pushObject(data);
            let tempList = rs.sortBy('typecode').reverse();
            this.set("selfChooseList", tempList);
        }
    },

    actions: {
        /**
         * 保存——钩：调用Fun()方法；
         * code
         * lishan
         * 2016-8-4
         */
        save() {
            var _self = this;
            App.lookup('controller:business.mainpage').showMobileLoading();
            var source = _self.get("source");
            var infoId = _self.get("infoId");
            var edit = this.get('edit');
            console.log("this.edit", edit);
            var $FromDate;
            var date;
            console.log("11111111111date", date);
            var timeData;
            if (source === "advDate" || source === "appointmentDate") {
                $FromDate = $("#FromDate");
                date = $FromDate.val();
                console.log("11111111111date", date);
                timeData = this.get("dateService").timeStringToTimestamp(date);
                console.log("11111111111date test", timeData);
                if (!timeData) {
                    this.set('succeed', '时间不能为空！');
                    App.lookup('controller:business.mainpage').closeMobileLoading();
                    return;
                }
            }
            if (source === "advName" && (edit === null || edit.length === 0)) {
                this.set('succeed', '请输入咨询人姓名！');
                App.lookup('controller:business.mainpage').closeMobileLoading();
                return;
            } else if (source === "staffMail" && !this.get('emailRegular')) {
                this.set('succeed', '请输入正确的邮箱账号！');
                App.lookup('controller:business.mainpage').closeMobileLoading();
            } else if (source === "customerTel" && !this.get('phoneRegular')) {
                this.set('succeed', '请输入正确的电话号码！');
                App.lookup('controller:business.mainpage').closeMobileLoading();
                return;
            } else if (source === "advTel" && !this.get('phoneRegular')) {
                this.set('succeed', '请输入正确的电话号码！');
                App.lookup('controller:business.mainpage').closeMobileLoading();
            } else if (source === "customerBrith" && !this.get('ageRegular')) {
                this.set('succeed', '请输入正确0-150的年龄！');
                App.lookup('controller:business.mainpage').closeMobileLoading();
                return;
            } else if (source === "staffCardCode" && !this.get('codeRegular')) {
                this.set('succeed', '请输入正确的身份证号码！');
                App.lookup('controller:business.mainpage').closeMobileLoading();
            } else if (source === "psychologicalPrice" && !this.get('numRegular')) {
                this.set('succeed', '请输入数字！');
                App.lookup('controller:business.mainpage').closeMobileLoading();
                return;
            } else if (!edit && source !== "advDate" && source !== "appointmentDate") {
                console.log('_self.get in edit is none ,not do save');
                var mainController = App.lookup("controller:business.mainpage");
                mainController.switchMainPage("consultation-detail-mobile");
            } else {
                var leaveStatusObj = null;
                var consultinfo = this.get("store").peekRecord('consultinfo', infoId);
                if (source === "advTel") {
                    consultinfo.set("advTel", edit);
                } else if (source === "advName") {
                    consultinfo.set("advName", edit);
                } else if (source === "occupancyIntent") {
                    consultinfo.set("occupancyIntent", edit);
                } else if (source === "remark") {
                    consultinfo.set("remark", edit);
                } else if (source === "customerName") {
                    consultinfo.set("customerName", edit);
                } else if (source === 'customerPS') { //家庭住址
                    consultinfo.set("customerPS", edit);
                } else if (source === "customerAddr") {
                    consultinfo.set("customerAddr", edit);
                } else if (source === "customerTel") {
                    consultinfo.set("customerTel", edit);
                } else if (source === 'customerBrith') { //家庭住址
                    consultinfo.set("customerBrith", edit);
                } else if (source === "inPreferenceName") {
                    consultinfo.set("inPreferenceName", edit);
                } else if (source === "care") {
                    consultinfo.set("care", edit);
                } else if (source === 'dietRequirements') { //家庭住址
                    consultinfo.set("dietRequirements", edit);
                } else if (source === "roomRequirements") {
                    consultinfo.set("roomRequirements", edit);
                } else if (source === "serviceRequirements") {
                    consultinfo.set("serviceRequirements", edit);
                } else if (source === "otherRequirements") {
                    consultinfo.set("otherRequirements", edit);
                } else if (source === "psychologicalPrice") {
                    consultinfo.set("psychologicalPrice", edit);
                } else if (source === "discontent") {
                    consultinfo.set("discontent", edit);
                } else if (source === "advDate") { //籍贯
                    console.log("typecode   1111", timeData);
                    consultinfo.set("advDate", timeData);
                } else if (source === "appointmentDate") {
                    console.log("appointmentDate   2222", timeData);
                    consultinfo.set("appointmentDate", timeData); //
                }
                _self.get("global_ajaxCall").set("dur-noprevent", "yes");
                var itemId = "consultationEditMobileBut";
                $("." + itemId).addClass("tapped");
                Ember.run.later(function() {
                    $("." + itemId).removeClass("tapped");
                    consultinfo.save().then(function() {
                        console.log("hhhh");
                        _self.get("feedService").set("conManaFlag", true);
                        App.lookup('controller:business.mainpage').closeMobileLoading();
                        // var params = {
                        //     clickActFlag: 'tabInfo',
                        //     itemId: consultinfo.get("id"),
                        //     itemIdFlag: Math.random(),
                        //     source: "edit"
                        // };
                        var mainController = App.lookup("controller:business.mainpage");
                        mainController.switchMainPage("consultation-detail-mobile");
                        // this.set('succeed', '保存成功请返回');backvist-detail-mobile backvist-edit-mobile
                        // this.set('succeed', '');
                    });
                }, 200);


            }
        },
        //了解渠道
        inPreferenceSelect: function(sourceDict) {
            var _self = this;
            var source = this.get("source");
            var infoId = _self.get("infoId");
            let list = new Ember.A();
            list.pushObject(sourceDict);
            this.store.findRecord('consultinfo', infoId).then(function(consultInfo) {
                consultInfo.set("inPreference", sourceDict);
            });
            consultInfo.save().then(function() {
                var mainController = App.lookup("controller:business.mainpage");
                mainController.switchMainPage("consultation-detail-mobile");
            });
        },

        choose: function(data) {
            var itemId = "choose_" + data.get("id");
            $("#" + itemId).addClass("tapped");
            setTimeout(function() {
                $("#" + itemId).removeClass("tapped");
            }, 200);
            App.lookup('controller:business.mainpage').showMobileLoading();
            var _self = this;
            var source = this.get("source");
            var infoId = _self.get("infoId");
            var leaveStatusObj = _self.get("dataLoader").findDict(data.get("typecode"));
            var leaveStatusObjAction = _self.get("dataLoader").findDict(data.get("typecode"));
            var refleshFlag=true;
            this.store.findRecord('consultinfo', infoId).then(function(consultInfo) {
                if (source === "consultChannel") {
                    console.log("consultChannel   2222", data.get("typecode"));
                    console.log("testdict ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                    if (_self.get('dictTemp') && _self.get('dictTemp').get('typecode') === leaveStatusObj.get('typecode')) {
                        console.log("testdict1 ", _self.get('dictTemp').get('typecode') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=false;
                        //_self.refreshChooseSingleList(leaveStatusObj, false);
                        _self.set('dictTemp', null);
                        leaveStatusObj = null;
                    } else {
                        console.log("testdict2 ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=true;
                        //_self.refreshChooseSingleList(leaveStatusObj, true);
                        _self.set('dictTemp', leaveStatusObj);
                    }
                    console.log("testdict3 ", _self.get('dictTemp') + " " + leaveStatusObj);
                    _self.set("theChoose", leaveStatusObj);
                    consultInfo.set("consultChannel", leaveStatusObj); //
                } else if (source === "advGender") {
                    console.log("typecode   2222", data.get("typecode"));
                    console.log("testdict ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                    if (_self.get('dictTemp') && _self.get('dictTemp').get('typecode') === leaveStatusObj.get('typecode')) {
                        console.log("testdict1 ", _self.get('dictTemp').get('typecode') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=false;
                        //_self.refreshChooseSingleList(leaveStatusObj, false);
                        _self.set('dictTemp', null);
                        leaveStatusObj = null;
                    } else {
                        console.log("testdict2 ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=true;
                        //_self.refreshChooseSingleList(leaveStatusObj, true);
                        _self.set('dictTemp', leaveStatusObj);
                    }
                    console.log("testdict3 ", _self.get('dictTemp') + " " + leaveStatusObj);
                    _self.set("theChoose", leaveStatusObj);
                    consultInfo.set("advGender", leaveStatusObj); //
                }  else if (source === "consultRelation") {
                    console.log("typecode   2222", data.get("typecode"));
                    console.log("testdict ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                    if (_self.get('dictTemp') && _self.get('dictTemp').get('typecode') === leaveStatusObj.get('typecode')) {
                        console.log("testdict1 ", _self.get('dictTemp').get('typecode') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=false;
                        //_self.refreshChooseSingleList(leaveStatusObj, false);
                        _self.set('dictTemp', null);
                        leaveStatusObj = null;
                    } else {
                        console.log("testdict2 ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=true;
                        //_self.refreshChooseSingleList(leaveStatusObj, true);
                        _self.set('dictTemp', leaveStatusObj);
                    }
                    console.log("testdict3 ", _self.get('dictTemp') + " " + leaveStatusObj);
                    _self.set("theChoose", leaveStatusObj);
                    consultInfo.set("consultRelation", leaveStatusObj); //
                } else if (source === "customerNative") {
                    console.log("typecode   2222", data.get("typecode"));
                    console.log("testdict ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                    if (_self.get('dictTemp') && _self.get('dictTemp').get('typecode') === leaveStatusObj.get('typecode')) {
                        console.log("testdict1 ", _self.get('dictTemp').get('typecode') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=false;
                        //_self.refreshChooseSingleList(leaveStatusObj, false);
                        _self.set('dictTemp', null);
                        leaveStatusObj = null;
                    } else {
                        console.log("testdict2 ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=true;
                        //_self.refreshChooseSingleList(leaveStatusObj, true);
                        _self.set('dictTemp', leaveStatusObj);
                    }
                    console.log("testdict3 ", _self.get('dictTemp') + " " + leaveStatusObj);
                    _self.set("theChoose", leaveStatusObj);
                    consultInfo.set("customerNative", leaveStatusObj); //
                } else if (source === "customerNative") {
                    console.log("typecode   2222", data.get("typecode"));
                    consultInfo.set("customerNative", leaveStatusObj); //
                } else if (source === "customerGender") {
                    console.log("typecode   2222", data.get("typecode"));
                    console.log("testdict ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                    if (_self.get('dictTemp') && _self.get('dictTemp').get('typecode') === leaveStatusObj.get('typecode')) {
                        console.log("testdict1 ", _self.get('dictTemp').get('typecode') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=false;
                        //_self.refreshChooseSingleList(leaveStatusObj, false);
                        _self.set('dictTemp', null);
                        leaveStatusObj = null;
                    } else {
                        console.log("testdict2 ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=true;
                        //_self.refreshChooseSingleList(leaveStatusObj, true);
                        _self.set('dictTemp', leaveStatusObj);
                    }
                    console.log("testdict3 ", _self.get('dictTemp') + " " + leaveStatusObj);
                    _self.set("theChoose", leaveStatusObj);
                    consultInfo.set("customerGender", leaveStatusObj); //
                } else if (source === "liveIntent") {
                    console.log("liveIntent   2222", data.get("typecode"));
                    console.log("testdict ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                    if (_self.get('dictTemp') && _self.get('dictTemp').get('typecode') === leaveStatusObj.get('typecode')) {
                        console.log("testdict1 ", _self.get('dictTemp').get('typecode') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=false;
                        //_self.refreshChooseSingleList(leaveStatusObj, false);
                        _self.set('dictTemp', null);
                        leaveStatusObj = null;
                    } else {
                        console.log("testdict2 ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=true;
                        //_self.refreshChooseSingleList(leaveStatusObj, true);
                        _self.set('dictTemp', leaveStatusObj);
                    }
                    console.log("testdict3 ", _self.get('dictTemp') + " " + leaveStatusObj);
                    consultInfo.set("liveIntent", leaveStatusObj); //
                } else if (source === "inPreference") {
                    console.log("typecode   2222", data.get("typecode"));
                    let inTemp;
                    if (consultInfo.get('inPreference')) {
                        consultInfo.get('inPreference').forEach(function(item) {
                            _self.get('listIn').pushObject(item);
                        });
                    }
                    if (_self.get('listIn')) {
                        inTemp = _self.get('listIn').findBy('typecode', leaveStatusObj.get('typecode'));
                    }
                    if (inTemp) {
                        refleshFlag=false;
                        //_self.refreshChooseMoreList(inTemp, false);
                        _self.get('listIn').removeObject(inTemp);
                    } else {
                        refleshFlag=true;
                        //_self.refreshChooseMoreList(leaveStatusObj, true);
                        _self.get('listIn').pushObject(leaveStatusObj);
                    }
                    console.log("testin ", _self.get('listIn'));
                    consultInfo.set("inPreference", _self.get('listIn')); //
                } else if (source === "customerSelfCareAbility") {
                    console.log("typecode   2222", data.get("typecode"));
                    console.log("testdict ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                    if (_self.get('dictTemp') && _self.get('dictTemp').get('typecode') === leaveStatusObj.get('typecode')) {
                        console.log("testdict1 ", _self.get('dictTemp').get('typecode') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=false;
                        //_self.refreshChooseSingleList(leaveStatusObj, false);
                        _self.set('dictTemp', null);
                        leaveStatusObj = null;
                    } else {
                        console.log("testdict2 ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=true;
                        //_self.refreshChooseSingleList(leaveStatusObj, true);
                        _self.set('dictTemp', leaveStatusObj);
                    }
                    console.log("testdict3 ", _self.get('dictTemp') + " " + leaveStatusObj);
                    _self.set("theChoose", leaveStatusObj);
                    consultInfo.set("customerSelfCareAbility", leaveStatusObj); //
                } else if (source === "relationType") {
                    console.log("typecode   2222", data.get("typecode"));
                    console.log("testdict ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                    if (_self.get('dictTemp') && _self.get('dictTemp').get('typecode') === leaveStatusObj.get('typecode')) {
                        console.log("testdict1 ", _self.get('dictTemp').get('typecode') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=false;
                        //_self.refreshChooseSingleList(leaveStatusObj, false);
                        _self.set('dictTemp', null);
                        leaveStatusObj = null;
                    } else {
                        console.log("testdict2 ", _self.get('dictTemp') + " " + leaveStatusObj.get('typecode'));
                        refleshFlag=true;
                        //_self.refreshChooseSingleList(leaveStatusObj, true);
                        _self.set('dictTemp', leaveStatusObj);
                    }
                    console.log("testdict3 ", _self.get('dictTemp') + " " + leaveStatusObj);
                    _self.set("theChoose", leaveStatusObj);
                    consultInfo.set("relationType", leaveStatusObj); //
                } else if (source === "advWay") {
                    console.log("typecode   2222", data.get("typecode"));
                    if (consultInfo.get('advWay')) {
                        consultInfo.get('advWay').forEach(function(item) {
                            _self.get('listAdv').pushObject(item);
                        });
                    }
                    let inTemp;
                    let rsT=new Ember.A();
                    if (_self.get('listAdv')) {
                        inTemp = _self.get('listAdv').findBy('typecode', leaveStatusObj.get('typecode'));
                    }
                    if (inTemp) {
                        refleshFlag=false;
                        //_self.refreshChooseSingleList(inTemp, false);
                        //_self.get('listAdv').removeObject(inTemp);
                        _self.set('listAdv',rsT);
                    } else {
                        refleshFlag=true;
                        //_self.refreshChooseSingleList(leaveStatusObj, true);
                        _self.set('listAdv',rsT);
                        _self.get('listAdv').pushObject(leaveStatusObj);
                    }
                    console.log("testin ", _self.get('listAdv'));
                    consultInfo.set("advWay", _self.get('listAdv')); //
                }
                _self.get("global_ajaxCall").set("dur-noprevent", "yes");
                consultInfo.save().then(function() {
                  if (source === "consultChannel" || source === "advGender" || source === "consultRelation" || source === "customerNative" || source === "customerGender" || source === "liveIntent" || source === "customerSelfCareAbility" || source === "relationType" || source === "advWay") {
                      _self.refreshChooseSingleList(leaveStatusObjAction, refleshFlag);
                  }
                  if (source === "inPreference") {
                      _self.refreshChooseMoreList(leaveStatusObjAction, refleshFlag);
                  }
                  App.lookup('controller:business.mainpage').closeMobileLoading();
                  if (source != 'inPreference') {
                    var mainController = App.lookup("controller:business.mainpage");
                    mainController.switchMainPage("consultation-detail-mobile");
                  }
                    // var params = {
                    //     clickActFlag: 'tabInfo',
                    //     itemId: consultInfo.get("id"),
                    //     itemIdFlag: Math.random(),
                    //     source: "edit"
                    // };
                    // var itemId = 'consultationEditMobileBut';
                    // $("." + itemId).addClass("tapped");
                    // Ember.run.later(function() {
                    //     $("." + itemId).removeClass("tapped");
                    //     _self.get("feedService").set("conManaFlag", true);
                    //     if (source !== 'inPreference' && source !== 'advWay') {
                    //         var mainController = App.lookup("controller:business.mainpage");
                    //         mainController.switchMainPage("consultation-detail-mobile",params);
                    //     }
                    // }, 200);
                });
            });
        },
        chooseStaff: function(data) {
            var itemId = "choose_staff_" + data.get("id");
            $("#" + itemId).addClass("tapped");
            App.lookup('controller:business.mainpage').showMobileLoading();
            setTimeout(function() {
                $("#" + itemId).removeClass("tapped");
            }, 200);
            var _self = this;
            var source = this.get("source");
            var infoId = _self.get("infoId");
            this.set("theChoose", data);
            this.store.findRecord('consultinfo', infoId).then(function(consultInfo) {
                if (source === "otherReceiveStaff") { //籍贯
                    console.log("typecode   1111", data.name);
                    consultInfo.set("otherReceiveStaff", data);
                } else if (source === "receiveStaff") {
                    console.log("typecode   2222", data.name);
                    consultInfo.set("receiveStaff", data); //
                }
                _self.get("global_ajaxCall").set("dur-noprevent", "yes");
                consultInfo.save().then(function() {
                    _self.get("feedService").set("conManaFlag", true);
                    App.lookup('controller:business.mainpage').closeMobileLoading();
                    // var params = {
                    //     clickActFlag: 'tabInfo',
                    //     itemId: consultInfo.get("id"),
                    //     itemIdFlag: Math.random(),
                    //     source: "edit"
                    // };
                    var mainController = App.lookup("controller:business.mainpage");
                    mainController.switchMainPage("consultation-detail-mobile");
                });
            });

        },
    },
});
