import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  model() {
    this.set('header_title','知识库信息查看及维护');
    var managementList;
    var curTask= this.get("global_curStatus").getTask();
    if(!curTask||!curTask.get("id")){
      return ;
    }
    var curUser=this.get('global_curStatus').getUser();
    if(curUser.get('role').get('id')==='2'){
      curTask = this.get("global_curStatus").getTask().get('task');
    }else {
      curTask = this.get("global_curStatus").getTask();
    }
    var params = this.buildQueryParams();
    managementList = this.findPaged('knowledge-base',params);
    return Ember.RSVP.hash({
      curTask:curTask,
      managementList: managementList
    });
  },
  doQuery: function(){
    var params = this.buildQueryParams();
    var managementList = this.findPaged('knowledge-base',params,function(rows){
      console.log("get managementList in rows is",rows);
    });
    this.getCurrentController().set("managementList",managementList);
  },
  buildQueryParams: function(){
    var params = this.pagiParamsSet();
    var curController = this.getCurrentController();
    // var curTask = this.get("global_curStatus").getTask().get('task');
    var curUser=this.get('global_curStatus').getUser();
    var curTask;
    if(curUser.get('role').get('id')==='2'){
      curTask = this.get("global_curStatus").getTask().get('task');
    }else {
      curTask = this.get("global_curStatus").getTask();
    }
    var filter= {task:{id:curTask.get("id")},'delStatus':0};
    var sort={updateTime:'desc'};//降序
    if(curController&&curController.get("endTime")){
      var endTime=curController.get("endTime");
      var endTimeStr = this.change(endTime);
      filter= $.extend({},filter,{'updateTime@$lte':startTimeStr,'updateTime@$gte':endTimeStr});
    }//结束时间
    if(curController&&curController.get("startTime")){
      var startTime=curController.get("startTime");
      var startTimeStr = this.change(startTime);
      filter= $.extend({},filter,{'updateTime@$lte':startTimeStr,'updateTime@$gte':endTimeStr});
    }//开始时间
    if(curController&&curController.get("tasksname")){
      filter= $.extend({},filter,{'title@$like':curController.get("tasksname")});
    }//搜索框
    params.sort=sort;
    params.filter = filter;
    return params;
  },
  change:function (time){
    var date = new Date();
    console.log("timeget1",time);
    date.setFullYear(time.substring(0,4));
    date.setMonth(time.substring(5,7)-1);
    date.setDate(time.substring(8,10));
    date.setHours(time.substring(11,13));
    date.setMinutes(time.substring(14,16));
    date.setSeconds(time.substring(17,19));
    return Date.parse(date)/1000;
  },//是时间转换器
  setupController: function(controller,model){
    this._super(controller, model);
    this.defineController(controller,model);
  },
  defineController: function(controller,model){
    var _self = this;
    controller.reopen({
      dateService: Ember.inject.service('date-service'),
      actions:{
        beginOver(){
          _self.doQuery();
        },//按时间搜索
        searchta: function() {
          _self.doQuery();
        },//搜索框（标题）
      }
    });
    controller.setProperties(model);//设置页面属性
  },
  actions:{
    reloadModel:function(){
      this.refresh();
    },
  }
});
