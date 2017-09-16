import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"fileImplementDetailContainer",
  queryFlagIn: function(){return;},

  observeGotoWork:function(){
    var id = this.get("executionReportId");
    console.log("executionReport id",id);
    let executionReport = this.store.peekRecord('executionReport',id);
    this.set('executionReport',executionReport);
    console.log('executionReport',executionReport);
  }.observes('executionReportId'),

  checkScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('checkScore');
    var checkScore = {};
    checkScore.num = num;
    var list = [0,0,0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    checkScore.list = list;
    var status;
    switch (num)
    {
    case 0:
      status="很差";
      break;
    case 1:
      status="较差";
      break;
    case 2:
      status="较差";
      break;
    case 3:
      status="一般";
      break;
    case 4:
      status="一般";
      break;
    case 5:
      status="良好";
      break;
    case 6:
      status="很好";
      break;
    case 7:
      status="极好";
      break;
    }
    checkScore.status = status;
    return checkScore;
  }),
  mealScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('mealScore');
    var mealScore = {};
    mealScore.num = num;
    var list = [0,0,0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    mealScore.list = list;
    var status;
    switch (num)
    {
    case 0:
      status="很差";
      break;
    case 1:
      status="较差";
      break;
    case 2:
      status="较差";
      break;
    case 3:
      status="一般";
      break;
    case 4:
      status="一般";
      break;
    case 5:
      status="良好";
      break;
    case 6:
      status="很好";
      break;
    case 7:
      status="极好";
      break;
    }
    mealScore.status = status;
    return mealScore;
  }),
  sportScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('sportScore');
    var sportScore = {};
    sportScore.num = num;
    var list = [0,0,0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    sportScore.list = list;
    var status;
    switch (num)
    {
    case 0:
      status="很差";
      break;
    case 1:
      status="较差";
      break;
    case 2:
      status="较差";
      break;
    case 3:
      status="一般";
      break;
    case 4:
      status="一般";
      break;
    case 5:
      status="良好";
      break;
    case 6:
      status="很好";
      break;
    case 7:
      status="极好";
      break;
    }
    sportScore.status = status;
    return sportScore;
  }),
  medicationScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('medicationScore');
    var medicationScore = {};
    medicationScore.num = num;
    var list = [0,0,0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    medicationScore.list = list;
    var status;
    switch (num)
    {
    case 0:
      status="很差";
      break;
    case 1:
      status="较差";
      break;
    case 2:
      status="较差";
      break;
    case 3:
      status="一般";
      break;
    case 4:
      status="一般";
      break;
    case 5:
      status="良好";
      break;
    case 6:
      status="很好";
      break;
    case 7:
      status="极好";
      break;
    }
    medicationScore.status = status;
    return medicationScore;
  }),
  recoveryScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('recoveryScore');
    var recoveryScore = {};
    recoveryScore.num = num;
    var list = [0,0,0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    recoveryScore.list = list;
    var status;
    switch (num)
    {
    case 0:
      status="很差";
      break;
    case 1:
      status="较差";
      break;
    case 2:
      status="较差";
      break;
    case 3:
      status="一般";
      break;
    case 4:
      status="一般";
      break;
    case 5:
      status="良好";
      break;
    case 6:
      status="很好";
      break;
    case 7:
      status="极好";
      break;
    }
    recoveryScore.status = status;
    return recoveryScore;
  }),


  actions:{

  },

});
