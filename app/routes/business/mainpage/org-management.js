import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    header_title: '机构信息',
    queryParams: {
        flag: {
            refreshModel: true
        }
    },
    model() {
        return {};
    },
    setupController: function(controller, model) {

        controller.set("operateFlag", null);
        controller.set("editModel", null);
        controller.set("editLoginNameModel", null);
        var curUser = this.get('global_curStatus').getUser();
        var _self = this;
        if(curUser.get('org.id')===undefined){
        console.log("use++++++  " );
        this.get("store").query('organization',{
          sort: {
              'remark': 'asc'
          }
        }).then(function(orgList) {
            controller.set('org', orgList.get('firstObject'));
          });
        }else{
            console.log("user---------  " + curUser.get('org.id'));
            _self.store.findRecord('organization', curUser.get('org.id')).then(function (organization) {
                controller.set("org", organization);
            });
        }
    }
});
