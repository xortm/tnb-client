import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
// import Pagination from '../pagination';

export default BaseItem.extend({
    actions:{
      toDetailPage(diet){
        this.sendAction('dietDetail',diet);
      },



    }



});
