import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service("store"),
  statusService: Ember.inject.service("current-status"),
  global_curStatus: Ember.inject.service("current-status"),
  customer:null,//客户数据
  didInsertElement:function(){
    console.log('global_curStatus.isJujia',this.get('global_curStatus.isJujia'));
    if(this.get("global_curStatus.isJujia")){
        this._super(...arguments);
        var curCustomer = this.get("customer");
        var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
        var _self = this;
        _self.get('store').query("relCustomerScheme",{
            filter:{
                customer:{id:curCustomerId},
            },
        }).then(function(relCustomerSchemeList){
            relCustomerSchemeList.forEach(function(relCustomerScheme) {
                console.log("relCustomerScheme init",relCustomerScheme);
                var typecode = relCustomerScheme.get('scheme.type.typecode'); //体检类型
                if (typecode == 'schemeType1') {
                    //获取膳食方案
                    _self.set('dictScheme',relCustomerScheme);
                }
                if (typecode == 'schemeType2') {
                    //获取运动方案
                    _self.set('sportScheme',relCustomerScheme);
                }
                if (typecode == 'schemeType5') {
                    //获取中医方案
                    _self.set('medicineScheme',relCustomerScheme);
                }
            });
        });
    }
  },
  curId: Ember.computed(function(){
    var curUser = this.get("statusService").getUser();
    console.log('in role curuser.role',curUser.get('role').get('id'));
    return curUser.get('role').get('id');//这里get('role');role是use.js modul定义好的
  }),
  actions:{
    goDetail(customer){
      console.log('customer.click',customer);
      this.sendAction("goDetail",customer);
    }
  }
});
