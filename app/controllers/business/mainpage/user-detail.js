import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    detailEditClick:function(){
      this.set('detailEdit',true);
    },//编辑按钮
    detailBtnClick:function(){
      this.set('detailEdit',false);
    },//确认按钮
    detailCancel:function(){
      this.set('detailEdit',false);
    },//取消按钮
  }
});
