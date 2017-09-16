import Ember from 'ember';
import BaseItem from '../../ui/base-ui-item';

export default BaseItem.extend({
  service_PageConstrut:Ember.inject.service("page-constructure"),
  classNameBindings: ['hideLodingPage:hidden'],
  pageStatus: 0,
  pageEnd: true,
  showLoaderTip: "",
  oriPageStatus: 0,//原来的状态

  hideLodingPage: Ember.computed("service_PageConstrut.pageInLoading","pageEnd",function(){
    if(!this.get("service_PageConstrut.pageInLoading")){
      return true;
    }
    if(this.get("pageEnd")){
      return true;
    }
    return false;
  }),
  //页面状态监控
  pageStatusObs: function(){
    //只有route级页面加载时才进行判断
    if(!this.get("service_PageConstrut.pageInLoading")){
      return;
    }
    console.log("pageStatus:" + this.get("pageStatus") + "|oriPageStatus:" + this.get("oriPageStatus"));
    //滚动结束后再显示
    if((this.get("pageStatus")===8&&this.get("oriPageStatus")===7)||
      (this.get("pageStatus")===7&&this.get("oriPageStatus")===8)||
      (this.get("pageStatus")===6&&this.get("oriPageStatus")===7)||
        (this.get("pageStatus")===7&&this.get("oriPageStatus")===3)||
          (this.get("pageStatus")===8&&this.get("oriPageStatus")===3)){
      this.set("pageEnd",true);
      //向页面控制服务发送页面加载结束的事件
      this.set("service_PageConstrut.pageInLoading",false);
    }else if(this.get("pageStatus")===3){
      this.set("pageEnd",true);
      this.set("service_PageConstrut.pageInLoading",false);
    }else{
      this.set("pageEnd",false);
    }
    //显示页面提示
    if(this.get("pageStatus")===0){
      this.set("showLoaderTip","正在进行数据加载，请稍候");
    }
    if(this.get("pageStatus")===2){
      this.set("showLoaderTip","正在进行页面处理，请稍候");
    }
    if(this.get("pageStatus")===5){
      this.set("showLoaderTip","正在进行页面检查，请稍候");
    }
    this.set("oriPageStatus",this.get("pageStatus"));
  }.observes("pageStatus","pageInLoading"),

});
