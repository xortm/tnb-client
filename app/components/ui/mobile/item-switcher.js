import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(GesturesMixin,{
  defData:null,
  actions:{
    choice: function(item){
      this.set("showLoadingImg",true);
      console.log("choice in",item);
      item.set("selected",true);
      this.get("defData").forEach(function(defItem){
        //取消另一个的选中状态
        if(defItem.get("code")!==item.get("code")){
          defItem.set("selected",false);
        }
      });
      var _self = this;
      Ember.run.next(this,function() {//加个异步方法
        _self.sendAction("switchAction",item.get("code"));
      });

    }
  }
});
