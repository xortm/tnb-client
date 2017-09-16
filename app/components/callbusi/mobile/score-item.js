import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  store: Ember.inject.service("store"),
  feedBus: Ember.inject.service("feed-bus"),
  /*标记*/
  /*控制相关属性*/
  recognizers:"tap pan",
  constants:Constants,

  actions:{
    //跳转到detail页面
    tapItem(scroe,appraiseItemId){
      this.sendAction("tapItem", scroe,appraiseItemId);
    },

    saveAppraiseResult(){
      this.sendAction("saveAppraiseResult");
    },

  }

});
