import Ember from 'ember';
import InfiniteScroll from '../../../controllers/infinite-scroll';

export default Ember.Component.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"showExesContainer",
  global_curStatus: Ember.inject.service("current-status"),
  dataLoader: Ember.inject.service("data-loader"),
  store: Ember.inject.service("store"),

  queryFlagIn: function(){return;},
  didInsertElement(){
    this._super(...arguments);
    var _self = this;
    console.log("insert e in nursingplanexe-list:");
    var windowHeight = $(window).height();
    this.$("#showExesContainer").height(windowHeight-120);

  },

  actions:{
    //弹出层取消显示
    invitation() {
      this.sendAction("invitation");
    },
    //删除按钮
    minusAction(itemExeId,exeStaffId) {
      this.sendAction("minusAction",itemExeId,exeStaffId);
    },

  }

});
