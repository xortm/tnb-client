import Ember from 'ember';
import BaseItem from './base-ui-item';

/*
 *  可编辑区域，选择以后变成输入框,有保存功能
 *
 *  创建人：梁慕学
 */
export default BaseItem.extend({
  busiType:null,//业务类型
  busiObj: null,//业务对象
  content:null,//内容
  editMode: false,//是否编辑模式
  realSeq: Ember.computed("seq",function(){
    var seq= this.get("seq") + 1;
    if(seq==1){
      return "A";
    }
    if(seq==2){
      return "B";
    }
    if(seq==3){
      return "C";
    }
    if(seq==4){
      return "D";
    }
    if(seq==5){
      return "E";
    }
    if(seq==6){
      return "F";
    }
    if(seq==7){
      return "G";
    }
  }),
  actions:{
    edit(){
      this.set("editMode",true);
    },
    delAnswer(){
      this.sendAction("delAnswer");
    },
    commit(){
      this.set("editMode",false);
      this.sendAction("commitAction",this.get("content"),this.get("busiType"),this.get("busiObj"));
    },
    cancel(){
      this.set("editMode",false);
    },
  }
});
