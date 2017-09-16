import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "documentTypeList",
  infiniteModelName: "document-type",
  infiniteContainerName:"documentTypeContainer",
  queryFlagInFlag: 1,

  customerObs: function(){
    var _self = this;
    this.infiniteQuery('document-type',{});
  }.observes("queryFlagInFlag").on("init"),

  actions:{
    goDetail(documentType){
      console.log("go detail",documentType);
      var id = documentType.get("id");
      console.log("go detail id",id);
      var params ={
        trainingId:id
      };
      var itemId = "shareDocumentItem_" + id;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('my-training-list',params);
        },100);
      },200);
    },

  },

});
