import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    ategoriesSelect:function(){
      Text = $("#ategoriesSelect").find("option:selected").val();
      if(Text == 1){//计次隐藏周期和频次
        this.set('count',false);
      }
      if(Text == 2){//按时显示周期和频次
        this.set('count',true);
      }
    },
  }
});
