import Ember from 'ember';
import Changeset from 'ember-changeset';
import OrgValidations from '../../../validations/organization';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(OrgValidations, {
    orgModel: Ember.computed("org", function() {
        var model = this.get("org");
        console.log("orgModel  " + model.get("orgName"));
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(OrgValidations), OrgValidations);
    }),
    mainController: Ember.inject.controller('business.mainpage'),
    parent: null,
    editModel: null,
    actions: {
        invalid() {
            alert("error");
        },
        saveClick: function() {
            //  alert("save");
            var _self = this;
            var orgModel = this.get("orgModel");
            orgModel.validate().then(function() {
                //alert("save   out");
                if (orgModel.get('errors.length') === 0) {
                    //alert("save   in");
                    orgModel.save().then(function() {
                        if (_self.get('operateFlag') == 'edit') {
                            console.log("edit   detailSaveClick");
                            _self.set('editModel', null);
                            _self.get("mainController").switchMainPage('org-management', {
                                flag: 'edit'
                            });
                        }
                        if (_self.get('operateFlag') == 'add') {
                            console.log("add   detailSaveClick");
                            _self.get("mainController").switchMainPage('org-management', {
                                flag: 'add'
                            });
                        }
                    });
                } else {
                    //alert("not validate");
                }
            });

            /*var _self = this;
            console.log("   detailSaveClick");
            console.log("detailSaveClick   " + _self.get('operateFlag'));
            if (_self.get('operateFlag') == 'edit') {
                console.log("edit   detailSaveClick");
                this.send('editStaff');
            }
            if (_self.get('operateFlag') == 'add') {
                console.log("add   detailSaveClick");
                this.send('addStaff');
            }*/

        },
        editOrg: function() {
            var _self = this;
            console.log("id   " + _self.get('id'));
            this.store.findRecord('organization', _self.get('id')).then(function(org) {
                org.set('orgName', _self.get("orgDetail.orgName"));
                org.set('orgCode', _self.get("orgDetail.orgCode"));
                org.set('mobileIcon', _self.get("orgDetail.mobileIcon"));
                console.log("id   " + org.get('id') + org.get('orgName') + org.get('orgCode') + org.get('mobileIcon'));
                org.set('delStatus', 0);
                org.save().then(function() {
                    _self.get("mainController").switchMainPage('org-management', {
                        flag: 'edit'
                    });
                });
            });
        },
        addOrg: function() {
            var _self = this;
            var org = _self.store.createRecord('organization', {});
            org.set('orgName', _self.get("orgName"));
            org.set('orgCode', _self.get("orgCode"));
            org.set('orgTel', _self.get("orgTel"));
            org.set('address', _self.get("address"));
            org.set('mobileIcon', _self.get("mobileIcon"));
            org.set('delStatus', 0);
            org.save().then(function() {
                _self.get("mainController").switchMainPage('org-management', {
                    flag: 'add'
                });
            });

        },
        cancelOperate: function() {
            console.log("cancelEdit");
            if (this.get('operateFlag') == 'edit') {
                this.get("org").rollbackAttributes();
                this.set("orgModel", new Changeset(this.get("org"), lookupValidator(OrgValidations), OrgValidations));
            }
            this.get("mainController").switchMainPage('org-management', {
                flag: 'edit-add'
            });
        },
        /*删除*/
        delOrg: function() {
            var _self = this;
            this.store.findRecord('organization', _self.get('id')).then(function(org) {
                org.set("delStatus", 1);
                org.save().then(function() {
                    _self.get("mainController").switchMainPage('org-management', {});
                });
            });
        },
        editModelModify: function() {
            this.set('editModel', 1);
        },
        cancelEdit: function() {
            this.set('editModel', null);
            this.get("org").rollbackAttributes();
            this.set("orgModel", new Changeset(this.get("org"), lookupValidator(OrgValidations), OrgValidations));
        },
    }
});
