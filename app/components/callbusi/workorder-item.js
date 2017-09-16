import Ember from 'ember';

export default Ember.Component.extend({
  editMode: false,//是否编辑状态
  isSuccess:Ember.computed(function(){
    console.log('this.get(workOrder)',this.get('workOrder'));
    return this.get('workOrder').get('isSuccess');
  }),
  observeList: function(){  //只要数据变化便触发
    var showStatus = this.get("workOrder").get("isSuccess");
    console.log("isSuccess change:" + showStatus);
    if(showStatus===1){
      this.set("isSuccess",false);
    }else if(showStatus===0){
      this.set("isSuccess",true);
    }
  }.observes('workOrder.isSuccess'),

  actions:{
    editWorkorder(){//取消
      this.set("editMode",true);
    },
    saveWorkorder(){//保存
      var workOrder = this.get("workOrder");
      console.log("saveWorkorder in comp",workOrder);
      this.sendAction('saveWorkorder', workOrder);
      this.set("editMode",false);
    },
    successOrder(){//成单
      var workOrder = this.get("workOrder");
      console.log('sendsuc',workOrder);
      // var result = confirm('确认成单？');
      // if(result === true){
        this.sendAction('successOrder', workOrder);
      // }
      // this.set('alertmodal',true);
    },
    // confirm(){
    //   var workOrder = this.get("workOrder");
    //   this.sendAction('successOrder', workOrder);
    //   this.set('alertmodal',false);
    // },
    // cancelSubmit(){
    //   this.set('alertmodal',false);
    // },
    followOrder(){//追加信息
      var workOrder = this.get("workOrder");
      this.sendAction('followOrder',workOrder);
    },
    popFollow:function(){
      console.log('popFollow in item');
      this.sendAction('popFollow');
    },
    popSuccess:function(){
      console.log('popSuccess in item');
      this.sendAction('popSuccess');
    },
    popfreezeOrder:function(){
      console.log('freezeOrder in item');
      var workOrder = this.get("workOrder");
      this.sendAction('popfreezeOrder',workOrder);
    },
    popremovefreezeOrder:function(){
      console.log('popremovefreezeOrder in item!!');
      var workOrder = this.get("workOrder");
      this.sendAction('popremovefreezeOrder',workOrder);
    },
  }
});
