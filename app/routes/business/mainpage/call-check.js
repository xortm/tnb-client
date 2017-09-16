import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default BaseBusiness.extend(Pagination,{
  model() {
    return {};
  },
  doQuery: function(){
    console.log('defaultCallaaaaaa');
    var _self = this;
    var oldcall = this.getCurrentController().get('call');
    var curController = this.getCurrentController();
    if(oldcall){
      console.log('oldcall get in js',oldcall);
      oldcall.set('hasSelected',false);
    }//设置上一工单中的已选中为不选中
      if(curController.get('curTask')){
        var params = this.buildQueryParams();//拼查询条件
        var callList = this.findPaged('call',params,function(){
          console.log("call find after");
        });
        callList.then(function(list){
          var call = list.get('firstObject');
          console.log('firstObjectget in route ',call);
          _self.getCurrentController().send('changeCallItem',call);
        });
        this.getCurrentController().set("callList",callList);
      }
    // console.log('chushihua',this.getCurrentController().get('callList').get('firstObject'));
  },
  buildQueryParams: function(){
    var _self = this;
    var params = this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter = {};
    var curUser = this.get("global_curStatus").getUser();
    var curTask = this.get("global_curStatus").getTask();
    console.log('curtaskhhh',curTask);
    // filter = $.extend({}, filter, {agent:{id:curUser.get('id')}});
    if(curTask && curTask.get('id')){
      filter = $.extend({}, filter, {task:{id:curTask.get('id')}});
    }
    if(curController&&curController.get("directionSel")){
      filter = $.extend({}, filter, {direction:this.getCurrentController().get("directionSel.id")});
    }
    if(curController&&(curController.get('a')||curController.get('b'))){
      filter = $.extend({},filter,{'createTime@$lte':curController.get('a'),'createTime@$gte':curController.get('b')});
    }
    if(curController&&curController.get('callname')){
      var name = curController.get('callname');
      console.log('searchcall name',name);
      filter = $.extend({},filter,{customer:{'name@$like@$or1':name},'callingNumber@$like@$or1':name,'calledNumber@$like@$or1':name});
    }
    if(curController&&curController.get('callname')){
      var name = curController.get('callname');
      console.log('hahaha');
      filter = $.extend({},filter,{agent:{'name@$like@$or1':name},'callingNumber@$like@$or1':name,'calledNumber@$like@$or1':name});
  console.log('hahahajjjjj');
    }
    params.filter = filter;
    var sort = {createTime:"desc"};
    params.sort = sort;
    console.log("params is:",params);
    return params;
  },

  //设置controller信息，不再单独建立controller文件
  setupController: function(controller,model){//默认自动执行，且每次页面有变化都会执行
    this._super(controller, model);
    var task = this.get("global_curStatus").getTask();
    this.defineController(controller,model);

    if(task && task.get('id')){
      controller.set("curTask",task);
      this.set('header_title',task.get('title'));
    }
    this.doQuery();
    this.defineController(controller,model);
    console.log("controller in",controller);
    //呼叫类型
    controller.set("directions",[{
      id:1,
      text: "呼入"
    },{
      id:2,
      text: "呼出"
    }]);
  },

  defineController: function(controller,model){
    console.log('defineController in');
    var _self = this;
    controller.reopen({
      // curtask : this.get("global_curStatus").getTask().get('task'),//获取当前任务用于判断
      dateService: Ember.inject.service('date-service'),
      // chooseDateFrom:Ember.computed(function(){
      //   var date = new Date();
      //   var format = ("YYYY-MM-DD");
      //   return moment(date).format(format);
      // }),
      chooseDateTo:Ember.computed(function(){
        var date = new Date();
        var format = ("YYYY-MM-DD");
        return moment(date).format(format);
      }),
      // directionSel: null,
      actions:{
        dirSelect(direction){
          console.log("dirSelect in:" , direction);
          this.set("directionSel",direction);
          _self.doQuery();
        },
        changeCallItem: function(call){//类似displayDetail
          var _self = this;
          var curCall = this.get("call");
          // this.get("callList").forEach(function(callItem){
            //重置原来的选择项
            if(curCall&&curCall.get("id")){
              console.log('in if now workOrderbefore exist');
              curCall.set("hasSelected",false);
            }
            //设置新的选择项
            if(call){
            if(call.get("id")){
              call.set("hasSelected",true);
              this.store.findRecord('customer',call.get('customer').get('id')).then(function(cus){
                _self.set('phoneHide',cus.get('phoneHidden'));
              });
            }
          }
          // });

          this.set("call",call);
        },
        choosetime(){
          console.log('choose time ');
          function change(time){
            var date = new Date();
            date.setFullYear(time.substring(0,4));
            date.setMonth(time.substring(5,7)-1);
            date.setDate(time.substring(8,10));
            date.setHours(time.substring(11,13));
            date.setMinutes(time.substring(14,16));
            date.setSeconds(time.substring(17,19));
            return Date.parse(date)/1000;
          }
          var endTime = this.chooseDateTo;
          var a = this.get('dateService').getLastSecondStampOfDayString(endTime);
          var beginTime = this.chooseDateFrom;
          var b = change(beginTime);
          this.set('a',a);
          this.set('b',b);
          console.log('aaabbb a',_self.get('a'));
          _self.doQuery();
        },

        searchcall(){
          console.log('searchcall in');
          _self.doQuery();
        },
      }
    });
    controller.setProperties(model);
    if(controller.get('curTask')){
    controller.get('callList').then(function(calllist){
      var call = calllist.get('firstObject');
      controller.send('changeCallItem',call);
    });
    }
  },
});
