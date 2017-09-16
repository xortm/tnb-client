import Ember from 'ember';
import Changeset from 'ember-changeset';
import tenantValidations from '../../../validations/tenant';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(tenantValidations, {
    saveFlag: 0,
    pathConfiger: Ember.inject.service("path-configer"),
    feedBus: Ember.inject.service("feed-bus"),
    constants: Constants, //引入字典常量
    count: true,
    systemType:1,
    status:null,
    tenantModel: Ember.computed("tenantInfo", function() {
        var model = this.get("tenantInfo");
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(tenantValidations), tenantValidations);
    }),
    mainController: Ember.inject.controller('business.mainpage'),
    editModel: null,
    uploadUrl: Ember.computed('property', function() {
        return this.get("pathConfiger").get("uploadUrl");
    }),
    deformation: function() {
        if ($(".cccc >div img").width() >= $(".cccc >div img").height()) {
            $(".cccc >div ").addClass("intergration_normal");
            $(".cccc >div img").css("height", "110px  ");
            $(".cccc >div img").css("width", "auto");
        } else {
            $(".cccc >div ").addClass("intergration_normal");
            $(".cccc >div img").css("width", "110px ");
            $(".cccc >div img").css("height", "auto");
        }
    },
    actions: {
        uploadSucc: function(response) {
            var model = this.get('model');
            var res = JSON.parse(response);
            this.get("tenantInfo").set("licenseImg", res.relativePath);
            this.get("tenantInfo").save();
        },
        invalid() {
            alert("invalid");
        },
        //编辑按钮
        detailEditClick: function() {
            this.set('detailEdit', true);
            this.set('tenantInfo.detailEdit', true);
            this.send('systemTypeChange',1);
        },
        //取消按钮
        detailCancel: function() {
            var id = this.get('id');
            var editMode = this.get('editMode');
            if (id && editMode != 'add') {
                this.set('detailEdit', false);
                this.get('tenantInfo').rollbackAttributes();
                var route = App.lookup('route:business.mainpage.tenant-detail');
                route.refresh(); //刷新页面
            } else {
                this.get('tenantInfo').rollbackAttributes();
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('tenant-management');
            }
        },
        //保存
        saveTenant() {
            var _self = this;
            Ember.run.later(function() {
                var editMode = _self.get('editMode');
                var tenantModel = _self.get('tenantModel');
                tenantModel.validate().then(function() {
                    if (tenantModel.get('errors.length') === 0) {
                      if (_self.get("status")&&_self.get("status").get("typename")=="已发布"&& _self.get('currentTenant')&&_self.get('currentTenant').get("status").get("typename")!="已发布") {
                           App.lookup('controller:business.mainpage').showAlert("发布后不能修改状态");
                         return;
                      }
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        if (_self.get('editMode') === 'add') {//  新增  租户信息
                            tenantModel.save().then(function(tenant) {
                                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                _self.set('detailEdit', false);
                                App.lookup('controller:business.mainpage').switchMainPage("tenant-management");
                            }, function(err) {
                                let error = err.errors[0];
                                if (error.code === "5") {
                                    tenantModel.validate().then(function() {
                                        tenantModel.addError('linkManTel', ['该联系人电话已被占用']);
                                        tenantModel.set("validFlag", Math.random());
                                        App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
                                    });
                                }
                            });
                        }
                        if (_self.get('editMode') === 'edit') {//  编辑 租户信息
                            tenantModel.save().then(function(tenant) {
                                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                _self.set('detailEdit', false);
                                App.lookup('controller:business.mainpage').switchMainPage("tenant-management");
                            }, function(err) {
                                let error = err.errors[0];
                                if (error.code === "5") {
                                    tenantModel.validate().then(function() {
                                        tenantModel.addError('linkManTel', ['该联系人电话已被占用']);
                                        tenantModel.set("validFlag", Math.random());
                                        App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
                                    });
                                }
                            });
                        }
                        if (_self.get('editMode') === 'editRole') {// 编辑租户权限以及发布
                          var a= _self.get('currentTenant').get("status");
                          var b=_self.get('tenantModel').get("status");
                          var c=_self.get('tenantInfo').get("status");
                            _self.set('detailEdit', false);
                            _self.incrementProperty("saveFlag", 1);
                        }
                    } else {
                        tenantModel.set("validFlag", Math.random());
                    }
                });
            }, 1);

        },
        //删除按钮
        delById: function() {
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录", function() {
                _self.cancelPassSubmit();
            });
        },

        //选择护理类型
        careTypeSelect(careType) {
            this.set('tenantInfo.careType', careType);
        },
        //选择周期
        periodSelect(period) {
            this.set('tenantInfo.period', period);
        },
        //选择类别
        countTypeSelect(countType) {
            this.set('tenantInfo.countType', countType);
            if (countType.get('typename') == '按时') {
                this.set('count', true);
            }
            if (countType.get('typename') == '按次') {
                this.set('count', false);
            }
        },
        //弹窗取消
        invitation() {
            this.set('showpopInvitePassModal', false);
        },
        //弹窗确定，删除记录
        cancelPassSubmit(tenant) {
            App.lookup('controller:business.mainpage').openPopTip("正在删除");
            this.set("showpopInvitePassModal", false);
            tenant.set("delStatus", 1);
            tenant.save().then(function() {
                App.lookup('controller:business.mainpage').showPopTip("删除成功");
                var mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('tenant-management');
            });
        },
        systemTypeChange(value){
          this.set("systemType",parseInt(value));
          this.get("feedBus").set('systemType',parseInt(value));
          console.log(this.get("feedBus").get("systemType"));
        },
        allocatePublicPrivilege:function(){
          var tenantModel=this.get("tenantModel");
          tenantModel.set("allPublic",1);
          this.send("saveFunction",tenantModel);
        },
        allocateSysPrivilege:function(systemType){
          var tenantModel=this.get("tenantModel");
           if (systemType==1) {
                tenantModel.set('allJiGou',1);
           }
           if (systemType==2) {
              tenantModel.set("allJuJia",1);
           }
           this.send("saveFunction",tenantModel);
        },
        saveFunction:function(tenantModel){
            var _self=this;
          App.lookup('controller:business.mainpage').openPopTip("正在分配权限");
          tenantModel.save().then(function(tenant) {
              App.lookup('controller:business.mainpage').showPopTip("分配完成");
              _self.set('detailEdit', false);
              var propertyArray=["allPublic","allJiGou","allJuJia"];
              for(var i=0;i<propertyArray.length;i++){
                tenant.set(propertyArray[i],0);
                tenantModel.set(propertyArray[i],0);
                _self.get("currentTenant").set(propertyArray[i],0);
              }
              App.lookup('controller:business.mainpage').switchMainPage("tenant-management");
          }, function(err) {
              let error = err.errors[0];
              if (error.code === "5") {
                App.lookup('controller:business.mainpage').showPopTip("分配失败", false);
              }
          });
        }
    }
});
