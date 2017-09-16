import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
// header_title:'我的',
  model(){
    console.log("healthy-file-test model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);

    // var curUser = this.get("global_curStatus").getUser();//拿到数据
    // console.log("mode in setupController",curUser);
    //controller.set("curUser",curUser);
     var _self = this;
    // model.set("curUser",curUser);
    // _self.store.query("customerExtend",{
    //
    // }).then(function(customerExtendList){
    //
    // });
  },

});
