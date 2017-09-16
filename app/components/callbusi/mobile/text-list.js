import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    chooseItem(item){
      // if(item.get('hasSelcted')){
      //   item.set('hasSelcted',false);
      // }else{
      //   item.set('hasSelcted',true);
      // }
      this.sendAction('chooseItem',item);
    },
    toNextPage(item){
      let _self = this;
      this.$().addClass("tapped");
      Ember.run.later(function(){
        _self.$().removeClass("tapped");
        Ember.run.later(function(){
          _self.sendAction('toNextPage',item);;
        },100);
      },200);

    }
  }
});
