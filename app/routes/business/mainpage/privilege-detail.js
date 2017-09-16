import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {
    taskApplyStatus_applyFail,
    taskApplyStatus_refuseInvitation
} = Constants;

export default BaseBusiness.extend(Pagination, {
    header_title: '客服详情',
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
        controller.set("parent", null);
        controller.set("editModel", null);
        controller.set("privilegeList", null);
        var privilegeList = this.store.query("privilege", {}).then(function(privileges){
          privileges.forEach(function(privilege){
            privilege.set('namePinyin',pinyinUtil.getFirstLetter(privilege.get("showName")));
          });
          controller.set("privilegeList", privileges);
        });
        this.store.findRecord("privilege", this.getCurrentController().get('id')).then(function(privilege) {
            controller.set("privilege", privilege);
            if (privilege.get('parent').get('id')!==undefined) {
                controller.send('getParent', privilege.get('parent').get('id'));
            }
        });
    },

});
