import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const {
    educationLevelPrimary,
    educationLevelJunior,
    educationLevelSenior,
    educationLevelUniversity
} = Constants;

export default Ember.Controller.extend(InfiniteScroll, {
    infiniteContentPropertyName: "selfChooseList",
    infiniteModelName: "dicttype",
    infiniteContainerName: "selfChooseContainer",
    dateService: Ember.inject.service('date-service'),
    dataLoader: Ember.inject.service("data-loader"),
    feedService: Ember.inject.service('feed-bus'),
    editEnd: true,
    backRoutePath: null, //返回路径
    curRoutePath: null, //当前路径
    isSquare: true,

    // queryObs: function() {
    //     App.lookup('route:business.mainpage.backvist-edit-mobile').doQuery();
    // }.observes("source"),

    isMobile: Ember.computed(function() {
        console.log("isMobile in:", this.get("global_curStatus").get("isMobile"));
        return this.get("global_curStatus").get("isMobile");
    }),

    //通过event service监控顶部菜单的选择事件，并进行相关方法调用
    // listenner: function() {
    //     this.get('feedService').on('saveFun_save_back', this, 'saveBackvist');
    // }.on('init'),
    ageRegular: Ember.computed(function() {
        var num = this.get('edit');
        var Reg = /[1-9]?[0-9]|100/;
        return this.Regular(num, Reg);
    }).property('edit'),
    phoneRegular: Ember.computed(function() {
        var num = this.get('edit');
        var Reg = /^1\d{10}/;
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
        if (source === 'customerName') {
            editPlaceholder = "请输入客户姓名";
        }
        if (source === 'age') {
            editPlaceholder = "请输入年龄";
        }
        if (source === 'staffCardCode') {
            editPlaceholder = "请输入身份证号";
        }
        if (source === 'customerTel') {
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
        return editPlaceholder;
    }),

    actions: {
        /**
         * 保存——钩：调用Fun()方法；
         * code
         * lishan
         * 2016-8-4
         */
        save() {
            var _self = this;
            var source = _self.get("source");
            var infoId = _self.get("infoId");
            var edit = this.get('edit');
            console.log("this.edit", edit);
            var $FromDate;
            var date;
            console.log("11111111111date", date);
            var timeData;
            if (source === "createDateTime") {
                $FromDate = $("#FromDate");
                date = $FromDate.val();
                console.log("11111111111date", date);
                timeData = this.get("dateService").timeStringToTimestamp(date);
                if (!timeData) {
                    this.set('succeed', '时间不能为空！');
                    return;
                }
            }
            if (source === "customerName" && (edit === null || edit.length === 0)) {
                this.set('succeed', '请输入咨询人姓名！');
                return;
            } else if (source === "staffMail" && !this.get('emailRegular')) {
                this.set('succeed', '请输入正确的邮箱账号！');
            } else if (source === "customerTel" && !this.get('phoneRegular')) {
                this.set('succeed', '请输入正确的手机号码！');
                return;
            } else if (source === "advTel" && !this.get('phoneRegular')) {
                this.set('succeed', '请输入正确的手机号码！');
            } else if (source === "age" && !this.get('ageRegular')) {
                this.set('succeed', '请输入正确0-100的年龄！');
            } else if (source === "staffCardCode" && !this.get('codeRegular')) {
                this.set('succeed', '请输入正确的身份证号码！');
            } else if (!edit && source !== "createDateTime") {
                console.log('_self.get in edit is none ,not do save');
                console.log('11111111');
                var mainController = App.lookup("controller:business.mainpage");
                mainController.switchMainPage("backvist-detail-mobile");
            } else {
                var leaveStatusObj = null;
                this.store.findRecord('backvist', infoId).then(function(backvist) {
                    if (source === "remark") {
                        backvist.set("remark", edit);
                    } else if (source === "customerName") {
                        backvist.set("customerName", edit);
                    } else if (source === "customerTel") {
                        backvist.set("customerTel", edit);
                    } else if (source === "createDateTime") { //籍贯
                        console.log("typecode   1111", timeData);
                        backvist.set("createDateTime", timeData);
                    }
                    _self.get("global_ajaxCall").set("dur-noprevent","yes");
                    var itemId = "backvistEditMobileBut";
                    $("." + itemId).addClass("tapped");
                    Ember.run.later(function(){
                      $("." + itemId).removeClass("tapped");
                      backvist.save().then(function(ll) {
                          _self.set('succeed', '');
                          var params = {
                              dataId: backvist.id,
                              infoId: backvist.consultInfo.id,
                              source: 'edit',
                              itemIdFlag:Math.random()
                          };
                          var mainController = App.lookup("controller:business.mainpage");
                          console.log('2222222');
                          mainController.switchMainPage("backvist-detail-mobile",params);
                      });
                    },200);

                });
            }
        },
        choose: function(data) {
            var itemId = "choose_" + data.get("id");
            $("#" + itemId).addClass("tapped");
            setTimeout(function() {
                $("#" + itemId).removeClass("tapped");
            }, 200);
            var _self = this;
            var source = this.get("source");
            var infoId = _self.get("infoId");
            var leaveStatusObj = _self.get("dataLoader").findDict(data.get("typecode"));
            this.set("theChoose", leaveStatusObj);
            this.store.findRecord('backvist', infoId).then(function(backvist) {
                if (source === "accessType") { //籍贯
                    console.log("typecode   1111", data.get("typecode"));
                    backvist.set("accessType", leaveStatusObj);
                } else if (source === "liveIntent") {
                    console.log("typecode   2222", data.get("typecode"));
                    backvist.set("liveIntent", leaveStatusObj); //
                }
                _self.get("global_ajaxCall").set("dur-noprevent","yes");
                backvist.save().then(function() {
                  var params = {
                      dataId: backvist.id,
                      infoId: backvist.consultInfo.id,
                      source: 'edit',
                      itemIdFlag:Math.random()
                  };
                    var mainController = App.lookup("controller:business.mainpage");
                    console.log('33333333');
                    mainController.switchMainPage("backvist-detail-mobile",params);
                });
            });

        },
        chooseStaff: function(data) {
            var itemId = "choose_staff_" + data.get("id");
            $("#" + itemId).addClass("tapped");
            setTimeout(function() {
                $("#" + itemId).removeClass("tapped");
            }, 200);
            var _self = this;
            var source = this.get("source");
            var infoId = _self.get("infoId");
            this.set("theChoose", data);
            this.store.findRecord('backvist', infoId).then(function(backvist) {
                if (source === "vistUser") { //籍贯
                    console.log("typecode   1111", data.name);
                    backvist.set("vistUser", data);
                }
                _self.get("global_ajaxCall").set("dur-noprevent","yes");
                backvist.save().then(function() {
                  var params = {
                      dataId: backvist.id,
                      infoId: backvist.consultInfo.id,
                      source: 'edit',
                      itemIdFlag:Math.random()
                  };
                    var mainController = App.lookup("controller:business.mainpage");
                    console.log('44444444444');
                    mainController.switchMainPage("backvist-detail-mobile",params);
                });
            });

        },
    },
});
