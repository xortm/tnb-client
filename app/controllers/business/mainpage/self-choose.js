import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "selfChooseList",
  infiniteModelName: "dicttype",
  infiniteContainerName:"selfChooseContainer",

  dataLoader: Ember.inject.service("data-loader"),

  actions:{
    choose:function(data){
      var itemId = "choose_" + data.get("id");
      $("#"+itemId).addClass("tapped");
      setTimeout(function(){$("#"+itemId).removeClass("tapped");},200);
      var _self = this;
      var source = this.get("source");
      var curUser = this.get("global_curStatus").getUser();
      var leaveStatusObj = _self.get("dataLoader").findDict(data.get("typecode"));
      this.set("theChoose",leaveStatusObj);
      this.store.findRecord('user',curUser.get("id")).then(function(user){
        if(source==="staffCensus"){//籍贯
          console.log("typecode   1111",data.get("typecode"));
          user.set("staffCensus",leaveStatusObj);
        }else {
          console.log("typecode   2222",data.get("typecode"));
          user.set("staffNation",leaveStatusObj);//民族
        }
        user.save().then(function(){
          var mainController = App.lookup("controller:business.mainpage");
          mainController.switchMainPage("business-mine");
        });
      });

    },
  },

});
