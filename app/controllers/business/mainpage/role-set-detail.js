import Ember from 'ember';
import Changeset from 'ember-changeset';
import RoleValidations from '../../../validations/role';
import lookupValidator from 'ember-changeset-validations';
/*
 * 角色管理
 * create by lmx
 */
export default Ember.Controller.extend(RoleValidations,{
  constants:Constants,
  saveFlag:0,
  roleModel:Ember.computed("roleInfo",function(){
    var model = this.get("roleInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(RoleValidations), RoleValidations);
  }),
  refreshPageNumbers:true,
  showPopModal:false,
  mainController: Ember.inject.controller('business.mainpage'),
  refreshRoleList: function(){
    var route = App.lookup('route:business.mainpage.role-management');
    App.lookup('controller:business.mainpage').refreshPage(route);
  },
  actions:{
    invalid() {
        //alert("error");
    },
    //保存按钮
    saveRole(){
      var _self=this;
      var editMode=this.get('editMode');
      var roleModel=this.get('roleModel');
        roleModel.validate().then(function(){
          if(roleModel.get('errors.length')===0){

            roleModel.save().then(function(role){
              _self.set('currentRole',role);
              _self.incrementProperty("saveFlag");
              _self.set('detailEdit',false);

            },function(err){
              let error = err.errors[0];
              if(error.code==="4"){
                roleModel.validate().then(function(){
                  roleModel.addError('name',['该名称已被占用']);
                  roleModel.set("validFlag",Math.random());
                  App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                });
              }
            });
          }else{
            roleModel.set("validFlag",Math.random());
          }
      });
    },
    //编辑按钮
    detailEditClick(){
      this.set('detailEdit',true);
      this.set('roleInfo.detailEdit',true);
    },
    //取消按钮
    detailCancel(){
      var id=this.get('id');
      var editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('roleInfo').rollbackAttributes();
        var route=App.lookup('route:business.mainpage.role-detail');
        App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
      }else{
        this.set('roleInfo.floor','');
        this.get('roleInfo').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('role-management');
      }
    },
    //保存备注
    remarkSave:function(remark,type,role){
      role.set("remark",remark);
      role.save();
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此角色信息",function(){
          _self.send('cancelPassSubmit',_self.get('roleInfo'));
      });
    },
    cancelPassSubmit(role){
      var _self = this;
      var roleEnt = this.store.peekRecord("role",role.get("id"));
      role.set("delStatus",1);
      //通过增加计数来触发分页条刷新
      App.lookup('controller:business.mainpage').openPopTip("正在删除角色");
      role.save().then(function(){
        _self.refreshRoleList();
        App.lookup('controller:business.mainpage').showPopTip("角色删除成功");
        App.lookup('controller:business.mainpage').switchMainPage('role-management');
      });
    },
  }
});
