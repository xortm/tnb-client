import Ember from 'ember';

export default Ember.Controller.extend({
  detailEdit:false,
  actions:{
    //保存
    saveConf(conf) {
      conf.save().then(function(){
        conf.set('choosed',false);
      });
    },
    chooseConf(conf){
      this.get('confList').forEach(function(conf){
        conf.set('choosed',false);
      });
      conf.set('choosed',true);
    },
    //编辑按钮
    detailEditClick(){
      this.set('detailEdit',true);
    },
    //取消
    detailCancel(){
      this.set('detailEdit',false);
    },
  }
});
