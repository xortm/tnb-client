import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "userActivityScheduleItem",
  infiniteModelName: "user",
  infiniteContainerName:"userActivityScheduleItemContainer",

  observeGotoWork:function(){
    //获取activityid
    var _self = this;
    _self._showLoading();
    var id = this.get("id");
    console.log("activity id:",id);
    //获取activitytitle
    var title = this.get("title");
    this.set("title",title);
    console.log("activity title:",title);
    this.store.query('activityPlan',{
      filter:{
        activity:{id:id}
      }
    }).then(function(activityPlanList){
      _self.set("activityPlanList",activityPlanList);
      _self.hideAllLoading();
    });
  }.observes('id','title'),

  actions:{

  },

});
