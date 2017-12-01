import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  global_curStatus: Ember.inject.service("current-status"),
  showSwitchList:false,
  constants: Constants,
  switchServiceFlag: Ember.computed("global_curStatus.switchServiceFlag",function(){
    let switchServiceFlag = this.get("global_curStatus.switchServiceFlag");
    console.log("switchServiceFlag in component",switchServiceFlag);
    return switchServiceFlag;
  }),
  // showServiceNurseFlag: Ember.computed("switchServiceFlag",function(){
  //   let switchServiceFlag = this.get("switchServiceFlag");
  //   if(switchServiceFlag == "service-nurse"){
  //     return true;
  //   }
  //   return false;
  // }),
  actions: {
    switchAction(param){
      this.toggleProperty("showSwitchList");
      if(param == "close"){return;}
      var switchServiceFlag = this.get("switchServiceFlag");
      console.log("switchServiceFlag::",switchServiceFlag);
      if(switchServiceFlag == param){
        return;
      }else {
        let routeName;
        if(param == "service-nurse"){
          routeName = "service-nurse";
        }else{
          routeName = "service-care";
        }
        this.set("global_curStatus.preventMenuChange",true);
        var mainpageController = App.lookup('controller:business.mainpage');
        localStorage.setItem(Constants.uickey_careChoice,routeName);
        mainpageController.switchMainPage(routeName);
        this.get("global_curStatus").set("switchServiceFlag",param);
      }
    },
    showSwitchListAction(){
      this.toggleProperty("showSwitchList");
    },


  },
});
