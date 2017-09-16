import Ember from 'ember';
import CommonButton from './common-button';
/*
 * 多级菜单内项
 */
export default CommonButton.extend({
  classStatic: true,
  name: Ember.computed("menu",function(){
    if(!this.get("menu")){
      return;
    }
    return "name_" + this.get("menu.code");
  }),
  menu: null,//对应菜单数据
  classNameBindings: ['classStatic:groupitem-nav','isHide:hidden','isUpshow:upshow','isSelected:selected'],

  isHide: Ember.computed("menu","groupExpanded",function(){
    //没有展开并且没有选中，则隐藏
    if(!this.get("groupExpanded")&&!this.get("menu.selected")){
      return true;
    }
    return false;
  }),
  isUpshow: Ember.computed("menu","groupExpanded",function(){
    //已展开并且没有选中，则显示在上方浮层
    if(this.get("groupExpanded")&&!this.get("menu.selected")){
      Ember.run.schedule('afterRender',function(){
        if($('.upshow').length == 2){
            $('.upshow:first').css('top','-82px');
            // $('.upshow:eq(1)').css('top','-82px');
            $('.upshow:last').css('top','-41px');
        }
      });
      return true;
    }
    return false;
  }),
  isSelected: Ember.computed("menu","groupSelected",function(){
    //菜单组和本菜单都选中，则选中渲染处理
    if(this.get("menu.selected")&&this.get("groupSelected")){
      return true;
    }
    return false;
  }),
});
