import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer-vip-info';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(CustomerValidations, {
    constants: Constants,
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    vipModel: Ember.computed("customerVipInfo", function() {
        var model = this.get("customerVipInfo");
        console.log("model customerVipInfo", model);
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(CustomerValidations), CustomerValidations);
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.member-management');
        //route.refresh();
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    detailModify: Ember.computed("addMode", function() {
        var addMode = this.get("addMode");
        if (addMode) {
            return true;
        } else {
            return false;
        }
    }),
    didInsertElement: function() {
        var _self = this;
        console.log('accountFlag11 is', this.get('accountFlag'));
    },
    changeObs: function() {
        var _self = this;
        //查询老热对应的会员信息
        this.get('store').query('customer-vip-info', {
          filter:{
            '[customer][id]': _self.get('customerInComp.id')
          }
        }).then(function(customerVipInfoList){
          console.log('changeObs:customerVipInfoList',customerVipInfoList+':'+customerVipInfoList.get('length'));
          if(customerVipInfoList.get('length')){
            _self.set('customerVipInfo',customerVipInfoList.get('firstObject'));
          }else {
            _self.set('customerVipInfo', _self.get('store').createRecord('customer-vip-info', {
              customer:_self.get('customerInComp')
            }));
          }
          console.log('changeObs:customerVipInfo',_self.get('customerVipInfo'));
        });
    }.observes("accountFlag").on('init'),
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
            var customerVipInfo=this.get('customerVipInfo');
            console.log('vip-info:customerVipInfo',customerVipInfo);
            var vipModel=this.get('vipModel');
            console.log('vip-info:vipModel',vipModel);
            this.get('customerInComp').set('customerVipInfo',customerVipInfo);
            vipModel.validate().then(function(){
              if (vipModel.get('errors.length') === 0){
                App.lookup('controller:business.mainpage').openPopTip("正在保存");
                vipModel.save().then(function(){
                    _self.get('customerInComp').save().then(function(){
                      App.lookup('controller:business.mainpage').showPopTip("保存成功");
                      if (_self.get('addMode')) {
                          _self.set('detailModify', false);
                      }
                      _self.set('detailModify', false);
                      _self.set('accountFlag', 0);
                    });
                });
              }else {
              vipModel.set("validFlag", Math.random());
              }
            });
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            if (!this.get('addMode')) {
                this.get("customerVipInfo").rollbackAttributes();
                this.set("vipModel", new Changeset(this.get("customerVipInfo"), lookupValidator(CustomerValidations), CustomerValidations));
            }
            if (this.get("addMode")) {
                mainpageController.switchMainPage('member-management', {
                    //flag: 'edit-add'
                });
            }
        },
        //删除按钮
        delById: function() {
            var _self = this;
            var customerInComp = this.get('customerInComp');
            var customerVipInfo=this.get('customerVipInfo');
            var mainpageController = App.lookup('controller:business.mainpage');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此会员信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                customerInComp.set('customerVipInfo',null);
                customerVipInfo.set("delStatus", 1);
                customerVipInfo.save().then(function() {
                    customerInComp.save().then(function(){
                      App.lookup('controller:business.mainpage').showPopTip("删除成功");
                      var mainpageController = App.lookup('controller:business.mainpage');
                      mainpageController.switchMainPage('member-management');
                    });
                });
            });
        },
        levelSelect: function(levelDict) {
            console.log("levelDict in", levelDict);
            this.get("vipModel").set("level", levelDict);
            console.log("levelDict is", this.get("vipModel.level"));
        }, //性别字典
    }
});
