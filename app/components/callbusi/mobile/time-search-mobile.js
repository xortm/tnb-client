import Ember from 'ember';

export default Ember.Component.extend({
  dateService:Ember.inject.service('date-service'),
  global_curStatus:Ember.inject.service('current-status'),
  actions:{
    invitation(){
      this.set('showFlag',false);
    },
    showTimeChoose(){
      if(this.get('showFlag')){
        this.set('showFlag',false);
      }else{
        this.set('showFlag',true);
        Ember.run.schedule('afterRender',function(){
          $('#FromDate').trigger('click').focus();
        });
      }
    },
    searchDate(){
      let _self = this;

      Ember.run.schedule('afterRender',function(){
        let date = $('#FromDate').val();
        _self.set('date',date);
        let lastSecond = _self.get('dateService').getLastSecondStampOfDayString(date);
        let firstSecond = _self.get('dateService').getFirstSecondStampOfDayString(date);
        _self.set('showFlag',false);
        _self.set('global_curStatus.searchTimeFirst',firstSecond);
        _self.set('global_curStatus.searchTimeLast',lastSecond);
        _self.sendAction('searchTimeChange');
        _self.set('date',null);
      });

    },
  }
});
