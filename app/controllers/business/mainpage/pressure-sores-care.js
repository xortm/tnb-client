import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  mainController: Ember.inject.controller('business.mainpage'),
  nocustomerId:false,
  infiniteContainerName:"pressureCareContainer",
  actions:{
    toEvaluation(){
      let _self = this;
      $('#evaluate-check').addClass("tapped");
      Ember.run.later(function(){
        $('#evaluate-check').removeClass("tapped");
        Ember.run.later(function(){
          _self.get("mainController").switchMainPage('evaluation-info');
        },100);
      },200);

    },
    toRiskForm(risk,itemId){
      let _self = this;
      let elementId = "#consultation-management-mobile-" + itemId;
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          _self.get("mainController").switchMainPage('risk-form-management',{id:risk.get('id')});
        },100);
      },200);
    },
    switchShowAction(){
    },
  },
});
