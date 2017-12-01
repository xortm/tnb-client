import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'订单查看',
  setupController: function(controller,model){
    this._super(controller,model);
    //当以后切换进入页面时,才把全局选好的时间传给组件
    var switchDateFlag = this.get("global_curStatus.switchDateFlag");
    controller.set("switchDateFlag",switchDateFlag);
  },
});
