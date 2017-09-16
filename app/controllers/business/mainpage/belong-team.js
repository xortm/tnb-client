import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const {educationLevelPrimary,educationLevelJunior,educationLevelSenior,educationLevelUniversity} = Constants;

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "employeenursinggroupList",
  infiniteModelName: "employeenursinggroup",
  infiniteContainerName:"employeenursinggroupContainer",
  mainController: Ember.inject.controller('business.mainpage'),

  init: function(){
    this.set("showLoadingImg",true);
  },
  actions:{
    toTask(){
      var itemId = "toSquare";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
      },300);
      this.get("global_dataLoader").getMobileMenu().then(function(menus){
        var needMenucode = '';
        menus.forEach(function(item){
          if(item.get("mobileIcon")=='ic-wheelchair'){
            needMenucode = item.get("code");
            item.set("selected",true);
          }else {
            item.set("selected",false);
          }
        });
        var businessController = App.lookup("controller:business");
        businessController.send("changeMainPage",needMenucode);
      });


    },

  },
});
