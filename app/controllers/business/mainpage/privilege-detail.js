import Ember from 'ember';

export default Ember.Controller.extend({
    mainController: Ember.inject.controller('business.mainpage'),
    parent: null,
    editModel:null,
    actions: {
        editPrivilege: function() {
            var _self = this;
            var level;
            var remark;
            var order;
            var idParOld = null;
            var idPar = null;
            console.log("_self.get('id') "+_self.get('id'));
            this.store.findRecord('privilege', _self.get('id')).then(function(privilege) {
                privilege.set('showName', _self.get("privilege.showName"));
                privilege.set('mobileMenuName', _self.get("privilege.mobileMenuName"));
                privilege.set('code', _self.get("privilege.code"));
                privilege.set('mobileIcon', _self.get("privilege.mobileIcon"));
                privilege.set('type', _self.get("privilege.type"));
                if (privilege.get('parent')) {
                    idParOld = privilege.get('parent').get('id');
                }
                if (_self.get('parent')) {
                    idPar = _self.get('parent').get('id');
                }
                console.log(idParOld + " idpar  " + idPar);
                if(idParOld===undefined){
                  console.log("idParOld  undefined");
                }
                if(idPar===null){
                  console.log("idPar");
                }
                if ((idParOld!==undefined && idPar!==null) || (idParOld === idPar)) { //判断是否更改parent
                    console.log("parent  ======");
                    privilege.set('parent', _self.get("parent"));
                    privilege.set('remark', _self.get("remark"));
                    privilege.set('delStatus', 0);
                    console.log("editPrivilege  " + privilege.get('showName') + privilege.get('code') + privilege.get('parent').get('id'));
                    privilege.save().then(function() {
                        _self.get("mainController").switchMainPage('privilege-management', {
                            flag: 'edit'
                        });
                    });
                } else {
                    console.log("parent  ！！！====");
                    if (!_self.get('parent')) {
                        level = 1;
                    } else {
                        level = _self.get('parent').get('level') + 1;
                    }
                    _self.store.query("privilege", {
                        sort: {
                            order: 'desc'
                        },
                        filter: {
                            parent: {
                                id: idPar
                            }
                        }
                    }).then(function(privileges) {
                      var parRemark = _self.get('parent').get('remark');
                      if (parRemark === undefined) {
                          parRemark = '0';
                      }
                        if (privileges) {
                            if (privileges.objectAt(0)) {
                                order = privileges.objectAt(0).get('order') + 1;
                            } else {
                                order = 1;
                            }
                            /*if (idPar) {
                                remark = _self.get('parent').get('remark') + '00' + order;
                            } else
                                remark = 'tnb0' + order;*/
                            var tempRemark;
                            if (idPar) {
                                tempRemark = parRemark;
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
                            if (idPar)
                                remark = parRemark + '00' + order;
                            else
                                remark = 'tnb0' + order;
                        }
                        privilege.set('parent', _self.get("parent"));
                        privilege.set('level', level);
                        privilege.set('order', order);
                        // privilege.set('remark', remark);
                        console.log("editttt  " + order + "  " + remark);
                        privilege.set('delStatus', 0);
                        console.log("editPrivilege  " + privilege.get('showName') + privilege.get('code') + privilege.get('remark') + privilege.get('parent').get('id'));
                        privilege.save().then(function() {
                            _self.get("mainController").switchMainPage('privilege-management', {
                                flag: 'edit'
                            });
                        });
                    });
                }
            });
        },
        /*删除*/
        delPrivilege: function() {
            var _self = this;
            this.store.findRecord('privilege', _self.get('id')).then(function(privilege) {
                privilege.set("delStatus", 1);
                privilege.save().then(function() {
                    _self.get("mainController").switchMainPage('privilege-management', {});
                });
            });
        },
        editModelModify: function() {
            this.set('editModel', 1);
        },
        cancelEdit: function() {
            console.log("cancelEdit");
            this.get("privilege").rollbackAttributes();
            this.get("mainController").switchMainPage('privilege-management', {
                flag: 'edit'
            });
        },
        selectParent(privilege) {
            this.set('parent', privilege);
            console.log("父节点 " + privilege.get('id'));
        },
        getParent(id) {
            var _self = this;
            this.store.findRecord("privilege", id).then(function(privilege) {
                _self.set("parent", privilege);
            });
        }
    }
});
