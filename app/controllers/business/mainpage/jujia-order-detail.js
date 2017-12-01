import Ember from 'ember';
import Changeset from 'ember-changeset';
import NursingplandetailValidations from '../../../validations/nursingplandetail';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(NursingplandetailValidations,{
  dataLoader: Ember.inject.service("data-loader"),
  constants: Constants,
  showEmployeeModelFlag:false,
  dateService: Ember.inject.service("date-service"),
  detailEdit:false,
  nursingplandetailModel:Ember.computed('nursingplandetail',function(){
    var model = this.get("nursingplandetail");
    if (!model) {
      return null;
    }
    return new Changeset(model, lookupValidator(NursingplandetailValidations), NursingplandetailValidations);
  }),
  actions:{
    //保存
    chooseEmployee(){
      let _self = this;
      let nursingplandetailModel = this.get('nursingplandetailModel');
      let serviceStatusObj = this.get("dataLoader").findDict(_self.get('constants').jujiaServiceStatus2);
      nursingplandetailModel.set("serviceStatus",serviceStatusObj);
      nursingplandetailModel.validate().then(function(){
        if(nursingplandetailModel.get('errors.length')===0){
          _self.set('detailEdit',false);
          console.log("detailEdit after",_self.get("detailEdit"));
          _self.set('showEmployeeModelFlag',false);
          App.lookup('controller:business.mainpage').openPopTip("正在派单");
          nursingplandetailModel.save().then(function(){
            _self.get("nursingplandetail").set("serviceOperater", _self.get("defaultEmployee"));
            _self.get("nursingplandetail").set("serviceStatus",serviceStatusObj);
            App.lookup('controller:business.mainpage').showPopTip("派单完成");
          },function(err){
            let error = err.errors[0];
            if(error.code==="4"){
              nursingplandetailModel.validate().then(function(){
                nursingplandetailModel.addError('serviceOperater',['该员工不存在']);
                nursingplandetailModel.set("validFlag",Math.random());
                App.lookup('controller:business.mainpage').showPopTip("派单失败",false);
              });
            }else {
              App.lookup("controller:business.mainpage").closePopTip();
              App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
            }
          });
        }else{
          nursingplandetailModel.set("validFlag",Math.random());
        }
      });

    },
    selectEmployee(employee) {
      this.set("defaultEmployee", employee);
      this.get("nursingplandetailModel").set("serviceOperater", employee);
    },
    invalid(){},
    //弹窗取消
    invitation(){
      this.set('showEmployeeModelFlag',false);
    },
    // 编辑按钮
    showEmployeeModel:function(){
      this.set("defaultEmployee", null);
      this.set('showEmployeeModelFlag',true);
    },
    // //编辑按钮
    // detailCancel:function(){
    //   let id=this.get('id');
    //   let editMode=this.get('editMode');
    //   if(id&&editMode=='edit'){
    //     this.set('detailEdit',false);
    //     this.get('department').rollbackAttributes();
    //     let route=App.lookup('route:business.mainpage.department-add-detail');
    //     App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
    //   }else{
    //     this.get('department').rollbackAttributes();
    //     let mainpageController = App.lookup('controller:business.mainpage');
    //     mainpageController.switchMainPage('department-management');
    //   }
    // },//取消按钮
    // //删除按钮
    // delById(){
    //   let _self = this;
    //   App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录",function(){
    //     _self.send('cancelPassSubmit',_self.get('department'));
    //   });
    // },

  }


});
