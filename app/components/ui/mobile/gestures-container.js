import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(GesturesMixin,{
  recognizers: 'tap pinch swipe',//移动端手势
  swipeLeft(e) {
     console.log("swipeLeft in",e);
  },
  swipeRight(e) {
     console.log("swipeRight in",e);
  },
  tap(e) {
     console.log("tap in",e);
  },
  panStart(e) {
     console.log("panStart in",e);
     this.sendAction("panStartAction",e);
  },
  panMove(e) {
     console.log("panMove in",e);
     this.sendAction("panMoveAction",e);
  },
});
