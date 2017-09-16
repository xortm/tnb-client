import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    showList:function(){
      this.set('textShow',true);
      $('#listBtn').attr('class','cur');
      $('#textBtn').attr('class','');
    },//列表显示
    showText:function(){
      this.set('textShow',false);
      $('#listBtn').attr('class','');
      $('#textBtn').attr('class','cur');
    },//图文显示

    showDate:function(){
      this.set('dateShow',true);
    },//显示时间选择器
    hideDate:function(){
      this.set('dateShow',false);
    },//隐藏时间选择器

    showBigImg:function(){
      this.set('bigImg',true);
    },//大图显示
    hideBigImg:function(){
      this.set('bigImg',false);
    },//大图显示

  }
});
