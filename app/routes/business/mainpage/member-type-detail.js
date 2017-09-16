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
    header_title: '会员等级详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            this.store.findRecord('dicttype', id).then(function(dicttype) {
                controller.set('dicttype', dicttype);
            });
        } else {
            controller.set('detailEdit', true);
            controller.set('dicttype', this.store.createRecord('dicttype', {}));
        }
        // this.store.query("employee", {filter:{
        //   staffStatus:{'typecode@$not':Constants.staffStatusLeave}
        // }}).then(function(staffList) {
        //   console.log("staffList is", staffList);
        //   staffList.forEach(function(staff) {
        //     staff.set('operaterPinyin', staff.get("name"));
        //   });
        //   controller.set("staffList", staffList);
        //   controller.set('staffListFirst', staffList.get('firstObject'));
        // });
        this.store.findRecord("typegroup",97).then(function(typegroup){
          console.log("typegroup:",typegroup);
          controller.set("typegroup",typegroup);
        });

    }
});
