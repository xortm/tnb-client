import Ember from 'ember';
import Changeset from 'ember-changeset';
import customerbusinessdetailValidations from '../../../validations/customerbusinessdetail';
import lookupValidator from 'ember-changeset-validations';
// const {leaveStatus1,consultStatus5,consultStatus6,consultStatus7,leaveReason} = Constants;

export default Ember.Controller.extend(customerbusinessdetailValidations,{
  inBedFlag:0,
  leaveFlag:0,
  constants:Constants,
  dateService: Ember.inject.service("date-service"),
  dataLoader: Ember.inject.service("data-loader"),
  customerflowdModel:Ember.computed('customerflow',function(){
    var model = this.get("customerflow");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(customerbusinessdetailValidations), customerbusinessdetailValidations);
  }),
  defaultOldName:Ember.computed('customerflow.customer',function(){
    return this.get("customerflow.customer");
  }),
  defaultName:Ember.computed('customerflow.leaveStaff',function(){
      return this.get('customerflow.leaveStaff');
  }),
  theToday: Ember.computed(function() {
    let today = this.get('dateService').getCurrentTime();
    today=parseInt(today)-86400;
    today = this.get("dateService").timestampToTime(today);
    console.log('today is:',today);
    return today;
  }),
  secondDay:Ember.computed(function() {
    let today = this.get('dateService').getCurrentTime();
    today=parseInt(today);
    today = this.get("dateService").timestampToTime(today);
    console.log('today is:',today);
    return today;
  }),
  customerListObs:function(){
      // if(this.get('customerflow.customer')){
      //   console.log('11111111111111111 必填',this.get('customerflow'));
      //   this.get('defaultOldName',this.get('customerflow'));
      // }else {
      //   console.log('11111111111111111 必填 else',this.get('customerflow'));
      //   this.get('defaultOldName',' ');
      // }

    var inBedFlag = this.get("inBedFlag");
    var leaveFlag = this.get("leaveFlag");
    if(!leaveFlag||!inBedFlag){
      return;
    }
    var leaveList = this.get("leaveList");
    var customerflowInBedList = this.get("customerflowInBedList");
    let list = new Ember.A();
    customerflowInBedList.forEach(function(item,index){
      if(!leaveList.findBy('customer.id',item.get('customer.id'))){
        list.pushObject(item.get("customer"));
      }
    });
    console.log('list',list,list.get('length'));
    list.forEach(function(item){
      item.set("namePinyin",item.get("name"));
    });
    this.set("customerList",list);
  }.observes("leaveFlag","inBedFlag","customerflow"),

  actions:{
    invalid() {
        //alert("error");
    },
    back:function(){
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('stay-back');
    },
    changeAction(date) {
        var stamp = this.get("dateService").timeToTimestamp(date);
        this.set("customerflowdModel.leaveRecordDate", stamp);
    },
    changeLeaveAction(date) {
        var stamp = this.get("dateService").timeToTimestamp(date);
        this.set("customerflowdModel.leaveDate", stamp);
    },
    //保存
    detailSaveClick: function(customerflow) {
      var constants = this.get("constants");
      var editMode = this.get('editMode');
      var customerflowdModel = this.get('customerflowdModel');
      var _self = this;
      let leaveRecordDate = customerflowdModel.get('leaveRecordDate');
      let leaveDate = customerflowdModel.get("leaveDate");
      console.log('登记日期：',leaveRecordDate,'退住日期：',leaveDate);

      customerflowdModel.validate().then(function(){
        if(Number(leaveRecordDate)>Number(leaveDate)){
          customerflowdModel.addError('leaveDate',['退住日期不能小于登记日期']);
        }
        if(customerflowdModel.get('errors.length')===0){
          if(editMode=='add'){
            var leaveStatusObj = _self.get("dataLoader").findDict(constants.leaveStatus1);
            // var statusObj = _self.get("dataLoader").findDict(constants.consultStatus6);
            customerflowdModel.set("leaveStatus",leaveStatusObj);//设置为申请退住
            customerflowdModel.set("backRemark","out");//新增一条退住的时候 设置为out
            // customerflowdModel.set("status",statusObj);//设置为退住
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            customerflowdModel.save().then(function(){
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('stay-back');
            });

          }else{
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            customerflowdModel.save().then(function(){
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
              _self.set('detailEdit',false);
            });
          }

        }else{
          customerflowdModel.set("validFlag",Math.random());
        }
      });

    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    //取消
    detailCancel:function(){
      var id=this.get('id');
      var editMode=this.get('editMode');
      var mainpageController = App.lookup('controller:business.mainpage');
      if(editMode=='edit'){
        this.set('detailEdit',false);
        this.get('customerflow').rollbackAttributes();
        mainpageController.switchMainPage('stay-back');
      }else{
        console.log("11111111111detailEdit  else");
        this.get('customerflow').rollbackAttributes();
        mainpageController.switchMainPage('stay-back');
      }

    },
    //选择老人
    selectOldman(customer) {
        // this.set('customerflow.customer',customer.get("customer"));
        // this.set('customerflowdModel.customer',customer.get("customer"));
        this.set('customerflow.customer',customer);
        this.set('customerflowdModel.customer',customer);
        // this.set('customerflowCustomer',customer);
    },
    //选择登记人
    selectName(user) {
        this.set('customerflow.leaveStaff',user);
        this.set('customerflowdModel.leaveStaff',user);
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此床位记录",function(){
        _self.send('cancelPassSubmit',_self.get('customerflowdModel'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(customerflow){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      customerflow.set("delStatus", 1);
      customerflow.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('stay-back');
      });
		},

  }
});
