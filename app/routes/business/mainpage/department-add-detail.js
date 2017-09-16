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
  header_title:'部门信息',
  model(){
    return{};
  },
  setupController(controller,model){
    let _self = this;

    this._super(controller, model);
    let editMode=this.getCurrentController().get('editMode');
    let id=this.getCurrentController().get('id');
    // this.store.query('department',{filter:{parent:{id:'null'}}}).then(function(parList){
    //         controller.set('parList',parList);
    //         console.log("parList的数据： ",parList);
    //
    // });
    let departmentList = this.store.peekAll('department');
    var list = new Ember.A();
    departmentList.forEach(function(item){
      if(item.get("id")!==id){
          list.pushObject(item);
      }
    });
    controller.set('parList',list);
    this.store.query('employee',{filter:{department:{id:id},leaderFlag:1}}).then(function(leaderList){
      var str = '';
      leaderList.forEach(function(item){
        str += item.get("name")+"，";
      });
      str = str.substring(0,str.length-1);
      controller.set('leadersName',str);
    });

    if(editMode=='edit'){
      let department = this.store.peekRecord('department',id);
      controller.set('department',department);
      // controller.set('deparDate',false);

      controller.set('detailEdit',false);
    }else{
  controller.set('detailEdit',true);
  // controller.set('deparDate',true);

      controller.set('department',this.store.createRecord('department',{}));


    }
    // this.store.query("employee",{}).then(function(employeeList) {
    //     console.log("employeeList is", employeeList);
    //     employeeList.forEach(function(employee) {
    //       employee.set('namePinyin', pinyinUtil.getFirstLetter(employee.get("name")));
    //     });
    //     controller.set("employeeList", employeeList);
    //     controller.set('employeeListFirst', employeeList.get('firstObject'));
    // });

    this.store.query("department", {}).then(function(parList) {
        console.log("parList is", parList);
        parList.forEach(function(department) {
            department.set('parentPinyin', department.get("name"));
        });
        controller.set("parList", parList);
        controller.set('parListFirst', parList.get('firstObject'));
    });


  }
});
