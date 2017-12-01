import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer';
import lookupValidator from 'ember-changeset-validations';
//const {sexTypeMale,sexTypeFemale} = Constants;
export default BaseItem.extend(CustomerValidations, {
    constants: Constants,
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    idNumber:0,
    //delFlag:true,
    customerModel: Ember.computed("customerInfo", function() {
        var model = this.get("customerInfo");
        console.log("model customerInfo", model);
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(CustomerValidations), CustomerValidations);
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.customer-service');
        //route.refresh();
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    detailModify: Ember.computed("addMode", "showCustomer", function() {
        var addMode = this.get("addMode");
        if (addMode) {
            return true;
        } else {
            return false;
        }
        if (showCustomer) {
            return false;
        } else {
            return true;
        }
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
    defaultBed: Ember.computed('customerInfo.bed', function() {
        console.log("customerInfo.bed", this.get('customerInfo.bed'));
        //this.set('bedListFirst',bedList.get('firstObject'));
        //if (this.get('customerInfo.bed') && this.get('customerInfo.bed').content) {
        return this.get('customerInfo.bed');
        //}
        //return this.get('bedListFirst');
    }),
    actions: {
        dpShowAction(e) {

        },
        computedCardCode: function() {
            var cardCode = this.get("customerModel.cardCode");
            if(!cardCode){return;}
            //计算出生年月日
            console.log("cardCode is", cardCode);
            var dateStr = cardCode.substring(6, 10) + "-" + cardCode.substring(10, 12) + "-" + cardCode.substring(12, 14);
            console.log("dateStr is", dateStr);
            var birthday = this.get("dateService").timeStringToTimestamp(dateStr);
            console.log("birthday isis++++++", birthday);
            var birthdayTime = this.get("dateService").timestampToTime(birthday);
            console.log("birthdayTime is what", birthdayTime);
            this.get("customerModel").set("birthdayTime", birthdayTime);
            //计算性别
            if (parseInt(cardCode.substr(16, 1)) % 2 == 1) {
                var manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
                console.log("manObj is", manObj);
                //var dictMan = this.get("store").peekRecord("dicttype", manObj.get("id"));
                //console.log("dictMan is",dictMan);
                this.get("customerModel").set("sexChange", manObj);
                this.get("customerModel").set("sex", manObj);
                this.get("customerInfo").set("sex", manObj);
            } else {
                var womanObj = this.get("dataLoader").findDict(Constants.sexTypeFemale);
                //var dictWoman= this.get("store").peekRecord("dicttype", womanObj.get("id"));
                this.get("customerModel").set("sexChange", womanObj);
                this.get("customerModel").set("sex", womanObj);
                this.get("customerInfo").set("sex", womanObj);
            }
            //计算年龄
            var momentDate = this.get('dateService').getCurrentTime();
            console.log('当前时间戳', momentDate);
            var momentString = this.get("dateService").formatDate(momentDate, "yyyy");
            console.log('当前时间字符', momentString);
            var computedStr = cardCode.substring(6, 10);
            var computedAge = parseInt(momentString) - parseInt(computedStr);
            console.log('实际年龄是', computedAge);
            this.get('customerModel').set('age', computedAge);
        },
        // computedFirstCardCode: function() {
        //     var guardianFirstCardCode = this.get("customerModel.guardianFirstCardCode");
        //     console.log("guardianFirstCardCode is", guardianFirstCardCode);
        //     //计算性别
        //     if (parseInt(guardianFirstCardCode.substr(16, 1)) % 2 == 1) {
        //         var manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
        //         console.log("manObj is", manObj);
        //         this.get("customerModel").set("guardianSexChange", manObj);
        //         this.get("customerModel").set("guardianFirstGener", manObj);
        //     } else {
        //         var womanObj = this.get("dataLoader").findDict(Constants.sexTypeFemale);
        //         //var dictWoman= this.get("store").peekRecord("dicttype", womanObj.get("id"));
        //         console.log("womanObj is", womanObj);
        //         this.get("customerModel").set("guardianSexChange", womanObj);
        //         this.get("customerModel").set("guardianFirstGener", womanObj);
        //     }
        // },
        uploadSucc: function(response) {
            var model = this.get('model');
            var res = JSON.parse(response);
            this.get("customerInfo").set("headImg", res.relativePath);
            //this.get("customerInfo").save();//因为点击上传头像会生成customer所以注掉
        },
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
            var birthday=customerModel.get('birthday');
            if(birthday){
              var momentDate=this.get('dateService').getCurrentTime();
              var momentString=this.get("dateService").formatDate(momentDate, "yyyy");
              var computedStr=this.get("dateService").formatDate(birthday, "yyyy");
              var computedAge=parseInt(momentString)-parseInt(computedStr);
              customerModel.set('age',computedAge);
            }
            var mainpageController = App.lookup('controller:business.mainpage');
            //查询已入住状态
            var customerStatus = _self.get("dataLoader").findDict("customerStatusIn");
            customerModel.validate().then(function() {
                if (customerModel.get('errors.length') === 0) {
                    App.lookup('controller:business.mainpage').openPopTip("正在保存");
                    if (_self.get('directSave')) {
                        customerModel.set('addRemark', 'directCreate');
                        customerModel.set('customerStatus', customerStatus);
                    }
                    // let item = _self.get('store').createRecord("room",{name:'test1'});
                    // let p1 = _self.get('store').createRecord("device",{name:'test'});
                    // item.set('scanner',p1);
                    // item.save();
                    if(_self.get("statusService.isJujia")){
                      if (!_self.get('addMode')) {
                        let customerExtendId = _self.get("customerInfo.customerExtend.id");
                        console.log("customerExtendId in addMode:",customerExtendId);
                        let customerExtend = _self.get('store').findRecord('customer-extend',customerExtendId).then(function(customerExtend) {
                          customerModel.set('customerExtend', customerExtend);
                          // console.log("customerModel characteristic9:",customerModel.get(customerExtend.characteristic9));
                        });
                      }else{
                        let customerExtend = _self.get('store').createRecord('customer-extend', {});
                        // if(_self.get("characteristic0")){
                        //   console.log("characteristic0:",_self.get("characteristic0"));
                        //   customerExtend.set('characteristic0',_self.get("characteristic0"));
                        // }
                        // if(_self.get("characteristic1")){
                        //   customerExtend.set('characteristic1',_self.get("characteristic1"));
                        // }
                        // if(_self.get("characteristic2")){
                        //   customerExtend.set('characteristic2',_self.get("characteristic2"));
                        // }
                        // if(_self.get("characteristic3")){
                        //   customerExtend.set('characteristic3',_self.get("characteristic3"));
                        // }
                        // if(_self.get("characteristic4")){
                        //   customerExtend.set('characteristic4',_self.get("characteristic4"));
                        // }
                        // if(_self.get("characteristic5")){
                        //   customerExtend.set('characteristic5',_self.get("characteristic5"));
                        // }
                        // if(_self.get("characteristic6")){
                        //   customerExtend.set('characteristic6',_self.get("characteristic6"));
                        // }
                        // if(_self.get("characteristic7")){
                        //   customerExtend.set('characteristic7',_self.get("characteristic7"));
                        // }
                        // if(_self.get("characteristic8")){
                        //   customerExtend.set('characteristic8',_self.get("characteristic8"));
                        // }
                        // if(_self.get("characteristic9")){
                        //   customerExtend.set('characteristic9',_self.get("characteristic9"));
                        // }
                        customerModel.set('customerExtend', customerExtend);
                      }
                    }
                    // customerModel.save().then(function() {},function(err) {});
                    customerModel.save().then(function() {
                        console.log("save yes!");
                        App.lookup('controller:business.mainpage').showPopTip("保存成功");
                        if (_self.get('addMode')) {
                          if(_self.get('jujia')){
                            mainpageController.switchMainPage('member-info', {id:customerModel.get('id')});
                          }else {
                            mainpageController.switchMainPage('customer-info', {id:customerModel.get('id')});
                          }
                        }
                        _self.set('detailModify', false);
                        //为居家项目查找staffcustomer表并更新到全局
                        if(_self.get("statusService.isJujia")){
                          _self.get('store').query("staffcustomer",{}).then(function(staffcustomerList){
                            let Arr = new Ember.A();
                            staffcustomerList.forEach(function(staffcustomer){
                              Arr.pushObject(staffcustomer);
                            });
                            _self.get('dataLoader').set("staffcustomerList",Arr);
                          });
                        }
                    }, function(err) {
                        console.log("save err!");
                        console.log("err:",err);
                        let error = err.errors[0];
                        if (error.code === "3") {
                            customerModel.validate().then(function() {
                                customerModel.addError('cardCode', ['该身份证号已被录入']);
                                customerModel.set("validFlag", Math.random());
                                App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
                            });
                        }
                    });
                } else {
                    customerModel.set("validFlag", Math.random());
                    //alert("校验失败");
                }
            });
        },
        //暂存
        shortSaveInfo: function() {
            var _self = this;
            var customerModel = this.get("customerModel");
            customerModel.validate().then(function() {
                customerModel.save().then(function() {
                    _self.set('detailModify', false);
                    _self.sendAction('stagingAction');
                });
            });
        },
        //下一步
        next: function() {
            var _self = this;
            var customerModel = this.get("customerModel");
            customerModel.validate().then(function() {
                if (customerModel.get('errors.length') === 0) {
                    _self.sendAction('goNext', customerModel);
                } else {
                    customerModel.set("validFlag", Math.random());
                }
            });
        },
        //入住信息界面的取消
        remove: function() {
            var _self = this;
            var customerModel = this.get("customerModel");
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('try-and-stay', {});
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            if (!this.get('addMode')) {
                this.get("customerInfo").rollbackAttributes();
                this.set("customerModel", new Changeset(this.get("customerInfo"), lookupValidator(CustomerValidations), CustomerValidations));
            }
            if (this.get("addMode")) {
              if(this.get('jujia')){
                mainpageController.switchMainPage('member-management', {});
              }else {
                  mainpageController.switchMainPage('customer-service', {});
              }
            }
        },
        //删除按钮
        delById: function() {
            //this.set('showpopInvitePassModal', true);
            var customerInfo = this.get('customerInfo');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此基本信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                customerInfo.set("delStatus", 1);
                customerInfo.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('customer-service');
                });
            });
        },
        sexSelect: function(str) {
            let sexType;
            if(str=='man'){//男
              sexType = this.get("dataLoader").findDict('sexTypeMale');
            }
            if(str=='woman'){//女
              sexType = this.get("dataLoader").findDict('sexTypeFemale');
            }
            this.set('customerModel.sex',sexType);
            this.get("customerInfo").set("sex", sexType);
        }, //性别字典
        abilitySelect: function(abilityDict) {
            this.get("customerInfo").set("selfCareAbility", abilityDict);
        }, //自理能力字典
        bloodSelect: function(bloodDict) {
            //alert("bloodDict");
            this.get("customerInfo").set("bloodType", bloodDict);
        }, //血型字典
        religionSelect: function(religionDict) {
            this.get("customerInfo").set("religion", religionDict);
        }, //信仰字典
        educationSelect: function(educationDict) {
            this.get("customerInfo").set("educationLevel", educationDict);
        }, //文化程度字典
        maritalSelect: function(maritalDict) {
            this.get("customerInfo").set("maritalStatus", maritalDict);
        }, //婚姻字典
        // GenerSelect: function(GenerDict) {
        //     this.get("customerInfo").set("guardianFirstGener", GenerDict);
        // }, //第一监护人性别字典
        // relationSelect: function(relationDict) {
        //     this.get("customerInfo").set("firstRelation", relationDict);
        // }, //与老人关系字典
        // diningSelect: function(diningDict) {
        //     this.get("customerInfo").set("diningStandard", diningDict);
        // }, //餐饮标准字典
        // nursingSelect: function(nursingDict) {
        //     this.get("customerInfo").set("nursingGrade", nursingDict);
        // }, //护理等级字典
        // selectParent(bed) {
        //     //this.set("customerInfo").set("bed",bed);
        //     this.get('customerModel').set("bed", bed);
        //     this.set("parent", bed);
        // }, //床位信息
        nationalitySelect: function(nationalityDict) {
            this.get("customerInfo").set("nationality", nationalityDict);
        }, //民族字典
        nativeSelect: function(nativeDict) {
            this.get("customerInfo").set("customerNative", nativeDict);
        }, //籍贯字典
        // changeCheckInDateAction(date) {
        //     console.log("changeDateAction in,date", date);
        //     var stamp = this.get("dateService").getLastSecondStampOfDay(date);
        //     console.log("stamp is:" + stamp);
        //     this.set("customerModel.checkInDate", stamp);
        // },
        // changeCheckOutDateAction(date) {
        //     var stamp = this.get("dateService").getLastSecondStampOfDay(date);
        //     this.set("customerModel.checkOutDate", stamp);
        // },
        changeBirthdayAction(date) {
            console.log('customerinfo is date', date);
            //var stamp = this.get("dateService").getLastSecondStampOfDay(date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("customerModel.birthday", stamp);
            //根据出生日期计算年龄
            var year = date.getFullYear();
            //计算年龄
            var momentDate = this.get('dateService').getCurrentTime();
            console.log('当前时间戳', momentDate);
            var momentString = this.get("dateService").formatDate(momentDate, "yyyy");
            console.log('当前时间字符', momentString);
            var computedAge = parseInt(momentString) - parseInt(year);
            console.log('实际年龄是', computedAge);
            this.get('customerModel').set('age', computedAge);
        },
        //生日习惯
        birthdayHabitSelect: function(str) {
          let birtydayType;
          if(str=='lunar'){//阴历
            birtydayType = this.get("dataLoader").findDict('birtydayTypeN');
          }
          if(str=='solar'){//阳历
            birtydayType = this.get("dataLoader").findDict('birtydayTypeY');
          }
          this.set('customerModel.customerBirthdayHabit',birtydayType);
          this.get("customerInfo").set("customerBirthdayHabit", birtydayType);
        },
        //老人类型
        oldManTypeSelect: function(oldManTypeDict) {
            this.get("customerInfo").set("oldManType", oldManTypeDict);
            this.get("customerModel").set("oldManType", oldManTypeDict);
        },
        //医保类别
        medicalInsuranceSelect: function(medicalInsuranceDict) {
            this.get("customerInfo").set("medicalInsuranceCategory", medicalInsuranceDict);
        },
        selectTown:function(town){
          console.log('customer-info:town',town.get('name')+":"+town);
          this.get('customerInfo').set('town',town);
        }
    }
});
