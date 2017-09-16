import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userMessageDetailContainer",

  observeGotoWork:function(){
    var id = this.get("messageId");
    console.log("message id",id);
    let message = this.store.peekRecord('message',id);
    this.set('message',message);
    console.log('message content',message.get("content"));
  }.observes('messageId'),
  queryFlagIn: function(){return;},

  actions:{

  },

});
