import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "content",
  infiniteModelName: "userTask",
  infiniteContainerName:"taskMineContainer",
  
});
