import Ember from 'ember';
import Changeset from 'ember-changeset';
import PlanexeValidations from '../../../validations/servicecheck';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(PlanexeValidations,{
  constants:Constants,//引入字典常量

  global_dataLoader: Ember.inject.service('data-loader'),
  dateService: Ember.inject.service("date-service"),
  detailEdit:false,
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
  // customerList:Ember.computed('nursingplanList',function(){
  //   let nursingplanList = this.get('nursingplanList');
  //   let customerList = new Ember.A();
  //   if(nursingplanList){
  //     nursingplanList.forEach(function(plan){
  //       let customer = Ember.Object.create({
  //         id:plan.get('customer.id'),
  //         name:plan.get('customer.name'),
  //         item:plan.get('customer'),
  //         plan:plan,
  //         sortName:pinyinUtil.getFirstLetter(plan.get('customer.name')),
  //       });
  //       if(!customerList.findBy('id',plan.get('customer.id'))){
  //         customerList.pushObject(customer);
  //       }
  //
  //     });
  //   }
  //   return customerList;
  // }),
  actions:{
    countTypeSelect(countType){
      let _self = this;
      this.set('countType',countType);
    },
    dpShowAction(e){},
    //选择开始时间
    changePlanStartDateAction(date){
      let _self = this;
      //当前选择时间
      var stamp = this.get("dateService").timeStringToTimestamp(date);
      let workDay = this.get("dateService").timestampToTime(stamp).getDay();
      this.set("planModel.exeStartTime", stamp);
      this.set('workDay',workDay);
    },
    selectCustomer(customer){
      let _self=this;
      this.set('customer',customer);
      this.set('planModel.customer',customer);
      this.store.query('nursingprojectitem',{filter:{project:{customer:{id:customer.get('id')}}}}).then(function(projectList){
        let list = new Ember.A();
        projectList.forEach(function(project){
          if(!list.findBy('id',project.get('item.id'))){
            list.pushObject(project.get('item'));
          }
        });
        _self.set('serviceList',list);
        _self.set('projectList',projectList);
      });
    },
    selectStaff(staff){
      this.set('staff',staff);
      this.set('planModel.exeStaff',staff);
    },
    selectService(service){
      this.set('service',service);
      this.set('planModel.service',service);
      console.log("service:",service.get('name'));
    },
    invalid() {
        //alert("error");
    },
    //保存
    detailSaveClick: function() {
      var planModel=this.get('planModel');
      var _self=this;
      let itemProject = this.get('projectList').findBy('item.id',_self.get('service.id'));
      planModel.validate().then(function(){

        if(planModel.get('errors.length')===0){
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          //计时项目
          if(_self.get('service.countType.typecode')=='countTypeByTime'){
            planModel.set('itemProject',itemProject);
            let json = {};
            json.serviceDesc = _self.get('planInfo.remark');
            let remark = JSON.stringify(json);
            planModel.set('remark',remark);
          }
          //计次项目
          if(_self.get('service.countType.typecode')=='countTypeByFrequency'){
            planModel.set('itemProject',itemProject);
            let arr = [];
            let json = {};
            json.content = _self.get('planInfo.remark');
            json.applyUserId = planModel.get('exeStaff.id');
            arr = arr.concat(json);
            let remark = JSON.stringify(arr);
            planModel.set('remark',remark);

          }
          planModel.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('serviceapplycheck');
        });
      }else{
        planModel.set("validFlag",Math.random());
      }
      });
    },
    //取消
    detailCancel:function(){
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('serviceapplycheck');
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定撤销此记录",function(){
        _self.send('cancelPassSubmit',_self.get('planInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(plan){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      plan.set("delStatus", 1);
      plan.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('serviceapplycheck');

      });
		},
  }
});
