import Ember from 'ember';

export default Ember.Component.extend({
  //information : this.get('customer.extendInfo'),
  information:Ember.computed('customer.extendInfo',function(){
    var jsonData = JSON.parse(this.get('customer.extendInfo')).extendInfo;
    return jsonData;
  }),
  // observeTask: function(){//动态监控状态变化，反向影响页面显示  比Ember.computed(只有get set的时候才会更新数据)更灵敏
  //   var jsonData = JSON.parse(this.get('customer.extendInfo')).extendInfo;
  //   this.set('information',jsonData);
  // }.observes('customer'),

  actions:{

  }
});
