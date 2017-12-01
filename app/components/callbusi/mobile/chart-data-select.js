import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  global_curStatus: Ember.inject.service("current-status"),
  chartShow: Ember.computed("global_curStatus.chartShow",function(){
    let chartShow = this.get("global_curStatus.chartShow");
    console.log("chartShow in component",chartShow);
    return chartShow;
  }),
  clickState:false,
  switchState:true,
  actions: {
    chartShowAction(){
      if(this.get("clickState")){return;}
      this.set("clickState",true);
      var chartShow = this.get("chartShow");
      console.log("chartShow::",chartShow);
      if(chartShow){
        this.set("chartShow",false);
      }else {
        this.set("chartShow",true);
      }
      this.get("global_curStatus").set("chartShow",this.get("chartShow"));
      this.set("clickState",false);
    },
    // chartShowObs: function(){
    //   let chartShow = this.get("global_curStatus.chartShow");
    //   this.set("chartShow",chartShow);
    // }.observes("global_curStatus.chartShow"),
    switchChanged(){
      if(this.get('switchState')){
        this.set("chartShow",true);
      }else{
        this.set("chartShow",false);
      }
      this.get("global_curStatus").set("chartShow",this.get("chartShow"));
    },
  },
});
