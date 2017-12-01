import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "customerserviceitemList",
  infiniteModelName: "customerserviceitem",
  infiniteContainerName:"serviceOrderListContainer",
  constants:Constants,

  init: function(){
    var _self = this;
    this.infiniteQuery('customerserviceitem',{filter:{serviceSource:{typecode:"jujia"}},sort:{createDateTime:'desc'}});
    // this.infiniteQuery('customerserviceitem',{filter:{'scannerId@$isNotNull':'null'},sort:{callTime:'desc'}});
  },


  actions:{

  },

});
