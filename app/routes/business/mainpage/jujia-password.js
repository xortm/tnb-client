import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  model(){
    // var model = Ember.Object.create({});
    // return model;
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
    // console.log("mode in setupController",model);
    // var curUser = this.get("global_curStatus").getUser();//拿到数据
    // console.log("curUser1111:",curUser);
    // var _self = this;
    // _self.store.findRecord("userPrivate",curUser.get("id")).then(function(userEnt){
    //   controller.set("curUser",userEnt);
    //   console.log("curUser2222:",userEnt);
    // });
  },
});
