import Ember from 'ember';
import Changeset from 'ember-changeset';
import TradeValidations from '../../../validations/trade';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend({
  constants: Constants,
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  //默认用户
  defaultCustomer:Ember.computed('tradeInfo.customer',function(){
      return this.get('tradeInfo.customer');
  }),
  tradeModel:Ember.computed('tradeInfo',function(){
    let model = this.get("tradeInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(TradeValidations), TradeValidations);
  }),
  actions:{
    invalid() {
        //alert("error");
    },
    //保存
    detailSaveClick: function() {
      let editMode=this.get('editMode');
      let tradeInfo=this.get('tradeInfo');
      let tradeModel = this.get('tradeModel');
      let mainpageController = App.lookup('controller:business.mainpage');
      let _self=this;
      tradeModel.validate().then(function() {
          if (tradeModel.get('errors.length') === 0) {
              _self.get('store').query('tradeaccount',{filter:{
                '[customer][id]': _self.get('tradeModel.customer.id'),
                '[type][typecode]': _self.get('tradeModel.payAccountType.typecode')
              }}).then(function(tradeAccountList) {
                  let payAccount = tradeAccountList.get('firstObject');
                  tradeModel.set('payAccount',payAccount);
                  App.lookup('controller:business.mainpage').openPopTip("正在保存");
                  tradeModel.save().then(function() {
                      App.lookup('controller:business.mainpage').showPopTip("保存成功");
                      mainpageController.switchMainPage('payment-management');
                  });
              });
          } else {
              tradeModel.set("validFlag", Math.random());
          }
      });
    },
    //取消
    detailCancel:function(){
      let mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('payment-management');
    },
    //选择房间
    selectCustomer(customer) {
        this.set('tradeInfo.customer',customer);
        this.set('tradeModel.customer',customer);
    },
  }
});
