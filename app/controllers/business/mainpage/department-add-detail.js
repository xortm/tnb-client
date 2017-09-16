import Ember from 'ember';
import Changeset from 'ember-changeset';
import DepartmentValidations from '../../../validations/department';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(DepartmentValidations,{
  constants: Constants,
  queryCondition:'',
  flags:0,
  dateService: Ember.inject.service("date-service"),
  // store: Ember.inject.service("store"),
  departmentModel:Ember.computed('department',function(){
    var model = this.get("department");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(DepartmentValidations), DepartmentValidations);
  }),
  editService:false,
  detailEdit:false,

  abd: function() {},
  defaultUser: Ember.computed('department.createUser', 'userListFirst', function() {
      return this.get('department.createUser');

  }),
  defaultUser2: Ember.computed('department.lastUpdateUser', 'userListFirst', function() {
      return this.get('department.lastUpdateUser');

  }),
  defaultDepartment: Ember.computed('department.name', 'departmentListFirst', function() {
      return this.get('department.name');

  }),
  defaultEmployee: Ember.computed('department.leaderUser', 'employeeListFirst', function() {
      return this.get('department.leaderUser');

  }),

  defaultParent: Ember.computed('department.parent', 'parListFirst', function() {
      return this.get('department.parent');

  }),
  actions:{

    //保存
    detailSaveClick(){
      var _self=this;
      var editMode=this.get('editMode');
      var departmentModel=this.get('departmentModel');
      var lastTime = this.get("dateService").getCurrentTime();
      departmentModel.set("lastUpdateDateTime",lastTime);
      departmentModel.set("createDateTime",lastTime);

        departmentModel.validate().then(function(){
          if(departmentModel.get('errors.length')===0){
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            departmentModel.save().then(function(){
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
              if(editMode=='add'){
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('department-management');
              }else{
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                _self.set('detailEdit',false);
                let route=App.lookup('route:business.mainpage.department-add-detail');
                App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
              }
            },function(err){
              let error = err.errors[0];
              if(error.code==="4"){
                departmentModel.validate().then(function(){
                  departmentModel.addError('name',['该名称已被占用']);
                  departmentModel.set("validFlag",Math.random());
                  App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                });
              }else {
                App.lookup("controller:business.mainpage").closePopTip();
                App.lookup("controller:business.mainpage").showAlert("出现未知错误未能成功保存该条信息，请重试");
              }
            });
          }else{
            departmentModel.set("validFlag",Math.random());
          }
        });


    },
    invalid(){},
    // 编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);

    },
    //编辑按钮
    detailCancel:function(){
      let id=this.get('id');
      let editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('department').rollbackAttributes();
        let route=App.lookup('route:business.mainpage.department-add-detail');
        App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
      }else{
        this.get('department').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('department-management');
      }
    },//取消按钮
    //删除按钮
    delById(){
      let _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录",function(){
        _self.send('cancelPassSubmit',_self.get('department'));
      });
    },
    selectParent(parent) {
        this.set('department.parent', parent);
        console.log("父节点 " + parent.get('id'));
    },
    // selectDepart(department){
    //   this.get('departmentModel').set("name", name);
    //   this.set('department.name', name);
    // },
    selectDepartment(employee){
      this.set("departmentModel.leaderUser", employee);
      this.set('department.leaderUser', employee);
    },


    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //删除记录
    cancelPassSubmit(serviceLevelInfo){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      serviceLevelInfo.set("delStatus", 1);
      serviceLevelInfo.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          let mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('department-management');
      },function(data){//网络错误容错
        App.lookup("controller:business.mainpage").closePopTip();
        App.lookup("controller:business.mainpage").showAlert("出现未知错误删除失败，请重试");
      });
    },
    // //部门领导
    // selectEmployee(employee) {
    //   this.set("departmentModel.leaderUser", employee);
    //   this.set('department.leaderUser', employee);
    // },
    //创建人
    selectDepart1(user) {
      this.set("departmentModel.createUser",user);
      this.set('department.createUser',user);
        //this.set("defaultCustomer", caller);
    },
    //更新人
    selectDepart2(user) {
      this.set("departmentModel.lastUpdateUser",user);
      this.set('department.lastUpdateUser',user);
        //this.set("defaultCustomer", caller);
    },
    //部门名称
    selectDepart(name) {
        this.set("departmentModel.name",name);
        this.set('department.name',name);
    },
    changeCreateTimeDateAction(date) {
         console.log("date is who", date);
        var stamp = this.get("dateService").timeToTimestamp(date);
        this.set("departmentModel.createDateTime", stamp);
    }

  }


});
