import Ember from 'ember';
import ListItem from '../ui/mobile/list-item';
import BaseUiItem from '../ui/base-ui-item';
// import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default BaseUiItem.extend(ListItem,{
  jiaSrc: "./assets/images/icon/jia.png",


actions: {
  choiceCustomer(cid,leaveStatus){
    this.sendAction("choiceCustomer", cid ,leaveStatus);
  },
},
});
