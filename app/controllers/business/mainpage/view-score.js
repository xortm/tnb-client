import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "appraiseList",
  infiniteModelName: "appraise",
  infiniteContainerName:"viewScoreContainer",
  queryFlagInFlag: 0,
  constants:Constants,

  customerObs: function(){
    var _self = this;
    console.log("queryFlagInFlag:",this.get("queryFlagInFlag"));
    this.infiniteQuery('appraise',{
      sort:{endTime:'desc',publishStatus:'desc'}
      });
  }.observes("queryFlagInFlag").on("init"),

  actions:{
    switchShowAction(){
      this.directInitScoll(true);
    },

  },

});
