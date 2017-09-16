import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "taskCountDetail",
  infiniteModelName: "task",
  infiniteContainerName:"taskCountDetailContainer",

  actions:{
    backMain(){
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('task-square');
    }
  }
});
