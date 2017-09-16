import Ember from 'ember';

export default Ember.Component.extend({
  dateService: Ember.inject.service("date-service"),
  actions:{
    search(flag){
      this.sendAction('search',flag);
    },
    changeBeginDateAction(date) {
        this.sendAction('changeBeginDateAction',date);
    },
    changeEndDateAction(date) {
        this.sendAction('changeEndDateAction',date);
    },
    dpShowAction(e){

    },
    //显示时间选择器
    showDate() {
        this.get("controller").set('dateShow', true);
    },
    //隐藏时间选择器
    hideDate() {
        this.get("controller").set('dateShow', false);
    },
    submmit(){
      this.sendAction('submmit');
      console.log('is sybmmit?');
    },
    emptied(){
      this.sendAction('emptied');
    }
  }
});
