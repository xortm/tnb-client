import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title: "个人信息",
  model(){
    console.log("csinfo model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    var _self = this;
    this._super(controller,model);
    console.log("mode in setupController",model);
    var curUser = this.get("global_curStatus").getUser();//拿到数据
    model.set("curUser",curUser.get("employee"));
    console.log("curUser",curUser);
    console.log("curUser staffSex:",curUser.get("staffSex.typename"));
    console.log("curUser staffCensus:",curUser.get("staffCensus"));
    console.log("curUser staffCensus11:",curUser.get("staffCensus.typename"));
    console.log("curUser staffNation:",curUser.get("staffNation"));
    console.log("curUser staffNation11:",curUser.get("staffNation.typename"));
    // this.store.findRecord("user",curUser.get("id")).then(function(userEnt){
    //   model.set("curUser",userEnt);
    //   console.log("curUser.get curUser",userEnt);
    // });
  },
});
