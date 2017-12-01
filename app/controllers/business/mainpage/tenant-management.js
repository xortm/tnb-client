import Ember from 'ember';

export default Ember.Controller.extend({
    constants: Constants,
    queryCondition: '',
    mainController: Ember.inject.controller('business.mainpage'),
    actions: {
        toDetailPage(tenant) {
            if (tenant) {
                let id = tenant.get('id');
                this.get("mainController").switchMainPage('tenant-detail', {
                    id: id,
                    // editMode: "editRole"
                    editMode: "edit",
                    customizeModel:false,
                });
            } else {
                this.get("mainController").switchMainPage('tenant-detail', {
                    editMode: "add",
                    id: '',
                    customizeModel:false,
                });
            }
        },
        saveTenantPrivilege() {
          let tenant = this.get('curTenant');
          let _self = this;
          App.lookup('controller:business.mainpage').openPopTip("正在分配");
          tenant.set("desc", 'alljigou');
          tenant.save().then(function() {
              _self.set('curTenant',null);
              _self.set('showpopInvitePassModal',false);
              App.lookup('controller:business.mainpage').showPopTip("分配成功");
          });
        },
        toEquipTypePage:function(tenant){
          this.get("mainController").switchMainPage('tenant-devicemanagement', {
            id:tenant.id
          });
        },
        invitation(){
          this.set('showpopInvitePassModal',false);
        },
        recall(){
          this.set('showpopInvitePassModal',false);
        },
        //分配机构权限
        toAssignPermissions(tenant){
          this.set('showpopInvitePassModal',true);
          this.set('curTenant',tenant);
        },
        //自定义分配权限
        toCustomize(){
          let tenant = this.get('curTenant');
          this.set('showpopInvitePassModal',false);
          this.get("mainController").switchMainPage('tenant-detail', {
              editMode: "editRole",
              id: tenant.get('id'),
              customizeModel:true,
          });
          this.set('curTenant',null);
        },
    }
});
