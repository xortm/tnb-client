import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
// import Pagination from '../pagination';

export default BaseItem.extend({
  actions:{
    toDetailPage(sports){
      this.sendAction('sportsDetail',sports);
    },



  }



});
