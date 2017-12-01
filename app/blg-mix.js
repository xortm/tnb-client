import Ember from 'ember';
import config from './config/environment';

const BlgMixin = Ember.Mixin.create({
  service_PageConstrut:Ember.inject.service("page-constructure"),
  service_currStatus :Ember.inject.service("current-status"),
  totalBlankPageNum: Ember.computed(function(){
    return this.get("service_PageConstrut.totalBlankPageNum");
  }),
  seq:null,
  isBlankPage:true,
  realTemplateName:Ember.computed("seq",function(){
    let nextBlankRouteName = this.get("service_PageConstrut").getBlankPageName(this.get("seq"));
    return nextBlankRouteName;
  }),
  //挨个初始化所有route
  blankAfterRender(){
    console.log("blankAfterRender in:" + this.get("seq"));
    let mainController = App.lookup("controller:business.mainpage");
    let nextSeq = this.get("seq") + 1;
    //到达最后时，进入业务主页面
    if(nextSeq>this.get("totalBlankPageNum")){
      //进入首页
      console.log("need in home");
      App.lookup("route:business.mainpage").toHomePage();
      return;
    }
    let curBlankRouteName = this.get("service_PageConstrut").getBlankPageName(this.get("seq"));
    let nextBlankRouteName = this.get("service_PageConstrut").getBlankPageName(nextSeq);
    nextBlankRouteName = "business.mainpage." + nextBlankRouteName;
    let mainpage = App.lookup("route:business.mainpage");
    mainpage.changePageInroute(curBlankRouteName,curBlankRouteName);
    this.transitionTo(nextBlankRouteName);
  }
});

export default BlgMixin;
