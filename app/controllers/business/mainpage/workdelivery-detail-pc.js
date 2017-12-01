import Ember from 'ember';
import Changeset from 'ember-changeset';
import NursingValidations from '../../../validations/nursing';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(NursingValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    // dataModel: Ember.computed("detailEdit","nursing.id", function() {
    //     var model = this.get("nursing");
    //     console.log("model nursing", model);
    //     if (!model) {
    //         return null;
    //     }
    //     return new Changeset(model, lookupValidator(NursingValidations), NursingValidations);
    // }),
    nursingObs: function() {
        var model = this.get("data");
        console.log("model nursing", model);
        if (!model) {
            return null;
        }
        //var dataModel = new Changeset(model, lookupValidator(NursingValidations), NursingValidations);
        this.set("dataModel", model);
    }.observes("data"),
    refreshemployeeList: function() {
        var route = App.lookup('route:business.mainpage.nursinglog-management');
        //route.refresh();
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    // init() {
    //     this._super(...arguments);
    //     let model = this.get("store").createRecord('hbeaconnursing', {});
    //     // this.set("customerInComp",model);
    //     this.nursing = model;
    // },
    abd: function() {},
    defaultCustomer: Ember.computed('nursing.nurscustomer', 'customerListFirst', function() {
        //if (this.get('nursing.caller') && this.get('nursing.caller').content) {
        return this.get('nursing.nurscustomer');
        //}
        //return this.get('customerListFirst');
    }),
    defaultEmployee: Ember.computed('nursing.recordUser', 'employeeListFirst', function() {
        //if (this.get('nursing.operater') && this.get('nursing.operater').content) {
        return this.get('nursing.recordUser');
        //}
        //return this.get('employeeListFirst');
    }),
    defaultEmployee1: Ember.computed('nursing.createUser', 'employeeListFirst', function() {
        //if (this.get('nursing.operater') && this.get('nursing.operater').content) {
        return this.get('nursing.createUser');
        //}
        //return this.get('employeeListFirst');
    }),
    //护理时间验证
    nursingTimeValidate() {
        var nursingDate = this.get('nursing.nursingDate');
        if (!nursingDate || nursingDate.length === 0) {
            this.set("nursing.page_errors.title", "时间不能为空");
            this.get("nursing").incrementProperty("page_errorsCnt");
            return false;
        } else {
            this.set("nursing.page_errors.title", null);
        }
        return true;
    },
    actions: {
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function(nursing) {
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
                this.get("nursing").rollbackAttributes();
                this.set("dataModel", new Changeset(this.get("nursing"), lookupValidator(NursingValidations), NursingValidations));
            } else {
                mainpageController.switchMainPage('nursinglog-management', {});
            }
        },
        //存储
        saveNursing() {
            //alert("保存");
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));

            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var logtime = this.get("dateService").getCurrentTime();
                var dataModel = this.get("dataModel");
                var curUser = this.get("global_curStatus").getUser();
                console.log("jiushi ta ",curUser);
                console.log('名字是',curUser.get('name'));
                dataModel.set("createUser",curUser);
                dataModel.set("recordTime",logtime);
                //对传递进来的数据进行判断，判断护理日期是否为空
                var nursingLogDate = this.get("dataModel.nursingDate");//后台逻辑 前台注释了
                console.log("就是这个时间：11111111111 ",nursingLogDate);
                if(!nursingLogDate){
                  dataModel.set("nursingDate",logtime);
                  console.log("就是这个时间： in it ",logtime);
                }
                console.log("就是这个时间：",logtime);
                var  content = this.get('dataModel.remarkContent');
                var  remark = this.get('dataModel.remark');
                let remarkObj = null;
                if(!remark){
                  remarkObj = {};
                  remarkObj.content = content;
                }else{
                  if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
                    remarkObj = JSON.parse(remark);
                  }else {
                    remarkObj = {};
                  }
                  remarkObj.content = content ;
                }
                this.set("dataModel.remark",JSON.stringify(remarkObj));


                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                dataModel.validate().then(function() {
                    //alert("save   out");
                    if (dataModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        dataModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('nursinglog-management');
                                _self.set('detailEdit', false);
                            }
                        },function(data){//网络错误容错
                          App.lookup("controller:business.mainpage").closePopTip();
                          App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
                        });
                    } else {
                        dataModel.set("validFlag", Math.random());
                    }
                });
            }
        },


        //是否处理
    //    flagSelect(flagDict) {
    //        this.get("nursing").set("flag", flagDict);
    //    },
        //用户姓名
        selectNursing(nurscustomer) {
            this.get('dataModel').set("nurscustomer", nurscustomer);
            this.set('nursing.nurscustomer', nurscustomer);
            //this.set("defaultCustomer", caller);
        },
        //日志状态
        statusSelect(dict) {
          this.set("dataModel.logStatus", dict);
          var logStatusId = dict.get("id");
          let remark = this.get("dataModel.remark");
          let remarkObj = null;
          if(!remark){
            remarkObj = {};
          }else{
            if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
              remarkObj = JSON.parse(remark);
            }else {
              remarkObj = {};
              remarkObj.content = remark ;
            }
          }
          remarkObj.logTag = logStatusId;
          this.set("dataModel.remark",JSON.stringify(remarkObj));
        },

        //处理人
        selectEmployee(employee) {
          this.set("dataModel.recordUser", employee);
          this.set('nursing.recordUser', employee);
        },
        selectEmployee02(employee2) {
          this.set("dataModel.createUser", employee2);
          this.set('nursing.createUser', employee2);
        },
        changeNursinglogDateAction(date) {
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("dataModel.nursingDate", stamp);
            this.set("nursing.nursingDate", stamp);
        },
        changeRecordTimeDateAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("dataModel.recordTime", stamp);
        },
        //删除按钮
        delById: function(nursing) {
            //this.set('showpopInvitePassModal', true);
            this.set("delFlag", false);
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此床位记录", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                nursing.set("delStatus", 1);
                nursing.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    //console.log("delFlag删除", _self.get("delFlag"));
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('nursinglog-management');
                },function(data){//网络错误容错
                  App.lookup("controller:business.mainpage").closePopTip();
                  App.lookup("controller:business.mainpage").showAlert("出现未知错误删除失败，请重试");
                });
            });
        },
        dpShowAction(e) {},

    }
});
