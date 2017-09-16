import Ember from 'ember';
import Changeset from 'ember-changeset';
import dicttypeValidations from '../../../validations/dicttype';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(dicttypeValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    pathConfiger: Ember.inject.service("path-configer"),
    uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
    today: Ember.computed(function() {
        let today = this.get('dateService').getCurrentTime();
        //today=parseInt(today)-86400;
        today = this.get("dateService").timestampToTime(today);
        console.log('today is:',today);
        return today;
    }),
    dicttypeObs: function() {
        var model = this.get("dicttype");
        console.log("model dicttype", model);
        if (!model) {
            return null;
        }
        var dicttypeModel = new Changeset(model, lookupValidator(dicttypeValidations), dicttypeValidations);
        this.set("dicttypeModel", dicttypeModel);
    }.observes("dicttype"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.activity-type');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    defaultStaff: Ember.computed('warning.operater', 'staffListFirst', function() {
        return this.get('warning.operater');
    }),
    checkdicttype: function(title){

    },
    actions: {
        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function(dicttype) {
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
                this.get("dicttype").rollbackAttributes();
                this.set("dicttypeModel", new Changeset(this.get("dicttype"), lookupValidator(dicttypeValidations), dicttypeValidations));
            } else {
                mainpageController.switchMainPage('activity-type', {});
            }
        },
        //存储
        savedicttype() {
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var typename = this.get("typename");
                console.log("typename:",typename);
                var typecode = CommonUtil.Common_randomNum(8);
                console.log("typecode:",typecode);
                var dicttypeModel = this.get("dicttypeModel");
                dicttypeModel.set("typecode",typecode);
                dicttypeModel.set("typegroup",_self.get("typegroup"));
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                dicttypeModel.validate().then(function() {
                  console.log('dicttype:errors',dicttypeModel.get('errors.length')+':'+dicttypeModel.get('errors').get('firstObject'));
                  console.log('dicttype:contents',dicttypeModel.get('contents'));
                    if (dicttypeModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        dicttypeModel.save().then(function(dicttype) {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('activity-type');
                                _self.set('detailEdit', false);
                            }
                            //为居家项目预置字典数据并更新到全局
                            // _self.get('global_dataLoader').syncDictData();
                            var Arr = _self.get('global_dataLoader').get("dicttypes");
                            dicttype.set("typegroupCode",dicttype.get("typegroup.typegroupcode"));
                            Arr.pushObject(dicttype);
                            _self.get('global_dataLoader').set("dicttypes",Arr);
                        },function(err){
                          let error = err.errors[0];
                          if(error.code==="4" || error.code==="12"){
                              App.lookup("controller:business.mainpage").showAlert("该活动类型已存在");
                              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                          }
                        });
                    } else {
                        dicttypeModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //处理人
        // selectStaff(staff) {
        //     this.set("staff", staff);
        //     this.get("warning").set("operater", staff);
        // },
        // changeCallTimeAction(date) {
        //     console.log("date is who", date);
        //     var stamp = this.get("dateService").timeToTimestamp(date);
        //     this.set("warningModel.callTime", stamp);
        // },
        // //活动类型
        // typeSelect(typeDict) {
        //     this.get("dicttype").set("type", typeDict);
        // },
        // // 图片上传成功
        // uploadSucc: function(response) {
        //   var res = JSON.parse(response);
        //   var pic = res.relativePath;
        //   console.log("pic:",pic);
        //   this.set("dicttypeModel.pic",pic);
        // },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var dicttype=this.get('dicttype');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此活动信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                dicttype.set("delStatus", 1);
                dicttype.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('activity-type');
                },function(err){
                  let error = err.errors[0];
                  if(error.code==="8"){
                      App.lookup("controller:business.mainpage").showAlert("该活动类型下已存在活动项目,不可删除");
                      App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
                  }
                });
            });
        },
    }
});
