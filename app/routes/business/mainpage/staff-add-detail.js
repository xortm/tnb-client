import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {
    sexType,
    staffStatus,
    hireType,
    educationLevel,
    maritalStatus,
    relationType,
    nationality,
    nativePlace,
    careType,
    postType,
    deviceType4,
    deviceStatus1
} = Constants;

export default BaseBusiness.extend(Pagination, {
    header_title: '员工信息',
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
    },
    role_par: null,
    model() {
        return {};
    },
    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set("operateFlag", false);
        controller.set("editModel", false);
        console.log("operateFlagid " + controller.get('id'));
        var id = controller.get('id');
        var editMode = controller.get('editMode');
        var staff;
        if (editMode=='edit') {
          staff = this.store.peekRecord("employee", id);
          controller.set("staff", staff);
          controller.set("staffStatusBefore", staff.get("staffStatus"));
          controller.set("operateFlag", true);
          if(staff.get("leaderFlag")===1){// 1是leader
            controller.set("cbState",true);
          }else {
            controller.set("cbState",false);
          }

        } else {
            let model = this.get("store").createRecord('employee', {});
            controller.set("staff", model);
            controller.set("operateFlag", false);
            controller.set("cbState", false);
        }
        this.store.query("department", {}).then(function(departmentList) {
            controller.set("departmentList", departmentList);
        });
        this.store.query("device", {filter:{
          status:{typecode:Constants.deviceStatus1},
          deviceType:{typecode:Constants.deviceType4}
        }}).then(function(braceletList) {
            controller.set("braceletList", braceletList);
        });
    },

});
