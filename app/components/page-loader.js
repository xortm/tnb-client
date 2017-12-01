import Ember from 'ember';

export default Ember.Component.extend({
  classStatic: true,
  isHide: false,
  service_PageConstrut: Ember.inject.service('page-constructure'),
  classNameBindings: ['classStatic:mainpageLoading','isHide:hide'],

  //根据标志，设置隐藏以及加载状态
  showLoaderFlagObs: function(){
    console.log("showLoaderFlagObs in:" + this.get("service_PageConstrut.showLoader"));
    this.set("isHide",!this.get("service_PageConstrut.showLoader"));
    // return;
  }.observes("service_PageConstrut.showLoader").on("init"),

  didRender(){
    console.log("didrender in");
    //当标志切换为显示加载页面时，异步执行页面切换
    if(this.get("service_PageConstrut.showLoader")){
      console.log("page loader ele is in");
      Ember.run.later(this,function(){
        console.log("pswitchPageProcess is in");
        this.get("service_PageConstrut").switchPageProcess();
      },100);
    }
  }

});
