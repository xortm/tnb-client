import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"fileTestDetailContainer",

  observeGotoWork:function(){
    var id = this.get("physicalReportId");
    console.log("physicalReport id",id);
    let physicalReport = this.store.peekRecord('physicalReport',id);
    this.set('physicalReport',physicalReport);
    console.log('physicalReport',physicalReport);
    this.hideAllLoading();
  }.observes('physicalReportId'),
  queryFlagIn: function(){
    this.hideAllLoading();
  },

  actions:{

  },

});
