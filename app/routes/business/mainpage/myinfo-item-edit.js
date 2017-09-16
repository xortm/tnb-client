
import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  queryParams: {
    source: {
      refreshModel: true
    }
  },
  model(params){
    // this.set('header_title','修改');
    var curUser = this.get("global_curStatus").getUser();//拿到数据
    var model = {isInCrumb: false};
    model.curUser = curUser;
    return model;
  },
  doQuery(){
    var controller = this.getCurrentController();
    controller.set('succeed',null);
    var curUser = this.get("global_curStatus").getUser();
    var source = controller.get("source");
    var _self = this;
    this.store.findRecord('user',curUser.get("id")).then(function(curUser){
      if(source === 'name'){
        controller.set('edit' ,curUser.get('name'));
        _self.set('header_title','修改姓名');
      }else if(source === 'age'){
        controller.set('edit' ,curUser.get('age'));
        _self.set('header_title','修改年龄');
      }else if(source === 'staffCardCode'){//身份证号码
        console.log("curUser.get  code",curUser.get('staffCardCode'));
        console.log("curUser.get  code",curUser.staffCardCode);
        console.log("curUser.get  curUser",curUser);
        controller.set('edit' , curUser.get('staffCardCode'));
        _self.set('header_title','身份证号码');
      }else if(source === 'staffTel'){
        controller.set('edit' , curUser.get('staffTel'));
        _self.set('header_title','修改手机号');
      }else if(source === 'staffMail'){
        controller.set('edit' , curUser.get('staffMail'));
        _self.set('header_title','修改邮箱');
      }else if(source === 'curAddress'){//家庭住址
        controller.set('edit' , curUser.get('curAddress'));
        _self.set('header_title','修改家庭住址');
      }
    });
  },
  setupController: function(controller,model){
    this._super(controller,model);
    this.doQuery();
  },

});
