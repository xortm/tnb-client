import Ember from 'ember';

const { Component, guidFor, run, computed } = Ember;

/**
 A simple component to send an action when it passes a distance from the bottom
 of a scrollable element.

 @class EmberICYou
 */

export default Component.extend({
  classNames: ['ember-ic-you'],
  routeContainer: null,//对应的route名字
  /**
   The name of the action that will be sent.
   */
  crossedTheLine: 'crossedTheLine',
  /**
   True if the listener can be turned on.
   @property enabled
   @type { Boolean }
   @default true
   */
  enabled: true,
  /**
   The distance from the bottom at which aboveTheLine will be true.
   @property triggerDistance
   @type { Number }
   @default 0
   */
  triggerDistance: 0,

  /**
   Keeps state of page position relative to the component's
   trigger `triggerDistance`

   @property aboveTheTrigger
   @type {Boolean}
   @default false
   */

  aboveTheTrigger: false,

  /**
   Selector for the scrolled container. If null, the container will be the window.

   @property scrollContainer
   @type {String}
   @default null
   */

  _scrollContainer: computed(function() {
    let scrollContainerId = this.get('scrollContainerId');
    let scrollContainer = this.get("scrollContainer");
    if(scrollContainer){
      return scrollContainer;
    }
    //初始化iscroll
    console.log("scrollContainerId:" + scrollContainerId);
    scrollContainer = new IScroll('#' + scrollContainerId,{
      scrollX : false, //是否水平滚动
			scrollY : true, //是否垂直滚动
			x: 0,
			y: 0,
			startY : 20, //滚动垂直初始位置
			bounce : true, //是否超过实际位置反弹
			momentum : true, //动量效果，拖动惯性
			lockDirection : true,
			useTransform : true, //是否使用CSS形变
			useTransition : false, //是否使用CSS变换
			checkDOMChanges : false, //是否自动检测内容变化
			hScrollbar : false, //是否显示水平滚动条
			vScrollbar : true, //同上垂直滚动条
			fixedScrollbar : true, //对andriod的fixed
			hideScrollbar : true, //是否隐藏滚动条
			fadeScrollbar : false, //滚动条是否渐隐渐显
			scrollbarClass : '', //自定义滚动条的样式名
    });
    this.set("scrollContainer",scrollContainer);
    return scrollContainer;
  }),

  /**
   Caches the elements that will be used in each scroll cycle, sets an observer
   on `enabled` to fire `_switch`, and calls `_switch`;

   @method didInsertElement
   */

  didInsertElement() {
    return;
    this.addObserver('enabled', this, '_switch');
    this._switch();
  },

  /**
   The names of the listeners the component will use, concatenated for use by
   jQuery.

   @property eventNames
   @type { String }
   */

  eventNames: computed(function() {
    let guid = guidFor(this);
    return `scrollEnd beforeScrollStart scrollCancel scrollStart`;
  }),

  /**
   Deactivates the jQuery listeners.

   @method willDestroyElement
   */

  willDestroyElement() {
    this.deactivateListeners();
  },

  activateListeners() {
    let scrollContainer = this.get('_scrollContainer'),
        eventNames = this.get('eventNames');

    scrollContainer.on("scrollEnd ", () => {
      this._listenerFired();
    });
  },

  /**
   Deinitializes jQuery listeners.

   @method deactivateListeners
   */

  deactivateListeners() {
    let scrollContainer = this.get('_scrollContainer'),
        eventNames = this.get('eventNames');

    scrollContainer.off(eventNames);
  },

  /**
   Activates and deactivates listeners depending on if the component is `enabled`

   @method _switch
   @private
   */

  _switch() {
    let enabled = this.get('enabled');

    if (enabled) {
      this.activateListeners();
    } else {
      this.deactivateListeners();
    }
  },

  /**
   Measures the distance of the component from the bottom.
   Debounces `crossedTheLine` action.

   @method _listenerFired
   @private
   */

  _listenerFired() {
    let scrollContainer = this.get('_scrollContainer'),
        triggerDistance = this.get('triggerDistance'),
        previousAboveTheTrigger = this.get('aboveTheTrigger');

    let offsetFromTop = this.$().offset().top,
        scrollContainerPosition =  scrollContainer.scrollTop(),
        scrollContainerHeight = scrollContainer.height();

    let positionOfMe = offsetFromTop - scrollContainerPosition - scrollContainerHeight;
    let aboveTheTrigger = ( positionOfMe <= triggerDistance );
    console.log("positionOfMe:" + positionOfMe + " and aboveTheTrigger:" + aboveTheTrigger + " previousAboveTheTrigger:" + previousAboveTheTrigger);
    if (aboveTheTrigger !== previousAboveTheTrigger||true) {
      this.set('aboveTheTrigger', aboveTheTrigger);
      run.debounce(this, 'sendAction', 'crossedTheLine', aboveTheTrigger, 50);
    }
  }
});
