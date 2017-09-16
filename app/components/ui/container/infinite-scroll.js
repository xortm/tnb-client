import Ember from 'ember';

const { Component } = Ember;

/**
 A component to trigger infinite scroll.

 @class InfiniteScrollComponent
 */

export default Component.extend({

  /**
   The name of the method to trigger

   @property performInfinite
   @type { String }
   @default 'performInfinite
   */

  performInfinite: 'performInfinite',

  /**
   The distance from the bottom at which the infinite scroll will fire.

   @property triggerDistance
   @type { Number }
   @default 0
   */

  triggerDistance: 0,

  /**
   Whether or not the infinite scroll can be triggered.

   @property infiniteScrollAvailable
   @type { Boolean }
   @default true
   */

  infiniteScrollAvailable: true,
  moniteData: null,
  didInsertElement: function(){
    console.log("monite didInsertElement");
    //通过组件把didInsertElement事件发给controller
    this.sendAction("didInsertElementAction");
  },
  didRender: function(){
    console.log("monite render");
    //通过组件把didRender事件发给controller
    this.sendAction("didRenderAction");
  }
});
