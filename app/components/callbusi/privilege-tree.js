import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

/*
 * 权限树组件
 * create by lmx
 */
export default BaseItem.extend({
  classStatic: true,
  classNameBindings: ['classStatic:tree-folder'],
  privilege: null,//权限数据

  actions:{
    privilegeCheck(privilege){
      // this.privilegeCheckAct();
      this.sendAction("privilegeCheck",privilege);
    }
  }
});
