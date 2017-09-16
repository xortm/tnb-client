import Ember from 'ember';

export default Ember.Controller.extend({
  detailEdit:false,
  addModel:false,
  autoModel:false,
  unsubmitted:false,
  createModel:false,
  readOnly:false,
  popSubmit:false,
  constants: Constants,
  dataLoader: Ember.inject.service("data-loader"),
  //默认房间
  defaultCustomer:Ember.computed('billInfo.customer',function(){
      return this.get('billInfo.customer');
  }),
  //年、季度、月份的展示
  defaultYear:Ember.computed('billInfo.billYear',function(){
    if(this.get('billInfo.billYear')){
      let quarter = Ember.Object.create({});
      quarter.set('name',this.get('billInfo.billYear')+'年');
      return quarter;
    }
  }),
  defaultQuarter:Ember.computed('billInfo.billQuarter',function(){
    if(this.get('billInfo.billQuarter')){
      let quarter = Ember.Object.create({});
      quarter.set('name','第'+this.get('billInfo.billQuarter')+'季度');
      return quarter;
    }
  }),
  defaultMonth:Ember.computed('billInfo.billMonth',function(){
    if(this.get('billInfo.billMonth')){
      let quarter = Ember.Object.create({});
      quarter.set('name',this.get('billInfo.billMonth')+'月');
      return quarter;
    }
  }),
  //yearList,monthList,quarterList分别为年、月、季度的下拉框
  monthList:Ember.computed(function(){
    let monthArr = new Ember.A();
    for(let i=1;i<13;i++){
      let month = Ember.Object.create({});
      month.set('name',i+'月');
      month.set('number',i);
      monthArr.pushObject(month);
    }
    return monthArr;
  }),
  yearList:Ember.computed(function(){
    let yearArr = new Ember.A();
    for(let i=2016;i<2036;i++){
      let year = Ember.Object.create({});
      year.set('name',i+'年');
      year.set('number',i);
      yearArr.pushObject(year);
    }
    return yearArr;
  }),
  quarterList:Ember.computed(function(){
    let quarterArr = new Ember.A();
    for(let i=1;i<5;i++){
      let quarter = Ember.Object.create({});
      quarter.set('name','第'+i+'季度');
      quarter.set('number',i);
      quarterArr.pushObject(quarter);
    }
    return quarterArr;
  }),
  //year,month,quarter,根据账单类别，选择显示年、月、季度的下拉框
  year:Ember.computed('billInfo.billType',function(){
    let status = this.get('billInfo.billType.typecode');
    let constants = this.get('constants');
    if(status!==constants.billType1){
      return true;
    }else{
      return false;
    }
  }),
  month:Ember.computed('billInfo.billType',function(){
    let status = this.get('billInfo.billType.typecode');
    let constants = this.get('constants');
    if(status==constants.billType2){
      return true;
    }else{
      return false;
    }
  }),
  quarter:Ember.computed('billInfo.billType',function(){
    let status = this.get('billInfo.billType.typecode');
    let constants = this.get('constants');
    if(status==constants.billType3){
      return true;
    }else{
      return false;
    }

  }),

  actions:{
    invalid() {
        //alert("error");
    },
    //保存
    detailSaveClick: function() {

      let _self = this;
      let billInfo = this.get('billInfo');
      let status = this.get('dataLoader').findDict("billStatus0");
      let createType = this.get('dataLoader').findDict("createType2");
      billInfo.set('billStatus',status);
      billInfo.set('billCreateType',createType);
      this.get('dataLoader').disableClick();
      billInfo.save().then(function(){
        App.lookup('controller:business.mainpage').openPopTip("正在保存");
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('cost-management');
        App.lookup('controller:business.mainpage').showPopTip("保存成功");
        _self.set('addModel',false);
        _self.get('dataLoader').btnClick();
      });
    },
    //提交
    commit(){
      this.set('popSubmit',true);
    },
    submit(){
      let _self = this;
      let billInfo = this.get('billInfo');
      let status = this.get("dataLoader").findDict("billStatus1");
      billInfo.set('billStatus',status);
      //添加新纪录时，将账单状态设为手动生成
      if(this.get('editMode')=='add'){
        let createType = this.get('dataLoader').findDict("createType2");
        billInfo.set('billCreateType',createType);
      }
      billInfo.save().then(function(){
        App.lookup('controller:business.mainpage').openPopTip("正在提交");
        _self.set('popSubmit',false);
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('cost-management');
        App.lookup('controller:business.mainpage').showPopTip("提交成功");
      });
    },
    recall(){
      this.set('popSubmit',false);
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    //取消
    detailCancel:function(){
      let mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('cost-management');
    },
    //选择用户
    selectCustomer(customer) {
      this.set('billInfo.customer',customer);
    },
    selectMonth(month) {
      this.set('billInfo.billMonth',month.get('number'));
    },
    selectYear(year) {
      this.set('billInfo.billYear',year.get('number'));
    },
    selectQuarter(quarter) {
      this.set('billInfo.billQuarter',quarter.get('number'));
    },
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此账单",function(){
        _self.send('cancelPassSubmit',_self.get('billInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(bill){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      bill.set("delStatus", 1);
      bill.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('cost-management');

      });
		},
  }
});
