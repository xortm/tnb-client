import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
/*
 * 表单输入部分,包括校验等功能
 * create by lmx
 */
export default BaseItem.extend({
  tagName: "div",
  classStatic: true,
  classNameBindings: ['classStatic:pull-left'],
  placeholder:Ember.computed("placeholder",function(){
    return this.get('placeholder');
  }),
  modelPropertyName: Ember.computed("model","property",function(){
    var propertyName = this.get("property");
    return propertyName;
  }),
  modelProperty: Ember.computed("model","property",function(){
    var propertyName = this.get("property");
    return this.get("model").get(propertyName);
  }),
  errors: Ember.computed("model.page_errors",function(){
    return this.get("model.page_errors");
  }),
  //监控校验标志，显示对应属性
  errobs: function(){
    console.log("errors change",this.get("errors"));
    var propertyName = this.get("property");
    var errorText = this.get("errors").get(propertyName);
    console.log("and errorText:" + errorText);
    this.set("errorText",errorText);
  }.observes("model.page_errorsCnt"),

  actions:{
    changed(val){
        console.log("change in:" + val);
        var propertyName = this.get("property");
        this.get("model").set(propertyName,val);
    }
  }
});
