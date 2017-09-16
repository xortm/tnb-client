import Ember from 'ember';
import ItemGestures from '../../ui/mobile/item-gestures';

export default Ember.Component.extend(ItemGestures,{
  isRow: false,
  borderBorromLeft:true,
  borderBorromRight:false,
  actions:{
    changeConditionLeft(){
      console.log('in left here ');
      this.set('borderBorromLeft',true);
      this.set('borderBorromRight',false);
      this.sendAction('funcLeft');
    },
    changeConditionRight(){
      console.log('in right here ');
      this.set('borderBorromLeft',false);
      this.set('borderBorromRight',true);
      this.sendAction('funcRight');
    },
  }
});
