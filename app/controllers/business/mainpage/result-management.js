import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  mainController: Ember.inject.controller('business.mainpage'),
  infiniteContainerName:"resultManagementContainer",
  scrollPrevent:true,
  customerObs: function(){
    var _self = this;
    var customerId = this.get("global_curStatus.healtyCustomerId");
    if(!customerId){
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }else{
      this.set("stopScroll",false);
    }
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    let allAnswerList = this.get('feedService.allResultAnswers');
    this.store.query('evaluateresult',{filter:{customer:{id:customerId},model:{riskAssessModel:{code:'pressureSores'},useFlag:0,delStatus:0}},sort:{createDateTime:'desc'}}).then(function(resultList){
      let list = new Ember.A();
      resultList.forEach(function(result,index){
        if(index>0){
          list.pushObject(result);
        }
      });
      _self.set('resultList',list);
      _self.hideAllLoading();
      _self.directInitScoll(true);
    });

  }.observes('global_curStatus.evaluateComputed',"global_curStatus.healtyCustomerId").on("init"),
  actions:{
    addNewEva(result){
      this.get("mainController").switchMainPage('evaluate-template',{editModel:'edit',id:result.get('id'),resultId:result.get('id')});
      this.incrementProperty('global_curStatus.curResultSave');
    },
    delById(result){
      let _self = this;


      let elementId = "#result-management-mobile-del-" + result.get('id');
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          result.set('delStatus',1);
          result.save().then(function(){
            App.lookup("controller:business").popTorMsg("删除成功");
            _self.incrementProperty('global_curStatus.evaluateComputed');
            var route = App.lookup('route:business.mainpage.result-management');
            App.lookup('controller:business.mainpage').refreshPage(route);
          });
        },100);
      },200);
    },
    //返回
    returnInfo(){
      this.get("mainController").switchMainPage('evaluation-info');
    },
    switchShowAction(){

    },
  },
});
