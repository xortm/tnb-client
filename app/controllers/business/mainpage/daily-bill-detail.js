import Ember from 'ember';
import Changeset from 'ember-changeset';
import BillValidations from '../../../validations/bill';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend(BillValidations,{
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
  billModel:Ember.computed('billInfo',function(){
    var model = this.get("billInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(BillValidations), BillValidations);
  }),
  hasCustomer:false,
  actions:{
    invalid() {
        //alert("error");
    },
    //保存
    detailSaveClick: function() {

      let _self = this;
      let billInfo = this.get('billInfo');
      let billModel = this.get('billModel');
      billModel.validate().then(function(){
        if(billModel.get('errors.length')===0){
          let status = _self.get('dataLoader').findDict("billStatus0");
          let createType = _self.get('dataLoader').findDict("createType2");
          billInfo.set('billStatus',status);
          billInfo.set('billCreateType',createType);
          let billType = _self.get('dataLoader').findDict('chargeTypeD');
          billInfo.set('billType',billType);
          let remark ;
          if(!billInfo.get('id')){
            if(billInfo.get('remark')){
              remark = billInfo.get('remark') + '@rijiesuan@';
            }else{
              remark = '@rijiesuan@';
            }
          }
          billInfo.set('remark',remark);
          billInfo.save().then(function(){
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            let mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('daily-bill-management');
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            _self.set('addModel',false);
            _self.get('dataLoader').btnClick();
          },function(err){
            let error = err.errors[0];
            if(error.code=='14'){
              App.lookup('controller:business.mainpage').closePopTip();
              _self.set('popSubmit',false);
              _self.get('billInfo').rollbackAttributes();
              let customer = _self.get('curCustomer');
              _self.set('billInfo.customer',customer);
              App.lookup('controller:business.mainpage').showAlert('该老人当前没有未结算的账单');

            }
          });
        }else{
          billModel.set("validFlag",Math.random());
        }
      });


    },
    //提交
    commit(){
      this.set('popSubmit',true);
    },
    submit(){
      let _self = this;
      let billInfo = this.get('billInfo');
      let billModel = this.get('billModel');
      billModel.validate().then(function(){
        if(billModel.get('errors.length')===0){
          let status = _self.get("dataLoader").findDict("billStatus1");
          billInfo.set('billStatus',status);
          //添加新纪录时，将账单状态设为手动生成
          if(_self.get('editMode')=='add'){
            let createType = _self.get('dataLoader').findDict("createType2");
            billInfo.set('billCreateType',createType);
          }
          if(!billInfo.get('id')){
            let remark ;
            if(billInfo.get('remark')){
              remark = billInfo.get('remark') + '@rijiesuan@';
            }else{
              remark = '@rijiesuan@';
            }

            billInfo.set('remark',remark);
          }

          let billType = _self.get('dataLoader').findDict('chargeTypeD');
          billInfo.set('billType',billType);
          billInfo.save().then(function(){
            App.lookup('controller:business.mainpage').openPopTip("正在提交");
            _self.set('popSubmit',false);
            let mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('daily-bill-management');
            App.lookup('controller:business.mainpage').showPopTip("提交成功");
          },function(err){
            let error = err.errors[0];
            if(error.code=='14'){
              App.lookup('controller:business.mainpage').closePopTip();
              _self.set('popSubmit',false);
              _self.get('billInfo').rollbackAttributes();
              let customer = _self.get('curCustomer');
              _self.set('billInfo.customer',customer);
              App.lookup('controller:business.mainpage').showAlert('该老人当前没有未结算的账单');

            }
          });
        }else{
          billModel.set("validFlag",Math.random());
        }
      });

    },
    recall(){
      this.set('popSubmit',false);
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    cancel:function(){
      this.set('detailEdit',false);
      this.get('billInfo').rollbackAttributes();
    },
    //取消
    detailCancel:function(){
      let mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('daily-bill-management');
    },
    //选择用户
    selectCustomer(customer) {
      let _self = this;
      this.set('curCustomer',customer);
      this.set('billInfo.customer',customer);
      console.log(this.get('billInfo.billStatType.typecode'));

      this.set('hasCustomer',true);
      if(this.get('billInfo.billStatType')){
        this.send('selectBillStatType',this.get('billInfo.billStatType'));
      }
      this.set('billModel.customer',customer);
    },
    selectBillStatType(billStatType){
      let _self = this;
      //选择要结算的账单类型，基础服务和增值服务
      let customer = this.get('billInfo.customer');
      if(this.get('hasCustomer')){
        this.set('billInfo.billStatType',billStatType);
        if(!_self.get('billInfo.id')){
          if(billStatType.get('typecode')=='billStatTypeJC'){
            this.store.query('customerdaybill',{filter:{customer:{id:customer.get('id')},billStatus:{typecode:'dayBillStatusWJS'},'bill@$isNull':'null'}}).then(function(dayBillList){//取当前老人的，所有未结算日账单
              _self.set('dayBillList',dayBillList);
              _self.set('appreciationBillList',null);

              let total = 0;
              dayBillList.forEach(function(bill){
                total += bill.get('total');
              });
              _self.set('billInfo.total',total);

            });
          }
          if(billStatType.get('typecode')=='billStatTypeZZ'){
            this.store.query('customerservicebill',{filter:{customer:{id:customer.get('id')},billStatus:{typecode:'dayBillStatusWJS'},'bill@$isNull':'null'}}).then(function(dayBillList){//取当前老人的，所有未结算增值账单
              _self.set('dayBillList',null);
              _self.set('appreciationBillList',dayBillList);
              let total = 0;
              dayBillList.forEach(function(bill){
                total += bill.get('total');
              });
              _self.set('billInfo.total',total);
            });
          }
        }

      }
      this.set('billModel.billStatType',billStatType);
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
          mainpageController.switchMainPage('daily-bill-management');

      });
		},
  }
});
