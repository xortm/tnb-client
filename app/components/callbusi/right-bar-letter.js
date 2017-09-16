import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
// import InfiniteScroll from '../../controllers/infinite-scroll';

export default BaseItem.extend({


actions: {
  queryInitial(letter){
    this.sendAction("queryInitial", letter);
  },

},
});
