import Ember from 'ember';
import Changeset from 'ember-changeset';
import PlanexeValidations from '../../../validations/planexe';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(PlanexeValidations,{
  constants:Constants,//引入字典常量
  global_dataLoader: Ember.inject.service('data-loader'),
  dateService: Ember.inject.service("date-service"),
  statusService: Ember.inject.service("current-status"),
  detailEdit:false,
  // 获取当前user的name信息
  recordUserName: Ember.computed(function(){
    var curUser = this.get("statusService").getUser();
    return curUser.get('name');
  }),
  today:Ember.computed(function(){
    let today = this.get('dateService').getCurrentTime();
    today = this.get("dateService").timestampToTime(today);
    return today;
  }),
  planModel:Ember.computed('planInfo',function(){
    var model = this.get("planInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(PlanexeValidations), PlanexeValidations);
  }),
  actions:{
    dpShowAction(e){},
    //选择开始时间
    changePlanStartDateAction(date){
      let _self = this;
      //当前选择时间
      var stamp = this.get("dateService").timeToTimestamp(date);
      let workDay = this.get("dateService").timestampToTime(stamp).getDay();
      this.set("planModel.exeStartTime", stamp);
      this.set('workDay',workDay);
      console.log('选择时间：',stamp);
    },
    selectCustomer(customer){
      let _self=this;
      if(customer){
        this.set('customer',customer);
        this.set('planInfo.recorder',customer);
        this.store.query('nursingprojectitem',{filter:{'[project][customer][id]':customer.get('id')}}).then(function(list){
          //获取护理方案所对应的护理项目
          console.log('list is',list);
          _self.set('serviceList',list);
        });
      }else {
        this.set('customer',null);
        this.set('planInfo.recorder',null);
      }
    },
    selectStaff(staff){
      this.set('staff',staff);
      this.set('planModel.exeStaff',staff);
      console.log(staff.get('name'));
    },
    selectService(service){
      this.set('service',service);
      this.set('planInfo.itemProject',service);
      this.set('planModel.itemProject',service);
    },
    //执行状态
    exeStatusSelect: function(exeStatusDict) {
        this.get("planModel").set("exeStatus", exeStatusDict);
    },
    invalid() {
        //alert("error");
    },
    //保存
    detailSaveClick: function() {
      var _self=this;
      var planModel=this.get('planModel');
      console.log('save:planModel',planModel);
      var editMode=this.get('editMode');
      console.log('save:editMode',editMode);
      var curUser = this.get("statusService").getUser();
      console.log('statusService:user is',curUser);
      planModel.validate().then(function(){
        console.log('isvalidate','validate');
        console.log('is errors',planModel.get('errors.length'));
        if(planModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          planModel.set('recordUser',curUser);//当前登录者
          planModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if(editMode=='add'){
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('member-service-management');
            }else {
              _self.set('detailEdit',false);
            }
        });
      }else{
        planModel.set("validFlag",Math.random());
      }
      });
    },
    //编辑按钮
    detailEditClick: function() {
        this.set('detailEdit', true);
    },
    //取消
    detailCancel:function(){
        var editMode=this.get('editMode');
        if(editMode=='add'){
          let mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('member-service-management');
        }else {
          this.set('detailEdit',false);
        }
    },
    //删除按钮
    delById: function() {
      var _self = this;
      var planInfo=this.get('planInfo');
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此消费记录", function() {
            App.lookup('controller:business.mainpage').openPopTip("正在删除");
            planInfo.set("delStatus", 1);
            planInfo.save().then(function() {
                App.lookup('controller:business.mainpage').showPopTip("删除成功");
                var mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('member-service-management');
            });
        });
    },
  }
});
