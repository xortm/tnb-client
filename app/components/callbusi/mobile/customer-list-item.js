import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  statusService: Ember.inject.service("current-status"),
  customer:null,//客户数据

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
