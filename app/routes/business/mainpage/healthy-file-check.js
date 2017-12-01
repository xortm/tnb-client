import Ember from 'ember';
import BaseBusiness from '../base-business';

// const {healthExamType9,healthExamType8,healthExamType7} = Constants;
export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  model(){
    console.log("HealthyFileCheck model");
    var model = Ember.Object.create({});
    return model;
  },

  setupController: function(controller,model){
    this._super(controller,model);
    // var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    // var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
    // var curUser = this.get("statusService").getUser();//curUser
    // var curUserId = curUser.get("id");//获取居家curUserId
    // // filter:{
    // //   'itemtype---1':{'typecode@$or1---1':Constants.healthExamType9},
    // //   'itemtype---2':{'typecode@$or1---2':Constants.healthExamType8},
    // //   'itemtype---3':{'typecode@$or1---3':Constants.healthExamType7},
    // // }
    // var _self = this;
    // var params = {
    //   filter:{
    //   examUser:{id:curCustomerId},
    //   }
    // };
    // _self.store.query('health-info',params).then(function(healthInfoList){
    //   var sortByOver = healthInfoList.sortBy("examDateTime");//排序
    //   console.log("sortByOver",sortByOver);
    //   console.log("healthInfoList model",healthInfoList);
    //   controller.set("healthInfoList",sortByOver);
    // });

  },

});
