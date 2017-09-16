import Ember from 'ember';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend({
  detailEdit: false,
  //未选成员列表
  customerNameList:Ember.computed('staffCustomerList.@each.hasSelected',function(){
    var staffCustomerList=this.get('staffCustomerList');
    return staffCustomerList.filter(function(customer){
      return !customer.get('hasSelected');
    });
  }),
  //已选成员列表
  chooseCustomer:Ember.computed('staffCustomerList.@each.hasSelected',function(){
    var staffCustomerList=this.get('staffCustomerList');
    return staffCustomerList.filter(function(customer){
      return customer.get('hasSelected');
    });
  }),
  //已选成员名字
  chooseCustomerStr:Ember.computed('chooseCustomer',function(){
    var chooseCustomerList=this.get('chooseCustomer');
    var str = "";
    console.log('chooseCustomerList is',chooseCustomerList);
    chooseCustomerList.forEach(function(customer){
      str = str + customer.get("name") + "，";
    });
    console.log('str_self',str);
    return str;
  }),
  chooseCustomerName:Ember.computed('chooseCustomer',function(){
    var chooseCustomer=this.get('chooseCustomer');
    chooseCustomer.filter(function(customer){
      return customer.name;
    });
  }),

  actions:{
    invalid() {
        //alert("error");
    },
    //保存已选客户
    saveStaffCustomer(){
      // var staffCustomerInfo=this.get('staffCustomerInfo');
      // console.log('staffCustomerInfo_self',staffCustomerInfo);
      var editMode=this.get('editMode');
      let _self = this;
      let servArr = [];
      var count = 0;
            //修改编辑已有客户
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                // var customerNameList=_self.get('customerNameList');
                // //保存已选客户列表
                // var chooseCustomer=_self.get('chooseCustomer');
                // chooseCustomer.forEach(function(customer){
                //   var item=chooseCustomer.findBy('id',customer.get('id'));
                //   item.set('hasSelected',true);
                //
                //   let staffcustomers = _self.store.createRecord('staffcustomer',{});
                //   console.log('staff name:',_self.get('curStaff.id'));
                //     staffcustomers.set('staff',_self.get('curStaff'));
                //       staffcustomers.set('customer',customer);
                //       // staffcustomers.set('remar',remar);
                //       staffcustomers.save().then(function(){
                //         console.log('save success!!');
                //       });
                // });
                // _self.set('detailEdit',false);
                // var route=App.lookup('route:business.mainpage.customer-nursing-setting');
                // App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面

                let chooseCustomer = this.get('chooseCustomer');//当前已选的所有顾客
                console.log('当前选择项目：',this.get('chooseCustomer'));
                chooseCustomer.forEach(function(customer){
                  let item=chooseCustomer.findBy('id',customer.get('id'));
                  item.set('hasSelected',true);
                  // let service=_self.store.createRecord('nursingplanitem',{});
                  let service={};
                  service.customer = customer.get('id');
                  service.staff = _self.get('curStaff.id');
                  servArr = servArr.concat(service);
                  console.log('json:',servArr);
                });
                if(servArr.length===0){
                  let service={};
                  service.staff = _self.get('curStaff.id');
                  service.customer = '';
                  servArr = servArr.concat(service);
                }
                //将护理项目保存为json
                let serviceJson = JSON.stringify(servArr);
                console.log('jsonData:',serviceJson,servArr);
                let serviceJsonModel = this.store.createRecord('jsonmodel',{});
                serviceJsonModel.set('jsonData',serviceJson);
                serviceJsonModel.set('type','staffcustomer');
                serviceJsonModel.save().then(function(){
                  console.log('save success!!');
                  _self.set('detailEdit',false);
                  var route=App.lookup('route:business.mainpage.customer-nursing-setting');
                  App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
                });
    },
    //编辑按钮
    detailEditClick:function(){
      this.set('detailEdit',true);
    },
    //取消按钮
    detailCancel:function(){
        this.set('detailEdit',false);
        var route=App.lookup('route:business.mainpage.customer-nursing-setting');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },

    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //选中客户
    changeStaffType(itemCode){
      let item = this.get('customerNameList').findBy('id',itemCode);
      item.set('hasSelected',true);
    },
    //取消选中客户
    changeStaffBack(itemCode){
      var item = this.get('chooseCustomer').findBy('id',itemCode);
      item.set('hasSelected',false);
      console.log('cur:',this.get('chooseCustomerStr'));
    },

  }
});
