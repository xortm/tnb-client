import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

export default Ember.Component.extend({
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    service_PageConstrut: Ember.inject.service("page-constructure"),
    titleShow:"",
    bigFlag: false,



    actions:{
      setClick: function() { //点击设置
          if (this.get('listShow')) {
              this.set('listShow', false); //弹框显示标识
              return;
          }
          this.set('listShow', true);
      },
      listClick: function() { //点击显示列表
          this.set('listShow', false);
          this.set('listContainer', true);
          this.set('chartContainer', false);
          this.sendAction("listClick");
      },
      chartClick: function() {
          this.set('listShow', false);
          this.set('listContainer', false);
          this.set('chartContainer', true);
          this.sendAction("chartClick");
      },
      // bigClick: function(params) {
      //     if (this.get('bigFlag')) {
      //         this.set('bigFlag', false);
      //     } else {
      //         this.set('bigFlag', true);
      //     }
      //     this.sendAction("bigClick");
      // }

    }




});
