import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(GesturesMixin,{
  recognizers: 'tap press',
  classStatic: true,
  // classNameBindings: ['classStatic:square-button'],
  text: null,//对应文字
  count:0,//对应计次

  actions:{
    tapAction(){
      console.log("tap in,text:"+this.get("text"));
      this.set("count",this.get("count")+1);
      this.$().find("div[btnId='" + this.get("id") + "']").show();
      this.sendAction("itemClick",this.get("id"));
    },
    pressAction(){
      console.log("press in");
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('task-count-detail');
    }
  }

});
