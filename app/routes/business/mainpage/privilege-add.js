import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
    header_title: '权限添加',
    model() {
        // this.set('header_title','查看所有客服');
        return {};
    },
    parent: null,
    setupController: function(controller, model) {
        controller.set("parent", null);
        controller.set("privilegeList", null);
        this._super(controller, model);
        this.store.query("privilege", {}).then(function(privilegeList) {
            controller.set("privilegeList", privilegeList);
            privilegeList.forEach(function(privilege){
              privilege.set('namePinyin',pinyinUtil.getFirstLetter(privilege.get("showName")));
            });
            console.log('doQuery privilegeList', privilegeList);
        });
    },
});
