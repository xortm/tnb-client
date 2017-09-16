import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title: "我的擅长领域",
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
    _self.store.findRecord("userPrivate",curUser.get("id")).then(function(userEnt){
      model.set("curUser",userEnt);
      _self.store.query("dicttype",{filter:{typegroup:{typegroupcode:'tasktype'},'remark@$or1---1':1,'remark@$or1---2':2}}).then(function(cstags) {
        model.set("cstag",cstags);
        if(model.get("curUser.cstag")){
          model.get("curUser.cstag").forEach(function(lan){
            lan.set('checked',true);
          });
        }
      });
    });
  },
});
