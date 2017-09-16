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
    privileges: null, //当前角色对应的权限列表
    currentTenant: null, //当前选中角色
    resetCnt: 0, //重制页面权限列表的计数标志
    computedFlag: 0,
    privilegeListTemp: null,
    //包含选中信息的权限树形列表
    privilegesCombine: Ember.computed("privilegeList", function() {
        var privilegeList = this.get("privilegeList");
        if (!privilegeList) {
            return null;
        }
        privilegeList = privilegeList.sortBy("level", "order");
        console.log("privilegeList sort:", privilegeList);
        //转换为树形结构
        var privilegsTree = this.privilegesToTree(privilegeList);
        return privilegsTree;
    }),
    //包含选中信息的权限列表
    privilegeList: Ember.computed("global_dataLoader.allprivileges", "currentTenant", "resetCnt","systemType", function() {
        //  if (this.get("computedFlag") === 0) {
        var _self = this;
        console.log("pri now", this.get("currentTenant.privileges"));
        var privilegesWhole = this.get("global_dataLoader.allprivileges");
        privilegesWhole = privilegesWhole.filterBy("systemType",this.get("systemType"));
        var curPrivileges = this.get("currentTenant.privileges"); //  遍历提取 privilege   huibati
        if (!curPrivileges) {
            return null;
        }
        //然后同步添加
        var arr = new Ember.A();
        var findPrivFromRole = function(id) {
            var priv = null;
            let len = curPrivileges.get("length");
            for (let i = 0; i < len; i++) {
                let tenantPrivilegeTemp = curPrivileges.objectAt(i);
                if (tenantPrivilegeTemp.get('privilege').get("id") === id) {
                    priv = tenantPrivilegeTemp.get('privilege');
                    break;
                }
            }
            return priv;
        };
        privilegesWhole.forEach(function(privilege) {
            var p = findPrivFromRole(privilege.get("id"));
            //如果包含在当前权限列表中，则标志选中
            var hasSelected = false;
            if (p && p.get("id")) {
                hasSelected = true;
            }
            // if (privilege.get("hasSelected")) { // huibati
            //     hasSelected = true;
            // }
            var vo = _self.toPrivilegeObj(privilege, hasSelected);
            arr.pushObject(vo);
        });
        console.log("arr pri len:" + arr.get("length"));
        return arr;
        //  }
    }),
    //权限列表变树形结构
    privilegesToTree: function(privileges) {
        var map = Ember.Object.create({});
        var node, roots = new Ember.A();
        for (var i = 0; i < privileges.get("length"); i += 1) {
            node = privileges.objectAt(i);
            // //非pc端权限不在权限树里显示
            // if (node.type>3) {
            //   continue;
            // }
            node.set("children", new Ember.A());
            map.set(node.get("id"), i); // use map to look-up the parents
            var parentId = node.get("parent.id");
            if (parentId && parentId !== "0" && map.get(parentId) !== undefined) {
                console.log("parentId:" + parentId + 　"|map.get(parentId):" + map.get(parentId));
                privileges.get(map.get(parentId)).get("children").pushObject(node);
            } else {
                roots.pushObject(node);
            }
        }
        console.log("tree is:", roots);
        return roots;
    },
    //权限data对象转object对象
    toPrivilegeObj: function(privilege, hasSelected, detailEdit) {
        var voItem = Ember.Object.create({
            id: privilege.get("id"),
            showName: privilege.get("showName"),
            icon: privilege.get("icon"),
            code: privilege.get("code"),
            type: privilege.get("type"),
            level: privilege.get("level"),
            order: privilege.get("order"),
            parent: privilege.get("parent"),
            remark: privilege.get("remark"),
            hasSelected: hasSelected,
            detailEdit: detailEdit,
            childPrivleges: privilege.get("childPrivleges")
        });
        return voItem;
    },
    saveFlagChange: Ember.observer('saveFlag', function() {
        var _self = this;
        console.log("last list ", this.get("privilegeList"));
        this.set("computedFlag", 1);
        this.get("currentTenant").set("privileges", new Ember.A());
        var privilegesTemp = new Ember.A();
        console.log("last2 list ", this.get("privilegeList"));
        var deleteTenantPrivilege = this.get("store").createRecord("deletetenantprivilege", {
            tenantId: _self.get("currentTenant").get('id')
        });
        var flag = 0;
        let privilegeArr = new Ember.A();
        for (let i = 0; i < _self.get("privilegeList.length"); i++) {
            var privilege = _self.get("privilegeList").objectAt(i);
            if (privilege.get("hasSelected")) {
                //得到已选择的，查出对应的privilege数据实体，并放入角色
                console.log("hasSelected " + privilege.get("hasSelected") + " " + privilege.get("showName"));
                let privilegeEnt = _self.get("store").peekRecord("privilege", privilege.get("id"));
                let tenantPrivilege = _self.get("store").createRecord("tenantprivilege", {
                    privilege: privilegeEnt,
                    tenantId: _self.get("currentTenant").get('id'),
                    delStatus: 0
                });
                privilegeArr.pushObject(tenantPrivilege);
            }
        }

        _self.get("currentTenant").set("privileges", privilegeArr);
        App.lookup('controller:business.mainpage').openPopTip("正在保存");
        _self.get("currentTenant").save().then(function(tp) {
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            var route = App.lookup('route:business.mainpage.tenant-detail');
            App.lookup('controller:business.mainpage').refreshPage(route);
        }, function(err) {
            let error = err.errors[0];
            if (error.code === "5") {
                _self.get("currentTenant").validate().then(function() {
                    _self.get("currentTenant").addError('linkManTel', ['该联系人电话已被占用']);
                    _self.get("currentTenant").set("validFlag", Math.random());
                    App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
                });
            }
        });
    }),
    actions: {
        privilegeCheck(privilege) {
            console.log("pri list", this.get("privilegeList"));
            //如果选中，则父节点也要选中
            var spArr = privilege.get("remark").match(/.{1,3}/g);
            console.log("spArr is", spArr + "  " + privilege.get("hasSelected"));
            var remarkFetchStr = "";
            for (let i = 0; i < spArr.length - 1; i++) {
                remarkFetchStr = remarkFetchStr + spArr[i];
                let node = this.get("privilegeList").findBy("remark", remarkFetchStr);
                node.set("hasSelected", true);
            }
            this.set("privilegeListTemp", this.get("privilegeList"));
            console.log("last3 list ", this.get("privilegeList"));
        },
        savePrivileges() {
            var _self = this;
            //先清空之前的权限
            this.get("currentTenant").set("privileges", new Ember.A());
            for (let i = 0; i < this.get("privilegeList.length"); i++) {
                var privilege = this.get("privilegeList").objectAt(i);
                if (privilege.get("hasSelected")) {
                    //得到已选择的，查出对应的privilege数据实体，并放入角色
                    var privilegeEnt = this.get("store").peekRecord("privilege", privilege.get("id"));
                    var tenantPrivilege = this.get("store").createRecord("tenantprivilege", {});
                    tenantPrivilege.set('privilege', privilegeEnt);
                    this.get("currentTenant").get("privileges").pushObject(tenantPrivilege);
                }
            }
            App.lookup('controller:business.mainpage').openPopTip("正在保存权限2");
            this.get("currentTenant").save().then(function() {
                App.lookup('controller:business.mainpage').showPopTip("权限保存成功2");
                console.log(_self.get('editMode'));
                console.log('*-*-*-*-*-**-');
            });
        },
        cancelSave() {
            //通过重置计数标志的方式重置刷新权限树
            this.incrementProperty("resetCnt");
        }
    }
});
