import Ember from 'ember';
import BaseBusiness from '../base-business';


var routeClass = BaseBusiness.extend({
  dateService: Ember.inject.service('date-service'),
  model() {
    var model = Ember.Object.create({});
    //返回任务信息
    var _self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var curStatusService = _self.get("global_curStatus");
      var task = curStatusService.getTask();
      console.log("line user model,task:",task);
      if(!task||!task.get("id")){
        resolve(model);
        return;
      }
      console.log("need set title:" + task.get("task").get("title"));
      _self.set("header_title",task.get("task").get("title"));
      //for test
      //task.get("task").set("runstatus",1);//进行状态：1已开始，0未开始
      model.set("curTask",task);
      var applyworktimes = model.get('curTask').get('applyWorktimes');
      applyworktimes = applyworktimes.sortBy("worktime.section");
      model.set('applyWorktimes',applyworktimes);
      console.log('applyworktime get in js',applyworktimes);
      console.log('applyworktime get in js model',model.get('applyWorktimes'));
      resolve(model);
    });
  },
  //改变签入状态
  changeSignStatus: function (signstatus,signtime) {
    var _self = this;
    var curTask = this.get("global_curStatus").getTask();
    console.log("curTask is" + curTask.get("id"));
    this.store.findRecord("userTask",curTask.get("id")).then(function(userTask){
      userTask.set("signstatus",signstatus);
      if(signstatus===1){
        userTask.set("clientSigntime",signtime);
      }
      //设置
      _self.get("global_ajaxCall").set("action",Constants.action_sign);
      userTask.save().then(function(userTaskBack){
        console.log("userTaskBack:" , userTaskBack);
        _self.modelFor(_self.routeName).set("curTask",userTask);
        //放入全局
        _self.get("global_curStatus").set("task",userTask);
      });
    });
  },

  actions:{
    //签入
    checkin(){
      var signtime = this.get("dateService").getCurrentTime();
      console.log("signtime:" + signtime);
      this.changeSignStatus(1,signtime);
    },
    checkout(){
      this.changeSignStatus(0);
    }
  }
});
export default routeClass;
