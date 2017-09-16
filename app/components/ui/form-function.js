import Ember from 'ember';
import BaseItem from './base-ui-item';

import CommonButton from './common-button';
export default CommonButton.extend({
  edit:true,
  theDelete:true,
  editAction: null,
  removeAction:null,
  attributeBindings: ["name"],
  clickActParams:null,
  didInsertElement:function(){
    if(this.get('deleteNone')){
      this.set("theDelete",false);
      console.log("deleteAction:" + this.get("deleteNone"));
    }
    if(this.get('editNone')){
      this.set("edit",false);
      console.log("deleteAction:" + this.get("edit"));
    }
  },
  // click() {
  //   if (this.get('editClick')) {
  //     var editClick = this.get('editClick');
  //     console.log("editClick:" + editClick);
  //     this.sendAction(editClick,this.editClickParams);
  //   }
  //   if(this.get('deleteAction')){
  //     var deleteAction = this.get('deleteAction');
  //     console.log("deleteAction:" + deleteAction);
  //     this.sendAction(deleteAction,this.deleteClickParams);
  //   }
  //
  // },

  actions:{
    editClick(){
      this.sendAction(this.get("editAction"));
    },
    deleteClick(){
      this.sendAction(this.get("removeAction"));
    },
  }

});
