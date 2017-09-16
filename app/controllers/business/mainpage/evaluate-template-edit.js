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
    mainController: Ember.inject.controller('business.mainpage'),
    nowDate:Ember.computed('result',function(){
      if(!this.get('result')){
        return ;
      }
      let createDateTime = this.get('result.createDateTime');
      let nowDate = this.get("dateService").formatDateT(createDateTime, "yyyy-MM-dd hh:mm");
      return nowDate
    }),
    actions: {
      saveUser(user){
        let _self = this;
        let result = this.get('result');
        if(this.get('editType')=='staff'){
          result.set('user',user);

        }
        if(this.get('editType')=='date'){
          result.set('createDateTime',user);
        }
        result.save().then(function(result){
          _self.incrementProperty('global_curStatus.evaresultChange');
          App.lookup('controller:business').popTorMsg('保存成功');
          _self.get("mainController").switchMainPage('evaluate-template',{resultId:result.get('id')});


        });
      },
    },
});
