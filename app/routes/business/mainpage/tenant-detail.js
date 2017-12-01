import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
        customizeModel: {
            refreshModel: true
        },
    },
    header_title: '租户信息',
    model() {
        return {};
    },
    setupController(controller, model) {
        var _self = this;
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        controller.set("allPrivilege",false);
        if (editMode == 'editRole') {//编辑 权限数据
            controller.set('detailEdit', false);
            controller.set('addFlag', '0');
            this.store.findRecord('tenant', id).then(function(tenant) {
                controller.set('tenantInfo', tenant);
                controller.set('tenantInfo.detailEdit', false);
                controller.set("currentTenant", controller.get('tenantInfo'));
                controller.set("status",tenant.get("status"));
            });
        }
        if (editMode == 'add') {//新增租户
            controller.set('tenantInfo', this.store.createRecord('tenant', {}));
            controller.set('detailEdit', true);
            controller.set('addFlag', '1');
        }
        if (editMode == 'edit') {//编辑租户
            // controller.set('addFlag', '2');
            controller.set('addFlag', '0');
            controller.set('detailEdit', false);
            this.store.findRecord('tenant', id).then(function(tenant) {
                controller.set('tenantInfo', tenant);
                controller.set('tenantInfo.detailEdit', false);
                controller.set("currentTenant", controller.get('tenantInfo'));
            });
        }
        if (editMode == 'addRole') {
            controller.set('addFlag', '0');
            controller.set('detailEdit', false);
            this.store.findRecord('tenant', id).then(function(tenant) {
                controller.set('tenantInfo', tenant);
                controller.set('tenantInfo.detailEdit', false);
                controller.set("currentTenant", controller.get('tenantInfo'));
            });
        }
    }
});
