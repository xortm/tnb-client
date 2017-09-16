import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
header_title:'我的',
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
    console.log("curUser in csinfo:",curUser);
    model.set("curUser",curUser.get("employee"));
  }

});
