import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "fulfilTaskList",
  infiniteModelName: "task",
  infiniteContainerName:"fulfilTaskContainer",
  mainController:Ember.inject.controller("business.mainpage"),

  actions:{},
});
