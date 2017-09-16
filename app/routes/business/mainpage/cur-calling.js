import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  /*拷贝页面对象到数据实体*/
  copyFromEntity: function (customerEnt, customer) {
    customer.id = customerEnt.get("id");
    customer.name = customerEnt.get("name");
    customer.phone = customerEnt.get("phone");
    customer.email = customerEnt.get("email");
    customer.address = customerEnt.get("address");
    customer.weixin = customerEnt.get("weixin");
  },
  model() {
    var _self = this;
    var curCall = this.get("global_curStatus").getCall();
    var callingObj = {
      inCall: 0,
      curTask: "1",
    };
    if(this.get("global_curStatus").inCall()){
      callingObj.inCall = curCall.get("callNumber");
    }
    //设置标头
    if (callingObj.inCall) {
      this.title = "通话号码：" + callingObj.inCall;
      this.description = "类型：拨入电话，通话时长:10分35秒";
    }
    //根据来电号码(以及任务)查询通话记录，如果有，则返回通话对应客户
    var callPromise = this.get("global_curStatus").findCustomerWithCall();
    var customerPromise = null;
    return callPromise.then(function(callEnt){
      console.log("callEnt in add:", callEnt);
      return callEnt.save().then(function (callData) {
        console.log("callEnt save suc", callData);
        customerPromise = new Ember.RSVP.Promise(function (resolve, reject) {
          callData.get("customer").then(function (customerEnt) {
            //resolve(customerEnt);
            var customer = {};
            if(!customerEnt){
              resolve();
              return;
            }
            _self.copyFromEntity(customerEnt, customer);
           resolve(customer);
          });
        });
        var model = new Ember.RSVP.hash({
          inCall: callingObj.inCall,
          curTask: callingObj.curTask,
          //当前通话数据
          curCall: callData,
          //当前通话对应客户
          customer: customerPromise,
          //当前通话对应的客户的工单列表
          workorderList: new Ember.RSVP.Promise(function (resolve, reject) {
            customerPromise.then(function (customer) {
              console.log("customerPromise in,customer", customer);
              if (!customer) {
                resolve();
                return;
              }
              var workorderList = Ember.A();
              _self.store.query("workorder", {filter: {customer: customer.id}}).then(function (workorders) {
                console.log("workorders in", workorders);
                var len = workorders.get("length");
                console.log("len in workorders: " + len);
                var index = 0;
                if (len === 0) {
                  resolve(workorderList);
                  return;
                }
                resolve(workorders);
              });
            });
          }),
          //获得当前任务对应的所有客户
          taskCustomers: new Ember.RSVP.Promise(function (resolve, reject) {
            var customersForSelect2 = Ember.A();
            _self.store.query("customer", {}).then(function (customers) {
              console.log("taskCustomers in", customers);
              var len = customers.get("length");
              console.log("len in taskCustomers: " + len);
              var index = 0;
              if (len === 0) {
                resolve(customersForSelect2);
                return;
              }
              customers.forEach(function (customerEnt) {
                index++;
                var relTask = customerEnt.get('task');
                console.log("relTask id:" + relTask.get('id') + " and callingObj.curTask:" + callingObj.curTask);
                if (relTask.get("id") === callingObj.curTask) {
                  console.log("lll");
                  //转换为select2的格式
                  var customer = {
                    id: customerEnt.get('id'),
                    text: customerEnt.get("name"),
                    description: customerEnt.get("desc")
                  };
                  console.log("customer build", customer);
                  customersForSelect2.pushObject(customer);
                }
              });
              Ember.RSVP.all(customersForSelect2).then(function (customersForSelect2Res) {
                console.log("need all,customersForSelect2Res", customersForSelect2Res);
                resolve(customersForSelect2Res);
              });
            });
          }),
        });
        return model;
      });
    });
  }
});
