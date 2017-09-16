import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';

/*
 * 字典选择框
 * create by lmx
 */
export default BaseItem.extend({
  global_dataLoader: Ember.inject.service('data-loader'),
  currentDict: null,//当前的字典对象
  value: null,//绑定的外部数值
  showName: "",//显示的分组名称
  groupCode:null,//对应的分组编号
  preselected: true,//是否默认选择一项
  allowClear: false,//是否允许清空选项
  isTenant:false,
  didInsertElement: function(){
    if(this.get("preselected")&&(!this.get("curDict")||!this.get("curDict").content)){
      //如果没有默认值，把第一项作为默认值
      var dicttypes = this.get("global_dataLoader.dicttypes")||this.get("global_dataLoader.dicttypestenant");
      var list = dicttypes.filterBy('typegroup.typegroupcode', this.get("groupCode"));
      this.send("dictSelect",list.objectAt(0));
      console.log(list.objectAt(0));
    }else{
      this.set("currentDict",this.get("curDict"));
    }
  },
  //对应分组的字典列表
  dictList: Ember.computed("groupCode","global_dataLoader.dicttypes",function(){

    let dicttypes;
    let list;
    if(this.get('isTenant')){
      dicttypes = this.get("global_dataLoader.dicttypestenant");
      list = dicttypes.filterBy('typegroupTenant.typegroupcode', this.get("groupCode"));
      console.log('isTenant');
    }else{
      dicttypes = this.get("global_dataLoader.dicttypes");
      if(dicttypes){
        list = dicttypes.filterBy('typegroup.typegroupcode', this.get("groupCode"));
        if(this.get('sort')){
          list = list.sortBy('sort');
        }

      }else {
        return list;
      }
    }

    list.forEach(function(dict){
      // dict.set("typenamePinyin",pinyinUtil.getFirstLetter(dict.get("typename")));
      //还是先使用汉字查询
      dict.set("typenamePinyin",dict.get("typename"));
    });
    console.log("list:",list);
    return list;
  }),
  //如果字典选择值动态变化了，此处要响应
  dictChangeObs:function(){
    console.log("dictChange obs");
    this.set("currentDict",this.get("dictChange"));
  }.observes("dictChange"),

  actions:{
    dictSelect(currentDict){
      console.log("currentDict in",currentDict);
      this.set("currentDict",currentDict);
      this.set("value",currentDict);
      this.sendAction("dictSelect",this.get("currentDict"));
    },
    checkLength(text, select ) {
      if (select.searchText.length >= 3 && text.length < 3) {
        return ;
      } else {
        return text.length >= 3;
      }
    },
  }
});
