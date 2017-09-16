import Ember from 'ember';
import BaseItem from './base-ui-item';

/*用户信息下拉菜单*/
export default BaseItem.extend({
  code:null, //对应的菜单标识
  text: null,//显示内容

  actions:{
    menuSelect(){
      console.log('2222222222222222');
      this.sendAction("menuSelect",this.get("code"));
    }
  }
});
