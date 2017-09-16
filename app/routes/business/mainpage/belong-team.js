import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'所属护理组',
  model(){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
    var curUser = this.get("global_curStatus").getUser();
    var employee = curUser.get("employee");
    var _self = this;
    this.store.query('employeenursinggroup',{filter:{employee:{id:employee.get("id")}},include:{employeenursinggroup:"group"}}).then(function(employeenursinggroups){
      var employeenursinggroup = employeenursinggroups.get("firstObject");
      if(!employeenursinggroup){
        controller.set("showLoadingImg",false);
      }
      var group = employeenursinggroup.get("group");
      console.log("employeenursinggroups id id id",group.get("id"));
      console.log("employeenursinggroups id id id staffsstaffs",group.get("staffs"));
      console.log("employeenursinggroups id id id customers",group.get("customers"));
      console.log("employeenursinggroup111",employeenursinggroup);
      console.log("employeenursinggroup111 group",group);
      console.log("employeenursinggroup111 groupName",group.get("name"));
      controller.set("employeenursinggroup",employeenursinggroup);
      controller.set("group",group);
      controller.set("groupName",group.get("name"));
      // var nameStr = '';
      // var customers = group.get("customers");
      // if(customers&&customers.get("length")){
      //   customers.forEach(function(customer){
      //     console.log("forEachname customer",staff.get("employee.name") + ",staff:"+staff);
      //     if(customer.get('name')){
      //         nameStr += customer.get('name')+',';
      //     }
      //   });
      //   controller.set('customersName',nameStr.substring(0,nameStr.length-1));
      // }

      // var str = '';//这个带不出不行
      // var employees = group.get("staffs");
      // if(employees){
      //   employees.forEach(function(staff){
      //     console.log("forEachname staff",staff.get("employee.name") + ",staff:"+staff);
      //     str +=  staff.get("employee.name")+'，';
      //   });
      //   controller.set('employeesName',str.substring(0,str.length-1));
      // }

      _self.store.query('employeenursinggroup',{filter:{group:{id:group.get("id")}}}).then(function(employees){
        var str = "";
        if(employees){
          employees.forEach(function(staff){
            console.log("forEachname staff",staff.get("employee.name") + ",staff:"+staff);
            str +=  staff.get("employee.name")+'，';
          });
          controller.set('employeesName',str.substring(0,str.length-1));
          controller.set('employees',employees);
        }
      });

      _self.store.query('nursegroup',{filter:{id:group.get("id")}}).then(function(nursegroups){
        var str = "";
        var nursegroup = nursegroups.get("firstObject");
        var customers = nursegroup.get("customers");
        console.log("employeenursinggroups id id id",customers);
        if(customers){
          customers.forEach(function(customer){
            str +=  customer.get("name")+'，';
          });
        controller.set('customersName',str.substring(0,str.length-1));
        controller.set('customers',customers);
        controller.set("showLoadingImg",false);
        }
      });

    });

  },

});
