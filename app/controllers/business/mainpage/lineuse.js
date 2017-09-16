import Ember from 'ember';

export default Ember.Controller.extend({
  dateService: Ember.inject.service('date-service'),

  init: function(){
    var timestamp = 1465027249;
    var datetime = this.get("dateService").timestampToTime(timestamp);
    console.log("datetime is:" ,datetime);
    this.set("pickDate",datetime);
  },
  pickDate:null,
  /*是否占用线路*/
  isIntask: Ember.computed(function () {
    console.log("this model",this.get("model"));
    var curTask = this.get("model").curTask;
    console.log("curTask:",curTask);
    if(curTask){
      return true;
    }else{
      return false;
    }
  }),

  actions: {
    changeDateAction(date) {
      console.log("changeDateAction in,date",date);
      var stamp = this.get("dateService").getLastSecondStampOfDay(date);
      console.log("stamp is:" + stamp);
      console.log("select date to timestamp",this.get("dateService").timeToTimestamp(date));
    }
  }
});
