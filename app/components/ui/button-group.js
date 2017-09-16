import Ember from 'ember';

export default Ember.Component.extend({
  classStatic: true,
  classNameBindings: ["classStatic:btn-group","class"],
  defData:null,
  actions:{
    choice: function(item){
      console.log("choice in",item);
      item.set("selected",true);
      this.get("defData").forEach(function(defItem){
        //取消另一个的选中状态
        if(defItem.get("code")!==item.get("code")){
          defItem.set("selected",false);
        }
      });
      this.sendAction("switchAction",item.get("code"));
    }
  }
});
