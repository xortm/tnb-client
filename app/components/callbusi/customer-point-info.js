import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer-point-info';
import PreferenceValidations from '../../validations/customer-preference';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(CustomerValidations,PreferenceValidations, {
    constants: Constants,
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    global_curStatus: Ember.inject.service("current-status"),
    dataLoader: Ember.inject.service("data-loader"),
    customerModel: Ember.computed("customerInComp", function() {
        var model = this.get("customerInComp");
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(CustomerValidations), CustomerValidations);
    }),
    preferenceModel: Ember.computed("curPreference", function() {
        var model = this.get("curPreference");
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(PreferenceValidations), PreferenceValidations);
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.customer-service');
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
    points:Ember.computed("dataLoader.dicttypes",'preferenceList',function(){
      let dicttypes;
      let list;
      let preferenceList = this.get('preferenceList');
      dicttypes = this.get("dataLoader.dicttypes");
      if(dicttypes){
        list = dicttypes.filterBy('typegroup.typegroupcode', 'customerPreference');
      }else {
        return list;
      }
      list.forEach(function(dict){
        // dict.set("typenamePinyin",pinyinUtil.getFirstLetter(dict.get("typename")));
        //还是先使用汉字查询
        dict.set("typenamePinyin",dict.get("typename"));
      });
      if(preferenceList){
        list.forEach(function(point){
          let items = new Ember.A();
          preferenceList.forEach(function(preference){
            if(preference.get('type.typecode')==point.get('typecode')){
              items.pushObject(preference);
            }
          });
          point.set('items',items);
        });
      }
      return list;
    }),
    actions: {
        editPreference(preference){
          if(preference){
            this.set('curPreference',preference);
            this.set('editModel',true);
          }else{
            let customerInComp = this.get('customerInComp');
            let customer = this.get('store').peekRecord('customer',customerInComp.get('id'));
            let item = this.get('store').createRecord('customer-preference',{});
            item.set('customer',customer);
            this.set('curPreference',item);
            this.set('editModel',true);
            this.set('detailEdit',true);
          }
        },
        detailEditClick(){
          this.set('detailEdit',true);
        },
        addItem(point){
          let list = new Ember.A();
          if(point.get('items')){
            point.get('items').forEach(function(preference){
              if(!preference.get('hasSave')){
                //如果前面有没填好的，无法再新增
              }else{
                preference.set('edit',false);
                preference.set('choosed',false);
                list.pushObject(preference);
              }
            });
          }
          let item = this.get('store').createRecord('customer-preference',{});
          item.set('edit',true);
          list.pushObject(item);
          point.set('items',list);

        },
        delItem(item,point){
          let customerInComp = this.get('customerInComp');
          let customer = this.get('store').peekRecord('customer',customerInComp.get('id'));
          item.set('delStatus',1);
          let _self = this;
          item.save().then(function(){
            _self.get('store').query('customer-preference',{filter:{customer:{id:customer.get('id')}}}).then(function(preferenceList){
              _self.set('preferenceList',preferenceList);
            });
          });
        },
        //鼠标移入，选择完成情况标签
        itemChoose(item){
          item.set('choosed',true);
        },
        //鼠标移出完成情况标签
        itemNoChoose(item){
          item.set('choosed',false);
        },
        //选择编辑完成情况标签
        itemSelected(item,point){
          point.get('items').forEach(function(preference){
            preference.set('edit',false);
            item.set('choosed',false);
            if(!preference.get('remark')){
              point.get('items').removeObject(preference);
            }
          });
          item.set('edit',true);
        },
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
            var customerModel = this.get("customerModel");
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
                    customerModel.save().then(function() {
                        App.lookup('controller:business.mainpage').showPopTip("保存成功");
                        if (_self.get('addMode')) {
                            //alert("添加");
                            if(_self.get("global_curStatus.isJujia")){
                              mainpageController.switchMainPage('member-management', {});
                            }else {
                              mainpageController.switchMainPage('customer-service', {});
                            }
                        }
                        _self.set('detailModify', false);
                    });
                } else {
                    customerModel.set("validFlag", Math.random());
                    //alert("校验失败");
                }
            });
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            //alert("详情");
            if (!this.get('addMode')) {
                this.get("customerInComp").rollbackAttributes();
                this.set("customerModel", new Changeset(this.get("customerInComp"), lookupValidator(CustomerValidations), CustomerValidations));
            }
            if (this.get("addMode")) {
                mainpageController.switchMainPage('customer-service', {});
            }
        },
        //删除按钮
        delById: function() {
            var _self = this;
            var customerInComp=this.get('customerInComp');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此入住信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                customerInComp.set("delStatus", 1);
                customerInComp.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('customer-service');
                });
            });
        },
        changeTimeAction(date){
          let stamp = this.get("dateService").timeToTimestamp(date);
          this.set("preferenceModel.startTime", stamp);
        },
        savePre(){
          let _self = this;
          let preferenceModel = this.get('preferenceModel');
          preferenceModel.validate().then(function(){
            if(preferenceModel.get('errors.length')===0){
              App.lookup('controller:business.mainpage').openPopTip("正在保存");
              preferenceModel.save().then(function(){
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                _self.set('editModel',false);
                _self.set('detailEdit',false);
                _self.set('curPreference',null);
                var route = App.lookup('route:business.mainpage.customer-info');
                App.lookup('controller:business.mainpage').refreshPage(route);
              });
            }else{
              preferenceModel.set('validFlag',Math.random());
            }
          });
        },
        cancelPre(){
          this.set('editModel',false);
          this.set('curPreference',null);
          this.set('detailEdit',false);
        },
        delPrence(preference){
          var _self = this;
          App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录",function(){
            _self.send('cancelPassSubmit',preference);
          });
        },
        cancelPassSubmit(preference){
          App.lookup('controller:business.mainpage').openPopTip("正在删除");
          preference.set('delStatus',1);
          preference.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("删除成功");
            var route = App.lookup('route:business.mainpage.customer-info');
            App.lookup('controller:business.mainpage').refreshPage(route);
          });
        },
    }
});
