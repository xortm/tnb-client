import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

export default BaseItem.extend({
  constants: Constants,
  actions:{
    //弹窗取消
    invitation(){
      this.sendAction('close');
    },
    //保存項目
    saveService(serviceLevelInfo){
      var _self=this;
      var services=this.get('serviceLevelInfo.services');
      var count=0;
        App.lookup('controller:business.mainpage').openPopTip("正在保存");
      services.forEach(function(service){
        service.set('frequency',service.get("frequency"));
        service.set('period',service.get("period"));
        service.save().then(function(serv){
        });
        count++;
      });
      if(count==services.get('length')){
        App.lookup('controller:business.mainpage').showPopTip("保存成功");
        _self.set('editService',false);
        _self.sendAction('close');
      }
    },

  }
});
