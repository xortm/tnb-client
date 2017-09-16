import Ember from 'ember';
/*
 * 事件通知以及相关功能
 * 作者：梁慕学
 */
export default Ember.Service.extend(Ember.Evented,{
  threadData:null,//上下文传值
  serviceData:null,//移动端上下文传值
  searchData:null,//搜索的值
  keyProcessAct: null,//热键触发事件
});
