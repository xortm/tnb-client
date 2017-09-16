import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {
    taskApplyStatus_applyFail,
    taskApplyStatus_refuseInvitation
} = Constants;

export default BaseBusiness.extend(Pagination, {
    header_title: '机构信息',
    queryParams: {
        id: {
            refreshModel: true
        }
    },
    privilege_par: null,
    model() {
        return {};
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set("operateFlag", null);
        controller.set('editModel', null);
        console.log("operateFlagid " + this.getCurrentController().get('id'));
        if (this.getCurrentController().get('id')!== 'null') {
            this.store.findRecord("organization", this.getCurrentController().get('id')).then(function(org) {
                controller.set("org", org);
                controller.set("operateFlag", "edit");
                controller.set("header_title", "机构信息");
                console.log("operateFlag " + 'edit');
            });
        } else {
            let model = this.get("store").createRecord('organization', {});
            controller.set("org", model);
            controller.set("operateFlag", "add");
            controller.set("header_title", "添加机构");
            console.log("operateFlag " + 'add');
        }

    },

});
