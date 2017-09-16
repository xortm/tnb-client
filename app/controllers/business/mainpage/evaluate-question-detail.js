import Ember from 'ember';

export default Ember.Controller.extend({
  changeFlag: 0,
  feedBus: Ember.inject.service("feed-bus"),
  useModelObs:function(){
    //let useModelList = this.get("feedBus").get("threadData");
    //this.set('useModelList',useModelList);
    //console.log('controller useModelList is:',this.get('useModelList'));
    //被评估人
    let customerObj = this.get("feedBus").get("customerData");
    this.set('customerObj',customerObj);
    console.log('controller customerObj is:',this.get('customerObj'));
  },
});
