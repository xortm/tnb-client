import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Mixin.create(GesturesMixin,{
  recognizers: 'pan tap press',//移动端手势
});
