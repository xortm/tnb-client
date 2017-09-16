import Ember from 'ember';
/*
 * 角色管理
 * create by lmx
 */
export default Ember.Controller.extend({
  refreshPageNumbers:true,
  showPopModal:false,
  mainController: Ember.inject.controller('business.mainpage'),
  refreshRoleList: function(){
    var route = App.lookup('route:business.mainpage.role-management');
    // route.doQuery();
    route.refresh();
  },
  appendPrivInfoToRole: function(role){
    var _self=this;
    var showName='';
    console.log("role privileges",role.get("privileges"));
    var curPrivileges=role.get("privileges");
    var privilegesWhole = this.get("global_dataLoader.privileges");

    if(!curPrivileges){
      return new Ember.A();
    }
    var arr=new Ember.A();
    var index = 0;
    var len = curPrivileges.get("length");
    curPrivileges.then(function(privs){
      privs.forEach(function(priv){
        index++;
        var privData = privilegesWhole.findBy("id",priv.get("id"));
        if(privData){
          if(privData.get('level')==1){
              arr.pushObject(privData);
          }
        }


        if(index>=len){
          role.set("privilegeList",arr);
        }
      });
    });
    return showName;
  },

  actions:{
    toDetailPage(role){
      if(role){
        let id=role.get('id');
        this.get("mainController").switchMainPage('role-detail',{id:id,editMode:"edit"});
      }else{
        this.get("mainController").switchMainPage('role-detail',{editMode:"add",id:''});
      }
    },
    toSetting(role){
      let id=role.get('id');
      this.get("mainController").switchMainPage('role-setting',{id:id});
    },
    //保存备注
    remarkSave:function(remark,type,role){
      console.log("remarkSave in,remark:" + remark);
      role.set("remark",remark);
      role.save();
    },
    showPrivilegeList(role){
      console.log("role in show",role);
      if(this.get("currentRole")){
        this.get("currentRole").set("hasSelected",false);
      }
      role.set("hasSelected",true);
      this.set("currentRole",role);
    },
    removeRole(role){
      var _self = this;
      var roleEnt = this.store.peekRecord("role",role.get("id"));
      role.set("delStatus",1);
      //通过增加计数来触发分页条刷新
      App.lookup('controller:business.mainpage').openPopTip("正在删除角色");
      role.save().then(function(){
        _self.refreshRoleList();
        App.lookup('controller:business.mainpage').showPopTip("角色删除成功");
      });
    },
    addRole(){
      this.set("showPopModal",true);
    },
    addSave(){
      var _self = this;
      var role=this.store.createRecord('role',{});
      role.set('name',this.get('roleAddName'));
      role.set('remark',this.get('roleAddRemark'));
      App.lookup('controller:business.mainpage').openPopTip("正在添加角色");
      role.save().then(function(){
        _self.set("showPopModal",false);
        _self.refreshRoleList();
        App.lookup('controller:business.mainpage').showPopTip("角色添加成功");
      });
    },
    cancelAdd(){
      this.set("showPopModal",false);
    }
  }
});
