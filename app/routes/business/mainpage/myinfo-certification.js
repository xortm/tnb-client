import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title: "我的认证",
  // queryParams: {
  //   source: {
  //     refreshModel: true
  //   }
  // },
  model(){
    console.log("csinfo model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);
    console.log("mode in setupController",model);
    var curUser = this.get("global_curStatus").getUser();//拿到数据
    var _self = this;
    _self.store.query("account",{filter:{user:{id:curUser.get("id")}}}).then(function(accounts){
      model.set("accountUser",accounts.get("firstObject"));
    });
    _self.store.findRecord("userPrivate",curUser.get("id")).then(function(userEnt){
      if( curUser.get('status') !== 1 && curUser.get('status') !== 4){
        //隐藏保存图标
        _self.get("global_pageConstructure").set("hideHeaderFunc",true);
      }
      model.set("curUser",userEnt);
    });
  },
  actions:{
    reloadModel:function(){
      this.refresh();
    },
  }
  });
