import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title:' 关于公司',
  model(){
    var curUser = this.get("global_curStatus").getUser();//全局变量
    var model = {isInCrumb: false};
    var _self = this;
    console.log("build model");
    return new Ember.RSVP.Promise(function (resolve, reject){
      _self.store.findRecord("userPrivate",curUser.get("id")).then(function(userEnt){
        model.curUser = userEnt;
        _self.store.query("account",{filter:{user:{id:curUser.get("id")}}}).then(function(accounts){
          model.accountUser=accounts.get("firstObject");
          resolve(model);
        })
      });
    });
  },
  setupController: function(controller,model){
    this._super(controller,model);
    controller.set("errorText","");
    controller.set("errorText1","");
    controller.set("errorText2","");
    controller.set("errorText3","");
    controller.set("errorText4","");
  },
  // model(){
  //   console.log("csinfo model");
  //   var model = Ember.Object.create({});
  //   return model;
  // },
  // setupController: function(controller,model){
  //   this._super(controller,model);
  //   console.log("mode in setupController",model);
  //   var curUser = this.get("global_curStatus").getUser();//拿到数据
  //   var _self = this;
  //   _self.store.findRecord("userPrivate",curUser.get("id")).then(function(userEnt){
  //     model.set("curUser",userEnt);
  //     _self.store.query("account",{filter:{user:{id:curUser.get("id")}}}).then(function(accounts){
  //       model.set("accountUser",accounts.get("firstObject"));
  //     });
  //   });
  //   controller.set("errorText",null);
  //   controller.set("errorText1",null);
  //   controller.set("errorText2",null);
  // },
  actions:{
    editCancel: function() {
      var curController = this.getCurrentController();
      curController.set('editEnd',false);
      curController.set("isDisabled",true);
      curController.set('name',curController.get('model.curUser').get('name'));
      curController.set('address',curController.get('model.curUser').get('address'));
      curController.set('phone',curController.get('model.curUser').get('phone'));
      curController.set('weixin',curController.get('model.curUser').get('weixin'));
      curController.set('idcardNum',curController.get('model.curUser.edinfo').get('idcardNum'));
      curController.set('legalname',curController.get('model.curUser.edinfo').get('legalname'));
      curController.set('entIdNumber',curController.get('model.curUser.edinfo').get('entIdNumber'));
      curController.set('legalTel',curController.get('model.curUser.edinfo').get('legalTel'));
      curController.set('entIdAddress',curController.get('model.curUser.edinfo').get('entIdAddress'));
      curController.set('entName',curController.get('model.curUser').get('entName'));
      curController.set('introduce',curController.get('model.curUser').get('introduce'));
    },//取消
  }
});
