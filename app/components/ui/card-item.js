import Ember from 'ember';
import BaseItem from './base-ui-item';

/*卡片布局组件*/
export default BaseItem.extend({
  tagName: "div",
  classNameBindings: ['hasSelected:has-selected'],
  hasSelected: false,
  click() {
    if (this.get('selectAction')) {
      var selectAction = this.get('selectAction');
      console.log("selectAction:" + selectAction);
      this.set("hasSelected",true);
      this.sendAction(selectAction,this.clickActParams);
    }
  },
});
