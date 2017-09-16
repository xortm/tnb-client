import Ember from 'ember';
import Changeset from 'ember-changeset';
import SchemeValidations from '../../../validations/scheme';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(SchemeValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    dataLoader: Ember.inject.service("data-loader"),
    pathConfiger: Ember.inject.service("path-configer"),
    uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
    dietObs: function() {
        var model = this.get("diet");
        console.log("model diet", model);
        if (!model) {
            return null;
        }
        var dietModel = new Changeset(model, lookupValidator(SchemeValidations), SchemeValidations);
        this.set("dietModel", dietModel);
    }.observes("diet"),
    actions: {
        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function() {
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
                this.get("diet").rollbackAttributes();
                this.set("dietModel", new Changeset(this.get("diet"), lookupValidator(SchemeValidations), SchemeValidations));
            } else {
                mainpageController.switchMainPage('scheme-setting', {flag:1});
            }
        },
        //存储
        saveDiet() {
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var dietModel = this.get("dietModel");
                var dietObj = this.get("dataLoader").findDict(Constants.schemeType1);
                console.log("dietObj:",dietObj);
                dietModel.set("type",dietObj);
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                dietModel.validate().then(function() {
                  console.log('diet:errors',dietModel.get('errors.length')+':'+dietModel.get('errors').get('firstObject'));
                  console.log('title:',dietModel.get('title'));
                  console.log('picPath:',dietModel.get('picPath'));
                  console.log('contents:',dietModel.get('contents'));
                  console.log("type:", dietModel.get("type"));
                    if (dietModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        dietModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('scheme-setting', {flag:1});
                                _self.set('detailEdit', false);
                            }
                        },function(err){
                          let error = err.errors[0];
                          if(error.code==="1"){
                              App.lookup("controller:business.mainpage").showAlert("该饮食方案已存在");
                              App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
                          }
                        });
                    } else {
                        dietModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        // 图片上传成功
        uploadSucc: function(response) {
          var res = JSON.parse(response);
          var picPath = res.relativePath;
          console.log("picPath:",picPath);
          this.set("dietModel.picPath",picPath);
        },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var diet=this.get('diet');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此饮食方案", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                diet.set("delStatus", 1);
                diet.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('scheme-setting', {flag:1});
                },function(err){
                  let error = err.errors[0];
                  if(error.code==="0"){
                      App.lookup("controller:business.mainpage").showAlert("该饮食方案老人已使用,不可删除");
                      App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
                  }
                });
            });
        },
    }
});
