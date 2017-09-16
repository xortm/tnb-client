import Ember from 'ember';
import Changeset from 'ember-changeset';
import ServiceitemValidations from '../../../validations/serviceitem';
import ServicemerchValidations from '../../../validations/servicemerch';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(ServiceitemValidations,ServicemerchValidations,{
  constants:Constants,//引入字典常量
  count:false,
  serviceitemModel: Ember.computed("serviceitemInfo", function() {
      var model = this.get("serviceitemInfo");
      if (!model) {
          return null;
      }
      return new Changeset(model, lookupValidator(ServiceitemValidations), ServiceitemValidations);
  }),
  defaultMerch:null,
  mainController: Ember.inject.controller('business.mainpage'),
  editModel: null,
  actions:{
    //选择物品
    selectMerch(merch){
      this.set('defaultMerch',merch);
      this.set('servicemerchModel.merch',merch);
    },
    //新增物品标签
    addMerch(merchs){
      let list = new Ember.A();
      this.set('defaultMerch',null);
      let merchList = this.get('merchList');
      if(merchs){
        merchs.forEach(function(merch){
          if(!merch.get('merchNum')){
            //如果前面有没填好的，无法再新增
          }else{
            let item = merchList.findBy('id',merch.get('merch.id'));
            merchList.removeObject(item);
            merch.set('edit',false);
            list.pushObject(merch);
          }

        });
      }
      //将已有的物品从物品列表中移除
      this.set('merchList',merchList);
      let item = this.store.createRecord('servicemerch',{});
      item.set('focus',true);
      item.set('edit',true);
      item.set('item',this.get('serviceitemInfo'));
      list.pushObject(item);
      //新增后重置物品列表

      this.set('serviceitemInfo.merchList',list);
      //新增物品，设置验证model
      let merchModel = new Changeset(item, lookupValidator(ServicemerchValidations), ServicemerchValidations);
      this.set('servicemerchModel',merchModel);
    },
    saveMerch(merch){
      let _self = this;
      let merchModel = this.get('servicemerchModel');
      if((!merchModel.get('merch.name'))&&(!merchModel.get('merchNum.length'))){
        this.get('serviceitemInfo.merchList').removeObject(merch);
      }else{
        merchModel.validate().then(function(){
          if(merchModel.get('errors.length')===0){
            console.log('验证通过');
            merchModel.save().then(function(){
              merch.set('edit',false);
            });
          }else{
            merchModel.set("validFlag",Math.random());
            console.log('验证不过');
          }
        });
      }
    },
    //鼠标移入，选择物品标签
    merchChoose(merch){
      merch.set('choosed',true);
    },
    //鼠标移出物品标签
    merchNoChoose(merch){
      merch.set('choosed',false);
    },
    //选择编辑物品标签
    merchSelected(merch){
      this.get('serviceitemInfo.merchs').forEach(function(item){
        item.set('edit',false);
        merch.set('choosed',false);
      });
      merch.set('edit',true);
      //编辑物品，重置物品验证model

      let merchModel = new Changeset(merch, lookupValidator(ServicemerchValidations), ServicemerchValidations);
      this.set('servicemerchModel',merchModel);
      // this.set('servicemerchModel.merch',merch);
      this.set('defaultMerch',merch.get('merch'));
    },
    delMerch(merch){
      merch.set('delStatus',1);
      let _self = this;
      merch.save().then(function(){
        let list = new Ember.A();
        let merchList = _self.get('serviceitemInfo.merchList');
        if(merchList){
          merchList.forEach(function(item){
            if(item.get('id')!==merch.get('id')){
              list.pushObject(item);
            }
          });
        }
        _self.set('serviceitemInfo.merchList',list);
      },function(err){
        let error = err.errors[0];
        if(error.code==="8"){
          App.lookup('controller:business.mainpage').showAlert("物品已占用无法删除");
        }
      });
    },
    //新增完成情况标签
    addResult(resultList){
      let list = new Ember.A();
      if(resultList){
        resultList.forEach(function(result){
          if(!result.get('name')){
            //如果前面有没填好的，无法再新增
          }else{
            result.set('edit',false);
            result.set('choosed',false);
            list.pushObject(result);
          }

        });
      }
      let item = this.store.createRecord('servicefinishlevel',{});
      item.set('focus',true);
      item.set('edit',true);
      list.pushObject(item);
      this.set('resultList',list);
    },
    //保存完成情况标签
    saveResult(result){
      let _self = this;
      let resultList = this.get('resultList');
      let list = resultList.filter(function(item){
        return item.get('name') == result.get('name');
      });
      if(result.get('name')){
        if(list.get('length')>1){
          App.lookup('controller:business.mainpage').showAlert("您输入的内容已存在！");
        }else{
          result.set('edit',false);
          result.set('choosed',false);
          result.set('item',_self.get('serviceitemInfo'));
          result.save().then(function(){
              console.log('保存标签');
          });
        }
      }else{
        result.set('edit',false);
        this.get('resultList').removeObject(result);
      }
    },
    //鼠标移入，选择完成情况标签
    resultChoose(result){
      result.set('choosed',true);
    },
    //鼠标移出完成情况标签
    resultNoChoose(result){
      result.set('choosed',false);
    },
    //选择编辑完成情况标签
    resultSelected(result){
      this.get('resultList').forEach(function(item){
        item.set('edit',false);
        result.set('choosed',false);
      });
      result.set('edit',true);
    },
    //删除完成情况标签
    delResult(result){
      result.set('delStatus',1);
      let _self = this;
      result.save().then(function(){
        let list = new Ember.A();
        let resultList = _self.get('resultList');
        if(resultList){
          resultList.forEach(function(item){
            if(item.get('id')!==result.get('id')){
              list.pushObject(item);
            }
          });
        }
        _self.set('resultList',list);
      },function(err){
        let error = err.errors[0];
        if(error.code==="8"){
          App.lookup('controller:business.mainpage').showAlert("标签已占用无法删除");
        }
      });
    },
    invalid() {
        //alert("error");
    },
    //编辑按钮
    detailEditClick:function(){
      var count = this.get("count");
      console.log("count1111111111",count);
      this.set('detailEdit',true);
    },
    //取消按钮
    detailCancel:function(){
      let _self = this;
      var id=this.get('id');
      var editMode=this.get('editMode');
        this.set('detailEdit',false);
        if(editMode=='add'){
          let mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('service-item');
        }
        let list = _self.get('serviceitemInfo.merchList');
        _self.get('serviceitemInfo.merchList').forEach(function(merch){
          if(!merch.get('id')){
            list.removeObject(merch);
          }
        });

    },
    //保存护理项目
    saveServiceitem(){
      var _self=this;
      var editMode=this.get('editMode');
      var serviceitemModel=this.get('serviceitemModel');
      serviceitemModel.validate().then(function(){
        if(serviceitemModel.get("valueAdd")){
          let re = /^(0|[1-9][0-9]*)$/;
          if(!serviceitemModel.get('price')){
            serviceitemModel.addError('price',['价格不能为空']);
          }
          if(!re.test(serviceitemModel.get('price'))){
            serviceitemModel.addError('price',['价格必须为非零开头的整数']);
          }
        }
        if(serviceitemModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          serviceitemModel.save().then(function(serviceitemInfo){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            let list = _self.get('serviceitemInfo.merchList');
            _self.get('serviceitemInfo.merchList').forEach(function(merch){
              if(!merch.get('id')){
                list.removeObject(merch);
              }
            });

            _self.set('detailEdit',false);
            _self.set('serviceitemInfo',serviceitemInfo);
            _self.set('serviceitemInfo.merchList',list);
        },function(err){
          let error = err.errors[0];
          if(error.code==="4"){
            serviceitemModel.validate().then(function(){
              serviceitemModel.addError('name',['该名称已被占用']);
              serviceitemModel.set("validFlag",Math.random());
              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
            });
          }
        });
      }else{
        serviceitemModel.set("validFlag",Math.random());
      }
    });
    },
    detailResult(serviceitemInfo){
      this.set('serviceitemInfo',serviceitemInfo);
      this.set('editMode','edit');
      this.set('id',serviceitemInfo.get('id'));
      this.send('detailEditClick');
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此项目记录",function(){
        _self.send('cancelPassSubmit',_self.get('serviceitemInfo'));
      });
    },
    serviceValueTypeSelect(serviceValueType){
      this.set('serviceitemInfo.serviceValueType',serviceValueType);
    },
    //选择护理类型
    careTypeSelect(careType){
      this.set('serviceitemInfo.careType',careType);
    },
    //选择周期
    periodSelect(period){
      this.set('serviceitemInfo.period',period);
    },
    serviceTypeSelect(serviceType){
      this.set('serviceitemInfo.serviceType',serviceType);
      this.set('serviceitemModel.serviceType',serviceType);
    },
    //选择类别
    countTypeSelect(countType){
      this.set('serviceitemInfo.countType',countType);
      this.set('serviceitemModel.countType',countType);
      if(countType.get('typecode')=='countTypeByTime'){
        this.set('count',true);
      }
      if(countType.get('typecode')=='countTypeByFrequency'){
        this.set('count',false);
      }
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(serviceitem){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      serviceitem.set("delStatus", 1);
      serviceitem.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('service-item');
      },function(err){
        App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
        let error = err.errors[0];
        if(error.code==='8'){
          App.lookup('controller:business.mainpage').showAlert("已安排护理等级(方案)的护理项目无法删除！");
        }
      });
		},
  }
});
