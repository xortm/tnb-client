import Ember from 'ember';

export default Ember.Controller.extend({
  inCalling: null,
  customerEditMode: false,
  workorderEditMode: false,

  /*拷贝页面对象到数据实体*/
  copyToEntity: function (customerEnt, customer) {
    customerEnt.set("name", customer.name);
    customerEnt.set("phone", customer.phone);
    customerEnt.set("email", customer.email);
    customerEnt.set("address", customer.address);
    customerEnt.set("weixin", customer.weixin);
  },
  saveWorkorderEntity: function (workorder) {
    var _self = this;
    var workorderEnt = null;
    if (workorder.id) {
      //如果已有则直接保存
      console.log("update direct");
      return workorder.save();
    } else {
      workorderEnt = this.store.createRecord("workorder", {});
      workorderEnt.set("title", workorder.title);
      workorderEnt.set("type", workorder.type);
      workorderEnt.set("desc", workorder.desc);
      workorderEnt.set("followTime", workorder.followTime);
      return this.store.findRecord('customer', workorder.customer.id).then(function (customer) {
        //首先把客户信息挂入到通话
        workorder.call.set("customer", customer);
        //填入相关任务
        return customer.get("task").then(function(task){
          workorder.call.set("task",task);
          return workorder.call.save().then(function () {
            console.log("workorder")
            workorderEnt.set("customer", customer);
            workorderEnt.set("call", workorder.call);
            console.log("call save over,workorderEnt", workorderEnt);
            //保存工单
            return workorderEnt.save();
          });
        });
      });
    }
  },

  actions: {
    saveCustomer(customer){
      console.log("saveCustomer in controller", customer);
      var _self = this;
      if (customer.id) {
        console.log("need update");
        this.store.findRecord("customer", customer.id).then(function (customerEnt) {
          _self.copyToEntity(customerEnt, customer);
          console.log("customerEnt in update:", customerEnt);
          customerEnt.save().then(function () {
            _self.set("customerEditMode", false);
          });
        });
        return;
      }
      var customerEnt = this.store.createRecord("customer", {});
      this.copyToEntity(customerEnt, customer);
      console.log("customerEnt in add:", customerEnt);
      customerEnt.save().then(function () {
        _self.set("customerEditMode", false);
      });
    },
    saveWorkorder(workorder){
      console.log("saveWorkorder in controller", workorder);
      var _self = this;
      var model = this.get("model");
      this.saveWorkorderEntity(workorder).then(function (workorderData) {
        console.log("workorderEnt saved:", workorderData);
        //保存后刷新当前页
        workorderData.get("customer").then(function (customer) {
          console.log("model in ", model);
          //修改model的客户属性，从而重构页面
          Ember.set(model, "customer", customer);
          _self.store.query("workorder", {filter: {customer: customer.id}}).then(function (workorders) {
            console.log("workorders in", workorders);
            Ember.set(model, "workorderList", workorders);
          });

        });
      });
    }
  }
});
