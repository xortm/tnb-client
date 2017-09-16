import Ember from 'ember';
import Changeset from 'ember-changeset';
import ServiceitemValidations from '../../../validations/jujia-serviceitem';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(ServiceitemValidations,{
  constants:Constants,//引入字典常量
  count:false,
  serviceitemModel: Ember.computed("serviceitemInfo", function() {
      var model = this.get("serviceitemInfo");
      if (!model) {
          return null;
      }
      return new Changeset(model, lookupValidator(ServiceitemValidations), ServiceitemValidations);
  }),
  mainController: Ember.inject.controller('business.mainpage'),
  editModel: null,
  actions:{
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
      var id=this.get('id');
      var editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('serviceitemInfo').rollbackAttributes();
        var route=App.lookup('route:business.mainpage.nursing-service-detail');
        route.refresh();//刷新页面
      }else{
        this.get('serviceitemInfo').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('nursing-service-management');
      }
    },
    //保存护理项目
    saveServiceitem(){
     //alert('11');
      var _self=this;
      var editMode=this.get('editMode');
      var serviceitemModel=this.get('serviceitemModel');
      console.log('serviceitemModel is',serviceitemModel);
      serviceitemModel.validate().then(function(){
        console.log('saveServiceitem:errors',serviceitemModel.get('errors.length'));
        if(serviceitemModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");

          serviceitemModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if(editMode=='add'){
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('nursing-service-management');
            }else{
                _self.set('detailEdit',false);
            }
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
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此项目记录",function(){
        _self.send('cancelPassSubmit',_self.get('serviceitemModel'));
      });
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
      console.log(countType.get('typecode'));
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
    cancelPassSubmit(serviceitemModel){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
	  this.set("showpopInvitePassModal",false);
      serviceitemModel.set("delStatus", 1);
      serviceitemModel.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('nursing-service-management');
      },function(err){
        let error = err.errors[0];
        if(error.code==="8"){
            App.lookup("controller:business.mainpage").showAlert("该服务项目与会员套餐有关联,不可删除");
            App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
        }
      });
	},
  }
});
