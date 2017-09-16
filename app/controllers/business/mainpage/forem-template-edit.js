import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const {
    educationLevelPrimary,
    educationLevelJunior,
    educationLevelSenior,
    educationLevelUniversity,
    inPreference
} = Constants;

export default Ember.Controller.extend(InfiniteScroll, {
    infiniteContentPropertyName: "selfChooseList",
    infiniteModelName: "dicttype",
    infiniteContainerName: "consultEditContainer",
    dateService: Ember.inject.service('date-service'),
    dataLoader: Ember.inject.service("data-loader"),
    feedService: Ember.inject.service('feed-bus'),
    constants: Constants,
    scrollPrevent:true,
    mainController: Ember.inject.controller('business.mainpage'),
    resultObs:function(){
      let result = this.get('feedService.curResult');
      this.set('result',result);
    }.observes('feedService.curResult').on('init'),
    nowDate:Ember.computed('result',function(){
      if(!this.get('result')){
        return ;
      }
      let recordTime = this.get('result.recordTime');
      let nowDate = this.get("dateService").formatDateT(recordTime, "yyyy-MM-dd hh:mm");
      return nowDate;
    }),
    actions: {
      saveUser(user){
        let _self = this;
        let result = this.get('result');
        if(this.get('editType')=='staff'){
          result.set('user',user);
        }
        if(this.get('editType')=='date'){
          result.set('recordTime',user);
        }
        result.save().then(function(result){
          App.lookup('controller:business').popTorMsg('保存成功');
          _self.get("mainController").switchMainPage('risk-result-record',{resultId:result.get('id')});
          _self.incrementProperty('global_curStatus.formChange');
        });
      },
    },
});
