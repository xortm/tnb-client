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
    },
    detailEdit: true,
    header_title: '编辑排班',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            controller.set("flagEdit", true);
            this.store.findRecord('staffschedule', id).then(function(scheduling) {
                // console.log("set scheduling:", scheduling.get('user'));
                controller.set('scheduling', scheduling);
                controller.set("defaultUser", scheduling.get('user'));
                // controller.set("", scheduling.get('type'));
            });
        } else {
            controller.set("flagEdit", false);
            controller.set('detailEdit', true);
            controller.set('scheduling', this.store.createRecord('staffschedule', {}));
            var curUser = this.get("global_curStatus").getUser();
            console.log('curUser_self',curUser);
            this.get("store").findRecord('user', curUser.get("id")).then(function(userData) {
                controller.set('scheduling.createUser',userData);
            });
            controller.set("defaultUser",'');
        }
        this.store.query('user', {}).then(function(userList) {
          // userList.forEach(function(user){
          //   user.set('namePinyin',pinyinUtil.getFirstLetter(user.get("name")));
          // });
            controller.set('userList', userList);
            controller.set('userListFirst', userList.get('firstObject'));
            //console.log("++++++++++++++userList+++++++++++++++++",userList);
        });
    }
});
