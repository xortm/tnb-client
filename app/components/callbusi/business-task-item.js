import Ember from 'ember';

export default Ember.Component.extend({
  dateService:Ember.inject.service('date-service'),
  // 距离任务开始剩余天数
  days: Ember.computed(function(){
    // var curDate = new Date();
    var date = this.get('busiTask').get('beginTime');
    var second = -this.get("dateService").getSecondsFromNow(date);
    var day = Math.floor(second/60/60/24);
    var hour = Math.ceil((second-day*24*60*60)/60/60);
    if(day>0) {
      return day+'天'+hour+"小时";
    }
    return hour+"小时";
    // console.log('11111111111111',day+'天'+hour+"小时");
    // var beginDate = this.get("dateService").timestampToTime(date);
    // return Math.ceil((beginDate-curDate)/1000/60/60/24);
  }),
  taskPeriod: Ember.computed(function(){
    return this.get('busiTask.beginDateComp')+"~"+this.get('busiTask.endDateComp');
  }),

  callOut: Ember.computed(function(){
    if(this.get('busiTask').get('callType') === 1)
    {
      return true;
    }
    return false;
  }),
  taskTypes: Ember.computed(function(){
    var taskTypes = this.get('busiTask').get('taskTypes');
    var types = [];
    taskTypes.forEach(function(item){
      if(!!item)
      {
        types.push(item.get('typename'));
      }
    });
    return types;
  }),
  actions:{
    editCustomer:function() {
      this.sendAction('editCustomer',this.get('busiTask'));
    },
  }
});
