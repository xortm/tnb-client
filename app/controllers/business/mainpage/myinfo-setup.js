import Ember from 'ember';

import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "userMyInfoSetup",
  infiniteModelName: "user",
  infiniteContainerName:"userMyInfoSetupContainer",

  actions:{
    myinfoRemind:function(){
      this.toggleProperty("shutOpen");
    },
    quit1: function(){
      var mainController = App.lookup("controller:business.mainpage");
      mainController.send('quit');
    },
  }
});
