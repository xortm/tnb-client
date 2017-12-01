import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(GesturesMixin,{
  recognizers: 'press',//移动端手势
  press(e) {
     console.log("tap in",e);
  },
});
