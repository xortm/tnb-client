import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "shareDocumentList",
  infiniteModelName: "share-document",
  infiniteContainerName:"shareDocumentContainer",

  customerObs: function(){
    let _self = this;
    let id = this.get("trainingId");
    this.infiniteQuery('share-document',{filter:{type:{id:id}}});
  }.observes("trainingId"),


  actions:{
    goDetail(shareDocument){
      console.log("go detail",shareDocument);
      var id = shareDocument.get("id");
      console.log("go detail id",id);
      var params ={
        id:id
      };
      var itemId = "shareDocumentItem_" + id;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('my-training',params);
        },100);
      },200);
    },
    switchShowAction(){
      this.incrementProperty("queryFlagInFlag");
    },

  },

});
