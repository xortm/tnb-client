import Ember from 'ember';

export default Ember.Controller.extend({
    mainController: Ember.inject.controller('business.mainpage'),
    parent: null,
    actions: {
        addPrivilege: function() {
            var level;
            var order;
            var remark;
            var _self = this;
            var id_par = null;
            if (this.get('parent')) {
                // console.log("父节点 " + this.get('parent').get('id') + "  " + this.get('parent').get('level') + "  " + this.get('parent').get('order') + "  " + this.get('parent').get('remark'));
                level = this.get('parent').get('level') + 1;
                id_par = this.get('parent').get('id');
            } else {
                level = 1;
            }
            this.store.query("privilege", {
                sort: {
                    order: 'desc'
                },
                filter: {
                    parent: {
                        id: id_par
                    }
                }
            }).then(function(privileges) {
                var tempRemark;
                var parRemark = '0';
                if (privileges) {
                    if (privileges.objectAt(0)) {
                        order = privileges.objectAt(0).get('order') + 1;
                    } else {
                        order = 1;
                    }
                    if (id_par) {
                        tempRemark =parRemark;
                    } else {
                        tempRemark = '';
                    }

                    if (order > 0 && order < 10) {
                        remark = tempRemark + '00' + order;
                    }
                    if (order >= 10 && order < 100) {
                        remark = tempRemark + '0' + order;
                    }
                    if (order >= 100) {
                        remark = tempRemark + order;
                    }
                    console.log("remark1 " + remark);
                } else {
                    order = 1;
                    if (id_par)
                        remark = parRemark + '00' + order;
                    else
                        remark = 'tnb0' + order;
                }
                var privilege = _self.store.createRecord('privilege', {});
                privilege.set('showName', _self.get("showName"));
                privilege.set('mobileMenuName', _self.get("mobileMenuName"));
                privilege.set('code', _self.get("code"));
                privilege.set('mobileIcon', _self.get("mobileIcon"));
                privilege.set('parent', _self.get('parent'));
                privilege.set('type', _self.get("type"));
                privilege.set('level', level);
                privilege.set('order', _self.get("order"));
                privilege.set('systemType',_self.get('systemType'));
                // privilege.set('remark', remark);
                console.log("adddddd  " + order + "  " + remark);
                privilege.set('delStatus', 0);
                console.log("addPrivilege  " + privilege.get('showName') + privilege.get('code') + privilege.get('remark') + privilege.get('parent').get('id'));
                privilege.save().then(function() {
                    _self.get("mainController").switchMainPage('privilege-management', {
                        flag: 'add'
                    });
                });
            });
        },
        cancelAdd: function() {
            console.log("cancelAdd");
            this.get("mainController").switchMainPage('privilege-management', {
                flag: 'add'
            });
        },
        selectParent(privilege) {
            this.set('parent', privilege);
            console.log("父节点 " + this.get('parent').get('id'));
        }
    }
});
