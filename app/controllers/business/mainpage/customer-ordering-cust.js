import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  infiniteContentPropertyName: "customerdayfoodplanList",
  infiniteModelName: "customerdayfoodplan",
  infiniteContainerName:"customerOrderingCustContainer",
  // scrollPrevent: true,
  queryFlagInFlag: 0,
  constants:Constants,
  currentDate:Ember.computed(function(){
    let currentTime = this.get("dateService").getTodayTimestamp();
    console.log("currentTime in ordering:",currentTime);
    return currentTime;
  }),

  init: function(){
    this._super(...arguments);
    var _self = this;
    this.store.query("food",{}).then(function(foodList){
      console.log("foodList after query:",foodList);
      _self.get("dataLoader").set("foodList",foodList);
      _self.set("foodList",foodList);
    });
  },

  customerObs: function(){
    var _self = this;
    console.log("queryFlagInFlag:",this.get("queryFlagInFlag"));
    this.infiniteQuery('customerdayfoodplan',{filter:{},sort:{diningDate:'desc'}});
  }.observes("queryFlagInFlag").on("init"),

  actions:{

  },

});
