import BaseItem from 'ember-cli-bootstrap-datetimepicker/components/bs-datetimepicker';
const {
  $,
  Component,
  computed
} = Ember;
const {
  defaults
} = $.fn.datetimepicker;
/*
 * 时间日期选择框
 * create by lmx
 */
export default BaseItem.extend({
  global_curStatus: Ember.inject.service("current-status"),
  pubicFalg:false,

  didInsertElement() {
     this._super(...arguments);
     this.set("pubicFalg",false);//不管是true fasle 一进入变为false
     var _self = this;
     let icons = {
       clear: this.getWithDefault('config.icons.clear', defaults.icons.clear),
       close: this.getWithDefault('config.icons.close', defaults.icons.close),
       date: this.getWithDefault('config.icons.date', defaults.icons.date),
       down: this.getWithDefault('config.icons.down', defaults.icons.down),
       next: this.getWithDefault('config.icons.next', defaults.icons.next),
       previous: this.getWithDefault('config.icons.previous', defaults.icons.previous),
       time: this.getWithDefault('config.icons.time', defaults.icons.time),
       today: this.getWithDefault('config.icons.today', defaults.icons.today),
       up: this.getWithDefault('config.icons.up', defaults.icons.up)
     };

     this.$().datetimepicker({
       date: this.getWithDefault('date', defaults.defaultDate),
       daysOfWeekDisabled: this.getWithDefault('daysOfWeekDisabled', defaults.daysOfWeekDisabled),
       disabledDates: this.getWithDefault('disabledDates', defaults.disabledDates),
       disabledHours: this.getWithDefault('disabledHours', defaults.disabledHours),
       enabledDates: this.getWithDefault('enabledDates', defaults.enabledDates),
       enabledHours: this.getWithDefault('enabledHours', defaults.enabledHours),
       focusOnShow: this.getWithDefault('focusOnShow', defaults.focusOnShow),
       format: this.getWithDefault('format', defaults.format),
       icons:icons,
       keepOpen:true,
       buttonImageOnly: true,
      //  ignoreReadonly:true,//不成功
       locale: this.getWithDefault('locale', defaults.locale),
       maxDate: this.getWithDefault('maxDate', defaults.maxDate),
       minDate: this.getWithDefault('minDate', defaults.minDate),
       showClear: this.getWithDefault('showClear', defaults.showClear),
       showClose: this.getWithDefault('showClose', defaults.showClose),
       showTodayButton: this.getWithDefault('showTodayButton', defaults.showTodayButton),
       sideBySide: this.getWithDefault('sideBySide', defaults.sideBySide),
       useCurrent: this.getWithDefault('useCurrent', false),
       viewDate: this.getWithDefault('viewDate', defaults.viewDate),
       viewMode: this.getWithDefault('viewMode', defaults.viewMode),
       widgetPositioning: this.getWithDefault('widgetPositioning', defaults.widgetPositioning)
     }).on('dp.change', e => {
       // Convert moment to js date or default to null
       let newDate = e.date && e.date.toDate() || null;
       console.log("dp.change in,newDate");
       this.set('date', newDate);
       //直接转为时间戳给value
       if(newDate){
         this.set('value', newDate.getTime()/1000);
       }

       this.sendAction('change', newDate);
     }).on('dp.show', e => {
       //标志已经进入show模式
       _self.set("dpShowIn",true);
       console.log("dp.show in",e);
       console.log("dp.show in",e.currentTarget.children[0]);
       var target = $(e.currentTarget);
       var width = target.width();
       console.log("warningDate w:" + width);
       var pop = target.find(".datepicker");
       var widget = target.find(".bootstrap-datetimepicker-widget");
       console.log("widget is:" , widget);
      //  widget.width(width);
       _self.set("pubicFalg",true);
     });

     this.addObserver('date', function() {
       this.$().data('DateTimePicker').date(this.get('date'));
     });

     this.addObserver('maxDate', function() {
       this.$().data('DateTimePicker').maxDate(this.get('maxDate'));
     });

     this.addObserver('minDate', function() {
       this.$().data('DateTimePicker').minDate(this.get('minDate'));
     });
   },

   actions:{
     dtClick(){
       console.log("dtClick in");
      //  if(this.$("input").attr("readonly")){
      //    //如果是只读模式，首先去掉只读状态
      //    this.$("input").removeAttr("readonly");
      //    console.log("rm readonly and click again");
      //    //然后模拟再次点击日历按钮，以触发dp.show事件
      //    this.$(".input-group-addon").click();
      //  }else{
      //    console.log("dbshow mode");
      //  }
     },
     focus(){
      //  console.log("focus in");
      //  this.$("input").blur();
     }
   }
});
