import Ember from 'ember';

export default Ember.Controller.extend({
    constants: Constants,
    queryCondition: '',
    mainController: Ember.inject.controller('business.mainpage'),
    actions: {
        toDetailPage(tenant) {
            if (tenant) {
                let id = tenant.get('id');

                console.log('length-------' + tenant.get('privileges').get('length'));
                this.get("mainController").switchMainPage('tenant-detail', {
                    id: id,
                    editMode: "edit"
                });
            } else {
                this.get("mainController").switchMainPage('tenant-detail', {
                    editMode: "add",
                    id: ''
                });
            }
        },
        toEquipTypePage:function(tenant){
          this.get("mainController").switchMainPage('tenant-devicemanagement', {
            id:tenant.id
          });
        }
    }
});
