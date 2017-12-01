import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  global_curStatus: Ember.inject.service("current-status"),
  showSwitchList:false,
  constants: Constants,
  switchDateFlag: Ember.computed("global_curStatus.switchDateFlag",function(){
    let switchDateFlag = this.get("global_curStatus.switchDateFlag");
    console.log("switchDateFlag in component",switchDateFlag);
    return switchDateFlag;
  }),
  actions: {
    switchAction(param){
      this.toggleProperty("showSwitchList");
      if(param == "close"){return;}
      var switchDateFlag = this.get("switchDateFlag");
      console.log("switchDateFlag::",switchDateFlag);
      if(switchDateFlag == param){
        return;
      }else {
        this.get("global_curStatus").set("switchDateFlag",param);
      }
    },
    showSwitchListAction(){
      this.toggleProperty("showSwitchList");
    },


  },
});
