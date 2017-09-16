import Ember from 'ember';
import Changeset from 'ember-changeset';
import WarningValidations from '../../../validations/warning';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(WarningValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    dataLoader: Ember.inject.service("data-loader"),
    flagList:Ember.computed(function(){
      let flagList = this.get('dataLoader').findDictList('hbeaconWarning');
      console.log("flagList:",flagList);
      let per = flagList.findBy('typecode',Constants.hbeaconWarningCancelBySys);
      flagList.removeObject(per);
      return flagList;
    }),
    today: Ember.computed(function() {
        let today = this.get('dateService').getCurrentTime();
        today = this.get("dateService").timestampToTime(today);
        return today;
    }),
    warningObs: function() {
        var model = this.get("warning");
        if (!model) {
            return null;
        }
        var warningModel = new Changeset(model, lookupValidator(WarningValidations), WarningValidations);
        this.set("warningModel", warningModel);
    }.observes("warning"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.warning-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },

    abd: function() {},
    defaultCustomer: Ember.computed('warning.caller', 'customerListFirst', function() {
        return this.get('warning.caller');
    }),
    defaultStaff: Ember.computed('warning.operater', 'staffListFirst', function() {
        return this.get('warning.operater');
    }),
    //预警时间验证
    warningTimeValidate() {
        var callTime = this.get('warning.callTime');
        if (!callTime || callTime.length === 0) {
            this.set("warning.page_errors.title", "预警时间不能为空");
            this.get("warning").incrementProperty("page_errorsCnt");
            return false;
        } else {
            this.set("warning.page_errors.title", null);
        }
        return true;
    },
    actions: {
        selectFlag(flag){
          this.set('warningModel.flag',flag);
        },
        invalid() {
        },
        //编辑按钮
        detailEditClick: function(warning) {
            this.set('detailEdit', true);
        },
        //取消按钮
        detailCancel: function() {
            var id = this.get('id');
            var editMode = this.get('editMode');
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailEdit', false);
            //alert("详情");
            if (id && editMode == 'edit') {
                this.get("warning").rollbackAttributes();
                this.set("warningModel", new Changeset(this.get("warning"), lookupValidator(WarningValidations), WarningValidations));
            } else {
                mainpageController.switchMainPage('warning-management', {});
            }
        },
        //存储
        saveWarning() {
            if (this.get("delFlag")) {
                var _self = this;
                var warningModel = this.get("warningModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                warningModel.validate().then(function() {
                    if (warningModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        warningModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('warning-management');
                                _self.set('detailEdit', false);
                            }
                          }, function(err) {
                              console.log("save err!");
                              console.log("err:",err);
                              let error = err.errors[0];
                              if (error.code === "15") {
                                App.lookup('controller:business.mainpage').showPopTip("动态预警不可修改", false);
                              }
                          });
                    } else {
                        warningModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //是否处理
        flagSelect(flagDict) {
            this.get("warning").set("flag", flagDict);
        },
        //用户姓名
        selectParent(caller) {
            this.get('warningModel').set("caller", caller);
            this.set('warning.caller', caller);
            this.set('warning.bed',caller.get('bed'));
        },
        //选择床位号
        selectBedParent(customer) {
            this.set("customer", customer);
        },
        //处理人
        selectStaff(staff) {
            this.set("staff", staff);
            this.get("warning").set("operater", staff);
        },
        changeCallTimeAction(date) {
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("warningModel.callTime", stamp);
        },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var warning=this.get('warning');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此预警信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                warning.set("delStatus", 1);
                warning.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('warning-management');
                });
            });
        },
        dpShowAction(e) {},
    }
});
