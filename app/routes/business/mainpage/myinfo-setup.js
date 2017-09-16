import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title: "设置",
  model(){
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
    });
  },
});
