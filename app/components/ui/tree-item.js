import Ember from 'ember';
import BaseItem from './base-ui-item';
/*
 *  树形控件节点部分
 *
 *  创建人：梁慕学
 */

export default BaseItem.extend({
  classStatic: true,
  classNameBindings: ['nodeClass','itemData.hasSelected:tree-selected'],
  nodeClass:Ember.computed("hasChildren",function(){
    if(this.get("hasChildren")){
      return "tree-folder-header";
    }
    return "tree-item";
  }),
  rootNode:null,//总结点
  expanded:false,//是否已展开
  itemData:null,//对应的节点数据
  //检测是否是移动端权限
  isMobel:Ember.computed('itemData',function(){
    if(this.get('itemData')&&this.get('itemData')&&(this.get('itemData.type')===0)){
      return true;
    }else{
      return false;
    }
  }),
  click: function(){
    if(this.get("hasChildren")){
      if(this.get("clickPrevent")){
        //如果当前正在进行选中操作，则忽略
        this.set("clickPrevent",false);
      }else{
        this.toggleProperty("itemData.expanded");
      }
    }
  },

  actions:{
    checkClick(event){
      //设置点击保护
      this.set("clickPrevent",true);
      this.toggleProperty("itemData.hasSelected");
      //将所有子节点都进行选中设置
      var hasChildren = true;
      var hasSelected =  this.get("itemData.hasSelected");
      var loopAction = function(node){
        node.set("hasSelected",hasSelected);
        if(node.get("children.length")&&node.get("children.length")>0){
          node.get("children").forEach(function(child){
            loopAction(child);
          });
        }
      };
      loopAction(this.get("itemData"));
      //如果选中，则父节点也要选中,发给tree组件完成
      if(hasSelected){
        this.sendAction("privilegeCheck");
      }
    }
  }
});
