import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
// import Pagination from '../pagination';

export default BaseItem.extend({
    actions:{
      //进入详情
      toBlownUp(diet) {
          this.set('showBigImageModal', true);
          this.set("diet", diet);
          console.log("toBlownUp diet is", this.get("diet"));
      },
      //弹窗取消
      invitation() {
          this.set('showBigImageModal', false);
      },



    }



});
