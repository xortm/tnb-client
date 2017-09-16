import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

/*
 * 角色权限页面
 * create by lmx
 */
export default BaseItem.extend({
  store: Ember.inject.service('store'),
  global_dataLoader: Ember.inject.service('data-loader'),
  global_pageConstrut: Ember.inject.service('page-constructure'),
  privileges:null,//当前角色对应的权限列表
  currentRole: null,//当前选中角色
  resetCnt: 0,//重制页面权限列表的计数标志

  //包含选中信息的权限树形列表
  privilegesCombine: Ember.computed("privilegeList",function(){
    var privilegeList = this.get("privilegeList");
    if(!privilegeList){
      return null;
    }
    privilegeList = privilegeList.sortBy("level","order");
    //转换为树形结构
    var privilegsTree = this.privilegesToTree(privilegeList);
    return privilegsTree;
  }),
  //包含选中信息的权限列表
  privilegeList: Ember.computed("global_dataLoader.privileges","role","resetCnt",function(){
    var _self = this;
    var privilegesWhole = this.get("global_dataLoader.privileges");
    var curPrivileges = this.get("role.privileges");
    if(!curPrivileges){
      return null;
    }
    //然后同步添加
    var arr = new Ember.A();
    var findPrivFromRole = function(id){
      var priv = null;
      let len = curPrivileges.get("length");
      for(let i=0;i<len;i++){
        let privilege = curPrivileges.objectAt(i);
        if(privilege.get("id")===id){
          priv = privilege;
          break;
        }
      }
      return priv;
    };
    privilegesWhole.forEach(function (privilege) {
      var p = findPrivFromRole(privilege.get("privilege.id"));
      //如果包含在当前权限列表中，则标志选中
      var hasSelected = false;
      if(p&&p.get("id")){
        hasSelected = true;
      }
      var vo = _self.toPrivilegeObj(privilege.get('privilege'),hasSelected);
      arr.pushObject(vo);
    });
    return arr;
  }),
  //权限列表变树形结构
  privilegesToTree: function (privileges) {
    var map = Ember.Object.create({});
    var node,roots = new Ember.A();
    for (var i = 0; i < privileges.get("length"); i += 1) {
      node = privileges.objectAt(i);
      node.set("children",new Ember.A());
      map.set(node.get("id"),i); // use map to look-up the parents
      var parentId = node.get("parent.id");
      let flag = false;
      if(parentId){
        if(node.get("id")==="701"){
          console.log("nodeid 701 and parent id:" + parentId);
        }
        let index = map.get(parentId);
        if(index>=0){
          flag = true;
        }
      }
      if (parentId && (parentId !== "0" )&& flag) {
        privileges.get(map.get(parentId)).get("children").pushObject(node);
      } else {
        roots.pushObject(node);

      }
    }
    return roots;
  },
  //权限data对象转object对象
  toPrivilegeObj: function(privilege,hasSelected,detailEdit){
    var voItem = Ember.Object.create({
      id: privilege.get("id"),
      showName: privilege.get("showName"),
      icon: privilege.get("icon"),
      code: privilege.get("code"),
      type:privilege.get("type"),
      level:privilege.get("level"),
      order:privilege.get("order"),
      parent:privilege.get("parent"),
      remark:privilege.get("remark"),
      hasSelected:hasSelected,
      detailEdit:detailEdit,
      childPrivleges:privilege.get("childPrivleges")
    });
    console.log('权限名称toPri：',voItem.get('showName'),voItem.get('id'));
    return voItem;
  },

  saveFlagChange:function(){
    this.send('savePrivileges',this.get('role'));
  }.observes('saveFlag'),
  actions:{
    privilegeCheck(privilege){
      //如果选中，则父节点也要选中
      var spArr = privilege.get("remark").match(/.{1,3}/g);
      console.log(privilege.get("parent.id"),privilege.get("parent.showName"),privilege.get("parent.level"),privilege.get("parent.parent.level"));
      var remarkFetchStr = "";
      for(let i=0;i<spArr.length-1;i++){
        remarkFetchStr = remarkFetchStr + spArr[i];
        let node = this.get("privilegeList").findBy("remark",remarkFetchStr);
        node.set("hasSelected",true);
      }

    },
    savePrivileges(role){
      // App.lookup('controller:business.mainpage').openPopTip("正在保存权限");
      var _self=this;
      let editMode = this.get('editMode');
      //先清空之前的权限
      role.set("privileges",new Ember.A());
      for(let i=0;i<this.get("privilegeList.length");i++){
        var privilege = this.get("privilegeList").objectAt(i);
        if(privilege.get("hasSelected")){
          //得到已选择的，查出对应的privilege数据实体，并放入角色
          var privilegeEnt = this.get("store").peekRecord("privilege",privilege.get("id"));
          role.get("privileges").pushObject(privilegeEnt);
        }
      }

      role.save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip("权限保存成功");
        if(editMode=='add'){
          let mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('role-management');
        }
      });
    },
    cancelSave(){
      //通过重置计数标志的方式重置刷新权限树
      this.incrementProperty("resetCnt");
    }
  }
});
