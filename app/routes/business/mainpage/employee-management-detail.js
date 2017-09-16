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
            // this.store.findRecord("employee", id).then(function(staff) {
            //     controller.set("staff", staff);
            //     //staff.set('privilege',_self.get("privilege"));
            //     // staff.set('org',_self.get("org"));
            //     // controller.set('hireType', staff.get("hireType"));
            //     // controller.set("role", staff.get('role'));
            //     // controller.set("hireType", staff.get('hireType'));
            //     // controller.set("staffSex", staff.get('staffSex'));
            //     // controller.set("staffContactRelation", staff.get('staffContactRelation'));
            //     // controller.set("staffEducation", staff.get('staffEducation'));
            //     controller.set("operateFlag", true);
            // });
        } else {
            let model = this.get("store").createRecord('employee', {});
            controller.set("staff", model);
            //controller.set("staffModel", model);
            controller.set("operateFlag", false);
            controller.set("cbState", false);
            // var curUser = this.get('global_curStatus').getUser();
            // var _self = this;
            // console.log("user  " + curUser.get('id'));
            // this.store.findRecord('employee', curUser.get('id')).then(function(employee) {
            //     console.log("id  " + employee.get('org').get('id'));
            //     _self.store.findRecord('organization', employee.get('org').get('id')).then(function(org) {
            //         model.set('org', org);
            //     });
            // });
        }
        // var departmentList = this.store.peekAll('department');//列表页没有 department 所以要query 不能 peek
        // controller.set("departmentList", departmentList);
        this.store.query("department", {}).then(function(departmentList) {
            controller.set("departmentList", departmentList);
            console.log('doQuery departmentList', departmentList);
        });
        this.store.query("device", {filter:{status:{typecode:Constants.deviceStatus1},deviceType:{typecode:Constants.deviceType4}}}).then(function(braceletList) {
            controller.set("braceletList", braceletList);
            console.log('doQuery braceletList', braceletList);
        });
    },

});
