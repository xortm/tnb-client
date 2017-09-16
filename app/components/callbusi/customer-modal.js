import Ember from 'ember';

export default Ember.Component.extend({
  statusService: Ember.inject.service("current-status"),
  curId: Ember.computed(function(){
    var curUser = this.get("statusService").getUser();
    console.log('in role curuser.role',curUser.get('role').get('id'));
    return curUser.get('role').get('id');
  }),
  nosex: Ember.computed('customer.sex',function() {
    if(!this.get('customer.sex')) {
      return true;
    }
    return false;
  }),
  sex1: Ember.computed('customer.sex',function() {
    if(this.get('customer.sex') === 1) {
      return true;
    }
    return false;
  }),
  sex2: Ember.computed('customer.sex',function() {
    if(this.get('customer.sex') === 2) {
      return true;
    }
    return false;
  }),
  numbers:Ember.computed(function () {
    var ary = [];
    for(var i = 1 ; i<=100; i++){
      ary.push(i);
    }
    console.log("ary",ary);
    // this.set('numbers',ary);
    return ary;
  }),
  birthdayShow:Ember.computed('customer.birthdayShow',function(){
    var birthdayDate = this.get('customer.birthdayShow');
    console.log('birthdayDate',birthdayDate);
    if(birthdayDate){
      return birthdayDate;
    }else {
      return "2000-01-01";
    }
  }),
  // saveDisabled: Ember.computed(function() {
  //   if(this.get('customer.name')&&this.get('customer.phone')) {
  //     return false;
  //   }
  //   else {
  //     return true;
  //   }
  // }).property('customer.name','customer.phone'),

  actions:{
    /**
    * 保存客户
    * liantengfei
    * 2016/7/22
    */
    saveCustomer:function(customer) {
      var phone = /(^1\d{10}$)/.test(this.get('customer.phone')),//手机号
          telephone = /^\d{2,5}-\d{7,8}$/.test(this.get('customer.phone'));//座机号
      if(!this.get('customer.name')) {
        this.set('responseInfo','请输入客户姓名！');
        return;
      }
      else if (!telephone&&!phone) {
        this.set('responseInfo','请输入正确的手机号或座机号:区号-固定电话！');
        return;
      }
      else if (this.get('customer.email')&&(!(/^\w+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(this.get('customer.email'))))) {
        this.set('responseInfo','请输入正确的邮箱地址！');
        return;
      }
      else if (this.get('customer.email')&&(!(/^\w+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(this.get('customer.email'))))) {
        this.set('responseInfo','请输入正确的邮箱地址！');
        return;
      }
      this.set('responseInfo','');
      var _self = this;
      if(!this.get('saveDisabled')) {
        this.set('saveDisabled',true);
        console.log('save customer',customer);
        this.set("customer.birthdayShow",this.get('birthdayShow'));
        this.sendAction('saveCustomer',customer);
      }
    },
    typeAge:function(value){//年龄设置
      this.set('customer.age',value);
     },
    /**
    * 取消客户编辑
    * liantengfei
    * 2016/7/22
    */
    cancelCustomerChange:function() {
      this.sendAction('cancelCustomerChange');
    },

    /**
    * 性别选择
    * liantengfei
    * 2016/7/22
    */
    sexSelect:function(value) {
      this.set('customer.sex',value);
    },
    changeInfo: function() {
      this.set('responseInfo','');
    },
  }
});
