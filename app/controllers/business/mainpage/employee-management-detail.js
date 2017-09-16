import Ember from 'ember';
import Changeset from 'ember-changeset';
import StaffValidations from '../../../validations/jujia-staff';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(StaffValidations, {
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    mainController: Ember.inject.controller('business.mainpage'),
    refreshPageNumbers: true,
    showPopModal: false,

    staffModel: Ember.computed("staff", function() {
        var model = this.get("staff");
        console.log('staffModelMMMM   ' + model);
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(StaffValidations), StaffValidations);
    }),

    computedAge: Ember.computed("staff.staffCardCode", function() {
        var UUserCard = this.get("staff.staffCardCode");
        if (!UUserCard) {
            return;
        }
        //取得系统时间
        let sysTime = this.get("dataLoader").getNowTime();
        if (sysTime) {
            sysTime = sysTime;
        } else {
            sysTime = new Date().getTime() / 1000;
        }
        var myDate = this.get("dateService").timestampToTime(sysTime);
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) <= month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    }),
    computedBirthday: Ember.computed("staff.staffCardCode", function() {
        var UUserCard = this.get("staff.staffCardCode");
        if (!UUserCard) {
            return;
        }
        var tmpStr = "";
        var strReturn = "";
        if (UUserCard.length == 15) {
            tmpStr = UUserCard.substring(6, 12);
            tmpStr = "19" + tmpStr;
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
            return tmpStr;
        } else {
            tmpStr = UUserCard.substring(6, 14);
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
            return tmpStr;
        }
    }),
    showPassWord: Ember.computed("sysPassWord", function() { //密码转成 "*"符号
        var sysPassWord = this.get("sysPassWord").toString();
        var str = sysPassWord.replace(/\d/g, '*');
        return str;
    }),

    uploadUrl: Ember.computed('property', function() {
        return this.get("pathConfiger").get("uploadUrl");
    }),
    deformation: function() {
        if ($(".cccc >div img").width() >= $(".cccc >div img").height()) {
            $(".cccc >div ").addClass("intergration_normal");
            $(".cccc >div img").css("height", "110px  ");
            $(".cccc >div img").css("width", "auto");
            console.log("this.widthcccccccccccccc==========", $(".cccc >div img").width());
            console.log('==========cccccccccccccccintergration_normal_height', $(".cccc >div img").height(), $(".cccc >div img").width());
        } else {
            $(".cccc >div ").addClass("intergration_normal");
            $(".cccc >div img").css("width", "110px ");
            $(".cccc >div img").css("height", "auto");
            console.log("this.heightccccc==========", $(".cccc >div img").height());
            console.log('==========cccccccccccccccintergration_normal', $(".cccc >div img").height(), $(".cccc >div img").width());
        }
    },
    editModel: null,
    /*editFlag: Ember.computed(function () {
      //console.log("isMobile in:", this.get("global_curStatus").get("isMobile"));
      if(this.editModel){
        console.log("editFlag1111");
        return true;
      }else{
        console.log("editFlag0000");
        return false;
      }
    }),*/
    /*init() {
      this._super(...arguments);
      let model = this.get("store").createRecord('staff', {});
      this.staff = model;
    },*/
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.employee-management');
        // route.doQuery();
        route.refresh();
    },
    constants: Constants,
    actions: {
      leaveIdCard:function(){
        var UUserCard = this.get("staffModel.staffCardCode");
        if(!UUserCard){return;}
        //取得系统时间
        let sysTime = this.get("dataLoader").getNowTime();
        if(sysTime){
          sysTime = sysTime ;
        }else {
          sysTime = new Date().getTime()/1000;
        }
        var myDate = this.get("dateService").timestampToTime(sysTime);
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) <= month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        var staffModel = this.get("staffModel");
        staffModel.set("age",age);
        var tmpStr = "";
        var strReturn = "";
        var tmpStrNumber = "";
        var staffBirthDate;
        if (UUserCard.length == 15) {
          tmpStr = UUserCard.substring(6, 12);
          tmpStr = "19" + tmpStr;
          tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
          tmpStrNumber = new Date(tmpStr).getTime()/1000;
          staffBirthDate = this.get("dateService").timestampToTime(tmpStrNumber);
          staffModel.set("staffBirth",tmpStrNumber);
          staffModel.set("staffBirthString",tmpStr);
          staffModel.set("theStaffBirthDate",staffBirthDate);
          this.set("computedBirthday",tmpStr);
        }else {
          tmpStr = UUserCard.substring(6, 14);
          tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6);
          tmpStrNumber = new Date(tmpStr).getTime()/1000;
          console.log("tmpStrNumber111111",tmpStrNumber);
          staffBirthDate = this.get("dateService").timestampToTime(tmpStrNumber);
          staffModel.set("staffBirth",tmpStrNumber);
          staffModel.set("staffBirthString",tmpStr);
          staffModel.set("theStaffBirthDate",staffBirthDate);
          this.set("computedBirthday",tmpStr);
        }
        //计算性别
        if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
            var manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
            staffModel.set("staffSex", manObj);
            console.log("11111111111111111111111111111  nan",staffModel.get("staffSex"));
        } else {
            var womanObj = this.get("dataLoader").findDict(Constants.sexTypeFemale);
            staffModel.set("staffSex", womanObj);
            console.log("11111111111111111111111111111  nv",staffModel.get("staffSex"));
        }
        },
        uploadSuccHead: function(response) {
            var model = this.get('model');
            var res = JSON.parse(response);
            console.log("++++res+++++", res);
            this.get("staff").set("avatar", res.relativePath);
            this.set('staffModel.avatar', res.relativePath);
            console.log("res.relativePath:", res.relativePath);
            // this.get("staff").save();
        },
        uploadSucc: function(response) {
            var model = this.get('model');
            var res = JSON.parse(response);
            console.log("++++res+++++", res);
            this.get("staff").set("certificateImage", res.relativePath);
            this.set('staffModel.certificateImage', res.relativePath);
            console.log("res.relativePath:", res.relativePath);
            // this.get("staff").save();
        },
        // avatarUpload:function(){
        //   var imgIntergrationComponent = App.lookup('component:ui.img-intergration');
        //   imgIntergrationComponent.send("avatarUpload");
        // },
        invalid() {
            //alert("error");
        },
        saveClick: function() {
            //alert("save");
            var _self = this;
            var staffModel = this.get("staffModel");
            // var cbState = this.get("cbState");
            // if(cbState){
            //   this.set("staffModel.leaderFlag",1);// leaderFlag为 1 证明是部门领导人
            // }else {
            //   this.set("staffModel.leaderFlag",0);
            // }
            console.log("computedAge1111", staffModel.get("age"));
            var staff = this.get("staff");
            staffModel.validate().then(
                function() {
                    //alert("save   out");
                    if (staffModel.get('errors.length') === 0) {
                        var sysPas = _self.get("sysPassWord");
                        var appPas = _self.get("appPassWord");
                        console.log("password  " + sysPas + " " + appPas);
                        if (appPas && appPas !== '') {
                            staffModel.set('appPassWord', $.md5(appPas));
                        }
                        if (sysPas && sysPas !== '') {
                            staffModel.set('passcode', $.md5(sysPas));
                        }
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        console.log("computedAge1111  staffCardCode", _self.get("staff.staffCardCode"));
                        staffModel.save().then(function(staff) {
                        // staffModel.save().then(function(staff) {},function(err){});
                          console.log("error11111  in  save");
                                if (staff.get('errcode') === 0) {
                                    //  _self.get("staffModel").addError('loginName', '登录名已存在');
                                    App.lookup('controller:business.mainpage').showPopTip("登录名已存在");
                                    return false;
                                } else if (staff.get('errcode') === 1) {
                                    //   _self.get("staffModel").addError('staffCardCode', '该身份证号已注册');
                                    App.lookup('controller:business.mainpage').showPopTip("该身份证号已注册");
                                    return false;
                                }if (staff.get('errcode') === 3) {
                                    //   _self.get("staffModel").addError('staffCardCode', '该身份证号已注册');
                                    App.lookup('controller:business.mainpage').showPopTip("身份证号重复");
                                    return false;
                                } else if (staff.get('errcode') == 4) {
                                    App.lookup('controller:business.mainpage').showPopTip("该员工在护工组,不能离职");
                                    return false;
                                } else {
                                    if (_self.get('operateFlag')) {
                                        console.log("edit   detailSaveClick");
                                        _self.set('editModel', null);
                                        /*_self.get("mainController").switchMainPage('employee-management', {
                                            flag: 'edit'
                                        });*/
                                        App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                    }else {
                                      //  _self.set('staffModel', null);
                                      App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                      _self.get("mainController").switchMainPage('employee-management');
                                    }

                                }
                            },
                            function(err) {
                              console.log("error11111",err);
                                let error = err.errors[0];
                                console.log("error",error);
                                if (error.code == "3") {
                                    staffModel.validate().then(function() {
                                        staffModel.addError('staffCardCode', ['身份证号重复，已有该身份证号的员工']);
                                        staffModel.set("validFlag", Math.random());
                                        App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
                                    });
                                }else if (error.code == "4") {
                                    staffModel.validate().then(function() {
                                        staffModel.addError('staffStatus', ['员工属于护工组或有未完成排班,不能离职']);
                                        staffModel.set("validFlag", Math.random());
                                        staffModel.set("staffStatus", _self.get("staffStatusBefore"));
                                        App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
                                    });
                                }
                            }
                          );
                    } else {
                        staffModel.set("validFlag", Math.random());
                    }
                });
        },
        cancelOperate: function() {
            console.log("cancelEdit  " + this.get('id'));
            if (this.get('operateFlag')) {
                this.get("staff").rollbackAttributes();
                this.set("staffModel", new Changeset(this.get("staff"), lookupValidator(StaffValidations), StaffValidations));
            }
            this.get("mainController").switchMainPage('employee-management');
        },

        //删除按钮
        delById: function(staff) {
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此员工信息", function() {
                _self.send('delStaff', _self.get('staff'));
            });
        },
        //弹窗取消
        invitation() {
            this.set('showpopInvitePassModal', false);
        },

        /*删除*/
        delStaff: function(staff) {
            var _self = this;
            staff.set("delStatus", 1);
            //通过增加计数来触发分页条刷新
            App.lookup('controller:business.mainpage').openPopTip("正在删除");
            staff.save().then(function() {
                _self.refreshStaffList();
                App.lookup('controller:business.mainpage').showPopTip("删除成功");
                var mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('employee-management');
            },function(err) {
                let error = err.errors[0];
                if (error.code === "5") {
                    App.lookup('controller:business.mainpage').showPopTip("删除失败,该员工未离职",false);
                }
            });
        },
        editModelModify: function() {
            this.set('editModel', true);
        },
        cancelEdit: function() {
            this.set('editModel', false);//下面bug 先注释掉
            // console.log("name  " + this.get("staff").get("staffName") + " " + this.get("staffModel").get("staffName"));
            // this.get("staff").rollbackAttributes();
            // this.set("staffModel", new Changeset(this.get("staff"), lookupValidator(StaffValidations), StaffValidations));
        },
        sexSelect: function(dict) {
            this.set("staff.staffSex", dict);
            this.set('staffModel.staffSex', dict);
        },
        careTypeSelect: function(dict) {
            this.set("staff.careType", dict);
            this.set('staffModel.careType', dict);
        },
        hireTypeSelect: function(dict) {
            this.set("staff.hireType", dict);
            this.set('staffModel.hireType', dict);
        },
        educationSelect: function(dict) {
            this.set("staff.staffEducation", dict);
            this.set('staffModel.staffEducation', dict);
        },
        relationTypeSelect: function(dict) {
            this.set("staff.staffStatus", dict);
            this.set('staffModel.staffStatus', dict);
        },
        statusSelect: function(dict) {
            this.set("staff.staffStatus", dict);
            this.set('staffModel.staffStatus', dict);
        },
        systemUserSelect: function(systemUser) {
            this.set("staff.systemusers", systemUser);
            this.set('staffModel.systemusers', systemUser);
        },
        departmentSelect: function(department) {
            this.set("staff.department", department);
            this.set('staffModel.department', department);
        },
        nationalitySelect: function(dict) {
            this.set("staff.staffNation", dict);
            this.set('staffModel.staffNation', dict);
        },
        marrySelect: function(dict) {
            this.set("staff.staffMaritalStatus", dict);
            this.set('staffModel.staffMaritalStatus', dict);
        },
        nativeSelect: function(dict) {
            this.set("staff.staffCensus", dict);
            this.set('staffModel.staffCensus', dict);
        },
        positionSelect: function(dict) {
            this.set("staff.position", dict);
            this.set('staffModel.position', dict);
        },
        braceletSelect: function(bracelet) {//选择手环
            this.set("staff.bracelet", bracelet);
            this.set('staffModel.bracelet', bracelet);
        },
        changeAction(date) {
            var stamp = this.get("dateService").getLastSecondStampOfDay(date);
            this.set("staffModel.toPositionDate", stamp);
        },
        contractAction(date) {
            var stamp = this.get("dateService").getLastSecondStampOfDay(date);
            this.set("staffModel.contractEndDate", stamp);
        },
        birthAction(date) {
            var stamp = this.get("dateService").getLastSecondStampOfDay(date);
            this.set("staffModel.staffBirth", stamp);
            //取得系统时间
            let sysTime = this.get("dataLoader").getNowTime();
            if (sysTime) {
                sysTime = sysTime;
            } else {
                sysTime = new Date().getTime() / 1000;
            }
            var myDate = this.get("dateService").timestampToTime(sysTime);
            var employeeDate = this.get("dateService").timestampToTime(stamp);
            console.log("employeeDate", employeeDate);
            console.log("employeeDate myDate", myDate);
            var month = myDate.getMonth() + 1;
            var employeeMonth = employeeDate.getMonth() + 1;
            var day = myDate.getDate();
            var employeeDay = employeeDate.getDate();
            var age = myDate.getFullYear() - employeeDate.getFullYear() - 1;
            if (employeeMonth <= month && employeeDay <= day) {
                age++;
            }
            var staffModel = this.get("staffModel");
            var tmpStr = this.get("dateService").formatDate(stamp,"yyyy-MM-dd");
            staffModel.set("staffBirthString",tmpStr);
            staffModel.set("age",age);
        },

    },
});
