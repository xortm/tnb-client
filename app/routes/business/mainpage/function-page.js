import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'功能选择区',
  setupController: function(controller,model){
    this._super(controller,model);
    //由于没有继承InfiniteScroll,所有在此直接关闭转场页面
    this.get("service_PageConstrut").set("pageInLoading",false);
  },
});
