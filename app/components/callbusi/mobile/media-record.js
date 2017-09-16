import Ember from 'ember';

/*
 * 创建人:梁慕学
 * 日期:2017-09-01
 * 媒体录制组件
 */

export default Ember.Component.extend({
  classStatic: true,
  classNameBindings: ['classStatic:full-screen'],

  mediaService: Ember.inject.service("media-capability"),

  actions:{
    stopRecord(){
      let _self = this;
      this.get("mediaService").stopRecord(function(){
        _self.sendAction("afterStop");
      });
    }
  }
});
