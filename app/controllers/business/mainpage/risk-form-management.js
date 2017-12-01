import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  mainController: Ember.inject.controller('business.mainpage'),
  nocustomerId:false,
  infiniteContainerName:"resultFormManagementContainer",
  uiCapa: Ember.inject.service("ui-capability"),
  recognizers: 'press tap',//移动端手势
  press(e) {
   e=e||window.event;
   if (e.stopPropagation) {
     e.stopPropagation();//IE以外
   } else {
     e.cancelBubble = true;//IE
   }
   console.log("press in",e);
   var target = e.target || e.srcElement;
  },

  tap(e) {
   console.log("tap in",e);
  },
  customerObs: function(){
    var _self = this;
    let id = this.get('id');
    var customerId = this.get("global_curStatus.healtyCustomerId");
    if(!customerId){
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }else{
      this.set("stopScroll",false);
    }
    this.store.query('risk-record-result',{filter:{model:{id:id,riskModel:{code:'pressureSores'}},customer:{id:customerId},delStatus:0},sort:{id:'desc'}}).then(function(resultList){
      _self.set('resultList',resultList);
      _self.set('feedService.riskRecordResultList',resultList);
      _self.hideAllLoading();
    });
    this.set("nocustomerId",false);
    this.set("customerId",customerId);

  }.observes("global_curStatus.healtyCustomerId","global_curStatus.pageBackTime",'queryFlag').on("init"),
  queryFlagIn:function(){
    this.incrementProperty('queryFlag');
  },
  actions:{
    addNewRecord(risk){
      let _self = this;
      let id = this.get('id');
      let elementId = "#add-form-record";
      if(risk){
        _self.get("mainController").switchMainPage('risk-result-record',{resultId:risk.get('id'),recordId:id});
        _self.incrementProperty('global_curStatus.formChange');
      }else{
        $(elementId).addClass("tapped");
        Ember.run.later(function(){
          $(elementId).removeClass("tapped");
          Ember.run.later(function(){
            let newResult = _self.store.createRecord('risk-record-result',{});
            let model = _self.get('feedService.recordModelList').findBy('id',id);
            newResult.set('model',model);
            newResult.set('customer',_self.get("global_curStatus.healtyCustomer"));
            console.log('save new result 000000');
            newResult.save().then(function(result){
              _self.get("mainController").switchMainPage('risk-result-record',{recordId:id,resultId:result.get('id')});
            });
          },100);
        },200);

      }

    },
    switchShowAction(){
      this.directInitScoll();
    },
    //删除遮罩
    showDelBut(result){
      this.set('showDelButFlag',true);
      this.get('resultList').forEach(function(res){
        res.set('toDelStatus',false);
      })
      result.set('toDelStatus',true)
      console.log('come in showDelBut');
    },
    hideDelBut(){
      this.set('showDelButFlag',false);
    },
    delById(result){
      let _self = this;
      let elementId = "#risk-form-management-mobile-del-" + result.get('id');
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          result.set('delStatus',1);
          _self.get("global_ajaxCall").set("dur-noprevent","yes");
          result.save().then(function(){
            App.lookup("controller:business").popTorMsg("删除成功");
            var route = App.lookup('route:business.mainpage.risk-form-management');
            App.lookup('controller:business.mainpage').refreshPage(route);
            _self.incrementProperty('global_curStatus.pageBackTime');
          });
        },100);
      },200);
    }
  },
});
