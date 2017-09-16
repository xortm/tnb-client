import Ember from 'ember';
import customerInfo from './customer-info';

export default customerInfo.extend({
  // curCustomer : this.get("curCustomer"),
  // if(curCustomer.extendInfo){
  //   this.set("informationModel",true);
  // }
  actions:{
    /**
      * 保存客户信息
      * liantengfei
      * 2016/7/22
      */
      // loadExcel:function(){
      //   this.set('excelModal',true);
      // },
      // getAbrogate:function(){//取消按钮
      //   this.set("excelModal",false);
      // },
      // getNotarize:function(){//确认按钮
      //   this.set("excelModal",false);
      // },

      addCustomer: function() {
        this.set('saveType','1');
        this.set('curEditCustomer',{});
        this.set('confirmIdModal',true);
      },
      abrogate:function(){//取消按钮
        this.set("confirmIdModal",false);
      },
      notarize:function(){//确认按钮
        this.set("confirmIdModal",false);
        this.set("showpopCustomerModal",true);
        this.set('upExcel','uploadExcel')
      },
      saveCustomer:function(customer) {
        var _self = this;
        var curTask = this.get("global_curStatus").getTask();
        var saveType = _self.get('saveType');
        if(saveType === '1') {
          var newCustomer = _self.store.createRecord('customer',{});
          _self.store.find('task',curTask.get("id")).then(function(taskRecord){
            _self.copyCustomer(newCustomer,customer);
            newCustomer.set('task',taskRecord);
            newCustomer.save().then(function() {
              _self.set('showpopCustomerModal',false);
              _self.get('target').send('saveRefresh');
            });
          });
        }
        else if (saveType === '2') {
          _self.store.findRecord('customer',customer.id).then(function(newCustomer) {
            _self.copyCustomer(newCustomer,customer);
            newCustomer.save().then(function() {
              _self.set('showpopCustomerModal',false);
              // _self.refresh();
            });
          });
        }
      },
    }
});
