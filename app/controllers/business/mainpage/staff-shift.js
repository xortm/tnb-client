import Ember from 'ember';

export default Ember.Controller.extend({
  feedBus: Ember.inject.service("feed-bus"),
  //所有护理人员列表，包括护工组和未编组护工
  allStaffList:Ember.computed('staffs','groups',function(){
    let staffs = this.get('staffs');
    let groups = this.get('groups');
    let list = new Ember.A();
    if(!groups){
      return null;
    }
    if(!staffs){
      return null;
    }
    groups.forEach(function(group){
      group.set('type','group');
      group.set('hasSelected',false);
      group.set('group',true);
      list.pushObject(group);
    });
    staffs.forEach(function(staff){
      staff.set('hasSelected',false);
      staff.set('type','staff');
      list.pushObject(staff);
    });
    return list;
  }),
  //选定要排班的护理人员
  chooseStaffs:Ember.computed('allStaffList.@each.hasSelected',function(){
    let allStaffList = this.get('allStaffList');
    if(!allStaffList){
      return null;
    }
    return allStaffList.filter(function(staff){
      return staff.hasSelected===true;
    });
  }),

  actions:{
    //选择护工弹层
    editWork(){
      this.set('editStaff',true);
    },
    //选择护工弹层取消
    exitStaff(){
      let allStaffList = this.get('allStaffList');
      if(allStaffList){
        allStaffList.forEach(function(staff){
          staff.set('hasSelected',false);
        });
      }
      this.set('editStaff',false);

    },
    nav(nav){

    },
    invitation(){
      this.set('detailWork',false);
    },
    //选择要排班的人
    chooseStaff(staff){
      staff.set('hasSelected',true);
    },
    //移除要排班的人
    chooseStaffBack(staff){
      staff.set('hasSelected',false);
    },
    //确定要排班的人
    come(){
      let _self = this;
      let chooseStaffs = this.get('chooseStaffs');
      let list = new Ember.A();
      //选中的所有护工组
      let groupList = chooseStaffs.filter(function(staff){
        return staff.get('type')=='group';
      });
      //选中的所有护工
      let employeeList = chooseStaffs.filter(function(staff){
        return staff.get('type')=='staff';
      });
      //将护工放入一个数组
      employeeList.forEach(function(staff){
        list.pushObject(staff);
      });
      //当有选择的护工组时，根据护工组查出该护工组的所有护工
      if(groupList.get('length')!==0){
        //根据所选择的护工组，组成查询条件
        let filter = {};
        for(let i=0;i<groupList.length;i++){
              let j = i+1;
              let key = "group][id@$or1---"+j;
              let value = groupList.objectAt(i).get('id');
              let filterNew = {};
              filterNew[key] = value;
              filter = $.extend({},filter, filterNew);
          }
        _self.store.query('employeenursinggroup',{filter}).then(function(staffs){
          staffs.forEach(function(staff){
            //将查询所得的所有护工放入数组
            if(!list.findBy('id',staff.get('employee.id'))){
              list.pushObject(staff.get('employee'));
            }
          });
          _self.set('editStaff',false);
          let allStaffList = _self.get('allStaffList');
          allStaffList.forEach(function(staff){
            staff.set('hasSelected',false);
          });
          _self.set('staffList',list);
          _self.get('feedBus').set('workerList',list);
          if(list.get('length')>0){
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('nursing-staff-scheduling');
          }else{
            App.lookup('controller:business.mainpage').showAlert('请选择排班人员');
          }
        });
      }else{
        _self.set('editStaff',false);
        let allStaffList = _self.get('allStaffList');
        allStaffList.forEach(function(staff){
          staff.set('hasSelected',false);
        });
        _self.set('staffList',list);
        //将选中要排班的护工放入全局
        _self.get('feedBus').set('workerList',list);
        if(list.get('length')>0){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('nursing-staff-scheduling');
        }else{
          App.lookup('controller:business.mainpage').showAlert('请选择排班人员');
        }
      }
    },

  }
});
